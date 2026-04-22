import {
  foodGetByComponentSchema,
  type FoodGetByComponentInput,
} from "../schemas/food.js";
import { foodService } from "../services/food.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "food.getByComponent";

export const description =
  "Find foods that include a nutritional component, filterable by componentId or componentName and optional numeric value range.";

export const inputSchema = foodGetByComponentSchema;

export const handleFoodGetByComponent = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = foodGetByComponentSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return foodService.getByComponent(parsed.data as FoodGetByComponentInput);
};
