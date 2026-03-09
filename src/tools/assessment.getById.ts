import {
  assessmentGetByIdSchema,
  type AssessmentGetByIdInput,
} from "../schemas/assessment.js";
import { assessmentService } from "../services/assessment.service.js";
import type { ToolResponse } from "../types/responses.js";
import { error } from "../types/responses.js";

export const toolName = "assessment.getById";

export const description =
  "Get a single assessment by ID. Returns the full assessment (id, athleteId, userRolesId, notes, goal, activityLevel, createdAt, closedAt, isAutoAssessment) plus all related coach notes (notesByCategory). Use when you already have an assessment ID. Usage: { id: <assessmentId> }.";

export const inputSchema = assessmentGetByIdSchema;

export const handleAssessmentGetById = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = assessmentGetByIdSchema.safeParse(params);
  if (!parsed.success) {
    return error(parsed.error.message);
  }
  return assessmentService.getById(parsed.data as AssessmentGetByIdInput);
};
