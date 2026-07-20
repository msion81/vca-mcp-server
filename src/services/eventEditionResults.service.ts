import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { eventEditionResults, eventParticipants } from "../db/schema/index.js";
import type {
  EventEditionResultRecord,
  EventEditionResultsGetByAthleteInput,
  EventEditionResultsGetByEventInput,
} from "../schemas/eventEditionResults.js";
import { error, success, type ToolResponse } from "../types/responses.js";

export const eventEditionResultsService = {
  getByEvent: async (
    input: EventEditionResultsGetByEventInput
  ): Promise<ToolResponse<EventEditionResultRecord[]>> => {
    if (!db) return error("Database not configured");

    try {
      const rows = await db
        .select({
          id: eventEditionResults.id,
          eventId: eventParticipants.eventId,
          athleteId: eventParticipants.athleteId,
          resultType: eventEditionResults.resultType,
          payload: eventEditionResults.payload,
          createdAt: eventEditionResults.createdAt,
        })
        .from(eventEditionResults)
        .innerJoin(eventParticipants, eq(eventParticipants.id, eventEditionResults.participantId))
        .where(and(eq(eventParticipants.eventId, input.eventId), isNull(eventEditionResults.deletedAt)))
        .orderBy(desc(eventEditionResults.id));

      return success(rows);
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to get event edition results");
    }
  },

  getByAthlete: async (
    input: EventEditionResultsGetByAthleteInput
  ): Promise<ToolResponse<EventEditionResultRecord[]>> => {
    if (!db) return error("Database not configured");

    try {
      const conditions = [eq(eventParticipants.athleteId, input.athleteId), isNull(eventEditionResults.deletedAt)];
      if (input.eventId != null) conditions.push(eq(eventParticipants.eventId, input.eventId));

      const rows = await db
        .select({
          id: eventEditionResults.id,
          eventId: eventParticipants.eventId,
          athleteId: eventParticipants.athleteId,
          resultType: eventEditionResults.resultType,
          payload: eventEditionResults.payload,
          createdAt: eventEditionResults.createdAt,
        })
        .from(eventEditionResults)
        .innerJoin(eventParticipants, eq(eventParticipants.id, eventEditionResults.participantId))
        .where(and(...conditions))
        .orderBy(desc(eventEditionResults.id));

      return success(rows);
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to get event edition results");
    }
  },
};
