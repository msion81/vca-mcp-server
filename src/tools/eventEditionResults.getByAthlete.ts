import {
  eventEditionResultsGetByAthleteSchema,
  type EventEditionResultsGetByAthleteInput,
} from "../schemas/eventEditionResults.js";
import { eventEditionResultsService } from "../services/eventEditionResults.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "eventEditionResults.getByAthlete";

export const description =
  "List an athlete's event/edition results (optionally filtered by a specific event).";

export const inputSchema = eventEditionResultsGetByAthleteSchema;

export const handleEventEditionResultsGetByAthlete = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = eventEditionResultsGetByAthleteSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return eventEditionResultsService.getByAthlete(parsed.data as EventEditionResultsGetByAthleteInput);
};
