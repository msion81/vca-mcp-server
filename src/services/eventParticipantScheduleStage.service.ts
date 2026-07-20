import { and, asc, eq, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { eventParticipantScheduleStage, eventParticipants } from "../db/schema/index.js";
import type {
  EventParticipantScheduleStageGetByAthleteInput,
  EventParticipantScheduleStageRecord,
} from "../schemas/eventParticipantScheduleStage.js";
import { error, success, type ToolResponse } from "../types/responses.js";

export const eventParticipantScheduleStageService = {
  getByAthlete: async (
    input: EventParticipantScheduleStageGetByAthleteInput
  ): Promise<ToolResponse<EventParticipantScheduleStageRecord[]>> => {
    if (!db) return error("Database not configured");

    try {
      const conditions = [
        eq(eventParticipants.athleteId, input.athleteId),
        isNull(eventParticipantScheduleStage.deletedAt),
      ];
      if (input.eventId != null) conditions.push(eq(eventParticipants.eventId, input.eventId));

      const rows = await db
        .select({
          id: eventParticipantScheduleStage.id,
          eventId: eventParticipants.eventId,
          athleteId: eventParticipants.athleteId,
          sortOrder: eventParticipantScheduleStage.sortOrder,
          label: eventParticipantScheduleStage.label,
          scheduledAt: eventParticipantScheduleStage.scheduledAt,
        })
        .from(eventParticipantScheduleStage)
        .innerJoin(eventParticipants, eq(eventParticipants.id, eventParticipantScheduleStage.eventParticipantId))
        .where(and(...conditions))
        .orderBy(asc(eventParticipantScheduleStage.sortOrder));

      return success(rows);
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to get event participant schedule stages");
    }
  },
};
