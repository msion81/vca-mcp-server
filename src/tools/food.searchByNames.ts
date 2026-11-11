import {
  foodSearchByNamesSchema,
  type FoodSearchByNamesInput,
} from "../schemas/food.js";
import { foodService } from "../services/food.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "food.searchByNames";

export const description =
  "Batch search foods by a list of names in a single query. Returns up to `limitPerName` matches per name. Use this instead of multiple food.searchByName calls when you need nutritional data for several ingredients at once.";

export const inputSchema = foodSearchByNamesSchema;

export const handleFoodSearchByNames = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = foodSearchByNamesSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return foodService.searchByNames(parsed.data as FoodSearchByNamesInput);
};
