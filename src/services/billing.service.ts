import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  appointmentDuration,
  athlete,
  billingIndividualPurchase,
  billingPlan,
  billingSubscription,
  billingSubscriptionBalance,
  billingSubscriptionBalanceMovement,
  coachPayment,
} from "../db/schema/index.js";
import type {
  BillingIndividualPurchaseRecord,
  BillingIndividualPurchaseSearchInput,
  BillingPlanRecord,
  BillingPlansSearchInput,
  BillingSubscriptionBalanceGetBySubscriptionInput,
  BillingSubscriptionBalanceRecord,
  BillingSubscriptionRecord,
  BillingSubscriptionsSearchInput,
  CoachPaymentRecord,
  CoachPaymentsSearchInput,
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

  searchCoachPayments: async (
    input: CoachPaymentsSearchInput
  ): Promise<ToolResponse<CoachPaymentRecord[]>> => {
    if (!db) return error("Database not configured");

    try {
      const conditions = [eq(coachPayment.userRolesId, input.coachId)];
      if (input.athleteId != null) conditions.push(eq(coachPayment.athleteId, input.athleteId));
      if (input.subscriptionId != null) conditions.push(eq(coachPayment.subscriptionId, input.subscriptionId));
      if (input.status != null) conditions.push(eq(coachPayment.status, input.status));

      const rows = await db
        .select()
        .from(coachPayment)
        .where(and(...conditions))
        .orderBy(desc(coachPayment.createdAt))
        .limit(input.limit);

      const result: CoachPaymentRecord[] = rows.map((row) => ({
        id: row.id,
        athleteId: row.athleteId,
        subscriptionId: row.subscriptionId,
        provider: row.provider,
        concept: row.concept,
        status: row.status,
        amount: row.amount,
        currency: row.currency,
        approvedAt: row.approvedAt,
        createdAt: row.createdAt,
      }));

      return success(result);
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to search coach payments");
    }
  },

  getSubscriptionBalance: async (
    input: BillingSubscriptionBalanceGetBySubscriptionInput
  ): Promise<ToolResponse<BillingSubscriptionBalanceRecord[] | null>> => {
    if (!db) return error("Database not configured");

    try {
      const [owned] = await db
        .select({ id: billingSubscription.id })
        .from(billingSubscription)
        .where(
          and(eq(billingSubscription.id, input.subscriptionId), eq(billingSubscription.userRolesId, input.coachId))
        )
        .limit(1);

      if (!owned) return success(null);

      const balanceRows = await db
        .select({
          id: billingSubscriptionBalance.id,
          appointmentDurationId: billingSubscriptionBalance.appointmentDurationId,
          appointmentDurationName: appointmentDuration.name,
        })
        .from(billingSubscriptionBalance)
        .innerJoin(appointmentDuration, eq(appointmentDuration.id, billingSubscriptionBalance.appointmentDurationId))
        .where(eq(billingSubscriptionBalance.subscriptionId, input.subscriptionId));

      const balanceIds = balanceRows.map((row) => row.id);
      const remainingByBalanceId = new Map<number, number>();

      if (balanceIds.length > 0) {
        const movementRows = await db
          .select({
            subscriptionBalanceId: billingSubscriptionBalanceMovement.subscriptionBalanceId,
            quantity: billingSubscriptionBalanceMovement.quantity,
          })
          .from(billingSubscriptionBalanceMovement)
          .where(inArray(billingSubscriptionBalanceMovement.subscriptionBalanceId, balanceIds));

        for (const movement of movementRows) {
          const current = remainingByBalanceId.get(movement.subscriptionBalanceId) ?? 0;
          remainingByBalanceId.set(movement.subscriptionBalanceId, current + movement.quantity);
        }
      }

      const result: BillingSubscriptionBalanceRecord[] = balanceRows.map((row) => ({
        id: row.id,
        appointmentDurationId: row.appointmentDurationId,
        appointmentDurationName: row.appointmentDurationName,
        remainingQuantity: remainingByBalanceId.get(row.id) ?? 0,
      }));

      return success(result);
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to get subscription balance");
    }
  },

  searchIndividualPurchases: async (
    input: BillingIndividualPurchaseSearchInput
  ): Promise<ToolResponse<BillingIndividualPurchaseRecord[]>> => {
    if (!db) return error("Database not configured");

    try {
      const conditions = [eq(billingIndividualPurchase.userRolesId, input.coachId)];
      if (input.athleteId != null) conditions.push(eq(billingIndividualPurchase.athleteId, input.athleteId));

      const rows = await db
        .select({
          id: billingIndividualPurchase.id,
          athleteId: billingIndividualPurchase.athleteId,
          appointmentDurationId: billingIndividualPurchase.appointmentDurationId,
          appointmentDurationName: appointmentDuration.name,
          quantity: billingIndividualPurchase.quantity,
          purchaseDate: billingIndividualPurchase.purchaseDate,
        })
        .from(billingIndividualPurchase)
        .innerJoin(appointmentDuration, eq(appointmentDuration.id, billingIndividualPurchase.appointmentDurationId))
        .where(and(...conditions))
        .orderBy(desc(billingIndividualPurchase.purchaseDate))
        .limit(input.limit);

      return success(rows);
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to search individual purchases");
    }
  },
};
