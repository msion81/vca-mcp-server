import { z } from "zod";

export const eventParticipantScheduleStageGetByAthleteSchema = z.object({
  athleteId: z.number().int().positive(),
  eventId: z.number().int().positive().optional(),
});

export type EventParticipantScheduleStageGetByAthleteInput = z.infer<
  typeof eventParticipantScheduleStageGetByAthleteSchema
>;

export interface EventParticipantScheduleStageRecord {
  id: number;
  eventId: number;
  athleteId: number;
  sortOrder: number;
  label: string;
  scheduledAt: string;
}
