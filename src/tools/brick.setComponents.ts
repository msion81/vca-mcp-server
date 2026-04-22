import {
  brickSetComponentsSchema,
  type BrickSetComponentsInput,
} from "../schemas/brick.js";
import { brickService } from "../services/brick.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "brick.setComponents";

export const description =
  "Set manual nutritional component facts (avgComponent) for a brick.";

export const inputSchema = brickSetComponentsSchema;

export const handleBrickSetComponents = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = brickSetComponentsSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return brickService.setComponents(parsed.data as BrickSetComponentsInput);
};
