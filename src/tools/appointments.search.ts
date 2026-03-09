import {
  appointmentSearchSchema,
  type AppointmentSearchInput,
} from "../schemas/appointment.js";
import { appointmentService } from "../services/appointment.service.js";
import type { ToolResponse } from "../types/responses.js";
import { error } from "../types/responses.js";

export const toolName = "appointments.search";

export const description =
  "Search appointments. IMPORTANT: coachId is automatically injected - you will ONLY see appointments for the current coach. Filters: startDate/endDate (YYYY-MM-DD format, for filtering by calendar date - e.g., tomorrow, next week), startTime/endTime (HH:mm format, for filtering by time of day - e.g., morning appointments 09:00-12:00), athleteId, state (confirmed, cancelled, deleted). CRITICAL: Use startDate/endDate for DATES (mañana, esta semana), NOT startTime/endTime. startTime/endTime are for hour ranges within a day. Common use cases: ALL coach appointments → {}; tomorrow → { startDate: \"2026-03-09\", endDate: \"2026-03-09\" }; this week → { startDate: \"2026-03-08\", endDate: \"2026-03-14\" }; morning appointments → { startTime: \"06:00\", endTime: \"12:00\" }; athlete appointments → { athleteId: <id> }. Limit default 50.";

export const inputSchema = appointmentSearchSchema;

export const handleAppointmentsSearch = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = appointmentSearchSchema.safeParse(params);
  if (!parsed.success) {
    return error(parsed.error.message);
  }
  return appointmentService.search(parsed.data as AppointmentSearchInput);
};
