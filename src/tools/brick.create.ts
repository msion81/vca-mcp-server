import { brickCreateSchema, type BrickCreateInput } from "../schemas/brick.js";
import { brickService } from "../services/brick.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "brick.create";

export const description = "Create a new intake brick owned by a coach.";

export const inputSchema = brickCreateSchema;

export const handleBrickCreate = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = brickCreateSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return brickService.create(parsed.data as BrickCreateInput);
};
