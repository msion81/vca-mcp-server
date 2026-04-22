import { foodGetByIdSchema, type FoodGetByIdInput } from "../schemas/food.js";
import { foodService } from "../services/food.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "food.getById";

export const description =
  "Get a single food by foodId with core fields and brand information when available.";

export const inputSchema = foodGetByIdSchema;

export const handleFoodGetById = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = foodGetByIdSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return foodService.getById(parsed.data as FoodGetByIdInput);
};
