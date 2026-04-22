import {
  foodPlanGetByIdSchema,
  type FoodPlanGetByIdInput,
} from "../schemas/foodPlan.js";
import { foodPlanService } from "../services/foodPlan.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "foodPlan.getById";

export const description = "Get a coach-owned food plan by id.";

export const inputSchema = foodPlanGetByIdSchema;

export const handleFoodPlanGetById = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = foodPlanGetByIdSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return foodPlanService.getById(parsed.data as FoodPlanGetByIdInput);
};
