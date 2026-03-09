import { db } from "../db/index.js";
import { athlete, athleteByUserProfileRole } from "../db/schema/index.js";
import { sql, countDistinct, eq, and } from "drizzle-orm";
import type { ToolResponse } from "../types/responses.js";
import { success, error } from "../types/responses.js";
import { z } from "zod";

export const toolName = "athlete.stats";

export const description =
  "Get athlete statistics for the current coach. IMPORTANT: coachId is automatically injected - returns counts ONLY for athletes assigned to this coach. Returns totalAthletes (count of coach's athletes), assignedToCoach (same as total for specific coach), and unassigned (always 0 for specific coach). Use when asked 'how many athletes', 'cuántos atletas', 'total de atletas', or similar. This provides accurate counts directly from the database.";

export const inputSchema = z.object({
  coachId: z.number().int().positive().optional(),
});

interface DashboardStats {
  totalAthletes: number;
  assignedToCoach: number;
  unassigned: number;
}

export const handleAthleteStats = async (input: { coachId?: number }): Promise<ToolResponse<DashboardStats>> => {
  if (!db) {
    return error("Database not configured");
  }

  try {
    if (input.coachId != null) {
      // Filtrar solo atletas del coach específico
      const [totalResult] = await db
        .select({ count: countDistinct(athleteByUserProfileRole.athleteId) })
        .from(athleteByUserProfileRole)
        .where(and(
          eq(athleteByUserProfileRole.userRolesId, input.coachId),
          eq(athleteByUserProfileRole.active, 1)
        ));

      const totalAthletes = Number(totalResult?.count ?? 0);
      
      // Para un coach específico, todos los atletas ya están asignados a él
      return success({
        totalAthletes,
        assignedToCoach: totalAthletes,
        unassigned: 0,
      });
    } else {
      // Sin coachId, retornar estadísticas globales
      const [totalResult] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(athlete);

      const [assignedResult] = await db
        .select({ count: countDistinct(athleteByUserProfileRole.athleteId) })
        .from(athleteByUserProfileRole)
        .where(sql`${athleteByUserProfileRole.athleteId} IS NOT NULL`);

      const totalAthletes = totalResult?.count ?? 0;
      const assignedToCoach = Number(assignedResult?.count ?? 0);
      const unassigned = totalAthletes - assignedToCoach;

      return success({
        totalAthletes,
        assignedToCoach,
        unassigned,
      });
    }
  } catch (err) {
    return error(
      err instanceof Error ? err.message : "Failed to get dashboard stats"
    );
  }
};
