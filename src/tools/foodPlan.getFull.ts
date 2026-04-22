import {
  foodPlanGetFullSchema,
  type FoodPlanGetFullInput,
} from "../schemas/foodPlan.js";
import { foodPlanService } from "../services/foodPlan.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "foodPlan.getFull";

export const description =
  "Get full food plan detail with intakes and linked intake bricks.";

export const inputSchema = foodPlanGetFullSchema;

export const handleFoodPlanGetFull = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = foodPlanGetFullSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return foodPlanService.getFull(parsed.data as FoodPlanGetFullInput);
};
