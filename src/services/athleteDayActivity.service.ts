import { and, desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { athleteDayActivity } from "../db/schema/index.js";
import type {
  AthleteDayActivityRecord,
  AthleteDayActivitySearchInput,
} from "../schemas/athleteDayActivity.js";
import { error, success, type ToolResponse } from "../types/responses.js";

export const athleteDayActivityService = {
  search: async (
    input: AthleteDayActivitySearchInput
  ): Promise<ToolResponse<AthleteDayActivityRecord[]>> => {
    if (!db) return error("Database not configured");

    try {
      const conditions = [eq(athleteDayActivity.userRolesId, input.coachId)];
      if (input.athleteId != null) conditions.push(eq(athleteDayActivity.athleteId, input.athleteId));
      if (input.nutritionAssessmentId != null) {
        conditions.push(eq(athleteDayActivity.nutritionAssessmentId, input.nutritionAssessmentId));
      }
      if (input.weekDay != null) conditions.push(eq(athleteDayActivity.weekDay, input.weekDay));

      const rows = await db
        .select()
        .from(athleteDayActivity)
        .where(and(...conditions))
        .orderBy(desc(athleteDayActivity.sessionTime))
        .limit(input.limit);

      const result: AthleteDayActivityRecord[] = rows.map((row) => ({
        id: row.id,
        athleteId: row.athleteId,
        nutritionAssessmentId: row.nutritionAssessmentId,
        weekDay: row.weekDay,
        session: row.session,
        activity: row.activity,
        duration: row.duration,
        intensity: row.intensity,
        notes: row.notes,
        sessionTime: row.sessionTime,
      }));

      return success(result);
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to search athlete day activity");
    }
  },
};
