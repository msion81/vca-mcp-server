import { z } from "zod";
import { appointment } from "../db/schema/index.js";

/**
 * Allowed appointment state filter: confirmed, cancelled, or deleted (deletedAt set).
 */
const appointmentStateSchema = z.enum(["confirmed", "cancelled", "deleted"]);

/**
 * Input schema for appointments.search.
 * - Span: startDate/endDate (YYYY-MM-DD) — appointments that start within this date range.
 * - Time of day: startTime/endTime (HH:mm, 24h) — filter by start time within the day.
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

/** Appointment row type from pulled Drizzle schema. */
export type AppointmentRow = typeof appointment.$inferSelect;

/** Shaped appointment for tool response. */
export interface AppointmentSearchResult {
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
}
