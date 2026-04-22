import {
  foodGetAllGenericSchema,
  type FoodGetAllGenericInput,
} from "../schemas/food.js";
import { foodService } from "../services/food.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "food.getAllGeneric";

export const description =
  "List all generic formula foods (standardized references): generic=true and combined=false.";

export const inputSchema = foodGetAllGenericSchema;

export const handleFoodGetAllGeneric = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = foodGetAllGenericSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return foodService.getAllGeneric(parsed.data as FoodGetAllGenericInput);
};
