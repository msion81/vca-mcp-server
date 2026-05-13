import {
  appointmentUpdateSchema,
  type AppointmentUpdateInput,
} from "../schemas/appointment.js";
import { appointmentService } from "../services/appointment.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "appointments.update";

export const description =
  "Updates a calendar appointment already owned by the coach (coachId injected), identified by appointmentId. Typical changes: BOTH startUtc and endUtc together in UTC to move/reschedule (YOU compute endUtc); status confirmed or cancelled; description; durationId nullable to clear FK; deleted true soft-deletes (sets deleted_at), false restores (clears deleted_at). Use appointments.search rows to distinguish personal_block (no athlete) vs consultation (patient).";

export const inputSchema = appointmentUpdateSchema;

export const handleAppointmentsUpdate = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = appointmentUpdateSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);
  return appointmentService.update(parsed.data as AppointmentUpdateInput);
};
