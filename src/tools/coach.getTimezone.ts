import {
  coachGetTimezoneSchema,
  type CoachGetTimezoneInput,
} from "../schemas/coach.js";
import { coachService } from "../services/coach.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "coach.getTimezone";

export const description =
  "Internal: returns users.timezone for the coach user_roles row (coachId). Used by the agent host to resolve effective IANA zone; not intended for LLM calls.";

export const inputSchema = coachGetTimezoneSchema;

export const handleCoachGetTimezone = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = coachGetTimezoneSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);
  return coachService.getTimezoneByUserRoleId(
    (parsed.data as CoachGetTimezoneInput).coachId
  );
};
