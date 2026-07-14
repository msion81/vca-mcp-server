import {
  questionnaireCheckAnsweredSchema,
  type QuestionnaireCheckAnsweredInput,
} from "../schemas/questionnaire.js";
import { questionnaireService } from "../services/questionnaire.service.js";
import type { ToolResponse } from "../types/responses.js";
import { error } from "../types/responses.js";

export const toolName = "questionnaire.checkAnswered";

export const description =
  "Check whether an athlete answered a specific pre-anamnesis questionnaire AFTER a given instant (use the appointment's createdAt for the OPT you're evaluating — nutrition_assessment rows are reused across submissions, so 'has any answer ever' is not the same as 'answered this time'). questionnaireId optional: falls back to the coach's default type=1 (pre-anamnesis) questionnaire, same as vca-server's own resolution. Usage: { coachId, athleteId, since: <appointment.createdAt ISO> } or with questionnaireId to pin an exact questionnaire.";

export const inputSchema = questionnaireCheckAnsweredSchema;

export const handleQuestionnaireCheckAnswered = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = questionnaireCheckAnsweredSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);
  return questionnaireService.checkAnswered(parsed.data as QuestionnaireCheckAnsweredInput);
};
