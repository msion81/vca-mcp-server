import { and, desc, eq, ilike, isNull, or } from "drizzle-orm";
import { db } from "../db/index.js";
import { events, sports } from "../db/schema/index.js";
import type { EventsSearchInput } from "../schemas/events.js";
import type { EventSearchResult } from "../schemas/events.js";
import type { ToolResponse } from "../types/responses.js";
import { success, error } from "../types/responses.js";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export const eventsService = {
  search: async (
    input: EventsSearchInput
  ): Promise<ToolResponse<EventSearchResult[]>> => {
    if (!db) {
      return error("Database not configured");
    }
    try {
      const conditions = [];
      if (input.location?.trim()) {
        conditions.push(ilike(events.location, `%${input.location.trim()}%`));
      }
      if (input.title?.trim()) {
        conditions.push(ilike(events.title, `%${input.title.trim()}%`));
      }
      if (input.distance != null) {
        conditions.push(eq(events.distanceBasedValue, input.distance));
      }
      if (input.distanceUnit?.trim()) {
        conditions.push(ilike(events.distanceBasedUnit, input.distanceUnit.trim()));
      }
      const hasSportFilter = input.sport?.trim();
      const limit = Math.min(
        input.limit ?? DEFAULT_LIMIT,
        MAX_LIMIT
      );

      const selectFields = {
        id: events.id,
        title: events.title,
        date: events.date,
        time: events.time,
        location: events.location,
        isCompetition: events.isCompetition,
        sportName: sports.name,
        distance: events.distanceBasedValue,
        distanceUnit: events.distanceBasedUnit,
      };
      type Row = { id: number; title: string; date: string | null; time: string; location: string; isCompetition: boolean; sportName: string | null; distance: number | null; distanceUnit: string | null };

      let rows: Row[];
      if (hasSportFilter) {
        rows = await db
          .select(selectFields)
          .from(events)
          .innerJoin(sports, eq(events.sportId, sports.id))
          .where(
            and(
              isNull(events.deletedAt),
              ...conditions,
              or(
                ilike(sports.name, `%${hasSportFilter}%`),
                ilike(sports.code, `%${hasSportFilter}%`)
              )
            )
          )
          .orderBy(desc(events.date))
          .limit(limit);
      } else {
        const baseWhere =
          conditions.length > 0
            ? and(isNull(events.deletedAt), ...conditions)
            : isNull(events.deletedAt);
        rows = await db
          .select(selectFields)
          .from(events)
          .leftJoin(sports, eq(events.sportId, sports.id))
          .where(baseWhere)
          .orderBy(desc(events.date))
          .limit(limit);
      }

      const result: EventSearchResult[] = rows.map((r) => ({
        id: r.id,
        title: r.title,
        date: r.date,
        time: r.time,
        location: r.location,
        sportName: r.sportName ?? null,
        isCompetition: r.isCompetition,
        distance: r.distance ?? null,
        distanceUnit: r.distanceUnit ?? null,
      }));

      return success(result);
    } catch (err) {
      return error(
        err instanceof Error ? err.message : "Failed to search events"
      );
    }
  },
};
