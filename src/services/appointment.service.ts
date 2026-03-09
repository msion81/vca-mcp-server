import { and, desc, eq, gte, isNotNull, lte, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { appointment } from "../db/schema/index.js";
import type {
  AppointmentSearchInput,
  AppointmentSearchResult,
} from "../schemas/appointment.js";
import type { ToolResponse } from "../types/responses.js";
import { success, error } from "../types/responses.js";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

function toResult(row: {
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
}): AppointmentSearchResult {
  return {
    id: row.id,
    userRolesId: row.userRolesId,
    athleteId: row.athleteId,
    startDate: row.startDate,
    endDate: row.endDate,
    durationId: row.durationId,
    status: row.status,
    description: row.description,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    deletedAt: row.deletedAt,
  };
}

/** Normalize "H:mm" or "HH:mm" to "HH:mm:00" for Postgres time comparison. */
function toTimeParam(s: string): string {
  const parts = s.split(":");
  if (parts.length === 2) return `${parts[0].padStart(2, "0")}:${parts[1]}:00`;
  return s;
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

      if (input.startDate != null) {
        conditions.push(
          gte(appointment.startDate, `${input.startDate} 00:00:00`)
        );
      }
      if (input.endDate != null) {
        conditions.push(
          lte(appointment.startDate, `${input.endDate} 23:59:59.999`)
        );
      }
      if (input.startTime != null) {
        const t = toTimeParam(input.startTime);
        conditions.push(
          sql`(${appointment.startDate})::time >= (${t}::time)`
        );
      }
      if (input.endTime != null) {
        const t = toTimeParam(input.endTime);
        conditions.push(
          sql`(${appointment.startDate})::time <= (${t}::time)`
        );
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

      // Debug log para investigar
      console.log('[appointments.search] Query filters:', {
        athleteId: input.athleteId,
        coachId: input.coachId,
        startDate: input.startDate,
        endDate: input.endDate,
        conditionsCount: conditions.length
      });

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

      const result = rows.map(toResult);
      console.log('[appointments.search] Query results:', {
        rowCount: rows.length,
        sampleIds: rows.slice(0, 3).map(r => ({ id: r.id, athleteId: r.athleteId, userRolesId: r.userRolesId, startDate: r.startDate }))
      });
      return success(result);
    } catch (err) {
      return error(
        err instanceof Error ? err.message : "Failed to search appointments"
      );
    }
  },
};
