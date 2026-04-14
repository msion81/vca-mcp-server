import {
  medicalStudiesGetByAssessmentSchema,
  type MedicalStudiesGetByAssessmentInput,
} from "../schemas/medicalStudy.js";
import { medicalStudyService } from "../services/medicalStudy.service.js";
import type { ToolResponse } from "../types/responses.js";
import { error } from "../types/responses.js";

export const toolName = "medicalStudies.getByAssessment";

export const description =
  "Get all medical study documents linked to a specific assessment. Each record includes the full document info from the athlete's medical file: type (e.g. blood test, xray), studyDate, description, filePath (path to the PDF on the server), data (additional metadata), plus assessmentNotes (coach's notes about this document in the context of that specific consultation). Use when you need to inspect or reference the medical documents reviewed during a consultation. Usage: { assessmentId: <id> }.";

export const inputSchema = medicalStudiesGetByAssessmentSchema;

export const handleMedicalStudiesGetByAssessment = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = medicalStudiesGetByAssessmentSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);
  return medicalStudyService.getByAssessment(
    parsed.data as MedicalStudiesGetByAssessmentInput
  );
};
