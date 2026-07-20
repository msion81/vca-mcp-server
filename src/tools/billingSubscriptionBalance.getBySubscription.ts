import {
  billingSubscriptionBalanceGetBySubscriptionSchema,
  type BillingSubscriptionBalanceGetBySubscriptionInput,
} from "../schemas/billing.js";
import { billingService } from "../services/billing.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "billingSubscriptionBalance.getBySubscription";

export const description =
  "Get the remaining credit balance (per appointment duration) for a coach's subscription.";

export const inputSchema = billingSubscriptionBalanceGetBySubscriptionSchema;

export const handleBillingSubscriptionBalanceGetBySubscription = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = billingSubscriptionBalanceGetBySubscriptionSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return billingService.getSubscriptionBalance(
    parsed.data as BillingSubscriptionBalanceGetBySubscriptionInput
  );
};
