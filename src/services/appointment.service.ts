import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  isNotNull,
  isNull,
  lt,
  lte,
  or,
  sql,
} from "drizzle-orm";
import { db } from "../db/index.js";
import {
  appointment,
  appointmentDuration,
  athleteByUserProfileRole,
} from "../db/schema/index.js";
import { formatInstantInTimeZone, isValidIanaTimeZone } from "../lib/zoned-time-format.js";
import type {
  AppointmentCreateInput,
  AppointmentCreateResult,
  AppointmentDurationListItem,
  AppointmentListDurationsInput,
  AppointmentOverlapsInput,
  AppointmentSearchInput,
  AppointmentSearchResult,
  AppointmentUpdateInput,
} from "../schemas/appointment.js";
import type { ToolResponse } from "../types/responses.js";
import { error, success } from "../types/responses.js";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

function normalizeUtcInstant(s: string): string {
  const d = new Date(s.trim());
  return d.toISOString();
}

async function coachHasAthlete(
  coachId: number,
  athleteId: number
): Promise<boolean> {
  if (!db) return false;
  const [row] = await db
    .select({ athleteId: athleteByUserProfileRole.athleteId })
    .from(athleteByUserProfileRole)
    .where(
      and(
        eq(athleteByUserProfileRole.athleteId, athleteId),
        eq(athleteByUserProfileRole.userRolesId, coachId),
        eq(athleteByUserProfileRole.active, 1)
      )
    )
    .limit(1);
  return row != null;
}

async function getDurationForCoach(
  coachId: number,
  durationId: number
): Promise<number | null> {
  if (!db) return null;
  const [row] = await db
    .select({ id: appointmentDuration.id })
    .from(appointmentDuration)
    .where(
      and(
        eq(appointmentDuration.id, durationId),
        or(
          eq(appointmentDuration.userRolesId, coachId),
          isNull(appointmentDuration.userRolesId)
        )
      )
    )
    .limit(1);
  return row?.id ?? null;
}

function toResult(
  row: {
    id: number;
    userRolesId: number | null;
    athleteId: number | null;
    startDate: string | null;
    endDate: string | null;
    durationId: number | null;
    status: string | null;
    description: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    deletedAt: string | null;
  },
  displayTimeZone?: string
): AppointmentSearchResult {
  const calendarEntryType =
    row.athleteId != null ? "consultation" : "personal_block";
  const tzOk =
    displayTimeZone && isValidIanaTimeZone(displayTimeZone)
      ? displayTimeZone
      : undefined;
  const out: AppointmentSearchResult = {
    id: row.id,
    userRolesId: row.userRolesId,
    athleteId: row.athleteId,
    calendarEntryType,
    startDate: row.startDate,
    endDate: row.endDate,
    durationId: row.durationId,
    status: row.status,
    description: row.description,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
  if (tzOk) {
    const sl = row.startDate
      ? formatInstantInTimeZone(row.startDate, tzOk)
      : null;
    const el = row.endDate
      ? formatInstantInTimeZone(row.endDate, tzOk)
      : null;
    if (sl) out.startLocal = sl;
    if (el) out.endLocal = el;
  }
  return out;
}

function toTimeParam(s: string): string {
  const parts = s.split(":");
  if (parts.length === 2) return `${parts[0].padStart(2, "0")}:${parts[1]}:00`;
  return s;
}

/**
 * MCP persists appointment instants as ISO UTC; Drizzle/pg stores them as timestamp without tz
 * whose clock reads as UTC. For coach-facing filters (calendar day + wall clock), interpret that
 * naive value as UTC then shift to clientTimeZone so "martes 16:00" matches Argentina wall time.
 */
function sqlWallClockInClientZone(column: typeof appointment.startDate, tz: string) {
  return sql`(${column} AT TIME ZONE 'UTC') AT TIME ZONE ${tz}`;
}

/** Turnos activos (no borrados, no cancelados) cuyo intervalo intersecta ]start,end[ en timestamps persistidos. */
const OVERLAP_QUERY_LIMIT_CAP = 50;

async function fetchCoachOverlappingAppointmentRows(
  coachId: number,
  startNormalized: string,
  endNormalized: string,
  limit: number
): Promise<
  {
    id: number;
    userRolesId: number | null;
    athleteId: number | null;
    startDate: string | null;
    endDate: string | null;
    durationId: number | null;
    status: string | null;
    description: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    deletedAt: string | null;
  }[]
> {
  if (!db) return [];
  const cap = Math.min(Math.max(limit, 1), OVERLAP_QUERY_LIMIT_CAP);
  return db
    .select({
      id: appointment.id,
      userRolesId: appointment.userRolesId,
      athleteId: appointment.athleteId,
      startDate: appointment.startDate,
      endDate: appointment.endDate,
      durationId: appointment.durationId,
      status: appointment.status,
      description: appointment.description,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
      deletedAt: appointment.deletedAt,
    })
    .from(appointment)
    .where(
      and(
        eq(appointment.userRolesId, coachId),
        isNull(appointment.deletedAt),
        sql`${appointment.status} IS DISTINCT FROM 'cancelled'`,
        lt(appointment.startDate, endNormalized),
        gt(appointment.endDate, startNormalized)
      )
    )
    .orderBy(asc(appointment.startDate))
    .limit(cap);
}

export const appointmentService = {
  search: async (
    input: AppointmentSearchInput
  ): Promise<ToolResponse<AppointmentSearchResult[]>> => {
    if (!db) {
      return error("Database not configured");
    }
    try {
      const conditions = [];
      const filterTz =
        input.clientTimeZone && isValidIanaTimeZone(input.clientTimeZone)
          ? input.clientTimeZone
          : null;

      if (input.startDate != null) {
        if (filterTz) {
          conditions.push(
            sql`${sqlWallClockInClientZone(appointment.startDate, filterTz)}::date >= ${input.startDate}::date`
          );
        } else {
          conditions.push(
            gte(appointment.startDate, `${input.startDate} 00:00:00`)
          );
        }
      }
      if (input.endDate != null) {
        if (filterTz) {
          conditions.push(
            sql`${sqlWallClockInClientZone(appointment.startDate, filterTz)}::date <= ${input.endDate}::date`
          );
        } else {
          conditions.push(
            lte(appointment.startDate, `${input.endDate} 23:59:59.999`)
          );
        }
      }
      if (input.startTime != null) {
        const t = toTimeParam(input.startTime);
        if (filterTz) {
          conditions.push(
            sql`${sqlWallClockInClientZone(appointment.startDate, filterTz)}::time >= CAST(${t} AS TIME)`
          );
        } else {
          conditions.push(sql`(${appointment.startDate})::time >= (${t}::time)`);
        }
      }
      if (input.endTime != null) {
        const t = toTimeParam(input.endTime);
        if (filterTz) {
          conditions.push(
            sql`${sqlWallClockInClientZone(appointment.startDate, filterTz)}::time <= CAST(${t} AS TIME)`
          );
        } else {
          conditions.push(sql`(${appointment.startDate})::time <= (${t}::time)`);
        }
      }
      if (input.athleteId != null) {
        conditions.push(eq(appointment.athleteId, input.athleteId));
      }
      if (input.state != null) {
        if (input.state === "deleted") {
          conditions.push(isNotNull(appointment.deletedAt));
        } else {
          conditions.push(eq(appointment.status, input.state));
        }
      }
      if (input.coachId != null) {
        conditions.push(eq(appointment.userRolesId, input.coachId));
      }

      const limit = Math.min(input.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
      const baseWhere =
        conditions.length > 0 ? and(...conditions) : undefined;

      const rows = await db
        .select({
          id: appointment.id,
          userRolesId: appointment.userRolesId,
          athleteId: appointment.athleteId,
          startDate: appointment.startDate,
          endDate: appointment.endDate,
          durationId: appointment.durationId,
          status: appointment.status,
          description: appointment.description,
          createdAt: appointment.createdAt,
          updatedAt: appointment.updatedAt,
          deletedAt: appointment.deletedAt,
        })
        .from(appointment)
        .where(baseWhere)
        .orderBy(desc(appointment.startDate))
        .limit(limit);

      const displayTz =
        input.clientTimeZone && isValidIanaTimeZone(input.clientTimeZone)
          ? input.clientTimeZone
          : undefined;
      const result = rows.map((r) => toResult(r, displayTz));
      return success(result);
    } catch (err) {
      return error(
        err instanceof Error ? err.message : "Failed to search appointments"
      );
    }
  },

  listDurations: async (
    input: AppointmentListDurationsInput
  ): Promise<ToolResponse<AppointmentDurationListItem[]>> => {
    if (!db) return error("Database not configured");

    try {
      const rows = await db
        .select({
          id: appointmentDuration.id,
          name: appointmentDuration.name,
          durationMin: appointmentDuration.durationMin,
          isDefault: appointmentDuration.isDefault,
          color: appointmentDuration.color,
          useGoogleCalendar: appointmentDuration.useGoogleCalendar,
        })
        .from(appointmentDuration)
        .where(
          or(
            eq(appointmentDuration.userRolesId, input.coachId),
            isNull(appointmentDuration.userRolesId)
          )
        )
        .orderBy(
          desc(appointmentDuration.isDefault),
          asc(appointmentDuration.durationMin),
          asc(appointmentDuration.id)
        );

      return success(
        rows.map((r) => ({
          id: r.id,
          name: r.name,
          durationMin: r.durationMin,
          isDefault: r.isDefault,
          color: r.color,
          useGoogleCalendar: r.useGoogleCalendar,
        }))
      );
    } catch (err) {
      return error(
        err instanceof Error ? err.message : "Failed to list appointment durations"
      );
    }
  },

  overlaps: async (
    input: AppointmentOverlapsInput
  ): Promise<ToolResponse<AppointmentSearchResult[]>> => {
    if (!db) return error("Database not configured");

    try {
      const startNormalized = normalizeUtcInstant(input.startUtc);
      const endNormalized = normalizeUtcInstant(input.endUtc);
      const tz =
        input.clientTimeZone && isValidIanaTimeZone(input.clientTimeZone)
          ? input.clientTimeZone
          : undefined;
      const rows = await fetchCoachOverlappingAppointmentRows(
        input.coachId,
        startNormalized,
        endNormalized,
        input.limit ?? 25
      );
      const result = rows.map((r) => toResult(r, tz));
      return success(result);
    } catch (err) {
      return error(
        err instanceof Error ? err.message : "Failed to list overlapping appointments"
      );
    }
  },

  create: async (
    input: AppointmentCreateInput
  ): Promise<ToolResponse<AppointmentCreateResult>> => {
    if (!db) return error("Database not configured");

    const startNormalized = normalizeUtcInstant(input.startUtc);
    const endNormalized = normalizeUtcInstant(input.endUtc);
    const tz =
      input.clientTimeZone && isValidIanaTimeZone(input.clientTimeZone)
        ? input.clientTimeZone
        : undefined;

    try {
      if (input.durationId != null) {
        const okId = await getDurationForCoach(input.coachId, input.durationId);
        if (okId == null)
          return error("durationId is not allowed for this coach");
      }

      if (input.athleteId != null) {
        const hasLink = await coachHasAthlete(input.coachId, input.athleteId);
        if (!hasLink) return error("Coach has no active access to this athlete");
      }

      const overlappingRows = await fetchCoachOverlappingAppointmentRows(
        input.coachId,
        startNormalized,
        endNormalized,
        OVERLAP_QUERY_LIMIT_CAP
      );
      const overlappingExisting = overlappingRows.map((r) => toResult(r, tz));

      const [created] = await db
        .insert(appointment)
        .values({
          userRolesId: input.coachId,
          athleteId: input.athleteId ?? null,
          startDate: startNormalized,
          endDate: endNormalized,
          durationId: input.durationId ?? null,
          status: "confirmed",
          description: input.description ?? null,
        })
        .returning({
          id: appointment.id,
          userRolesId: appointment.userRolesId,
          athleteId: appointment.athleteId,
          startDate: appointment.startDate,
          endDate: appointment.endDate,
          durationId: appointment.durationId,
          status: appointment.status,
          description: appointment.description,
          createdAt: appointment.createdAt,
          updatedAt: appointment.updatedAt,
          deletedAt: appointment.deletedAt,
        });

      return success({
        appointment: toResult(created, tz),
        overlappingExisting,
      });
    } catch (err) {
      return error(
        err instanceof Error ? err.message : "Failed to create appointment"
      );
    }
  },

  update: async (
    input: AppointmentUpdateInput
  ): Promise<ToolResponse<AppointmentSearchResult | null>> => {
    if (!db) return error("Database not configured");

    try {
      const [current] = await db
        .select({
          id: appointment.id,
          userRolesId: appointment.userRolesId,
        })
        .from(appointment)
        .where(
          and(
            eq(appointment.id, input.appointmentId),
            eq(appointment.userRolesId, input.coachId)
          )
        )
        .limit(1);

      if (!current) return success(null);

      const durationToValidate = input.durationId;
      if (typeof durationToValidate === "number" && durationToValidate > 0) {
        const okId = await getDurationForCoach(input.coachId, durationToValidate);
        if (okId == null)
          return error("durationId is not allowed for this coach");
      }

      type AppointmentUpdatePatch = {
        startDate?: string;
        endDate?: string;
        status?: string;
        description?: string | null;
        durationId?: number | null;
        deletedAt?: string | null;
        updatedAt: string;
      };
      const patch: AppointmentUpdatePatch = {
        updatedAt: new Date().toISOString(),
      };

      if (input.startUtc != null && input.endUtc != null) {
        patch.startDate = normalizeUtcInstant(input.startUtc);
        patch.endDate = normalizeUtcInstant(input.endUtc);
      }
      if (input.status != null) patch.status = input.status;
      if (input.description !== undefined)
        patch.description = input.description ?? null;
      if (input.durationId !== undefined) patch.durationId = input.durationId;
      if (input.deleted === true) patch.deletedAt = new Date().toISOString();
      else if (input.deleted === false) patch.deletedAt = null;

      const [updated] = await db
        .update(appointment)
        .set(patch)
        .where(
          and(
            eq(appointment.id, input.appointmentId),
            eq(appointment.userRolesId, input.coachId)
          )
        )
        .returning({
          id: appointment.id,
          userRolesId: appointment.userRolesId,
          athleteId: appointment.athleteId,
          startDate: appointment.startDate,
          endDate: appointment.endDate,
          durationId: appointment.durationId,
          status: appointment.status,
          description: appointment.description,
          createdAt: appointment.createdAt,
          updatedAt: appointment.updatedAt,
          deletedAt: appointment.deletedAt,
        });

      return success(updated ? toResult(updated) : null);
    } catch (err) {
      return error(
        err instanceof Error ? err.message : "Failed to update appointment"
      );
    }
  },
};
