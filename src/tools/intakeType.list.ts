import { intakeTypeListSchema } from "../schemas/foodPlan.js";
import { foodPlanService } from "../services/foodPlan.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "intakeType.list";

export const description = "List available intake types (breakfast, lunch, dinner, etc.).";

export const inputSchema = intakeTypeListSchema;

export const handleIntakeTypeList = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = intakeTypeListSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return foodPlanService.listIntakeTypes();
};
