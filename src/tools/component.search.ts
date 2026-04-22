import {
  componentSearchSchema,
  type ComponentSearchInput,
} from "../schemas/food.js";
import { foodService } from "../services/food.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "component.search";

export const description =
  "Search nutrition components by name and return component IDs to be used with food.getByComponent.";

export const inputSchema = componentSearchSchema;

export const handleComponentSearch = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = componentSearchSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return foodService.componentSearch(parsed.data as ComponentSearchInput);
};
