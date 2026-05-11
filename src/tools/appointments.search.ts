import {
  appointmentSearchSchema,
  type AppointmentSearchInput,
} from "../schemas/appointment.js";
import { appointmentService } from "../services/appointment.service.js";
import type { ToolResponse } from "../types/responses.js";
import { error } from "../types/responses.js";

export const toolName = "appointments.search";

export const description =
  "Search calendar rows for the coach (consultations + personal blocks). IMPORTANT: coachId is automatically injected. Optional clientTimeZone (IANA, e.g. America/Argentina/Buenos_Aires): when provided (usually injected by the agent from the browser), each row includes startLocal and endLocal { calendarDate: YYYY-MM-DD, timeHm: HH:mm } for displaying wall time in that zone; raw startDate/endDate may be UTC from DB. calendarEntryType: consultation vs personal_block (see module prompts). Filters: startDate/endDate (YYYY-MM-DD), startTime/endTime (HH:mm), athleteId, state. CRITICAL: Use startDate/endDate for calendar dates, NOT startTime/endTime for full-day ranges. Limit default 50.";

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
