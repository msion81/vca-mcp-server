import {
  appointmentSearchSchema,
  type AppointmentSearchInput,
} from "../schemas/appointment.js";
import { appointmentService } from "../services/appointment.service.js";
import type { ToolResponse } from "../types/responses.js";
import { error } from "../types/responses.js";

export const toolName = "appointments.search";

export const description =
  "Search calendar rows for the coach (consultations + personal blocks). IMPORTANT: coachId is automatically injected. Optional clientTimeZone (IANA, e.g. America/Argentina/Buenos_Aires): when provided (usually injected by the agent from the browser), each row includes startLocal/endLocal for wall time AND startDate/endDate/startTime/endTime filters apply to that same zone (so «martes / las 16» matches rows stored as UTC instants). Without clientTimeZone, date/time filters use legacy naive comparisons (prefer passing zone). calendarEntryType: consultation vs personal_block. Limit default 50.";

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
