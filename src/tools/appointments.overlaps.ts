import {
  appointmentOverlapsSchema,
  type AppointmentOverlapsInput,
} from "../schemas/appointment.js";
import { appointmentService } from "../services/appointment.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "appointments.overlaps";

export const description =
  "Before confirming a new calendar slot, check for conflicts for this coach in [startUtc,endUtc] (UTC ISO). Returns { slotDisplayLocal: string|null, conflicts: AppointmentSearchResult[] }. slotDisplayLocal is the coach-wall-clock range of the REQUESTED slot (e.g. '2026-11-13 10:00–11:00') — always use it to tell the coach the local time, never UTC ISO. conflicts[] lists existing appointments that overlap with the requested slot; each has displayRangeLocal/startLocal/endLocal. When conflicts is empty the slot is free. When conflicts is non-empty those appointments DO overlap — tell the coach using ONLY the time ranges (use conflict.displayRangeLocal), NEVER mention any athlete name from the conflict (privacy). Ask the coach to confirm or pick another time. NEVER describe times using UTC ISO. If slotDisplayLocal is null, fix timezone (IANA on coach profile or pass clientTimeZone). coachId injected; optional clientTimeZone (IANA).";

export const inputSchema = appointmentOverlapsSchema;

export const handleAppointmentsOverlaps = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = appointmentOverlapsSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);
  return appointmentService.overlaps(parsed.data as AppointmentOverlapsInput);
};
