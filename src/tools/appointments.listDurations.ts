import {
  appointmentListDurationsSchema,
  type AppointmentListDurationsInput,
} from "../schemas/appointment.js";
import { appointmentService } from "../services/appointment.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "appointments.listDurations";

export const description =
  "Lists the coach-configured consultation duration presets (name, minutes, ids). USE BEFORE appointments.create WHEN booking WITH an athlete so you choose the correct durationId and YOU compute endUtc = startUtc + duration minutes in UTC—this tool alone does NOT block any calendar slot.";

export const inputSchema = appointmentListDurationsSchema;

export const handleAppointmentsListDurations = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = appointmentListDurationsSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);
  return appointmentService.listDurations(parsed.data as AppointmentListDurationsInput);
};
