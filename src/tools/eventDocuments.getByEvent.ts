import {
  eventDocumentsGetByEventSchema,
  type EventDocumentsGetByEventInput,
} from "../schemas/eventDocuments.js";
import { eventDocumentsService } from "../services/eventDocuments.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "eventDocuments.getByEvent";

export const description = "List documents attached to an event or edition.";

export const inputSchema = eventDocumentsGetByEventSchema;

export const handleEventDocumentsGetByEvent = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = eventDocumentsGetByEventSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return eventDocumentsService.getByEvent(parsed.data as EventDocumentsGetByEventInput);
};
