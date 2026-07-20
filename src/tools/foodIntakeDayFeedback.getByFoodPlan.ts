import {
  foodIntakeDayFeedbackGetByFoodPlanSchema,
  type FoodIntakeDayFeedbackGetByFoodPlanInput,
} from "../schemas/foodIntakeDayFeedback.js";
import { foodIntakeDayFeedbackService } from "../services/foodIntakeDayFeedback.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "foodIntakeDayFeedback.getByFoodPlan";

export const description =
  "Get an athlete's daily feedback (comments/photos/star ratings) on a food plan, optionally within a day range.";

export const inputSchema = foodIntakeDayFeedbackGetByFoodPlanSchema;

export const handleFoodIntakeDayFeedbackGetByFoodPlan = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = foodIntakeDayFeedbackGetByFoodPlanSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return foodIntakeDayFeedbackService.getByFoodPlan(
    parsed.data as FoodIntakeDayFeedbackGetByFoodPlanInput
  );
};
