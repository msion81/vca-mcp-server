import { z } from "zod";
import { events } from "../db/schema/index.js";

/**
 * Input schema for events.search tool (TOOLS_SPEC).
 * Aligned with pulled schema: filter by sport (name/code via sports), location (events.location), and race name (events.title).
 */
export const eventsSearchSchema = z.object({
  sport: z.string().optional(),
  location: z.string().optional(),
  title: z.string().optional(),
  distance: z.number().optional(),
  distanceUnit: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional().default(50),
});

export type EventsSearchInput = z.infer<typeof eventsSearchSchema>;

/** Event row type from pulled Drizzle schema. */
export type EventRow = typeof events.$inferSelect;

/** Shaped event for tool response (includes sport name and distance). */
export interface EventSearchResult {
  id: number;
  title: string;
  date: string | null;
  time: string;
  location: string;
  sportName: string | null;
  isCompetition: boolean;
  distance: number | null;
  distanceUnit: string | null;
}
