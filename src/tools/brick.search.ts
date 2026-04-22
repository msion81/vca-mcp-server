import { brickSearchSchema, type BrickSearchInput } from "../schemas/brick.js";
import { brickService } from "../services/brick.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "brick.search";

export const description = "List intake bricks owned by a coach (user_roles_id).";

export const inputSchema = brickSearchSchema;

export const handleBrickSearch = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = brickSearchSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return brickService.search(parsed.data as BrickSearchInput);
};
