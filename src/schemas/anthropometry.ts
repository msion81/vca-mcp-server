import { z } from "zod";

export const anthropometryGetByAssessmentSchema = z.object({
  assessmentId: z.number().int().positive(),
});

export type AnthropometryGetByAssessmentInput = z.infer<typeof anthropometryGetByAssessmentSchema>;

export const anthropometrySearchSchema = z
  .object({
    athleteId: z.number().int().positive().optional(),
    assessmentId: z.number().int().positive().optional(),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD")
      .optional(),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD")
      .optional(),
    limit: z.number().int().min(1).max(100).optional().default(20),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) return data.startDate <= data.endDate;
      return true;
    },
    { message: "startDate must be before or equal to endDate", path: ["endDate"] }
  );

export type AnthropometrySearchInput = z.infer<typeof anthropometrySearchSchema>;

export interface AnthropometryRecord {
  id: number;
  athleteId: number | null;
  userRolesId: number | null;
  assessmentId: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  isakType: string | null;
  basicWeight: number | null;
  basicHeight: number | null;
  basicHeatedHeight: number | null;
  referenceBoneMass: number | null;
  diameterBiacromial: number | null;
  diameterTransverseThorax: number | null;
  diameterAnteroposteriorThorax: number | null;
  diameterBiiliocrestal: number | null;
  diameterHumeralbiepicondylar: number | null;
  diameterFemoralbiepicondylar: number | null;
  diameterBistyloid: number | null;
  diameterBitrochanteric: number | null;
  diameterBimalleolar: number | null;
  perimeterHead: number | null;
  perimeterArm: number | null;
  perimeterFlexedArm: number | null;
  perimeterForearm: number | null;
  perimeterChest: number | null;
  perimeterWaist: number | null;
  perimeterHip: number | null;
  perimeterUpperThigh: number | null;
  perimeterMedialThigh: number | null;
  perimeterCalf: number | null;
  perimeterNeck: number | null;
  perimeterAbdominal: number | null;
  perimeterWrist: number | null;
  foldsTriceps: number | null;
  foldsSubscapular: number | null;
  foldsSupraspinal: number | null;
  foldsAbdominal: number | null;
  foldsThigh: number | null;
  foldsCalf: number | null;
  foldsBiceps: number | null;
  foldsIliacCrest: number | null;
  foldsForearm: number | null;
  lengthForearm: number | null;
  lengthLeg: number | null;
  lengthArm: number | null;
  lengthAcromialSitting: number | null;
  lengthSternalHeight: number | null;
  lengthElbowHeight: number | null;
  lengthStylionHeight: number | null;
  lengthMiddleFingerHeight: number | null;
  lengthTrochantericHeight: number | null;
  lengthAcromialStanding: number | null;
  skinfoldCaliperId: string | null;
  additionalMeasures: unknown;
  /** Placeholder for the calculated anthropometric report. Will be populated by an external helper. */
  report: null;
}
