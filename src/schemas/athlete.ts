import { z } from "zod";
import { athlete } from "../db/schema/index.js";

/**
 * Input schema for athlete.getById.
 */
export const athleteGetByIdSchema = z.object({
  id: z.number().int().positive(),
  coachId: z.number().int().positive().optional(),
});

export type AthleteGetByIdInput = z.infer<typeof athleteGetByIdSchema>;

/**
 * Input schema for athletes.search.
 */
export const athleteSearchSchema = z.object({
  name: z.string().optional(),
  lastName: z.string().optional(),
  sport: z.string().optional(),
  sex: z.string().optional(),
  age: z.number().int().min(0).optional(),
  limit: z.number().int().min(1).max(100).optional().default(50),
  coachId: z.number().int().positive().optional(),
});

export type AthleteSearchInput = z.infer<typeof athleteSearchSchema>;

/** Athlete row type from pulled Drizzle schema. */
export type AthleteRow = typeof athlete.$inferSelect;

/** Sport info for athlete response. */
export interface SportInfo {
  id: number;
  name: string;
  code: string;
}

/** Full athlete with sports and computed age (for getById and search). */
export interface AthleteWithSports {
  id: number;
  name: string;
  lastName: string;
  email: string;
  sex: string;
  phone: string;
  city: string | null;
  state: string | null;
  country: string;
  birthday: string | null;
  bodyWeight: number;
  height: number;
  metricSystemId: number;
  createdAt: string | null;
  updatedAt: string | null;
  socialNumber: string | null;
  sports: SportInfo[];
  age: number | null;
}
