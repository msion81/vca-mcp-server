import { z } from "zod";
import { nutritionAssessment } from "../db/schema/index.js";

/**
 * Input schema for assessment.getById.
 */
export const assessmentGetByIdSchema = z.object({
  id: z.number().int().positive(),
});

export type AssessmentGetByIdInput = z.infer<typeof assessmentGetByIdSchema>;

/**
 * Input schema for assessments.search.
 * athleteId = athlete; coachId = user_roles_id (coach who created/owns the assessment).
 * startDate/endDate = optional creation-date span (inclusive); ISO date "YYYY-MM-DD".
 */
export const assessmentSearchSchema = z
  .object({
    athleteId: z.number().int().positive().optional(),
    coachId: z.number().int().positive().optional(),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD")
      .optional(),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD")
      .optional(),
    limit: z.number().int().min(1).max(100).optional().default(50),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) return data.startDate <= data.endDate;
      return true;
    },
    { message: "startDate must be before or equal to endDate", path: ["endDate"] }
  );

export type AssessmentSearchInput = z.infer<typeof assessmentSearchSchema>;

/** Assessment row type from pulled Drizzle schema. */
export type AssessmentRow = typeof nutritionAssessment.$inferSelect;

/** One note entry linked to an assessment (coach comments by category). */
export interface AssessmentNote {
  id: number;
  nutritionAssessmentId: number | null;
  questionnaireQuestionCategoryId: number | null;
  notes: string | null;
  createdAt: string | null;
}

/** Full assessment with all fields plus collection of notes. */
export interface AssessmentWithNotes {
  id: number;
  athleteId: number | null;
  userRolesId: number | null;
  notes: string | null;
  goal: string | null;
  activityLevel: number;
  createdAt: string | null;
  closedAt: string | null;
  isAutoAssessment: boolean | null;
  notesByCategory: AssessmentNote[];
}
