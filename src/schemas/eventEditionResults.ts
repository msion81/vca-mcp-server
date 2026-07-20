import { z } from "zod";

export const eventEditionResultsGetByEventSchema = z.object({
  eventId: z.number().int().positive(),
});

export type EventEditionResultsGetByEventInput = z.infer<typeof eventEditionResultsGetByEventSchema>;

export const eventEditionResultsGetByAthleteSchema = z.object({
  athleteId: z.number().int().positive(),
  eventId: z.number().int().positive().optional(),
});

export type EventEditionResultsGetByAthleteInput = z.infer<typeof eventEditionResultsGetByAthleteSchema>;

export interface EventEditionResultRecord {
  id: number;
  eventId: number;
  athleteId: number;
  resultType: string;
  payload: unknown;
  createdAt: string | null;
}
