import { eventsGetByIdSchema, type EventsGetByIdInput } from "../schemas/events.js";
import { eventsService } from "../services/events.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "events.getById";

export const description = "Get full detail for a single event/edition by id, including its series (if any).";

export const inputSchema = eventsGetByIdSchema;

export const handleEventsGetById = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = eventsGetByIdSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return eventsService.getById(parsed.data as EventsGetByIdInput);
};
