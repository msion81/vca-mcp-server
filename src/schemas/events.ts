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

/** Input schema for events.getEditions: list editions (events rows) of a series. */
export const eventsGetEditionsSchema = z.object({
  seriesId: z.number().int().positive(),
});

export type EventsGetEditionsInput = z.infer<typeof eventsGetEditionsSchema>;

/** Shaped edition (an events row that belongs to a series). */
export interface EventEditionResult {
  id: number;
  title: string;
  year: number | null;
  date: string | null;
  time: string;
  location: string;
  isCompetition: boolean;
  sportName: string | null;
}

/** Input schema for events.getById: fetch a single event by id. */
export const eventsGetByIdSchema = z.object({
  eventId: z.number().int().positive(),
});

export type EventsGetByIdInput = z.infer<typeof eventsGetByIdSchema>;

/** Full detail for a single event, including its series (if it belongs to one). */
export interface EventDetailResult {
  id: number;
  title: string;
  eventType: number;
  date: string | null;
  time: string;
  timezone: string;
  location: string;
  sportName: string | null;
  isCompetition: boolean;
  isPublic: boolean;
  isOfficial: boolean;
  distance: number | null;
  distanceUnit: string | null;
  seriesId: number | null;
  seriesName: string | null;
  year: number | null;
}

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
