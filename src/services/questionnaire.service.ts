import { and, asc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  questionnaireOption,
  questionnaireQuestion,
  questionnaireQuestionByCategory,
  questionnaireQuestionsCategory,
} from "../db/schema/index.js";
import type {
  QuestionnaireCategory,
  QuestionnaireGetStructureInput,
  QuestionnaireOption,
  QuestionnaireQuestion,
} from "../schemas/questionnaire.js";
import type { ToolResponse } from "../types/responses.js";
import { error, success } from "../types/responses.js";

export const questionnaireService = {
  getStructure: async (
    input: QuestionnaireGetStructureInput
  ): Promise<ToolResponse<QuestionnaireCategory[]>> => {
    if (!db) return error("Database not configured");

    try {
      // Load all active categories (optionally filtered by code)
      const categoryConditions = [eq(questionnaireQuestionsCategory.active, 1)];
      if (input.categoryCode)
        categoryConditions.push(eq(questionnaireQuestionsCategory.code, input.categoryCode));

      const categoryRows = await db
        .select()
        .from(questionnaireQuestionsCategory)
        .where(and(...categoryConditions))
        .orderBy(asc(questionnaireQuestionsCategory.id));

      // Load all active questions mapped to those categories
      const questionRows = await db
        .select({
          questionId: questionnaireQuestion.id,
          questionText: questionnaireQuestion.questionText,
          questionTypeId: questionnaireQuestion.questionnaireQuestionTypeId,
          note: questionnaireQuestion.note,
          order: questionnaireQuestion.order,
          categoryId: questionnaireQuestionByCategory.questionnaireQuestionsCategoryId,
        })
        .from(questionnaireQuestion)
        .innerJoin(
          questionnaireQuestionByCategory,
          eq(questionnaireQuestion.id, questionnaireQuestionByCategory.questionnaireQuestionId)
        )
        .where(
          and(
            eq(questionnaireQuestion.active, 1),
            eq(questionnaireQuestion.delete, 0)
          )
        )
        .orderBy(asc(questionnaireQuestion.order));

      // Load all active options for those questions
      const optionRows = await db
        .select()
        .from(questionnaireOption)
        .where(
          and(
            eq(questionnaireOption.active, 1),
            eq(questionnaireOption.delete, 0)
          )
        )
        .orderBy(asc(questionnaireOption.order));

      // Build category → questions → options tree
      const optionsByQuestion = new Map<number, QuestionnaireOption[]>();
      for (const opt of optionRows) {
        if (opt.questionnaireQuestionId == null) continue;
        const list = optionsByQuestion.get(opt.questionnaireQuestionId) ?? [];
        list.push({ id: opt.id, optionText: opt.optionText, order: opt.order });
        optionsByQuestion.set(opt.questionnaireQuestionId, list);
      }

      const questionsByCategory = new Map<number, QuestionnaireQuestion[]>();
      for (const q of questionRows) {
        if (q.categoryId == null) continue;
        const list = questionsByCategory.get(q.categoryId) ?? [];
        list.push({
          id: q.questionId,
          questionText: q.questionText,
          questionTypeId: q.questionTypeId,
          note: q.note,
          order: q.order,
          options: optionsByQuestion.get(q.questionId) ?? [],
        });
        questionsByCategory.set(q.categoryId, list);
      }

      const categories: QuestionnaireCategory[] = categoryRows.map((cat) => ({
        id: cat.id,
        name: cat.name,
        code: cat.code,
        sex: cat.sex,
        questions: questionsByCategory.get(cat.id) ?? [],
      }));

      return success(categories);
    } catch (err) {
      return error(
        err instanceof Error ? err.message : "Failed to get questionnaire structure"
      );
    }
  },
};
