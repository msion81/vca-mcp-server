import {
  assessmentSearchSchema,
  type AssessmentSearchInput,
} from "../schemas/assessment.js";
import { assessmentService } from "../services/assessment.service.js";
import type { ToolResponse } from "../types/responses.js";
import { error } from "../types/responses.js";

export const toolName = "assessments.search";

export const description =
  "Search assessments (evaluaciones). IMPORTANT: coachId is automatically injected - you will ONLY see assessments created by the current coach. Filters: athleteId, date span (startDate, endDate YYYY-MM-DD). Assessments include anthropometric measurements (antropometría). Returns assessments with all fields, notesByCategory, creation date (ordered by most recent first). Common use cases: ALL coach assessments → {} (empty, coachId injected); athlete assessments → { athleteId: <id> }; most recent for athlete → { athleteId: <id>, limit: 1 }; date range → { startDate: \"YYYY-MM-DD\", endDate: \"YYYY-MM-DD\" }. Limit default 50.";

export const inputSchema = assessmentSearchSchema;

export const handleAssessmentsSearch = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = assessmentSearchSchema.safeParse(params);
  if (!parsed.success) {
    return error(parsed.error.message);
  }
  return assessmentService.search(parsed.data as AssessmentSearchInput);
};
