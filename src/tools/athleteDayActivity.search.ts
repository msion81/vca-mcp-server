import {
  athleteDayActivitySearchSchema,
  type AthleteDayActivitySearchInput,
} from "../schemas/athleteDayActivity.js";
import { athleteDayActivityService } from "../services/athleteDayActivity.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "athleteDayActivity.search";

export const description = "Search an athlete's reported daily training activity (session/duration/intensity).";

export const inputSchema = athleteDayActivitySearchSchema;

export const handleAthleteDayActivitySearch = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = athleteDayActivitySearchSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return athleteDayActivityService.search(parsed.data as AthleteDayActivitySearchInput);
};
