import { brickGetDetailSchema, type BrickGetDetailInput } from "../schemas/brick.js";
import { brickService } from "../services/brick.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "brick.getDetail";

export const description =
  "Get a brick by id with foods, computed facts, and manual fact overrides.";

export const inputSchema = brickGetDetailSchema;

export const handleBrickGetDetail = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = brickGetDetailSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return brickService.getDetail(parsed.data as BrickGetDetailInput);
};
