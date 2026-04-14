import {
  questionnaireGetStructureSchema,
  type QuestionnaireGetStructureInput,
} from "../schemas/questionnaire.js";
import { questionnaireService } from "../services/questionnaire.service.js";
import type { ToolResponse } from "../types/responses.js";
import { error } from "../types/responses.js";

export const toolName = "questionnaire.getStructure";

export const description =
  "Get the full questionnaire structure: categories with their questions and answer options. Useful for understanding what topics and questions exist in the system, interpreting assessment answers, or providing context about what was asked during a consultation. Filters: categoryCode (get a single category by its code), active (default true, only active items). Returns: array of categories, each with name, code, sex (f, m, or f,m), and questions array (each with questionText, note, options). Usage: {} for all categories; { categoryCode: \"habits\" } for a single category.";

export const inputSchema = questionnaireGetStructureSchema;

export const handleQuestionnaireGetStructure = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = questionnaireGetStructureSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);
  return questionnaireService.getStructure(
    parsed.data as QuestionnaireGetStructureInput
  );
};
