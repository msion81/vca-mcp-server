import {
  anthropometryGetByAssessmentSchema,
  type AnthropometryGetByAssessmentInput,
} from "../schemas/anthropometry.js";
import { anthropometryService } from "../services/anthropometry.service.js";
import type { ToolResponse } from "../types/responses.js";
import { error } from "../types/responses.js";

export const toolName = "anthropometry.getByAssessment";

export const description =
  "Get anthropometric measurements for a specific assessment. Returns all raw measurement fields (weights, heights, diameters, perimeters, skinfolds, lengths) grouped by category, plus a report field (currently null — placeholder for the calculated anthropometric report). Use when you have an assessmentId and need to inspect or reference the body composition data recorded in that consultation. Usage: { assessmentId: <id> }.";

export const inputSchema = anthropometryGetByAssessmentSchema;

export const handleAnthropometryGetByAssessment = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = anthropometryGetByAssessmentSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);
  return anthropometryService.getByAssessment(
    parsed.data as AnthropometryGetByAssessmentInput
  );
};
