import {
  athleteGetByIdSchema,
  type AthleteGetByIdInput,
} from "../schemas/athlete.js";
import { athleteService } from "../services/athlete.service.js";
import type { ToolResponse } from "../types/responses.js";
import { error } from "../types/responses.js";

export const toolName = "athlete.getById";

export const description =
  "Get athlete by ID. IMPORTANT: coachId is automatically injected - will only return athlete if assigned to current coach. Returns all athlete fields (id, name, lastName, email, sex, phone, city, state, country, birthday, bodyWeight, height, metricSystemId, createdAt, updatedAt, socialNumber), sports list (id, name, code), and computed age. Use when you already have an athlete ID and need full details. Returns null if athlete not assigned to coach.";

export const inputSchema = athleteGetByIdSchema;

export const handleAthleteGetById = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = athleteGetByIdSchema.safeParse(params);
  if (!parsed.success) {
    return error(parsed.error.message);
  }
  return athleteService.getById(parsed.data as AthleteGetByIdInput);
};
