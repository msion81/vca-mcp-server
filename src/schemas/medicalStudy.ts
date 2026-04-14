import { z } from "zod";

export const medicalStudiesGetByAssessmentSchema = z.object({
  assessmentId: z.number().int().positive(),
});

export type MedicalStudiesGetByAssessmentInput = z.infer<typeof medicalStudiesGetByAssessmentSchema>;

export const medicalStudiesGetByAthleteSchema = z.object({
  athleteId: z.number().int().positive(),
  type: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional().default(50),
});

export type MedicalStudiesGetByAthleteInput = z.infer<typeof medicalStudiesGetByAthleteSchema>;

/** Full medical study document with assessment-level coach notes. */
export interface MedicalStudyWithNotes {
  /** ID of the nutrition_assessment_medical_studies link row */
  linkId: number;
  /** ID of the underlying athlete_medical_studies document */
  studyId: number;
  assessmentId: number | null;
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

/** Medical study document belonging to an athlete (without assessment link). */
export interface MedicalStudy {
  id: number;
  athleteId: number | null;
  type: string | null;
  studyDate: string | null;
  description: string | null;
  /** Path to the PDF file on the server */
  filePath: string | null;
  data: unknown;
  createdAt: string | null;
  updatedAt: string | null;
}
