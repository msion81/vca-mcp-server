import {
  billingPlansSearchSchema,
  type BillingPlansSearchInput,
} from "../schemas/billing.js";
import { billingService } from "../services/billing.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "billingPlans.search";

export const description = "List billing plans configured by a coach (user_roles_id).";

export const inputSchema = billingPlansSearchSchema;

export const handleBillingPlansSearch = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = billingPlansSearchSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return billingService.searchPlans(parsed.data as BillingPlansSearchInput);
};
