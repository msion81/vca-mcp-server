import { and, desc, eq, gte, lte } from "drizzle-orm";
import { db } from "../db/index.js";
import { anthropometry } from "../db/schema/index.js";
import type {
  AnthropometryGetByAssessmentInput,
  AnthropometryRecord,
  AnthropometrySearchInput,
} from "../schemas/anthropometry.js";
import type { ToolResponse } from "../types/responses.js";
import { error, success } from "../types/responses.js";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

function toRecord(row: typeof anthropometry.$inferSelect): AnthropometryRecord {
  return {
    id: row.id,
    athleteId: row.athleteId,
    userRolesId: row.userRolesId,
    assessmentId: row.nutritionAssessmentId,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    isakType: row.isakType,
    basicWeight: row.basicWeight,
    basicHeight: row.basicHeight,
    basicHeatedHeight: row.basicHeatedHeight,
    referenceBoneMass: row.referenceBoneMass,
    diameterBiacromial: row.diameterBiacromial,
    diameterTransverseThorax: row.diameterTransverseThorax,
    diameterAnteroposteriorThorax: row.diameterAnteroposteriorThorax,
    diameterBiiliocrestal: row.diameterBiiliocrestal,
    diameterHumeralbiepicondylar: row.diameterHumeralbiepicondylar,
    diameterFemoralbiepicondylar: row.diameterFemoralbiepicondylar,
    diameterBistyloid: row.diameterBistyloid,
    diameterBitrochanteric: row.diameterBitrochanteric,
    diameterBimalleolar: row.diameterBimalleolar,
    perimeterHead: row.perimeterHead,
    perimeterArm: row.perimeterArm,
    perimeterFlexedArm: row.perimeterFlexedArm,
    perimeterForearm: row.perimeterForearm,
    perimeterChest: row.perimeterChest,
    perimeterWaist: row.perimeterWaist,
    perimeterHip: row.perimeterHip,
    perimeterUpperThigh: row.perimeterUpperThigh,
    perimeterMedialThigh: row.perimeterMedialThigh,
    perimeterCalf: row.perimeterCalf,
    perimeterNeck: row.perimeterNeck,
    perimeterAbdominal: row.perimeterAbdominal,
    perimeterWrist: row.perimeterWrist,
    foldsTriceps: row.foldsTriceps,
    foldsSubscapular: row.foldsSubscapular,
    foldsSupraspinal: row.foldsSupraspinal,
    foldsAbdominal: row.foldsAbdominal,
    foldsThigh: row.foldsThigh,
    foldsCalf: row.foldsCalf,
    foldsBiceps: row.foldsBiceps,
    foldsIliacCrest: row.foldsIliacCrest,
    foldsForearm: row.foldsForearm,
    lengthForearm: row.lengthForearm,
    lengthLeg: row.lengthLeg,
    lengthArm: row.lengthArm,
    lengthAcromialSitting: row.lengthAcromialSitting,
    lengthSternalHeight: row.lengthSternalHeight,
    lengthElbowHeight: row.lengthElbowHeight,
    lengthStylionHeight: row.lengthStylionHeight,
    lengthMiddleFingerHeight: row.lengthMiddleFingerHeight,
    lengthTrochantericHeight: row.lengthTrochantericHeight,
    lengthAcromialStanding: row.lengthAcromialStanding,
    skinfoldCaliperId: row.skinfoldCaliperId,
    additionalMeasures: row.additionalMeasures,
    report: null,
  };
}

export const anthropometryService = {
  getByAssessment: async (
    input: AnthropometryGetByAssessmentInput
  ): Promise<ToolResponse<AnthropometryRecord | null>> => {
    if (!db) return error("Database not configured");

    try {
      const [row] = await db
        .select()
        .from(anthropometry)
        .where(eq(anthropometry.nutritionAssessmentId, input.assessmentId))
        .limit(1);

      return success(row ? toRecord(row) : null);
    } catch (err) {
      return error(
        err instanceof Error ? err.message : "Failed to get anthropometry"
      );
    }
  },

  search: async (
    input: AnthropometrySearchInput
  ): Promise<ToolResponse<AnthropometryRecord[]>> => {
    if (!db) return error("Database not configured");

    try {
      const conditions = [];

      if (input.athleteId != null)
        conditions.push(eq(anthropometry.athleteId, input.athleteId));

      if (input.assessmentId != null)
        conditions.push(eq(anthropometry.nutritionAssessmentId, input.assessmentId));

      if (input.startDate != null)
        conditions.push(gte(anthropometry.createdAt, `${input.startDate}T00:00:00.000Z`));

      if (input.endDate != null)
        conditions.push(lte(anthropometry.createdAt, `${input.endDate}T23:59:59.999Z`));

      const limit = Math.min(input.limit ?? DEFAULT_LIMIT, MAX_LIMIT);
      const baseWhere = conditions.length > 0 ? and(...conditions) : undefined;

      const rows = await db
        .select()
        .from(anthropometry)
        .where(baseWhere)
        .orderBy(desc(anthropometry.id))
        .limit(limit);

      return success(rows.map(toRecord));
    } catch (err) {
      return error(
        err instanceof Error ? err.message : "Failed to search anthropometry"
      );
    }
  },
};
