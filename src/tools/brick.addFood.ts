import { brickAddFoodSchema, type BrickAddFoodInput } from "../schemas/brick.js";
import { brickService } from "../services/brick.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "brick.addFood";

export const description = "Add a food item into a brick owned by the coach.";

export const inputSchema = brickAddFoodSchema;

export const handleBrickAddFood = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = brickAddFoodSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return brickService.addFood(parsed.data as BrickAddFoodInput);
};
