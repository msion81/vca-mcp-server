import {
  foodSearchByNameSchema,
  type FoodSearchByNameInput,
} from "../schemas/food.js";
import { foodService } from "../services/food.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "food.searchByName";

export const description =
  "Search foods by partial name across all food categories (generic, manufactured, and combined).";

export const inputSchema = foodSearchByNameSchema;

export const handleFoodSearchByName = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = foodSearchByNameSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return foodService.searchByName(parsed.data as FoodSearchByNameInput);
};
