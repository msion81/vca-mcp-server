import {
  foodGetFullDetailSchema,
  type FoodGetFullDetailInput,
} from "../schemas/food.js";
import { foodService } from "../services/food.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "food.getFullFoodDetail";

export const description =
  "Get full food detail by foodId, including brand info and all nutrient components from food_component.";

export const inputSchema = foodGetFullDetailSchema;

export const handleFoodGetFullFoodDetail = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = foodGetFullDetailSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return foodService.getFullDetail(parsed.data as FoodGetFullDetailInput);
};
