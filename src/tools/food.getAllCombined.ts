import {
  foodGetAllCombinedSchema,
  type FoodGetAllCombinedInput,
} from "../schemas/food.js";
import { foodService } from "../services/food.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "food.getAllCombined";

export const description =
  "List all combined prepared foods (e.g. sandwich recipes): combined=true.";

export const inputSchema = foodGetAllCombinedSchema;

export const handleFoodGetAllCombined = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = foodGetAllCombinedSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return foodService.getAllCombined(parsed.data as FoodGetAllCombinedInput);
};
