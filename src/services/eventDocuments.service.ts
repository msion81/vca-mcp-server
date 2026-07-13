import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { eventDocuments, eventParticipantDocuments, eventParticipants } from "../db/schema/index.js";
import type {
  EventDocumentRecord,
  EventDocumentsGetByEventInput,
  EventParticipantDocumentRecord,
  EventParticipantDocumentsGetByAthleteInput,
} from "../schemas/eventDocuments.js";
import { error, success, type ToolResponse } from "../types/responses.js";

export const eventDocumentsService = {
  getByEvent: async (
    input: EventDocumentsGetByEventInput
  ): Promise<ToolResponse<EventDocumentRecord[]>> => {
    if (!db) return error("Database not configured");

    try {
      const rows = await db
        .select()
        .from(eventDocuments)
        .where(and(eq(eventDocuments.eventId, input.eventId), isNull(eventDocuments.deletedAt)))
        .orderBy(desc(eventDocuments.id));

      const result: EventDocumentRecord[] = rows.map((row) => ({
        id: row.id,
        eventId: row.eventId,
        documentType: row.documentType,
        title: row.title,
        fileUrl: row.fileUrl,
        mimeType: row.mimeType,
        sizeBytes: row.sizeBytes,
      }));

      return success(result);
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to get event documents");
    }
  },

  getParticipantDocumentsByAthlete: async (
    input: EventParticipantDocumentsGetByAthleteInput
  ): Promise<ToolResponse<EventParticipantDocumentRecord[]>> => {
    if (!db) return error("Database not configured");

    try {
      const conditions = [eq(eventParticipants.athleteId, input.athleteId), isNull(eventParticipantDocuments.deletedAt)];
      if (input.eventId != null) conditions.push(eq(eventParticipants.eventId, input.eventId));

      const rows = await db
        .select({
          id: eventParticipantDocuments.id,
          eventParticipantId: eventParticipantDocuments.eventParticipantId,
          eventId: eventParticipants.eventId,
          athleteId: eventParticipants.athleteId,
          documentType: eventParticipantDocuments.documentType,
          title: eventParticipantDocuments.title,
          fileUrl: eventParticipantDocuments.fileUrl,
          mimeType: eventParticipantDocuments.mimeType,
          sizeBytes: eventParticipantDocuments.sizeBytes,
          metadata: eventParticipantDocuments.metadata,
        })
        .from(eventParticipantDocuments)
        .innerJoin(eventParticipants, eq(eventParticipants.id, eventParticipantDocuments.eventParticipantId))
        .where(and(...conditions))
        .orderBy(desc(eventParticipantDocuments.id));

      return success(rows);
    } catch (err) {
      return error(
        err instanceof Error ? err.message : "Failed to get event participant documents"
      );
    }
  },
};
