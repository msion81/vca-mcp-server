import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  athleteMedicalStudies,
  nutritionAssessment,
  nutritionAssessmentAnswer,
  nutritionAssessmentMedicalStudies,
  nutritionAssessmentNotesByCategory,
  nutritionAssessmentReport,
  nutritionAssessmentReportComment,
  questionnaireOption,
  questionnaireQuestion,
  questionnaireQuestionByCategory,
  questionnaireQuestionsCategory,
} from "../db/schema/index.js";
import type {
  AssessmentAnswer,
  AssessmentFull,
  AssessmentGetFullInput,
  AssessmentMedicalStudy,
  AssessmentNoteWithCategory,
  AssessmentReport,
  AssessmentReportComment,
} from "../schemas/assessment.js";
import type { ToolResponse } from "../types/responses.js";
import { error, success } from "../types/responses.js";

export const assessmentFullService = {
  getFull: async (
    input: AssessmentGetFullInput
  ): Promise<ToolResponse<AssessmentFull | null>> => {
    if (!db) return error("Database not configured");

    try {
      const [row] = await db
        .select()
        .from(nutritionAssessment)
        .where(eq(nutritionAssessment.id, input.id))
        .limit(1);

      if (!row) return success(null);

      // Notes by category — join to resolve category name + code
      const noteRows = await db
        .select({
          id: nutritionAssessmentNotesByCategory.id,
          notes: nutritionAssessmentNotesByCategory.notes,
          categoryId: nutritionAssessmentNotesByCategory.questionnaireQuestionCategoryId,
          categoryName: questionnaireQuestionsCategory.name,
          categoryCode: questionnaireQuestionsCategory.code,
          createdAt: nutritionAssessmentNotesByCategory.createdAt,
        })
        .from(nutritionAssessmentNotesByCategory)
        .leftJoin(
          questionnaireQuestionsCategory,
          eq(
            nutritionAssessmentNotesByCategory.questionnaireQuestionCategoryId,
            questionnaireQuestionsCategory.id
          )
        )
        .where(
          eq(nutritionAssessmentNotesByCategory.nutritionAssessmentId, input.id)
        );

      const notesByCategory: AssessmentNoteWithCategory[] = noteRows.map((n) => ({
        id: n.id,
        notes: n.notes,
        categoryId: n.categoryId,
        categoryName: n.categoryName ?? null,
        categoryCode: n.categoryCode ?? null,
        createdAt: n.createdAt,
      }));

      // Answers — join question text + category + selected option text
      const answerRows = await db
        .select({
          id: nutritionAssessmentAnswer.id,
          questionId: nutritionAssessmentAnswer.questionnaireQuestionId,
          questionText: questionnaireQuestion.questionText,
          categoryName: questionnaireQuestionsCategory.name,
          answerText: nutritionAssessmentAnswer.answerText,
          optionId: nutritionAssessmentAnswer.questionnaireOptionId,
          optionText: questionnaireOption.optionText,
          createdAt: nutritionAssessmentAnswer.createdAt,
        })
        .from(nutritionAssessmentAnswer)
        .leftJoin(
          questionnaireQuestion,
          eq(
            nutritionAssessmentAnswer.questionnaireQuestionId,
            questionnaireQuestion.id
          )
        )
        .leftJoin(
          questionnaireQuestionByCategory,
          eq(
            questionnaireQuestion.id,
            questionnaireQuestionByCategory.questionnaireQuestionId
          )
        )
        .leftJoin(
          questionnaireQuestionsCategory,
          eq(
            questionnaireQuestionByCategory.questionnaireQuestionsCategoryId,
            questionnaireQuestionsCategory.id
          )
        )
        .leftJoin(
          questionnaireOption,
          eq(
            nutritionAssessmentAnswer.questionnaireOptionId,
            questionnaireOption.id
          )
        )
        .where(
          eq(nutritionAssessmentAnswer.nutritionAssessmentId, input.id)
        );

      const answers: AssessmentAnswer[] = answerRows.map((a) => ({
        id: a.id,
        questionId: a.questionId,
        questionText: a.questionText ?? null,
        categoryName: a.categoryName ?? null,
        answerText: a.answerText,
        optionId: a.optionId,
        optionText: a.optionText ?? null,
        createdAt: a.createdAt,
      }));

      // Medical studies — join athlete_medical_studies for full document fields
      const studyRows = await db
        .select({
          id: nutritionAssessmentMedicalStudies.id,
          studyId: athleteMedicalStudies.id,
          athleteId: athleteMedicalStudies.athleteId,
          type: athleteMedicalStudies.type,
          studyDate: athleteMedicalStudies.studyDate,
          description: athleteMedicalStudies.description,
          filePath: athleteMedicalStudies.filePath,
          data: athleteMedicalStudies.data,
          assessmentNotes: nutritionAssessmentMedicalStudies.notes,
          createdAt: athleteMedicalStudies.createdAt,
          updatedAt: athleteMedicalStudies.updatedAt,
        })
        .from(nutritionAssessmentMedicalStudies)
        .leftJoin(
          athleteMedicalStudies,
          eq(
            nutritionAssessmentMedicalStudies.athleteMedicalStudyId,
            athleteMedicalStudies.id
          )
        )
        .where(
          eq(nutritionAssessmentMedicalStudies.nutritionAssessmentId, input.id)
        );

      const medicalStudies: AssessmentMedicalStudy[] = studyRows.map((s) => ({
        id: s.id,
        studyId: s.studyId ?? null,
        athleteId: s.athleteId ?? null,
        type: s.type ?? null,
        studyDate: s.studyDate ?? null,
        description: s.description ?? null,
        filePath: s.filePath ?? null,
        data: s.data,
        assessmentNotes: s.assessmentNotes,
        createdAt: s.createdAt ?? null,
        updatedAt: s.updatedAt ?? null,
      }));

      // Reports + comments
      const reportRows = await db
        .select()
        .from(nutritionAssessmentReport)
        .where(
          eq(nutritionAssessmentReport.nutritionAssessmentId, input.id)
        );

      const reports: AssessmentReport[] = [];
      for (const rep of reportRows) {
        const commentRows = await db
          .select()
          .from(nutritionAssessmentReportComment)
          .where(
            eq(nutritionAssessmentReportComment.nutritionAssessmentReportId, rep.id)
          );

        const comments: AssessmentReportComment[] = commentRows
          .filter((c) => !c.deleted)
          .map((c) => ({
            id: c.id,
            comment: c.comment,
            createdBy: c.createdBy,
            createdAt: c.createdAt,
            edited: c.edited,
          }));

        reports.push({
          id: rep.id,
          report: rep.report,
          reportType: rep.reportType,
          createdAt: rep.createdAt,
          updatedAt: rep.updatedAt,
          createdBy: rep.createdBy,
          comments,
        });
      }

      return success({
        id: row.id,
        athleteId: row.athleteId,
        userRolesId: row.userRolesId,
        notes: row.notes,
        goal: row.goal,
        activityLevel: row.activityLevel,
        createdAt: row.createdAt,
        closedAt: row.closedAt,
        isAutoAssessment: row.isAutoAssessment,
        notesByCategory,
        answers,
        medicalStudies,
        reports,
      });
    } catch (err) {
      return error(
        err instanceof Error ? err.message : "Failed to get full assessment"
      );
    }
  },
};
