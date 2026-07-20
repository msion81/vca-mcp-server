import {
  billingIndividualPurchaseSearchSchema,
  type BillingIndividualPurchaseSearchInput,
} from "../schemas/billing.js";
import { billingService } from "../services/billing.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "billingIndividualPurchase.search";

export const description = "Search a coach's individual (out-of-plan) session purchases.";

export const inputSchema = billingIndividualPurchaseSearchSchema;

export const handleBillingIndividualPurchaseSearch = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = billingIndividualPurchaseSearchSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return billingService.searchIndividualPurchases(
    parsed.data as BillingIndividualPurchaseSearchInput
  );
};
