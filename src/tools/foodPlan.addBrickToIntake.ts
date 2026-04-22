import {
  foodPlanAddBrickToIntakeSchema,
  type FoodPlanAddBrickToIntakeInput,
} from "../schemas/foodPlan.js";
import { foodPlanService } from "../services/foodPlan.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "foodPlan.addBrickToIntake";

export const description =
  "Attach a coach-owned brick into a coach-owned food intake.";

export const inputSchema = foodPlanAddBrickToIntakeSchema;

export const handleFoodPlanAddBrickToIntake = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = foodPlanAddBrickToIntakeSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return foodPlanService.addBrickToIntake(
    parsed.data as FoodPlanAddBrickToIntakeInput
  );
};
