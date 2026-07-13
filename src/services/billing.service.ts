import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { athlete, billingPlan, billingSubscription, coachPayment } from "../db/schema/index.js";
import type {
  BillingPlanRecord,
  BillingPlansSearchInput,
  BillingSubscriptionRecord,
  BillingSubscriptionsSearchInput,
} from "../schemas/billing.js";
import { error, success, type ToolResponse } from "../types/responses.js";

export const billingService = {
  searchPlans: async (
    input: BillingPlansSearchInput
  ): Promise<ToolResponse<BillingPlanRecord[]>> => {
    if (!db) return error("Database not configured");

    try {
      const rows = await db
        .select()
        .from(billingPlan)
        .where(and(eq(billingPlan.userRolesId, input.coachId), isNull(billingPlan.deletedAt)))
        .orderBy(desc(billingPlan.id))
        .limit(input.limit);

      const result: BillingPlanRecord[] = rows.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.price,
        durationDays: row.durationDays,
      }));

      return success(result);
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to search billing plans");
    }
  },

  searchSubscriptions: async (
    input: BillingSubscriptionsSearchInput
  ): Promise<ToolResponse<BillingSubscriptionRecord[]>> => {
    if (!db) return error("Database not configured");

    try {
      const conditions = [eq(billingSubscription.userRolesId, input.coachId)];
      if (input.athleteId != null) conditions.push(eq(billingSubscription.athleteId, input.athleteId));
      if (input.status != null) conditions.push(eq(billingSubscription.status, input.status));

      const rows = await db
        .select({
          id: billingSubscription.id,
          athleteId: billingSubscription.athleteId,
          athleteName: athlete.name,
          athleteLastName: athlete.lastName,
          athleteEmail: athlete.email,
          planId: billingSubscription.planId,
          planName: billingPlan.name,
          startDate: billingSubscription.startDate,
          endDate: billingSubscription.endDate,
          status: billingSubscription.status,
          paymentMethod: billingSubscription.paymentMethod,
        })
        .from(billingSubscription)
        .innerJoin(athlete, eq(athlete.id, billingSubscription.athleteId))
        .innerJoin(billingPlan, eq(billingPlan.id, billingSubscription.planId))
        .where(and(...conditions))
        .orderBy(desc(billingSubscription.endDate))
        .limit(input.limit);

      const subscriptionIds = rows.map((row) => row.id);
      const latestPaymentBySubscription = new Map<
        number,
        { status: string; amount: number | null; approvedAt: string | null }
      >();

      if (subscriptionIds.length > 0) {
        const paymentRows = await db
          .select({
            subscriptionId: coachPayment.subscriptionId,
            status: coachPayment.status,
            amount: coachPayment.amount,
            approvedAt: coachPayment.approvedAt,
            createdAt: coachPayment.createdAt,
          })
          .from(coachPayment)
          .where(inArray(coachPayment.subscriptionId, subscriptionIds))
          .orderBy(desc(coachPayment.createdAt));

        for (const payment of paymentRows) {
          if (payment.subscriptionId == null) continue;
          if (latestPaymentBySubscription.has(payment.subscriptionId)) continue;
          latestPaymentBySubscription.set(payment.subscriptionId, {
            status: payment.status,
            amount: payment.amount,
            approvedAt: payment.approvedAt,
          });
        }
      }

      const result: BillingSubscriptionRecord[] = rows.map((row) => {
        const payment = latestPaymentBySubscription.get(row.id);
        return {
          id: row.id,
          athleteId: row.athleteId,
          athleteName: row.athleteName,
          athleteLastName: row.athleteLastName,
          athleteEmail: row.athleteEmail,
          planId: row.planId,
          planName: row.planName,
          startDate: row.startDate,
          endDate: row.endDate,
          status: row.status,
          paymentMethod: row.paymentMethod,
          paymentStatus: payment?.status ?? null,
          paymentAmount: payment?.amount ?? null,
          paymentApprovedAt: payment?.approvedAt ?? null,
        };
      });

      return success(result);
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to search billing subscriptions");
    }
  },
};
