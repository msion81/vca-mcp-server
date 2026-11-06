import {
  appointmentListDurationsSchema,
  type AppointmentListDurationsInput,
} from "../schemas/appointment.js";
import { appointmentService } from "../services/appointment.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "appointments.listDurations";

export const description =
  "Lists the coach-configured consultation duration presets (name, minutes, ids). USE ONLY before appointments.create when booking WITH an athlete AND the coach has NOT specified the exact duration in minutes. NEVER call this to find free slots or availability — use appointments.freeSlots for that. NEVER call this when the coach says 'buscame un hueco', 'hueco libre', 'espacio disponible' — even if the message says 'para un control' or 'para una hora de control': in that case call appointments.freeSlots with durationMinutes=60 (one hour). 'para un control' describes the appointment TYPE that will be booked LATER; it is NOT a reason to call this tool now. When the coach says 'una hora' or '60 minutos', durationMinutes=60 — no need to call this tool. YOU compute endUtc = startUtc + durationMinutes in UTC — this tool alone does NOT block any calendar slot.";

export const inputSchema = appointmentListDurationsSchema;

export const handleAppointmentsListDurations = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = appointmentListDurationsSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);
  return appointmentService.listDurations(parsed.data as AppointmentListDurationsInput);
};
