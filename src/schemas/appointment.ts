import { z } from "zod";
import { appointment } from "../db/schema/index.js";

/**
 * Allowed appointment state filter: confirmed, cancelled, or deleted (deletedAt set).
 */
const appointmentStateSchema = z.enum(["confirmed", "cancelled", "deleted"]);

/**
 * Input schema for appointments.search.
 * - Span: startDate/endDate (YYYY-MM-DD) — appointments whose **local start calendar day** (see clientTimeZone) falls in range when clientTimeZone is set; otherwise naive timestamp comparison (legacy).
 * - Time of day: startTime/endTime (HH:mm, 24h) — filter by **local** start wall-clock when clientTimeZone is set (matches coach phrasing like «las 16»); otherwise compares stored naive clock (UTC-shaped rows from MCP).
 * - coachId = user_roles_id of the coach; state = confirmed | cancelled | deleted.
 */
export const appointmentSearchSchema = z
  .object({
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD")
      .optional(),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD")
      .optional(),
    startTime: z
      .string()
      .regex(/^\d{1,2}:\d{2}(:\d{2})?$/, "Must be HH:mm or HH:mm:ss (24h)")
      .optional(),
    endTime: z
      .string()
      .regex(/^\d{1,2}:\d{2}(:\d{2})?$/, "Must be HH:mm or HH:mm:ss (24h)")
      .optional(),
    athleteId: z.number().int().positive().optional(),
    state: appointmentStateSchema.optional(),
    coachId: z.number().int().positive().optional(),
    limit: z.number().int().min(1).max(100).optional().default(50),
    /** IANA zone; cuando es válida, la respuesta incluye startLocal/endLocal en esa zona. */
    clientTimeZone: z.string().min(1).max(120).optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) return data.startDate <= data.endDate;
      return true;
    },
    { message: "startDate must be before or equal to endDate", path: ["endDate"] }
  )
  .refine(
    (data) => {
      if (data.startTime && data.endTime) return data.startTime <= data.endTime;
      return true;
    },
    { message: "startTime must be before or equal to endTime", path: ["endTime"] }
  );

export type AppointmentSearchInput = z.infer<typeof appointmentSearchSchema>;

/**
 * Instant in UTC-only form for create/update payloads (explicit Z / +00:00 / -00:00).
 */
export const appointmentUtcInstantSchema = z
  .string()
  .min(1)
  .refine(
    (raw) => {
      const trimmed = raw.trim();
      const hasUtc =
        /z$/i.test(trimmed) ||
        /\+00:00$/i.test(trimmed) ||
        /-00:00$/i.test(trimmed);
      if (!hasUtc) return false;
      return !Number.isNaN(Date.parse(trimmed));
    },
    {
      message: "Must be ISO 8601 with explicit UTC suffix (e.g. ...Z or ...+00:00)",
    }
  );

export const appointmentListDurationsSchema = z.object({
  coachId: z.number().int().positive(),
});

export type AppointmentListDurationsInput = z.infer<typeof appointmentListDurationsSchema>;

export const appointmentCreateSchema = z
  .object({
    coachId: z.number().int().positive(),
    startUtc: appointmentUtcInstantSchema,
    endUtc: appointmentUtcInstantSchema,
    athleteId: z.number().int().positive().optional(),
    durationId: z.number().int().positive().optional(),
    /** Free text; for blocks without athleteId this is the calendar-visible reason (e.g. dentist). */
    description: z.string().max(8000).optional(),
    /** Para devolver overlappingExisting con startLocal/endLocal coherentes con el navegador del coach. */
    clientTimeZone: z.string().min(1).max(120).optional(),
  })
  .superRefine((data, ctx) => {
    const startMs = Date.parse(data.startUtc.trim());
    const endMs = Date.parse(data.endUtc.trim());
    if (endMs <= startMs)
      ctx.addIssue({
        code: "custom",
        message: "endUtc must be after startUtc",
        path: ["endUtc"],
      });
    if (data.athleteId != null && data.durationId == null) {
      ctx.addIssue({
        code: "custom",
        message: "durationId is required when athleteId is present (patient appointment)",
        path: ["durationId"],
      });
    }
  });

export type AppointmentCreateInput = z.infer<typeof appointmentCreateSchema>;

export const appointmentOverlapsSchema = z
  .object({
    coachId: z.number().int().positive(),
    startUtc: appointmentUtcInstantSchema,
    endUtc: appointmentUtcInstantSchema,
    limit: z.number().int().min(1).max(50).optional().default(25),
    clientTimeZone: z.string().min(1).max(120).optional(),
  })
  .superRefine((data, ctx) => {
    const startMs = Date.parse(data.startUtc.trim());
    const endMs = Date.parse(data.endUtc.trim());
    if (endMs <= startMs)
      ctx.addIssue({
        code: "custom",
        message: "endUtc must be after startUtc",
        path: ["endUtc"],
      });
  });

export type AppointmentOverlapsInput = z.infer<typeof appointmentOverlapsSchema>;

const appointmentWritableStatusSchema = z.enum(["confirmed", "cancelled"]);

export const appointmentUpdateSchema = z
  .object({
    coachId: z.number().int().positive(),
    appointmentId: z.number().int().positive(),
    startUtc: appointmentUtcInstantSchema.optional(),
    endUtc: appointmentUtcInstantSchema.optional(),
    status: appointmentWritableStatusSchema.optional(),
    description: z.string().max(8000).optional(),
    durationId: z.number().int().positive().nullable().optional(),
    /** true = soft-delete (set deleted_at); false = clear deleted_at (restore). */
    deleted: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    const hasStart = data.startUtc != null;
    const hasEnd = data.endUtc != null;
    if (hasStart !== hasEnd) {
      ctx.addIssue({
        code: "custom",
        message: "When moving the slot, send both startUtc and endUtc in UTC.",
        path: hasStart ? ["endUtc"] : ["startUtc"],
      });
      return;
    }
    if (hasStart && hasEnd && data.startUtc && data.endUtc) {
      const startMs = Date.parse(data.startUtc.trim());
      const endMs = Date.parse(data.endUtc.trim());
      if (endMs <= startMs)
        ctx.addIssue({
          code: "custom",
          message: "endUtc must be after startUtc",
          path: ["endUtc"],
        });
    }
    const hasPatch =
      data.status !== undefined ||
      data.description !== undefined ||
      data.durationId !== undefined ||
      data.deleted !== undefined ||
      hasStart;
    if (!hasPatch)
      ctx.addIssue({
        code: "custom",
        message: "At least one field to update is required",
        path: ["appointmentId"],
      });
  });

export type AppointmentUpdateInput = z.infer<typeof appointmentUpdateSchema>;

export interface AppointmentDurationListItem {
  id: number;
  name: string;
  durationMin: number;
  isDefault: boolean;
  color: string | null;
  useGoogleCalendar: boolean | null;
}

/** Appointment row type from pulled Drizzle schema. */
export type AppointmentRow = typeof appointment.$inferSelect;

/**
 * consultation = turno con un atleta (athleteId presente).
 * personal_block = bloqueo/reserva del calendario sin atleta (athleteId null), p. ej. tiempo personal o “no atender”.
 */
export type AppointmentCalendarEntryType = "consultation" | "personal_block";

/** Wall time in clientTimeZone when the search requested it. */
export interface AppointmentLocalInstantParts {
  calendarDate: string;
  timeHm: string;
}

/** Shaped appointment for tool response. */
export interface AppointmentSearchResult {
  id: number;
  userRolesId: number | null;
  athleteId: number | null;
  /** Derivado de athleteId: consultation si hay atleta; personal_block si athleteId es null. */
  calendarEntryType: AppointmentCalendarEntryType;
  startDate: string | null;
  endDate: string | null;
  /** startDate interpretado en clientTimeZone (si se pidió y es válido). */
  startLocal?: AppointmentLocalInstantParts;
  /** endDate interpretado en clientTimeZone (si se pidió y es válido). */
  endLocal?: AppointmentLocalInstantParts;
  durationId: number | null;
  status: string | null;
  description: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
}

/** Respuesta de appointments.create: la fila nueva + turnos activos que ya ocupaban ese intervalo (si hay). */
export interface AppointmentCreateResult {
  appointment: AppointmentSearchResult;
  overlappingExisting: AppointmentSearchResult[];
}
