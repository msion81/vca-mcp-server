import { eventsSearchSchema, type EventsSearchInput } from "../schemas/events.js";
import { eventsService } from "../services/events.service.js";
import type { ToolResponse } from "../types/responses.js";
import { error } from "../types/responses.js";

export const toolName = "events.search";

export const description = "Search sports events";

export const inputSchema = eventsSearchSchema;

export const handleEventsSearch = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = eventsSearchSchema.safeParse(params);
  if (!parsed.success) {
    return error(parsed.error.message);
  }
  return eventsService.search(parsed.data as EventsSearchInput);
}