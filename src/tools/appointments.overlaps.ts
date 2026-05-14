import {
  appointmentOverlapsSchema,
  type AppointmentOverlapsInput,
} from "../schemas/appointment.js";
import { appointmentService } from "../services/appointment.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "appointments.overlaps";

export const description =
  "Before confirming a new calendar slot, list OTHER rows for this coach whose interval overlaps [startUtc,endUtc] (UTC ISO like create). Overlap ignores soft-deleted and cancelled rows only — creation is still allowed if busy. coachId injected; optional clientTimeZone (IANA). Each row includes displayRangeLocal (preferred coach wall range) and startLocal/endLocal when a display zone is resolved; raw UTC startDate/endDate are OMITTED from the tool JSON in that case so the model cannot misread them as local. NEVER describe overlap times using UTC ISO. If displayRangeLocal is missing, fix timezone (IANA on coach profile or pass clientTimeZone).";

export const inputSchema = appointmentOverlapsSchema;

export const handleAppointmentsOverlaps = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = appointmentOverlapsSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);
  return appointmentService.overlaps(parsed.data as AppointmentOverlapsInput);
};
