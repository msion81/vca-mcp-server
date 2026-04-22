import {
  brickRemoveFoodSchema,
  type BrickRemoveFoodInput,
} from "../schemas/brick.js";
import { brickService } from "../services/brick.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "brick.removeFood";

export const description = "Remove a food detail row from a coach-owned brick.";

export const inputSchema = brickRemoveFoodSchema;

export const handleBrickRemoveFood = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = brickRemoveFoodSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return brickService.removeFood(parsed.data as BrickRemoveFoodInput);
};
