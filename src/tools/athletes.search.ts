import {
  athleteSearchSchema,
  type AthleteSearchInput,
} from "../schemas/athlete.js";
import { athleteService } from "../services/athlete.service.js";
import type { ToolResponse } from "../types/responses.js";
import { error } from "../types/responses.js";

export const toolName = "athletes.search";

export const description =
  "Search athletes. IMPORTANT: coachId is automatically injected - you will ONLY see athletes assigned to the current coach. Filters: name (searches in BOTH first name AND last name, partial match), lastName (surname only, partial match), sport (name or code), sex (exact match), age (exact age in years). Returns athletes with all fields, sports, and computed age. IMPORTANT: The 'name' filter searches in both name and lastName fields automatically. When searching for 'Sufe' or 'Luciano Sufe', just use {name: 'Sufe'}. Use this to find coach's athletes by any part of their name, discipline, sex, or age when you don't have an athlete ID.";

export const inputSchema = athleteSearchSchema;

export const handleAthletesSearch = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = athleteSearchSchema.safeParse(params);
  if (!parsed.success) {
    return error(parsed.error.message);
  }
  return athleteService.search(parsed.data as AthleteSearchInput);
};
