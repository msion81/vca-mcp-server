import {
  foodPlanUpdateSchema,
  type FoodPlanUpdateInput,
} from "../schemas/foodPlan.js";
import { foodPlanService } from "../services/foodPlan.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "foodPlan.update";

export const description = "Update a coach-owned food plan.";

export const inputSchema = foodPlanUpdateSchema;

export const handleFoodPlanUpdate = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = foodPlanUpdateSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return foodPlanService.update(parsed.data as FoodPlanUpdateInput);
};
