import {
  appointmentCreateSchema,
  type AppointmentCreateInput,
} from "../schemas/appointment.js";
import { appointmentService } from "../services/appointment.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "appointments.create";

export const description =
  "Create one calendar row for the logged-in coach (coachId is injected). REQUIRED: startUtc and endUtc MUST be RFC3339/ISO timestamps in explicit UTC (...Z or ...+00:00); YOU must compute endUtc before calling—this server persists the window verbatim. Without athleteId: personal time BLOCK / occupied slot (no patient). WITH athleteId: APPOINTMENT with that athlete—then durationId from appointments.listDurations is REQUIRED (session type preset). Optional description; optional clientTimeZone (IANA) so overlappingExisting rows include startLocal/endLocal. SUCCESS BODY: { appointment, overlappingExisting } — overlappingExisting lists OTHER active (non-deleted, non-cancelled) rows that already occupied that interval BEFORE insert (may be empty); creation always proceeds even when non-empty — warn the coach when confirming if overlaps were shown earlier via appointments.overlaps.";


export const inputSchema = appointmentCreateSchema;

export const handleAppointmentsCreate = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = appointmentCreateSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);
  return appointmentService.create(parsed.data as AppointmentCreateInput);
};
