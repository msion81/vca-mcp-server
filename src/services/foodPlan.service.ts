import { and, asc, eq, gte, inArray, lte } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  foodEquivalence,
  foodIntake,
  foodIntakeEquivalence,
  foodIntakeType,
  foodPlan,
} from "../db/schema/index.js";
import type {
  FoodPlanAddBrickToIntakeInput,
  FoodPlanAddIntakeInput,
  FoodPlanBrickRecord,
  FoodPlanCreateInput,
  FoodPlanFullRecord,
  FoodPlanGetByIdInput,
  FoodPlanGetFullInput,
  FoodPlanIntakeRecord,
  FoodPlanRecord,
  FoodPlanRemoveBrickFromIntakeInput,
  FoodPlanRemoveIntakeInput,
  FoodPlanSearchInput,
  FoodPlanUpdateInput,
  IntakeTypeRecord,
} from "../schemas/foodPlan.js";
import { error, success, type ToolResponse } from "../types/responses.js";

function toFoodPlanRecord(row: typeof foodPlan.$inferSelect): FoodPlanRecord {
  return {
    id: row.id,
    name: row.name,
    userRolesId: row.userRolesId,
    goals: row.goals,
    recommendations: row.recommendations,
    notes: row.notes,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    createdBy: row.createdBy,
    updatedBy: row.updatedBy,
    athleteId: row.athleteId,
    startDate: row.startDate,
    endDate: row.endDate,
    status: row.status,
    component: row.component,
  };
}

async function getOwnedFoodPlan(
  coachId: number,
  foodPlanId: number
): Promise<typeof foodPlan.$inferSelect | null> {
  if (!db) return null;
  const [row] = await db
    .select()
    .from(foodPlan)
    .where(and(eq(foodPlan.id, foodPlanId), eq(foodPlan.userRolesId, coachId)))
    .limit(1);
  return row ?? null;
}

async function getOwnedIntake(
  coachId: number,
  foodIntakeId: number
): Promise<typeof foodIntake.$inferSelect | null> {
  if (!db) return null;
  const rows = await db
    .select({
      id: foodIntake.id,
      name: foodIntake.name,
      foodPlanId: foodIntake.foodPlanId,
      foodIntakeTypeId: foodIntake.foodIntakeTypeId,
      description: foodIntake.description,
      notes: foodIntake.notes,
      createdAt: foodIntake.createdAt,
      updatedAt: foodIntake.updatedAt,
      createdBy: foodIntake.createdBy,
      updatedBy: foodIntake.updatedBy,
      weekDay: foodIntake.weekDay,
      order: foodIntake.order,
    })
    .from(foodIntake)
    .innerJoin(foodPlan, eq(foodPlan.id, foodIntake.foodPlanId))
    .where(and(eq(foodIntake.id, foodIntakeId), eq(foodPlan.userRolesId, coachId)))
    .limit(1);

  return rows[0] ?? null;
}

export const foodPlanService = {
  search: async (
    input: FoodPlanSearchInput
  ): Promise<ToolResponse<FoodPlanRecord[]>> => {
    if (!db) return error("Database not configured");

    try {
      const conditions = [eq(foodPlan.userRolesId, input.coachId)];
      if (input.athleteId != null) conditions.push(eq(foodPlan.athleteId, input.athleteId));
      if (input.status != null) conditions.push(eq(foodPlan.status, input.status));
      if (input.startDate != null) conditions.push(gte(foodPlan.startDate, input.startDate));
      if (input.endDate != null) conditions.push(lte(foodPlan.endDate, input.endDate));

      const rows = await db
        .select()
        .from(foodPlan)
        .where(and(...conditions))
        .orderBy(asc(foodPlan.startDate), asc(foodPlan.id))
        .limit(input.limit);

      return success(rows.map(toFoodPlanRecord));
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to search food plans");
    }
  },

  getById: async (
    input: FoodPlanGetByIdInput
  ): Promise<ToolResponse<FoodPlanRecord | null>> => {
    if (!db) return error("Database not configured");

    try {
      const row = await getOwnedFoodPlan(input.coachId, input.foodPlanId);
      if (!row) return success(null);
      return success(toFoodPlanRecord(row));
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to get food plan");
    }
  },

  getFull: async (
    input: FoodPlanGetFullInput
  ): Promise<ToolResponse<FoodPlanFullRecord | null>> => {
    if (!db) return error("Database not configured");

    try {
      const row = await getOwnedFoodPlan(input.coachId, input.foodPlanId);
      if (!row) return success(null);

      const intakeRows = await db
        .select({
          id: foodIntake.id,
          name: foodIntake.name,
          foodPlanId: foodIntake.foodPlanId,
          foodIntakeTypeId: foodIntake.foodIntakeTypeId,
          foodIntakeTypeName: foodIntakeType.name,
          description: foodIntake.description,
          notes: foodIntake.notes,
          createdAt: foodIntake.createdAt,
          updatedAt: foodIntake.updatedAt,
          createdBy: foodIntake.createdBy,
          updatedBy: foodIntake.updatedBy,
          weekDay: foodIntake.weekDay,
          order: foodIntake.order,
        })
        .from(foodIntake)
        .innerJoin(foodIntakeType, eq(foodIntakeType.id, foodIntake.foodIntakeTypeId))
        .where(eq(foodIntake.foodPlanId, input.foodPlanId))
        .orderBy(asc(foodIntake.weekDay), asc(foodIntake.order), asc(foodIntake.id));

      const intakeIds = intakeRows.map((item) => item.id);
      const intakeBricksMap = new Map<number, FoodPlanBrickRecord[]>();

      if (intakeIds.length > 0) {
        const intakeBrickRows = await db
          .select({
            id: foodIntakeEquivalence.id,
            foodIntakeId: foodIntakeEquivalence.foodIntakeId,
            order: foodIntakeEquivalence.order,
            brickId: foodEquivalence.id,
            brickName: foodEquivalence.name,
            brickDisplayName: foodEquivalence.displayName,
            brickAmount: foodEquivalence.amount,
            brickMainComponent: foodEquivalence.mainComponent,
            brickAvgComponent: foodEquivalence.avgComponent,
          })
          .from(foodIntakeEquivalence)
          .innerJoin(foodEquivalence, eq(foodEquivalence.id, foodIntakeEquivalence.foodEquivalenceId))
          .where(inArray(foodIntakeEquivalence.foodIntakeId, intakeIds))
          .orderBy(asc(foodIntakeEquivalence.order), asc(foodIntakeEquivalence.id));

        for (const intakeBrick of intakeBrickRows) {
          const current = intakeBricksMap.get(intakeBrick.foodIntakeId) ?? [];
          current.push({
            id: intakeBrick.id,
            order: intakeBrick.order,
            brickId: intakeBrick.brickId,
            brickName: intakeBrick.brickName,
            brickDisplayName: intakeBrick.brickDisplayName,
            brickAmount: intakeBrick.brickAmount,
            brickMainComponent: intakeBrick.brickMainComponent,
            brickAvgComponent: intakeBrick.brickAvgComponent,
          });
          intakeBricksMap.set(intakeBrick.foodIntakeId, current);
        }
      }

      const intakes: FoodPlanIntakeRecord[] = intakeRows.map((item) => ({
        id: item.id,
        name: item.name,
        foodPlanId: item.foodPlanId,
        foodIntakeTypeId: item.foodIntakeTypeId,
        foodIntakeTypeName: item.foodIntakeTypeName,
        description: item.description,
        notes: item.notes,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        createdBy: item.createdBy,
        updatedBy: item.updatedBy,
        weekDay: item.weekDay,
        order: item.order,
        bricks: intakeBricksMap.get(item.id) ?? [],
      }));

      return success({
        ...toFoodPlanRecord(row),
        intakes,
      });
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to get full food plan");
    }
  },

  create: async (
    input: FoodPlanCreateInput
  ): Promise<ToolResponse<FoodPlanRecord>> => {
    if (!db) return error("Database not configured");

    try {
      const [created] = await db
        .insert(foodPlan)
        .values({
          userRolesId: input.coachId,
          athleteId: input.athleteId,
          name: input.name,
          goals: input.goals,
          recommendations: input.recommendations,
          notes: input.notes,
          startDate: input.startDate,
          endDate: input.endDate,
          status: input.status,
          component: input.component,
        })
        .returning();

      return success(toFoodPlanRecord(created));
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to create food plan");
    }
  },

  update: async (
    input: FoodPlanUpdateInput
  ): Promise<ToolResponse<FoodPlanRecord | null>> => {
    if (!db) return error("Database not configured");

    try {
      const current = await getOwnedFoodPlan(input.coachId, input.foodPlanId);
      if (!current) return success(null);

      const [updated] = await db
        .update(foodPlan)
        .set({
          athleteId: input.athleteId,
          name: input.name,
          goals: input.goals,
          recommendations: input.recommendations,
          notes: input.notes,
          startDate: input.startDate,
          endDate: input.endDate,
          status: input.status,
          component: input.component,
          updatedAt: new Date().toISOString(),
        })
        .where(and(eq(foodPlan.id, input.foodPlanId), eq(foodPlan.userRolesId, input.coachId)))
        .returning();

      return success(updated ? toFoodPlanRecord(updated) : null);
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to update food plan");
    }
  },

  addIntake: async (
    input: FoodPlanAddIntakeInput
  ): Promise<ToolResponse<FoodPlanIntakeRecord | null>> => {
    if (!db) return error("Database not configured");

    try {
      const current = await getOwnedFoodPlan(input.coachId, input.foodPlanId);
      if (!current) return success(null);

      const [created] = await db
        .insert(foodIntake)
        .values({
          foodPlanId: input.foodPlanId,
          weekDay: input.weekDay,
          foodIntakeTypeId: input.foodIntakeTypeId,
          name: input.name,
          description: input.description,
          notes: input.notes,
          order: input.order,
        })
        .returning();

      const [typeRow] = await db
        .select({ name: foodIntakeType.name })
        .from(foodIntakeType)
        .where(eq(foodIntakeType.id, created.foodIntakeTypeId))
        .limit(1);

      return success({
        id: created.id,
        name: created.name,
        foodPlanId: created.foodPlanId,
        foodIntakeTypeId: created.foodIntakeTypeId,
        foodIntakeTypeName: typeRow?.name ?? null,
        description: created.description,
        notes: created.notes,
        createdAt: created.createdAt,
        updatedAt: created.updatedAt,
        createdBy: created.createdBy,
        updatedBy: created.updatedBy,
        weekDay: created.weekDay,
        order: created.order,
        bricks: [],
      });
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to add intake");
    }
  },

  removeIntake: async (
    input: FoodPlanRemoveIntakeInput
  ): Promise<ToolResponse<{ removed: boolean }>> => {
    if (!db) return error("Database not configured");

    try {
      const current = await getOwnedFoodPlan(input.coachId, input.foodPlanId);
      if (!current) return success({ removed: false });

      const deletedRows = await db
        .delete(foodIntake)
        .where(and(eq(foodIntake.id, input.foodIntakeId), eq(foodIntake.foodPlanId, input.foodPlanId)))
        .returning({ id: foodIntake.id });

      return success({ removed: deletedRows.length > 0 });
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to remove intake");
    }
  },

  addBrickToIntake: async (
    input: FoodPlanAddBrickToIntakeInput
  ): Promise<ToolResponse<FoodPlanBrickRecord | null>> => {
    if (!db) return error("Database not configured");

    try {
      const currentIntake = await getOwnedIntake(input.coachId, input.foodIntakeId);
      if (!currentIntake) return success(null);

      const [ownedBrick] = await db
        .select()
        .from(foodEquivalence)
        .where(and(eq(foodEquivalence.id, input.brickId), eq(foodEquivalence.userRolesId, input.coachId)))
        .limit(1);

      if (!ownedBrick) return success(null);

      const [created] = await db
        .insert(foodIntakeEquivalence)
        .values({
          foodIntakeId: input.foodIntakeId,
          foodEquivalenceId: input.brickId,
          order: input.order,
        })
        .returning();

      return success({
        id: created.id,
        order: created.order,
        brickId: ownedBrick.id,
        brickName: ownedBrick.name,
        brickDisplayName: ownedBrick.displayName,
        brickAmount: ownedBrick.amount,
        brickMainComponent: ownedBrick.mainComponent,
        brickAvgComponent: ownedBrick.avgComponent,
      });
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to add brick to intake");
    }
  },

  removeBrickFromIntake: async (
    input: FoodPlanRemoveBrickFromIntakeInput
  ): Promise<ToolResponse<{ removed: boolean }>> => {
    if (!db) return error("Database not configured");

    try {
      const currentIntake = await getOwnedIntake(input.coachId, input.foodIntakeId);
      if (!currentIntake) return success({ removed: false });

      const deletedRows = await db
        .delete(foodIntakeEquivalence)
        .where(
          and(
            eq(foodIntakeEquivalence.id, input.foodIntakeEquivalenceId),
            eq(foodIntakeEquivalence.foodIntakeId, input.foodIntakeId)
          )
        )
        .returning({ id: foodIntakeEquivalence.id });

      return success({ removed: deletedRows.length > 0 });
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to remove brick from intake");
    }
  },

  listIntakeTypes: async (): Promise<ToolResponse<IntakeTypeRecord[]>> => {
    if (!db) return error("Database not configured");

    try {
      const rows = await db
        .select()
        .from(foodIntakeType)
        .orderBy(asc(foodIntakeType.name), asc(foodIntakeType.id));

      return success(rows.map((row) => ({ id: row.id, name: row.name })));
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to list intake types");
    }
  },
};
