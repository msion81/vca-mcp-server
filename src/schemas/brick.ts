import { z } from "zod";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export const brickSearchSchema = z.object({
  coachId: z.number().int().positive(),
  name: z.string().trim().min(1).optional(),
  limit: z.number().int().min(1).max(MAX_LIMIT).optional().default(DEFAULT_LIMIT),
  offset: z.number().int().min(0).optional().default(0),
});

export type BrickSearchInput = z.infer<typeof brickSearchSchema>;

export const brickGetDetailSchema = z.object({
  coachId: z.number().int().positive(),
  brickId: z.number().int().positive(),
});

export type BrickGetDetailInput = z.infer<typeof brickGetDetailSchema>;

export const brickCreateSchema = z.object({
  coachId: z.number().int().positive(),
  name: z.string().trim().min(1),
  amount: z.number().nonnegative().optional().default(0),
  displayName: z.string().trim().min(1).optional(),
  description: z.string().trim().min(1).optional(),
  image: z.string().trim().min(1).optional(),
  mainComponent: z.string().trim().min(1).optional(),
  maxSearchThreshold: z.string().trim().min(1).optional(),
  tag: z.string().trim().min(1).optional(),
  metadata: z.unknown().optional().default({}),
  active: z.boolean().optional().default(true),
});

export type BrickCreateInput = z.infer<typeof brickCreateSchema>;

export const brickUpdateSchema = z
  .object({
    coachId: z.number().int().positive(),
    brickId: z.number().int().positive(),
    name: z.string().trim().min(1).optional(),
    amount: z.number().nonnegative().optional(),
    displayName: z.string().trim().min(1).optional(),
    description: z.string().trim().min(1).optional(),
    image: z.string().trim().min(1).optional(),
    mainComponent: z.string().trim().min(1).optional(),
    maxSearchThreshold: z.string().trim().min(1).optional(),
    tag: z.string().trim().min(1).optional(),
    metadata: z.unknown().optional(),
    active: z.boolean().optional(),
  })
  .refine(
    (data) =>
      data.name !== undefined ||
      data.amount !== undefined ||
      data.displayName !== undefined ||
      data.description !== undefined ||
      data.image !== undefined ||
      data.mainComponent !== undefined ||
      data.maxSearchThreshold !== undefined ||
      data.tag !== undefined ||
      data.metadata !== undefined ||
      data.active !== undefined,
    { message: "At least one field to update is required" }
  );

export type BrickUpdateInput = z.infer<typeof brickUpdateSchema>;

export const brickAddFoodSchema = z.object({
  coachId: z.number().int().positive(),
  brickId: z.number().int().positive(),
  foodId: z.number().int().positive(),
  amount: z.number().nonnegative().optional().default(0),
  measure: z.string().trim().min(1).optional(),
  component: z.unknown().optional().default({}),
});

export type BrickAddFoodInput = z.infer<typeof brickAddFoodSchema>;

export const brickRemoveFoodSchema = z.object({
  coachId: z.number().int().positive(),
  brickId: z.number().int().positive(),
  detailId: z.number().int().positive(),
});

export type BrickRemoveFoodInput = z.infer<typeof brickRemoveFoodSchema>;

export const brickSetComponentsSchema = z.object({
  coachId: z.number().int().positive(),
  brickId: z.number().int().positive(),
  avgComponent: z.unknown(),
});

export type BrickSetComponentsInput = z.infer<typeof brickSetComponentsSchema>;

export interface BrickRecord {
  id: number;
  userRolesId: number | null;
  name: string | null;
  mainComponent: string | null;
  maxSearchThreshold: string | null;
  avgComponent: unknown;
  tag: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  amount: number | null;
  displayName: string | null;
  description: string | null;
  image: string | null;
  metadata: unknown;
  active: boolean | null;
}

export interface BrickFoodRecord {
  detailId: number;
  foodId: number;
  foodName: string;
  amount: number | null;
  measure: string | null;
  component: unknown;
}

export interface BrickComponentFact {
  componentId: number;
  componentName: string;
  componentCode: string | null;
  measure: string | null;
  value: number;
  source: "computed" | "manual";
}

export interface BrickDetailRecord extends BrickRecord {
  foods: BrickFoodRecord[];
  computedFacts: BrickComponentFact[];
  facts: BrickComponentFact[];
}
