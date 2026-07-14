import {
  appointmentSearchSchema,
  type AppointmentSearchInput,
} from "../schemas/appointment.js";
import { appointmentService } from "../services/appointment.service.js";
import type { ToolResponse } from "../types/responses.js";
import { error } from "../types/responses.js";

export const toolName = "appointments.search";

export const description =
  "Search calendar rows for the coach (consultations + personal blocks). IMPORTANT: coachId is automatically injected. Optional clientTimeZone (IANA, e.g. America/Argentina/Buenos_Aires): when resolved (request or coach DB profile), each row includes displayRangeLocal (preferred coach wall range), startLocal/endLocal for wall time, AND date/time filters apply in that zone. startDate/endDate in each row are UTC storage instants — never present those times to the coach as local. calendarEntryType: consultation vs personal_block. Each row also includes optCode and questionnaireId (non-empty optCode means a pre-anamnesis questionnaire link was sent to the athlete for this appointment; pair with questionnaires.checkAnswered to see if it was answered). Limit default 50.";

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
