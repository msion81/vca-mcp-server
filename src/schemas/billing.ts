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
