import {
  eventEditionResultsGetByEventSchema,
  type EventEditionResultsGetByEventInput,
} from "../schemas/eventEditionResults.js";
import { eventEditionResultsService } from "../services/eventEditionResults.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "eventEditionResults.getByEvent";

export const description = "List all participant results recorded for an event/edition.";

export const inputSchema = eventEditionResultsGetByEventSchema;

export const handleEventEditionResultsGetByEvent = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = eventEditionResultsGetByEventSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return eventEditionResultsService.getByEvent(parsed.data as EventEditionResultsGetByEventInput);
};
