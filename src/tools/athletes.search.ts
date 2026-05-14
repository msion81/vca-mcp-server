import {
  athleteSearchSchema,
  type AthleteSearchInput,
} from "../schemas/athlete.js";
import { athleteService } from "../services/athlete.service.js";
import type { ToolResponse } from "../types/responses.js";
import { error } from "../types/responses.js";

export const toolName = "athletes.search";

export const description =
  "Search athletes. IMPORTANT: coachId is automatically injected - you will ONLY see athletes assigned to the current coach. Filters: name (free-text: pass the coach phrase as-is, including compound given names and multiple surnames in one string, e.g. 'Maria Inés', 'Inés López', 'Lopez Perez'; whitespace tokens are ANDed against the full normalized display name; accents are ignored), lastName (optional: when ALSO provided with name, structured search — name part matches given OR last-name column, lastName part must match last-name column; accent-insensitive partial match), email (partial case-insensitive match), sport (name or code), sex (exact match), age (exact age in years). Returns athletes with all fields, sports, and computed age. Prefer a single {name: '...'} string with every token the user gave unless they clearly split given vs surname. For email use {email: '...'}.";

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
