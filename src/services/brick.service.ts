import { and, eq, ilike } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  component,
  food,
  foodComponent,
  foodEquivalence,
  foodEquivalenceDetail,
} from "../db/schema/index.js";
import type {
  BrickAddFoodInput,
  BrickComponentFact,
  BrickCreateInput,
  BrickDetailRecord,
  BrickFoodRecord,
  BrickGetDetailInput,
  BrickRecord,
  BrickRemoveFoodInput,
  BrickSearchInput,
  BrickSetComponentsInput,
  BrickUpdateInput,
} from "../schemas/brick.js";
import { error, success, type ToolResponse } from "../types/responses.js";

function toBrickRecord(row: typeof foodEquivalence.$inferSelect): BrickRecord {
  return {
    id: row.id,
    userRolesId: row.userRolesId,
    name: row.name,
    mainComponent: row.mainComponent,
    maxSearchThreshold: row.maxSearchThreshold,
    avgComponent: row.avgComponent,
    tag: row.tag,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    createdBy: row.createdBy,
    updatedBy: row.updatedBy,
    amount: row.amount,
    displayName: row.displayName,
    description: row.description,
    image: row.image,
    metadata: row.metadata,
    active: row.active,
  };
}

function parseNumeric(value: string | null): number {
  if (value == null) return 0;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeManualFacts(avgComponent: unknown): BrickComponentFact[] {
  const manualFacts: BrickComponentFact[] = [];

  if (Array.isArray(avgComponent)) {
    avgComponent.forEach((item, index) => {
      if (typeof item !== "object" || item == null) return;
      const maybe = item as Record<string, unknown>;
      const rawValue = maybe.value;
      if (typeof rawValue !== "number" || !Number.isFinite(rawValue)) return;
      const componentId =
        typeof maybe.componentId === "number" && Number.isFinite(maybe.componentId)
          ? maybe.componentId
          : -(index + 1);
      manualFacts.push({
        componentId,
        componentName:
          typeof maybe.componentName === "string"
            ? maybe.componentName
            : `manual_${index + 1}`,
        componentCode:
          typeof maybe.componentCode === "string" ? maybe.componentCode : null,
        measure: typeof maybe.measure === "string" ? maybe.measure : null,
        value: rawValue,
        source: "manual",
      });
    });

    return manualFacts;
  }

  if (typeof avgComponent === "object" && avgComponent != null) {
    Object.entries(avgComponent as Record<string, unknown>).forEach(
      ([key, value], index) => {
        if (typeof value !== "number" || !Number.isFinite(value)) return;
        const parsedComponentId = Number.parseInt(key, 10);
        manualFacts.push({
          componentId: Number.isFinite(parsedComponentId)
            ? parsedComponentId
            : -(index + 1),
          componentName: key,
          componentCode: null,
          measure: null,
          value,
          source: "manual",
        });
      }
    );

    return manualFacts;
  }

  return [];
}

function mergeFacts(
  computedFacts: BrickComponentFact[],
  manualFacts: BrickComponentFact[]
): BrickComponentFact[] {
  const merged = new Map<number, BrickComponentFact>();
  for (const fact of computedFacts) merged.set(fact.componentId, fact);
  for (const fact of manualFacts) merged.set(fact.componentId, fact);
  return Array.from(merged.values()).sort((a, b) =>
    a.componentName.localeCompare(b.componentName)
  );
}

async function getOwnedBrick(
  coachId: number,
  brickId: number
): Promise<typeof foodEquivalence.$inferSelect | null> {
  if (!db) return null;
  const [row] = await db
    .select()
    .from(foodEquivalence)
    .where(and(eq(foodEquivalence.id, brickId), eq(foodEquivalence.userRolesId, coachId)))
    .limit(1);
  return row ?? null;
}

export const brickService = {
  search: async (
    input: BrickSearchInput
  ): Promise<ToolResponse<BrickRecord[]>> => {
    if (!db) return error("Database not configured");

    try {
      const conditions = [eq(foodEquivalence.userRolesId, input.coachId)];
      if (input.name != null) conditions.push(ilike(foodEquivalence.name, `%${input.name}%`));

      const rows = await db
        .select()
        .from(foodEquivalence)
        .where(and(...conditions))
        .limit(input.limit)
        .offset(input.offset);

      return success(rows.map(toBrickRecord));
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to search bricks");
    }
  },

  getDetail: async (
    input: BrickGetDetailInput
  ): Promise<ToolResponse<BrickDetailRecord | null>> => {
    if (!db) return error("Database not configured");

    try {
      const row = await getOwnedBrick(input.coachId, input.brickId);
      if (!row) return success(null);

      const foodsRows = await db
        .select({
          detailId: foodEquivalenceDetail.id,
          foodId: foodEquivalenceDetail.foodId,
          foodName: food.name,
          amount: foodEquivalenceDetail.amount,
          measure: foodEquivalenceDetail.measure,
          component: foodEquivalenceDetail.component,
        })
        .from(foodEquivalenceDetail)
        .innerJoin(food, eq(food.id, foodEquivalenceDetail.foodId))
        .where(eq(foodEquivalenceDetail.foodEquivalenceId, input.brickId));

      const foods: BrickFoodRecord[] = foodsRows.map((item) => ({
        detailId: item.detailId,
        foodId: item.foodId,
        foodName: item.foodName,
        amount: item.amount,
        measure: item.measure,
        component: item.component,
      }));

      const factRows = await db
        .select({
          componentId: component.id,
          componentName: component.name,
          componentCode: component.code,
          measure: component.measure,
          value: foodComponent.value,
          amount: foodEquivalenceDetail.amount,
        })
        .from(foodEquivalenceDetail)
        .innerJoin(foodComponent, eq(foodComponent.foodId, foodEquivalenceDetail.foodId))
        .innerJoin(component, eq(component.id, foodComponent.componentId))
        .where(eq(foodEquivalenceDetail.foodEquivalenceId, input.brickId));

      const computedById = new Map<number, BrickComponentFact>();
      for (const item of factRows) {
        const amount = item.amount ?? 0;
        const current = computedById.get(item.componentId);
        const computedValue = parseNumeric(item.value) * amount;
        if (!current) {
          computedById.set(item.componentId, {
            componentId: item.componentId,
            componentName: item.componentName,
            componentCode: item.componentCode,
            measure: item.measure,
            value: computedValue,
            source: "computed",
          });
          continue;
        }
        current.value += computedValue;
      }

      const computedFacts = Array.from(computedById.values()).sort((a, b) =>
        a.componentName.localeCompare(b.componentName)
      );
      const manualFacts = normalizeManualFacts(row.avgComponent);
      const facts = mergeFacts(computedFacts, manualFacts);

      return success({
        ...toBrickRecord(row),
        foods,
        computedFacts,
        facts,
      });
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to get brick detail");
    }
  },

  create: async (
    input: BrickCreateInput
  ): Promise<ToolResponse<BrickRecord>> => {
    if (!db) return error("Database not configured");

    try {
      const [created] = await db
        .insert(foodEquivalence)
        .values({
          userRolesId: input.coachId,
          name: input.name,
          amount: input.amount,
          displayName: input.displayName,
          description: input.description,
          image: input.image,
          mainComponent: input.mainComponent,
          maxSearchThreshold: input.maxSearchThreshold,
          tag: input.tag,
          metadata: input.metadata,
          active: input.active,
        })
        .returning();

      return success(toBrickRecord(created));
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to create brick");
    }
  },

  update: async (
    input: BrickUpdateInput
  ): Promise<ToolResponse<BrickRecord | null>> => {
    if (!db) return error("Database not configured");

    try {
      const current = await getOwnedBrick(input.coachId, input.brickId);
      if (!current) return success(null);

      const [updated] = await db
        .update(foodEquivalence)
        .set({
          name: input.name,
          amount: input.amount,
          displayName: input.displayName,
          description: input.description,
          image: input.image,
          mainComponent: input.mainComponent,
          maxSearchThreshold: input.maxSearchThreshold,
          tag: input.tag,
          metadata: input.metadata,
          active: input.active,
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(eq(foodEquivalence.id, input.brickId), eq(foodEquivalence.userRolesId, input.coachId))
        )
        .returning();

      return success(updated ? toBrickRecord(updated) : null);
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to update brick");
    }
  },

  addFood: async (
    input: BrickAddFoodInput
  ): Promise<ToolResponse<BrickFoodRecord | null>> => {
    if (!db) return error("Database not configured");

    try {
      const current = await getOwnedBrick(input.coachId, input.brickId);
      if (!current) return success(null);

      const [created] = await db
        .insert(foodEquivalenceDetail)
        .values({
          foodEquivalenceId: input.brickId,
          foodId: input.foodId,
          amount: input.amount,
          measure: input.measure,
          component: input.component,
        })
        .returning();

      const [foodRow] = await db
        .select({ name: food.name })
        .from(food)
        .where(eq(food.id, input.foodId))
        .limit(1);

      return success({
        detailId: created.id,
        foodId: created.foodId,
        foodName: foodRow?.name ?? "",
        amount: created.amount,
        measure: created.measure,
        component: created.component,
      });
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to add food to brick");
    }
  },

  removeFood: async (
    input: BrickRemoveFoodInput
  ): Promise<ToolResponse<{ removed: boolean }>> => {
    if (!db) return error("Database not configured");

    try {
      const current = await getOwnedBrick(input.coachId, input.brickId);
      if (!current) return success({ removed: false });

      const deletedRows = await db
        .delete(foodEquivalenceDetail)
        .where(
          and(
            eq(foodEquivalenceDetail.id, input.detailId),
            eq(foodEquivalenceDetail.foodEquivalenceId, input.brickId)
          )
        )
        .returning({ id: foodEquivalenceDetail.id });

      return success({ removed: deletedRows.length > 0 });
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to remove food from brick");
    }
  },

  setComponents: async (
    input: BrickSetComponentsInput
  ): Promise<ToolResponse<BrickRecord | null>> => {
    if (!db) return error("Database not configured");

    try {
      const current = await getOwnedBrick(input.coachId, input.brickId);
      if (!current) return success(null);

      const [updated] = await db
        .update(foodEquivalence)
        .set({
          avgComponent: input.avgComponent,
          updatedAt: new Date().toISOString(),
        })
        .where(
          and(eq(foodEquivalence.id, input.brickId), eq(foodEquivalence.userRolesId, input.coachId))
        )
        .returning();

      return success(updated ? toBrickRecord(updated) : null);
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to set brick components");
    }
  },
};
