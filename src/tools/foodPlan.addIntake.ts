import {
  foodPlanAddIntakeSchema,
  type FoodPlanAddIntakeInput,
} from "../schemas/foodPlan.js";
import { foodPlanService } from "../services/foodPlan.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "foodPlan.addIntake";

export const description = "Add an intake (day + moment) into a coach-owned food plan.";

export const inputSchema = foodPlanAddIntakeSchema;

export const handleFoodPlanAddIntake = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = foodPlanAddIntakeSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return foodPlanService.addIntake(parsed.data as FoodPlanAddIntakeInput);
};
