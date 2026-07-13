import {
  eventsGetEditionsSchema,
  type EventsGetEditionsInput,
} from "../schemas/events.js";
import { eventsService } from "../services/events.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "events.getEditions";

export const description = "List editions (yearly instances) of an event series.";

export const inputSchema = eventsGetEditionsSchema;

export const handleEventsGetEditions = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = eventsGetEditionsSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return eventsService.getEditions(parsed.data as EventsGetEditionsInput);
};
