import {
  foodGetAllManufacturedSchema,
  type FoodGetAllManufacturedInput,
} from "../schemas/food.js";
import { foodService } from "../services/food.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "food.getAllManufactured";

export const description =
  "List all manufactured/commercial branded foods: generic=false, combined=false, and foodBrandId is present.";

export const inputSchema = foodGetAllManufacturedSchema;

export const handleFoodGetAllManufactured = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = foodGetAllManufacturedSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return foodService.getAllManufactured(parsed.data as FoodGetAllManufacturedInput);
};
