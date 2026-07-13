import {
  billingSubscriptionsSearchSchema,
  type BillingSubscriptionsSearchInput,
} from "../schemas/billing.js";
import { billingService } from "../services/billing.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "billingSubscriptions.search";

export const description =
  "List a coach's athlete subscriptions, including expiration, status, latest payment info, and athlete details.";

export const inputSchema = billingSubscriptionsSearchSchema;

export const handleBillingSubscriptionsSearch = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = billingSubscriptionsSearchSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return billingService.searchSubscriptions(parsed.data as BillingSubscriptionsSearchInput);
};
