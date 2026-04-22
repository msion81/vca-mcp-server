import {
  foodPlanCreateSchema,
  type FoodPlanCreateInput,
} from "../schemas/foodPlan.js";
import { foodPlanService } from "../services/foodPlan.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "foodPlan.create";

export const description = "Create a food plan owned by a coach.";

export const inputSchema = foodPlanCreateSchema;

export const handleFoodPlanCreate = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = foodPlanCreateSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return foodPlanService.create(parsed.data as FoodPlanCreateInput);
};
