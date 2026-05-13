import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { userRoles, users } from "../db/schema/index.js";
import type { ToolResponse } from "../types/responses.js";
import { error, success } from "../types/responses.js";

export interface CoachTimezoneResult {
  timezone: string | null;
}

export const coachService = {
  getTimezoneByUserRoleId: async (
    coachId: number
  ): Promise<ToolResponse<CoachTimezoneResult>> => {
    if (!db) return error("Database not configured");
    try {
      const [row] = await db
        .select({ timezone: users.timezone })
        .from(userRoles)
        .innerJoin(users, eq(userRoles.userId, users.id))
        .where(eq(userRoles.id, coachId))
        .limit(1);
      return success({ timezone: row?.timezone ?? null });
    } catch (err) {
      return error(
        err instanceof Error ? err.message : "Failed to load coach timezone"
      );
    }
  },
};
