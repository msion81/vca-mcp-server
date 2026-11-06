import {
  appointmentFreeSlotsSchema,
  type AppointmentFreeSlotsInput,
} from "../schemas/appointment.js";
import { appointmentService } from "../services/appointment.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "appointments.freeSlots";

export const description =
  "Find available time slots on the coach's calendar for a given date and duration. " +
  "Use when the coach asks 'find me a free slot', 'buscame un hueco libre', 'buscame un espacio disponible', 'cuándo tengo tiempo para X', 'when do I have time for X', or when a proposed slot has conflicts and you want to suggest alternatives. " +
  "THIS IS THE ONLY TOOL THAT ACCEPTS durationMinutes FOR SLOT SEARCHES. appointments.search does NOT have a durationMinutes parameter — passing durationMinutes to appointments.search has absolutely no effect and will NOT find free slots or filter by duration. If you want to find a free slot of N minutes, you MUST call THIS tool (appointments.freeSlots), not appointments.search. " +
  "Takes durationMinutes directly (e.g. 60 for 'una hora', 30 for 'media hora') — does NOT require a durationId or listDurations. " +
  "coachId is automatically injected. " +
  "Returns up to `count` available slots (default 3) within the working window (default 08:00–21:00 local), snapped to 15-minute boundaries. " +
  "Each slot includes displayRangeLocal (preferred), startLocal/endLocal, and the startUtc/endUtc ready to pass to appointments.create. " +
  "clientTimeZone (IANA) is required unless the coach has a timezone on their profile.";

export const inputSchema = appointmentFreeSlotsSchema;

export const handleAppointmentsFreeSlots = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = appointmentFreeSlotsSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);
  return appointmentService.freeSlots(parsed.data as AppointmentFreeSlotsInput);
};
