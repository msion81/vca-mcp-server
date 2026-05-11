import {
  appointmentSearchSchema,
  type AppointmentSearchInput,
} from "../schemas/appointment.js";
import { appointmentService } from "../services/appointment.service.js";
import type { ToolResponse } from "../types/responses.js";
import { error } from "../types/responses.js";

export const toolName = "appointments.search";

export const description =
  "Search calendar rows for the coach (consultations + personal blocks). IMPORTANT: coachId is automatically injected. Each result includes calendarEntryType: \"consultation\" (athleteId set — turno con atleta) or \"personal_block\" (athleteId null — bloqueo/reserva personal en el calendario, NO es una cita con atleta; usar description y horarios, NO llamar athlete.getById). Filters: startDate/endDate (YYYY-MM-DD), startTime/endTime (HH:mm), athleteId, state (confirmed, cancelled, deleted). CRITICAL: Use startDate/endDate for calendar dates (mañana, esta semana), NOT startTime/endTime for whole-day ranges. Limit default 50.";

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
