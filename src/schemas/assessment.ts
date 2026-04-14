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

/** Input schema for assessment.getFull. */
export const assessmentGetFullSchema = z.object({
  id: z.number().int().positive(),
});

export type AssessmentGetFullInput = z.infer<typeof assessmentGetFullSchema>;

/** Note with resolved category name and code. */
export interface AssessmentNoteWithCategory {
  id: number;
  notes: string | null;
  categoryId: number | null;
  categoryName: string | null;
  categoryCode: string | null;
  createdAt: string | null;
}

/** Questionnaire answer with resolved question text, category and selected option. */
export interface AssessmentAnswer {
  id: number;
  questionId: number | null;
  questionText: string | null;
  categoryName: string | null;
  answerText: string | null;
  optionId: number | null;
  optionText: string | null;
  createdAt: string | null;
}

/** Medical study linked to an assessment — includes full document fields from athlete_medical_studies. */
export interface AssessmentMedicalStudy {
  /** ID of the nutrition_assessment_medical_studies link row */
  id: number;
  /** ID of the underlying athlete_medical_studies document */
  studyId: number | null;
  athleteId: number | null;
  type: string | null;
  studyDate: string | null;
  description: string | null;
  /** Path to the PDF file on the server */
  filePath: string | null;
  data: unknown;
  /** Coach notes written in the context of this specific assessment */
  assessmentNotes: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

/** Comment on an assessment report. */
export interface AssessmentReportComment {
  id: number;
  comment: string | null;
  createdBy: number | null;
  createdAt: string | null;
  edited: boolean | null;
}

/** Report written by the coach summarising the consultation. */
export interface AssessmentReport {
  id: number;
  report: string | null;
  reportType: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: number | null;
  comments: AssessmentReportComment[];
}

/** Full assessment — all base fields plus all related data resolved with human-readable labels. */
export interface AssessmentFull {
  id: number;
  athleteId: number | null;
  userRolesId: number | null;
  notes: string | null;
  goal: string | null;
  activityLevel: number;
  createdAt: string | null;
  closedAt: string | null;
  isAutoAssessment: boolean | null;
  notesByCategory: AssessmentNoteWithCategory[];
  answers: AssessmentAnswer[];
  medicalStudies: AssessmentMedicalStudy[];
  reports: AssessmentReport[];
}
