import {
  foodPlanRemoveIntakeSchema,
  type FoodPlanRemoveIntakeInput,
} from "../schemas/foodPlan.js";
import { foodPlanService } from "../services/foodPlan.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "foodPlan.removeIntake";

export const description = "Remove an intake from a coach-owned food plan.";

export const inputSchema = foodPlanRemoveIntakeSchema;

export const handleFoodPlanRemoveIntake = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = foodPlanRemoveIntakeSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return foodPlanService.removeIntake(parsed.data as FoodPlanRemoveIntakeInput);
};
