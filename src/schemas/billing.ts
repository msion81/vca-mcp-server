import { z } from "zod";

export const billingPlansSearchSchema = z.object({
  coachId: z.number().int().positive(),
  limit: z.number().int().min(1).max(100).optional().default(50),
});

export type BillingPlansSearchInput = z.infer<typeof billingPlansSearchSchema>;

export const billingSubscriptionsSearchSchema = z.object({
  coachId: z.number().int().positive(),
  athleteId: z.number().int().positive().optional(),
  status: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional().default(50),
});

export type BillingSubscriptionsSearchInput = z.infer<typeof billingSubscriptionsSearchSchema>;

export interface BillingPlanRecord {
  id: number;
  name: string;
  description: string | null;
  price: number;
  durationDays: number;
}

export interface BillingSubscriptionRecord {
  id: number;
  athleteId: number;
  athleteName: string | null;
  athleteLastName: string | null;
  athleteEmail: string | null;
  planId: number;
  planName: string | null;
  startDate: string;
  endDate: string;
  status: string;
  paymentMethod: string | null;
  paymentStatus: string | null;
  paymentAmount: number | null;
  paymentApprovedAt: string | null;
}

export const coachPaymentsSearchSchema = z.object({
  coachId: z.number().int().positive(),
  athleteId: z.number().int().positive().optional(),
  subscriptionId: z.number().int().positive().optional(),
  status: z.string().optional(),
  limit: z.number().int().min(1).max(100).optional().default(50),
});

export type CoachPaymentsSearchInput = z.infer<typeof coachPaymentsSearchSchema>;

export interface CoachPaymentRecord {
  id: number;
  athleteId: number;
  subscriptionId: number | null;
  provider: string;
  concept: string;
  status: string;
  amount: number;
  currency: string;
  approvedAt: string | null;
  createdAt: string | null;
}

export const billingSubscriptionBalanceGetBySubscriptionSchema = z.object({
  coachId: z.number().int().positive(),
  subscriptionId: z.number().int().positive(),
});

export type BillingSubscriptionBalanceGetBySubscriptionInput = z.infer<
  typeof billingSubscriptionBalanceGetBySubscriptionSchema
>;

export interface BillingSubscriptionBalanceRecord {
  id: number;
  appointmentDurationId: number;
  appointmentDurationName: string | null;
  remainingQuantity: number;
}

export const billingIndividualPurchaseSearchSchema = z.object({
  coachId: z.number().int().positive(),
  athleteId: z.number().int().positive().optional(),
  limit: z.number().int().min(1).max(100).optional().default(50),
});

export type BillingIndividualPurchaseSearchInput = z.infer<
  typeof billingIndividualPurchaseSearchSchema
>;

export interface BillingIndividualPurchaseRecord {
  id: number;
  athleteId: number;
  appointmentDurationId: number;
  appointmentDurationName: string | null;
  quantity: number;
  purchaseDate: string | null;
}
