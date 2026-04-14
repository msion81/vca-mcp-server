import {
  medicalStudiesGetByAthleteSchema,
  type MedicalStudiesGetByAthleteInput,
} from "../schemas/medicalStudy.js";
import { medicalStudyService } from "../services/medicalStudy.service.js";
import type { ToolResponse } from "../types/responses.js";
import { error } from "../types/responses.js";

export const toolName = "medicalStudies.getByAthlete";

export const description =
  "Get all medical study documents belonging to an athlete across all assessments. Returns the athlete's full medical file history: type, studyDate, description, filePath (path to the PDF), and additional data. Use when you need an overview of all medical documents for an athlete regardless of which assessment they were attached to. Filters: athleteId (required), type (partial match, e.g. 'blood', 'xray'). Limit default 50. Usage: { athleteId: <id> } or { athleteId: <id>, type: \"blood\" }.";

export const inputSchema = medicalStudiesGetByAthleteSchema;

export const handleMedicalStudiesGetByAthlete = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = medicalStudiesGetByAthleteSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);
  return medicalStudyService.getByAthlete(
    parsed.data as MedicalStudiesGetByAthleteInput
  );
};
