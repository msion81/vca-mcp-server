import { and, desc, eq, gte, inArray, lte } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  nutritionAssessment,
  nutritionAssessmentNotesByCategory,
} from "../db/schema/index.js";
import type {
  AssessmentGetByIdInput,
  AssessmentSearchInput,
  AssessmentWithNotes,
  AssessmentNote,
} from "../schemas/assessment.js";
import type { ToolResponse } from "../types/responses.js";
import { success, error } from "../types/responses.js";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

function toAssessmentWithNotes(
  row: {
    id: number;
    athleteId: number | null;
    userRolesId: number | null;
    notes: string | null;
    goal: string | null;
    activityLevel: number;
    createdAt: string | null;
    closedAt: string | null;
    isAutoAssessment: boolean | null;
  },
  noteRows: {
    id: number;
    nutritionAssessmentId: number | null;
    questionnaireQuestionCategoryId: number | null;
    notes: string | null;
    createdAt: string | null;
  }[]
): AssessmentWithNotes {
  const notesByCategory: AssessmentNote[] = noteRows.map((n) => ({
    id: n.id,
    nutritionAssessmentId: n.nutritionAssessmentId,
    questionnaireQuestionCategoryId: n.questionnaireQuestionCategoryId,
    notes: n.notes,
    createdAt: n.createdAt,
  }));
  return {
    ...row,
    notesByCategory,
  };
}

export const assessmentService = {
  getById: async (
    input: AssessmentGetByIdInput
  ): Promise<ToolResponse<AssessmentWithNotes | null>> => {
    if (!db) {
      return error("Database not configured");
    }
    try {
      const [row] = await db
        .select()
        .from(nutritionAssessment)
        .where(eq(nutritionAssessment.id, input.id))
        .limit(1);
      if (!row) {
        return success(null);
      }
      const noteRows = await db
        .select()
        .from(nutritionAssessmentNotesByCategory)
        .where(eq(nutritionAssessmentNotesByCategory.nutritionAssessmentId, input.id));
      const result = toAssessmentWithNotes(
        {
          id: row.id,
          athleteId: row.athleteId,
          userRolesId: row.userRolesId,
          notes: row.notes,
          goal: row.goal,
          activityLevel: row.activityLevel,
          createdAt: row.createdAt,
          closedAt: row.closedAt,
          isAutoAssessment: row.isAutoAssessment,
        },
        noteRows
      );
      return success(result);
    } catch (err) {
      return error(
        err instanceof Error ? err.message : "Failed to get assessment"
      );
    }
  },

  search: async (
    input: AssessmentSearchInput
  ): Promise<ToolResponse<AssessmentWithNotes[]>> => {
    if (!db) {
      return error("Database not configured");
    }
    try {
      const conditions = [];
      if (input.athleteId != null) {
        conditions.push(eq(nutritionAssessment.athleteId, input.athleteId));
      }
      if (input.coachId != null) {
        conditions.push(eq(nutritionAssessment.userRolesId, input.coachId));
      }
      if (input.startDate != null) {
        conditions.push(
          gte(
            nutritionAssessment.createdAt,
            `${input.startDate}T00:00:00.000Z`
          )
        );
      }
      if (input.endDate != null) {
        conditions.push(
          lte(
            nutritionAssessment.createdAt,
            `${input.endDate}T23:59:59.999Z`
          )
        );
      }
      const limit = Math.min(input.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
      const baseWhere =
        conditions.length > 0 ? and(...conditions) : undefined;

      const rows = await db
        .select()
        .from(nutritionAssessment)
        .where(baseWhere)
        .orderBy(desc(nutritionAssessment.id))
        .limit(limit);

      // Notes for all matched assessments in one query instead of one per row.
      const assessmentIds = rows.map((row) => row.id);
      const notesByAssessmentId = new Map<
        number,
        (typeof nutritionAssessmentNotesByCategory.$inferSelect)[]
      >();
      if (assessmentIds.length > 0) {
        const noteRows = await db
          .select()
          .from(nutritionAssessmentNotesByCategory)
          .where(
            inArray(
              nutritionAssessmentNotesByCategory.nutritionAssessmentId,
              assessmentIds
            )
          );
        for (const note of noteRows) {
          if (note.nutritionAssessmentId == null) continue;
          const current = notesByAssessmentId.get(note.nutritionAssessmentId) ?? [];
          current.push(note);
          notesByAssessmentId.set(note.nutritionAssessmentId, current);
        }
      }

      const results: AssessmentWithNotes[] = rows.map((row) =>
        toAssessmentWithNotes(
          {
            id: row.id,
            athleteId: row.athleteId,
            userRolesId: row.userRolesId,
            notes: row.notes,
            goal: row.goal,
            activityLevel: row.activityLevel,
            createdAt: row.createdAt,
            closedAt: row.closedAt,
            isAutoAssessment: row.isAutoAssessment,
          },
          notesByAssessmentId.get(row.id) ?? []
        )
      );
      return success(results);
    } catch (err) {
      return error(
        err instanceof Error ? err.message : "Failed to search assessments"
      );
    }
  },
};
