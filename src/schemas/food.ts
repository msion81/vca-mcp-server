import { z } from "zod";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export const foodSearchByNameSchema = z.object({
  name: z.string().trim().min(1),
  limit: z.number().int().min(1).max(MAX_LIMIT).optional().default(DEFAULT_LIMIT),
});

export type FoodSearchByNameInput = z.infer<typeof foodSearchByNameSchema>;

export const foodGetAllGenericSchema = z.object({
  limit: z.number().int().min(1).max(MAX_LIMIT).optional().default(DEFAULT_LIMIT),
  offset: z.number().int().min(0).optional().default(0),
});

export type FoodGetAllGenericInput = z.infer<typeof foodGetAllGenericSchema>;

export const foodGetAllCombinedSchema = z.object({
  limit: z.number().int().min(1).max(MAX_LIMIT).optional().default(DEFAULT_LIMIT),
  offset: z.number().int().min(0).optional().default(0),
});

export type FoodGetAllCombinedInput = z.infer<typeof foodGetAllCombinedSchema>;

export const foodGetAllManufacturedSchema = z.object({
  brandId: z.number().int().positive().optional(),
  limit: z.number().int().min(1).max(MAX_LIMIT).optional().default(DEFAULT_LIMIT),
  offset: z.number().int().min(0).optional().default(0),
});

export type FoodGetAllManufacturedInput = z.infer<typeof foodGetAllManufacturedSchema>;

export const foodGetByComponentSchema = z
  .object({
    componentId: z.number().int().positive().optional(),
    componentName: z.string().trim().min(1).optional(),
    minValue: z.number().optional(),
    maxValue: z.number().optional(),
    limit: z.number().int().min(1).max(MAX_LIMIT).optional().default(DEFAULT_LIMIT),
  })
  .refine((data) => data.componentId != null || data.componentName != null, {
    message: "componentId or componentName is required",
    path: ["componentId"],
  })
  .refine(
    (data) => {
      if (data.minValue == null || data.maxValue == null) return true;
      return data.minValue <= data.maxValue;
    },
    {
      message: "minValue must be less than or equal to maxValue",
      path: ["maxValue"],
    }
  );

export type FoodGetByComponentInput = z.infer<typeof foodGetByComponentSchema>;

export const foodGetFullDetailSchema = z.object({
  foodId: z.number().int().positive(),
});

export type FoodGetFullDetailInput = z.infer<typeof foodGetFullDetailSchema>;

export const foodGetByIdSchema = z.object({
  foodId: z.number().int().positive(),
});

export type FoodGetByIdInput = z.infer<typeof foodGetByIdSchema>;

export const componentSearchSchema = z.object({
  name: z.string().trim().min(1).optional(),
  limit: z.number().int().min(1).max(MAX_LIMIT).optional().default(DEFAULT_LIMIT),
});

export type ComponentSearchInput = z.infer<typeof componentSearchSchema>;

export interface FoodRecord {
  id: number;
  name: string;
  portion: string | null;
  portionUnit: string | null;
  description: string | null;
  image: string | null;
  ingredients: string | null;
  metadata: unknown;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: number | null;
  updatedBy: number | null;
  foodBrandId: number | null;
  foodBrandName: string | null;
  combined: boolean;
  generic: boolean;
}

export interface FoodComponentRecord {
  id: number;
  componentId: number;
  componentName: string;
  componentCode: string | null;
  value: string;
  measure: string | null;
  details: unknown;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface FoodDetailRecord extends FoodRecord {
  components: FoodComponentRecord[];
}

export interface ComponentRecord {
  id: number;
  name: string;
  measure: string | null;
  code: string | null;
}
