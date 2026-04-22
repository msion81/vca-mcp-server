import {
  foodPlanSearchSchema,
  type FoodPlanSearchInput,
} from "../schemas/foodPlan.js";
import { foodPlanService } from "../services/foodPlan.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "foodPlan.search";

export const description = "Search food plans scoped to a coach (user_roles_id).";

export const inputSchema = foodPlanSearchSchema;

export const handleFoodPlanSearch = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = foodPlanSearchSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return foodPlanService.search(parsed.data as FoodPlanSearchInput);
};
