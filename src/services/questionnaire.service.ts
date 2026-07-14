import { and, asc, desc, eq, gt } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  nutritionAssessment,
  nutritionAssessmentAnswer,
  questionnaire,
  questionnaireOption,
  questionnaireQuestion,
  questionnaireQuestionByCategory,
  questionnaireQuestionsCategory,
} from "../db/schema/index.js";
import type {
  QuestionnaireAnsweredResult,
  QuestionnaireCategory,
  QuestionnaireCheckAnsweredInput,
  QuestionnaireGetStructureInput,
  QuestionnaireOption,
  QuestionnaireQuestion,
} from "../schemas/questionnaire.js";
import type { ToolResponse } from "../types/responses.js";
import { error, success } from "../types/responses.js";

/** Espeja questionnairePreAnamnesis (vca-server): tipo=1 = pre-anamnesis. */
const PRE_ANAMNESIS_QUESTIONNAIRE_TYPE_ID = 1;

async function resolveDefaultQuestionnaireId(coachId: number): Promise<number | null> {
  if (!db) return null;
  const [row] = await db
    .select({ id: questionnaire.id })
    .from(questionnaire)
    .where(
      and(
        eq(questionnaire.userRolesId, coachId),
        eq(questionnaire.questionnaireTypeId, PRE_ANAMNESIS_QUESTIONNAIRE_TYPE_ID),
        eq(questionnaire.delete, 0)
      )
    )
    .orderBy(asc(questionnaire.id))
    .limit(1);
  return row?.id ?? null;
}

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

  /**
   * Espeja el hasAnswer que vca-server ya calcula en calendar/appointment
   * (nutrition_assessment_answer join nutrition_assessment, filtrado por
   * athlete+coach+questionnaireId), parametrizado con `since` para saber si
   * hubo una respuesta NUEVA después de un OPT puntual — vca-server reusa la
   * misma fila de nutrition_assessment entre envíos, así que su propio flag
   * no distingue "respondido alguna vez" de "respondido de nuevo ahora".
   */
  checkAnswered: async (
    input: QuestionnaireCheckAnsweredInput
  ): Promise<ToolResponse<QuestionnaireAnsweredResult>> => {
    if (!db) return error("Database not configured");

    try {
      const resolvedQuestionnaireId =
        input.questionnaireId ?? (await resolveDefaultQuestionnaireId(input.coachId));
      if (resolvedQuestionnaireId == null) {
        return success({ answered: false, lastAnsweredAt: null });
      }

      const [row] = await db
        .select({ createdAt: nutritionAssessmentAnswer.createdAt })
        .from(nutritionAssessmentAnswer)
        .innerJoin(
          nutritionAssessment,
          eq(nutritionAssessmentAnswer.nutritionAssessmentId, nutritionAssessment.id)
        )
        .where(
          and(
            eq(nutritionAssessment.athleteId, input.athleteId),
            eq(nutritionAssessment.userRolesId, input.coachId),
            eq(nutritionAssessmentAnswer.questionnaireId, resolvedQuestionnaireId),
            gt(nutritionAssessmentAnswer.createdAt, input.since)
          )
        )
        .orderBy(desc(nutritionAssessmentAnswer.createdAt))
        .limit(1);

      return success({
        answered: row != null,
        lastAnsweredAt: row?.createdAt ?? null,
      });
    } catch (err) {
      return error(
        err instanceof Error ? err.message : "Failed to check questionnaire answer status"
      );
    }
  },
};
