import { brickUpdateSchema, type BrickUpdateInput } from "../schemas/brick.js";
import { brickService } from "../services/brick.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "brick.update";

export const description = "Update an intake brick if it belongs to the coach.";

export const inputSchema = brickUpdateSchema;

export const handleBrickUpdate = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = brickUpdateSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return brickService.update(parsed.data as BrickUpdateInput);
};
