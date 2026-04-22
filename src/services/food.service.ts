import { and, asc, eq, gte, ilike, isNotNull, lte, sql } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { db } from "../db/index.js";
import { component, food, foodBrand, foodComponent } from "../db/schema/index.js";
import type {
  ComponentRecord,
  ComponentSearchInput,
  FoodComponentRecord,
  FoodDetailRecord,
  FoodGetAllCombinedInput,
  FoodGetAllGenericInput,
  FoodGetAllManufacturedInput,
  FoodGetByComponentInput,
  FoodGetByIdInput,
  FoodGetFullDetailInput,
  FoodRecord,
  FoodSearchByNameInput,
} from "../schemas/food.js";
import { error, success, type ToolResponse } from "../types/responses.js";

function toFoodRecord(row: {
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
  combined: boolean | null;
  generic: boolean | null;
}): FoodRecord {
  return {
    id: row.id,
    name: row.name,
    portion: row.portion,
    portionUnit: row.portionUnit,
    description: row.description,
    image: row.image,
    ingredients: row.ingredients,
    metadata: row.metadata,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    createdBy: row.createdBy,
    updatedBy: row.updatedBy,
    foodBrandId: row.foodBrandId,
    foodBrandName: row.foodBrandName,
    combined: row.combined ?? false,
    generic: row.generic ?? false,
  };
}

function toFoodComponentRecord(row: {
  id: number;
  componentId: number;
  componentName: string;
  componentCode: string | null;
  value: string;
  measure: string | null;
  details: unknown;
  createdAt: string | null;
  updatedAt: string | null;
}): FoodComponentRecord {
  return {
    id: row.id,
    componentId: row.componentId,
    componentName: row.componentName,
    componentCode: row.componentCode,
    value: row.value,
    measure: row.measure,
    details: row.details,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export const foodService = {
  searchByName: async (
    input: FoodSearchByNameInput
  ): Promise<ToolResponse<FoodRecord[]>> => {
    if (!db) return error("Database not configured");

    try {
      const rows = await db
        .select({
          id: food.id,
          name: food.name,
          portion: food.portion,
          portionUnit: food.portionUnit,
          description: food.description,
          image: food.image,
          ingredients: food.ingredients,
          metadata: food.metadata,
          createdAt: food.createdAt,
          updatedAt: food.updatedAt,
          createdBy: food.createdBy,
          updatedBy: food.updatedBy,
          foodBrandId: food.foodBrandId,
          foodBrandName: foodBrand.name,
          combined: food.combined,
          generic: food.generic,
        })
        .from(food)
        .leftJoin(foodBrand, eq(food.foodBrandId, foodBrand.id))
        .where(ilike(food.name, `%${input.name}%`))
        .orderBy(asc(food.name))
        .limit(input.limit);

      return success(rows.map(toFoodRecord));
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to search food by name");
    }
  },

  getAllGeneric: async (
    input: FoodGetAllGenericInput
  ): Promise<ToolResponse<FoodRecord[]>> => {
    if (!db) return error("Database not configured");

    try {
      const rows = await db
        .select({
          id: food.id,
          name: food.name,
          portion: food.portion,
          portionUnit: food.portionUnit,
          description: food.description,
          image: food.image,
          ingredients: food.ingredients,
          metadata: food.metadata,
          createdAt: food.createdAt,
          updatedAt: food.updatedAt,
          createdBy: food.createdBy,
          updatedBy: food.updatedBy,
          foodBrandId: food.foodBrandId,
          foodBrandName: foodBrand.name,
          combined: food.combined,
          generic: food.generic,
        })
        .from(food)
        .leftJoin(foodBrand, eq(food.foodBrandId, foodBrand.id))
        .where(and(eq(food.generic, true), eq(food.combined, false)))
        .orderBy(asc(food.name))
        .limit(input.limit)
        .offset(input.offset);

      return success(rows.map(toFoodRecord));
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to get generic food");
    }
  },

  getAllCombined: async (
    input: FoodGetAllCombinedInput
  ): Promise<ToolResponse<FoodRecord[]>> => {
    if (!db) return error("Database not configured");

    try {
      const rows = await db
        .select({
          id: food.id,
          name: food.name,
          portion: food.portion,
          portionUnit: food.portionUnit,
          description: food.description,
          image: food.image,
          ingredients: food.ingredients,
          metadata: food.metadata,
          createdAt: food.createdAt,
          updatedAt: food.updatedAt,
          createdBy: food.createdBy,
          updatedBy: food.updatedBy,
          foodBrandId: food.foodBrandId,
          foodBrandName: foodBrand.name,
          combined: food.combined,
          generic: food.generic,
        })
        .from(food)
        .leftJoin(foodBrand, eq(food.foodBrandId, foodBrand.id))
        .where(eq(food.combined, true))
        .orderBy(asc(food.name))
        .limit(input.limit)
        .offset(input.offset);

      return success(rows.map(toFoodRecord));
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to get combined food");
    }
  },

  getAllManufactured: async (
    input: FoodGetAllManufacturedInput
  ): Promise<ToolResponse<FoodRecord[]>> => {
    if (!db) return error("Database not configured");

    try {
      const conditions: SQL<unknown>[] = [
        eq(food.generic, false),
        eq(food.combined, false),
        isNotNull(food.foodBrandId),
      ];

      if (input.brandId != null) conditions.push(eq(food.foodBrandId, input.brandId));

      const rows = await db
        .select({
          id: food.id,
          name: food.name,
          portion: food.portion,
          portionUnit: food.portionUnit,
          description: food.description,
          image: food.image,
          ingredients: food.ingredients,
          metadata: food.metadata,
          createdAt: food.createdAt,
          updatedAt: food.updatedAt,
          createdBy: food.createdBy,
          updatedBy: food.updatedBy,
          foodBrandId: food.foodBrandId,
          foodBrandName: foodBrand.name,
          combined: food.combined,
          generic: food.generic,
        })
        .from(food)
        .leftJoin(foodBrand, eq(food.foodBrandId, foodBrand.id))
        .where(and(...conditions))
        .orderBy(asc(food.name))
        .limit(input.limit)
        .offset(input.offset);

      return success(rows.map(toFoodRecord));
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to get manufactured food");
    }
  },

  getByComponent: async (
    input: FoodGetByComponentInput
  ): Promise<ToolResponse<FoodRecord[]>> => {
    if (!db) return error("Database not configured");

    try {
      const conditions: SQL<unknown>[] = [];

      if (input.componentId != null) conditions.push(eq(foodComponent.componentId, input.componentId));

      if (input.componentName != null)
        conditions.push(ilike(component.name, `%${input.componentName}%`));

      if (input.minValue != null || input.maxValue != null)
        conditions.push(sql`${foodComponent.value} ~ '^-?[0-9]+(\\.[0-9]+)?$'`);

      if (input.minValue != null)
        conditions.push(
          gte(sql<number>`(${foodComponent.value})::numeric`, input.minValue)
        );

      if (input.maxValue != null)
        conditions.push(
          lte(sql<number>`(${foodComponent.value})::numeric`, input.maxValue)
        );

      const rows = await db
        .select({
          id: food.id,
          name: food.name,
          portion: food.portion,
          portionUnit: food.portionUnit,
          description: food.description,
          image: food.image,
          ingredients: food.ingredients,
          metadata: food.metadata,
          createdAt: food.createdAt,
          updatedAt: food.updatedAt,
          createdBy: food.createdBy,
          updatedBy: food.updatedBy,
          foodBrandId: food.foodBrandId,
          foodBrandName: foodBrand.name,
          combined: food.combined,
          generic: food.generic,
        })
        .from(foodComponent)
        .innerJoin(food, eq(foodComponent.foodId, food.id))
        .innerJoin(component, eq(foodComponent.componentId, component.id))
        .leftJoin(foodBrand, eq(food.foodBrandId, foodBrand.id))
        .where(and(...conditions))
        .orderBy(asc(food.name))
        .limit(input.limit);

      const uniqueRows = new Map<number, FoodRecord>();
      for (const row of rows) uniqueRows.set(row.id, toFoodRecord(row));

      return success(Array.from(uniqueRows.values()));
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to get food by component");
    }
  },

  getFullDetail: async (
    input: FoodGetFullDetailInput
  ): Promise<ToolResponse<FoodDetailRecord | null>> => {
    if (!db) return error("Database not configured");

    try {
      const [foodRow] = await db
        .select({
          id: food.id,
          name: food.name,
          portion: food.portion,
          portionUnit: food.portionUnit,
          description: food.description,
          image: food.image,
          ingredients: food.ingredients,
          metadata: food.metadata,
          createdAt: food.createdAt,
          updatedAt: food.updatedAt,
          createdBy: food.createdBy,
          updatedBy: food.updatedBy,
          foodBrandId: food.foodBrandId,
          foodBrandName: foodBrand.name,
          combined: food.combined,
          generic: food.generic,
        })
        .from(food)
        .leftJoin(foodBrand, eq(food.foodBrandId, foodBrand.id))
        .where(eq(food.id, input.foodId))
        .limit(1);

      if (!foodRow) return success(null);

      const componentRows = await db
        .select({
          id: foodComponent.id,
          componentId: foodComponent.componentId,
          componentName: component.name,
          componentCode: component.code,
          value: foodComponent.value,
          measure: foodComponent.measure,
          details: foodComponent.details,
          createdAt: foodComponent.createdAt,
          updatedAt: foodComponent.updatedAt,
        })
        .from(foodComponent)
        .innerJoin(component, eq(foodComponent.componentId, component.id))
        .where(eq(foodComponent.foodId, input.foodId))
        .orderBy(asc(component.name));

      return success({
        ...toFoodRecord(foodRow),
        components: componentRows.map(toFoodComponentRecord),
      });
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to get full food detail");
    }
  },

  getById: async (input: FoodGetByIdInput): Promise<ToolResponse<FoodRecord | null>> => {
    if (!db) return error("Database not configured");

    try {
      const [row] = await db
        .select({
          id: food.id,
          name: food.name,
          portion: food.portion,
          portionUnit: food.portionUnit,
          description: food.description,
          image: food.image,
          ingredients: food.ingredients,
          metadata: food.metadata,
          createdAt: food.createdAt,
          updatedAt: food.updatedAt,
          createdBy: food.createdBy,
          updatedBy: food.updatedBy,
          foodBrandId: food.foodBrandId,
          foodBrandName: foodBrand.name,
          combined: food.combined,
          generic: food.generic,
        })
        .from(food)
        .leftJoin(foodBrand, eq(food.foodBrandId, foodBrand.id))
        .where(eq(food.id, input.foodId))
        .limit(1);

      return success(row ? toFoodRecord(row) : null);
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to get food by id");
    }
  },

  componentSearch: async (
    input: ComponentSearchInput
  ): Promise<ToolResponse<ComponentRecord[]>> => {
    if (!db) return error("Database not configured");

    try {
      const rows = await db
        .select({
          id: component.id,
          name: component.name,
          measure: component.measure,
          code: component.code,
        })
        .from(component)
        .where(input.name != null ? ilike(component.name, `%${input.name}%`) : undefined)
        .orderBy(asc(component.name))
        .limit(input.limit);

      return success(rows);
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to search components");
    }
  },
};
