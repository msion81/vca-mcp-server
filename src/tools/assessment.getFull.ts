import {
  assessmentGetFullSchema,
  type AssessmentGetFullInput,
} from "../schemas/assessment.js";
import { assessmentFullService } from "../services/assessment.full.service.js";
import type { ToolResponse } from "../types/responses.js";
import { error } from "../types/responses.js";

export const toolName = "assessment.getFull";

export const description =
  "Get the complete detail of a single assessment (consulta) by ID. Returns all base fields plus:\n" +
  "- notesByCategory: coach notes per interview topic, each with categoryName and categoryCode resolved.\n" +
  "- answers: questionnaire responses with questionText (what was asked) and optionText (what was answered) resolved — useful to understand the athlete's habits, history, and lifestyle at the time of the consultation.\n" +
  "- medicalStudies: medical documents reviewed during this consultation. Each entry contains: studyId, type (e.g. 'blood test', 'xray', 'echo'), studyDate, description (summary of findings), filePath (path to the PDF on the server), data (extra metadata as JSON), and assessmentNotes (coach notes about this specific document in the context of this consultation). Use this to analyze what medical documents were available and what the coach noted about them.\n" +
  "- reports: coach summary reports for this consultation, including peer comments.\n" +
  "Use after assessments.search to load the full content of a consultation. To get all medical documents for an athlete across all assessments use medicalStudies.getByAthlete. Usage: { id: <assessmentId> }.";

export const inputSchema = assessmentGetFullSchema;

export const handleAssessmentGetFull = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = assessmentGetFullSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);
  return assessmentFullService.getFull(parsed.data as AssessmentGetFullInput);
};
