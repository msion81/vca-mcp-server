import { z } from "zod";

export const athleteDayActivitySearchSchema = z.object({
  coachId: z.number().int().positive(),
  athleteId: z.number().int().positive().optional(),
  nutritionAssessmentId: z.number().int().positive().optional(),
  weekDay: z.number().int().optional(),
  limit: z.number().int().min(1).max(100).optional().default(50),
});

export type AthleteDayActivitySearchInput = z.infer<typeof athleteDayActivitySearchSchema>;

export interface AthleteDayActivityRecord {
  id: number;
  athleteId: number | null;
  nutritionAssessmentId: number | null;
  weekDay: number | null;
  session: string | null;
  activity: string | null;
  duration: string | null;
  intensity: string | null;
  notes: string | null;
  sessionTime: string | null;
}
