import {
  coachPaymentsSearchSchema,
  type CoachPaymentsSearchInput,
} from "../schemas/billing.js";
import { billingService } from "../services/billing.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "coachPayments.search";

export const description = "Search a coach's payment history (coach_payment).";

export const inputSchema = coachPaymentsSearchSchema;

export const handleCoachPaymentsSearch = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = coachPaymentsSearchSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return billingService.searchCoachPayments(parsed.data as CoachPaymentsSearchInput);
};
