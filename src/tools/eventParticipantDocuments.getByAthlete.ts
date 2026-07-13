import {
  eventParticipantDocumentsGetByAthleteSchema,
  type EventParticipantDocumentsGetByAthleteInput,
} from "../schemas/eventDocuments.js";
import { eventDocumentsService } from "../services/eventDocuments.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "eventParticipantDocuments.getByAthlete";

export const description =
  "List an athlete's documents for an event/edition (optionally filtered by a specific event).";

export const inputSchema = eventParticipantDocumentsGetByAthleteSchema;

export const handleEventParticipantDocumentsGetByAthlete = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = eventParticipantDocumentsGetByAthleteSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return eventDocumentsService.getParticipantDocumentsByAthlete(
    parsed.data as EventParticipantDocumentsGetByAthleteInput
  );
};
