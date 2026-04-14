import {
  anthropometrySearchSchema,
  type AnthropometrySearchInput,
} from "../schemas/anthropometry.js";
import { anthropometryService } from "../services/anthropometry.service.js";
import type { ToolResponse } from "../types/responses.js";
import { error } from "../types/responses.js";

export const toolName = "anthropometry.search";

export const description =
  "Search anthropometric records for an athlete across assessments, ordered by most recent first. Useful for tracking body composition evolution over time. Filters: athleteId, assessmentId (exact assessment), startDate/endDate (YYYY-MM-DD). Each record contains all raw measurements plus report: null (placeholder for the calculated anthropometric report). Common use cases: all records for athlete → { athleteId: <id> }; records in a period → { athleteId: <id>, startDate: \"YYYY-MM-DD\", endDate: \"YYYY-MM-DD\" }; single record by assessment → { assessmentId: <id> }. Limit default 20.";

export const inputSchema = anthropometrySearchSchema;

export const handleAnthropometrySearch = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = anthropometrySearchSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);
  return anthropometryService.search(parsed.data as AnthropometrySearchInput);
};
