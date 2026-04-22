import { z } from "zod";

const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

export const foodPlanStatusSchema = z.enum(["active", "inactive", "draft"]);

export const foodPlanSearchSchema = z
  .object({
    coachId: z.number().int().positive(),
    athleteId: z.number().int().positive().optional(),
    status: foodPlanStatusSchema.optional(),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD")
      .optional(),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD")
      .optional(),
    limit: z.number().int().min(1).max(MAX_LIMIT).optional().default(DEFAULT_LIMIT),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) return data.startDate <= data.endDate;
      return true;
    },
    { message: "startDate must be before or equal to endDate", path: ["endDate"] }
  );

export type FoodPlanSearchInput = z.infer<typeof foodPlanSearchSchema>;

export const foodPlanGetByIdSchema = z.object({
  coachId: z.number().int().positive(),
  foodPlanId: z.number().int().positive(),
});

export type FoodPlanGetByIdInput = z.infer<typeof foodPlanGetByIdSchema>;

export const foodPlanGetFullSchema = z.object({
  coachId: z.number().int().positive(),
  foodPlanId: z.number().int().positive(),
});

export type FoodPlanGetFullInput = z.infer<typeof foodPlanGetFullSchema>;

export const foodPlanCreateSchema = z.object({
  coachId: z.number().int().positive(),
  athleteId: z.number().int().positive().optional(),
  name: z.string().trim().min(1).optional(),
  goals: z.string().trim().min(1).optional(),
  recommendations: z.string().trim().min(1).optional(),
  notes: z.string().trim().min(1).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD").optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD").optional(),
  status: foodPlanStatusSchema.optional().default("draft"),
  component: z.unknown().optional().default({}),
});

export type FoodPlanCreateInput = z.infer<typeof foodPlanCreateSchema>;

export const foodPlanUpdateSchema = z
  .object({
    coachId: z.number().int().positive(),
    foodPlanId: z.number().int().positive(),
    athleteId: z.number().int().positive().nullable().optional(),
    name: z.string().trim().min(1).optional(),
    goals: z.string().trim().min(1).optional(),
    recommendations: z.string().trim().min(1).optional(),
    notes: z.string().trim().min(1).optional(),
    startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD").optional(),
    endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD").optional(),
    status: foodPlanStatusSchema.optional(),
    component: z.unknown().optional(),
  })
  .refine(
    (data) =>
      data.athleteId !== undefined ||
      data.name !== undefined ||
      data.goals !== undefined ||
      data.recommendations !== undefined ||
      data.notes !== undefined ||
      data.startDate !== undefined ||
      data.endDate !== undefined ||
      data.status !== undefined ||
      data.component !== undefined,
    { message: "At least one field to update is required" }
  );

export type FoodPlanUpdateInput = z.infer<typeof foodPlanUpdateSchema>;

export const foodPlanAddIntakeSchema = z.object({
  coachId: z.number().int().positive(),
  foodPlanId: z.number().int().positive(),
  weekDay: z.string().trim().min(1),
  foodIntakeTypeId: z.number().int().positive(),
  name: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  notes: z.string().trim().min(1).optional(),
  order: z.number().nonnegative().optional().default(0),
});

export type FoodPlanAddIntakeInput = z.infer<typeof foodPlanAddIntakeSchema>;

export const foodPlanRemoveIntakeSchema = z.object({
  coachId: z.number().int().positive(),
  foodPlanId: z.number().int().positive(),
  foodIntakeId: z.number().int().positive(),
});

export type FoodPlanRemoveIntakeInput = z.infer<typeof foodPlanRemoveIntakeSchema>;

export const foodPlanAddBrickToIntakeSchema = z.object({
  coachId: z.number().int().positive(),
  foodIntakeId: z.number().int().positive(),
  brickId: z.number().int().positive(),
  order: z.number().nonnegative().optional().default(0),
});

export type FoodPlanAddBrickToIntakeInput = z.infer<typeof foodPlanAddBrickToIntakeSchema>;

export const foodPlanRemoveBrickFromIntakeSchema = z.object({
  coachId: z.number().int().positive(),
  foodIntakeId: z.number().int().positive(),
  foodIntakeEquivalenceId: z.number().int().positive(),
});

export type FoodPlanRemoveBrickFromIntakeInput = z.infer<typeof foodPlanRemoveBrickFromIntakeSchema>;

export const intakeTypeListSchema = z.object({});

export interface FoodPlanRecord {
  id: number;
  name: string | null;
  userRolesId: number | null;
  goals: string | null;
  recommendations: string | null;
  notes: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  athleteId: number | null;
  startDate: string | null;
  endDate: string | null;
  status: "active" | "inactive" | "draft" | null;
  component: unknown;
}

export interface FoodPlanBrickRecord {
  id: number;
  order: number | null;
  brickId: number;
  brickName: string | null;
  brickDisplayName: string | null;
  brickAmount: number | null;
  brickMainComponent: string | null;
  brickAvgComponent: unknown;
}

export interface FoodPlanIntakeRecord {
  id: number;
  name: string | null;
  foodPlanId: number;
  foodIntakeTypeId: number;
  foodIntakeTypeName: string | null;
  description: string | null;
  notes: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  weekDay: string | null;
  order: number | null;
  bricks: FoodPlanBrickRecord[];
}

export interface FoodPlanFullRecord extends FoodPlanRecord {
  intakes: FoodPlanIntakeRecord[];
}

export interface IntakeTypeRecord {
  id: number;
  name: string | null;
}
