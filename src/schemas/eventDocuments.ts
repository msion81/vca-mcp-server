import { z } from "zod";

export const eventDocumentsGetByEventSchema = z.object({
  eventId: z.number().int().positive(),
});

export type EventDocumentsGetByEventInput = z.infer<typeof eventDocumentsGetByEventSchema>;

export const eventParticipantDocumentsGetByAthleteSchema = z.object({
  athleteId: z.number().int().positive(),
  eventId: z.number().int().positive().optional(),
});

export type EventParticipantDocumentsGetByAthleteInput = z.infer<
  typeof eventParticipantDocumentsGetByAthleteSchema
>;

export interface EventDocumentRecord {
  id: number;
  eventId: number;
  documentType: string;
  title: string | null;
  fileUrl: string;
  mimeType: string;
  sizeBytes: number | null;
}

export interface EventParticipantDocumentRecord {
  id: number;
  eventParticipantId: number;
  eventId: number;
  athleteId: number;
  documentType: string;
  title: string | null;
  fileUrl: string;
  mimeType: string;
  sizeBytes: number | null;
  metadata: unknown;
}
