import {
  foodPlanRemoveBrickFromIntakeSchema,
  type FoodPlanRemoveBrickFromIntakeInput,
} from "../schemas/foodPlan.js";
import { foodPlanService } from "../services/foodPlan.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "foodPlan.removeBrickFromIntake";

export const description = "Remove a brick link from a coach-owned intake.";

export const inputSchema = foodPlanRemoveBrickFromIntakeSchema;

export const handleFoodPlanRemoveBrickFromIntake = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = foodPlanRemoveBrickFromIntakeSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return foodPlanService.removeBrickFromIntake(
    parsed.data as FoodPlanRemoveBrickFromIntakeInput
  );
};
