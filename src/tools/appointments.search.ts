import {
  appointmentSearchSchema,
  appointmentFreeSlotsSchema,
  type AppointmentSearchInput,
} from "../schemas/appointment.js";
import { appointmentService } from "../services/appointment.service.js";
import type { ToolResponse } from "../types/responses.js";
import { error } from "../types/responses.js";

export const toolName = "appointments.search";

export const description =
  "Search the coach's calendar. ⚠️ TWO MODES: (1) Without durationMinutes → returns BOOKED appointments (consultations + personal blocks). You CANNOT determine free slots from booked appointment results. (2) With durationMinutes → returns AVAILABLE FREE TIME SLOTS of that duration. You MUST pass durationMinutes to find free slots — there is no other way. When coach asks 'buscame un hueco', 'hueco libre', 'cuándo tengo tiempo': ALWAYS include durationMinutes. Example free-slot call: {startDate:'2026-11-13', durationMinutes:60, clientTimeZone:'America/Argentina/Buenos_Aires'}. NOTE: for free-slot searches, use startDate (not 'date') as the field name. Free-slot results contain displayRangeLocal (e.g. '10:00–11:00') — present those as options to the coach. IMPORTANT: coachId is automatically injected. Optional clientTimeZone (IANA, e.g. America/Argentina/Buenos_Aires): when resolved (request or coach DB profile), each row includes displayRangeLocal (preferred coach wall range), startLocal/endLocal for wall time, AND date/time filters apply in that zone. startDate/endDate in each row are UTC storage instants — never present those times to the coach as local. calendarEntryType: consultation vs personal_block. Each row also includes optCode and questionnaireId (non-empty optCode means a pre-anamnesis questionnaire link was sent to the athlete for this appointment; pair with questionnaires.checkAnswered to see if it was answered). Limit default 50.";

export const inputSchema = appointmentSearchSchema;

export const handleAppointmentsSearch = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = appointmentSearchSchema.safeParse(params);
  if (!parsed.success) {
    return error(parsed.error.message);
  }
  if (parsed.data.durationMinutes !== undefined) {
    // Model tried to find free slots via search — proxy to freeSlots instead
    const { durationMinutes, coachId, startDate, clientTimeZone } = parsed.data;
    if (!coachId) return error("coachId is required for free slot search");
    const date = startDate ?? new Date().toISOString().slice(0, 10);
    const freeSlotsInput = appointmentFreeSlotsSchema.parse({ coachId, date, durationMinutes, clientTimeZone });
    return appointmentService.freeSlots(freeSlotsInput);
  }
  return appointmentService.search(parsed.data as AppointmentSearchInput);
};
