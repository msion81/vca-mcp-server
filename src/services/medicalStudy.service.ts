import { and, desc, eq, ilike } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  athleteMedicalStudies,
  nutritionAssessmentMedicalStudies,
} from "../db/schema/index.js";
import type {
  MedicalStudiesGetByAssessmentInput,
  MedicalStudiesGetByAthleteInput,
  MedicalStudy,
  MedicalStudyWithNotes,
} from "../schemas/medicalStudy.js";
import type { ToolResponse } from "../types/responses.js";
import { error, success } from "../types/responses.js";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export const medicalStudyService = {
  getByAssessment: async (
    input: MedicalStudiesGetByAssessmentInput
  ): Promise<ToolResponse<MedicalStudyWithNotes[]>> => {
    if (!db) return error("Database not configured");

    try {
      const rows = await db
        .select({
          linkId: nutritionAssessmentMedicalStudies.id,
          studyId: athleteMedicalStudies.id,
          assessmentId: nutritionAssessmentMedicalStudies.nutritionAssessmentId,
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
          eq(
            nutritionAssessmentMedicalStudies.nutritionAssessmentId,
            input.assessmentId
          )
        );

      const results: MedicalStudyWithNotes[] = rows.map((r) => ({
        linkId: r.linkId,
        studyId: r.studyId ?? 0,
        assessmentId: r.assessmentId,
        athleteId: r.athleteId ?? null,
        type: r.type ?? null,
        studyDate: r.studyDate ?? null,
        description: r.description ?? null,
        filePath: r.filePath ?? null,
        data: r.data,
        assessmentNotes: r.assessmentNotes,
        createdAt: r.createdAt ?? null,
        updatedAt: r.updatedAt ?? null,
      }));

      return success(results);
    } catch (err) {
      return error(
        err instanceof Error
          ? err.message
          : "Failed to get medical studies for assessment"
      );
    }
  },

  getByAthlete: async (
    input: MedicalStudiesGetByAthleteInput
  ): Promise<ToolResponse<MedicalStudy[]>> => {
    if (!db) return error("Database not configured");

    try {
      const conditions = [eq(athleteMedicalStudies.athleteId, input.athleteId)];

      if (input.type?.trim())
        conditions.push(ilike(athleteMedicalStudies.type, `%${input.type.trim()}%`));

      const limit = Math.min(input.limit ?? DEFAULT_LIMIT, MAX_LIMIT);

      const rows = await db
        .select()
        .from(athleteMedicalStudies)
        .where(and(...conditions))
        .orderBy(desc(athleteMedicalStudies.id))
        .limit(limit);

      const filtered = rows;

      const results: MedicalStudy[] = filtered.map((r) => ({
        id: r.id,
        athleteId: r.athleteId,
        type: r.type,
        studyDate: r.studyDate,
        description: r.description,
        filePath: r.filePath,
        data: r.data,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
      }));

      return success(results);
    } catch (err) {
      return error(
        err instanceof Error
          ? err.message
          : "Failed to get medical studies for athlete"
      );
    }
  },
};
