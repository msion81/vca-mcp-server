import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  foodIntake,
  foodIntakeCommentDay,
  foodIntakePhotoDay,
  foodIntakeStarRatingDay,
  foodPlan,
} from "../db/schema/index.js";
import type {
  FoodIntakeDayFeedback,
  FoodIntakeDayFeedbackGetByFoodPlanInput,
} from "../schemas/foodIntakeDayFeedback.js";
import { error, success, type ToolResponse } from "../types/responses.js";

export const foodIntakeDayFeedbackService = {
  getByFoodPlan: async (
    input: FoodIntakeDayFeedbackGetByFoodPlanInput
  ): Promise<ToolResponse<FoodIntakeDayFeedback | null>> => {
    if (!db) return error("Database not configured");

    try {
      const [ownedPlan] = await db
        .select({ id: foodPlan.id })
        .from(foodPlan)
        .where(and(eq(foodPlan.id, input.foodPlanId), eq(foodPlan.userRolesId, input.coachId)))
        .limit(1);

      if (!ownedPlan) return success(null);

      const intakeRows = await db
        .select({ id: foodIntake.id })
        .from(foodIntake)
        .where(eq(foodIntake.foodPlanId, input.foodPlanId));

      const intakeIds = intakeRows.map((row) => row.id);
      if (intakeIds.length === 0) return success({ comments: [], photos: [], ratings: [] });

      const [comments, photos, ratings] = await Promise.all([
        db
          .select({
            id: foodIntakeCommentDay.id,
            foodIntakeId: foodIntakeCommentDay.foodIntakeId,
            day: foodIntakeCommentDay.day,
            comment: foodIntakeCommentDay.comment,
            createdAt: foodIntakeCommentDay.createdAt,
          })
          .from(foodIntakeCommentDay)
          .where(
            and(
              inArray(foodIntakeCommentDay.foodIntakeId, intakeIds),
              input.startDay != null ? gte(foodIntakeCommentDay.day, input.startDay) : undefined,
              input.endDay != null ? lte(foodIntakeCommentDay.day, input.endDay) : undefined
            )
          ),
        db
          .select({
            id: foodIntakePhotoDay.id,
            foodIntakeId: foodIntakePhotoDay.foodIntakeId,
            day: foodIntakePhotoDay.day,
            photoUrl: foodIntakePhotoDay.photoUrl,
            photoThumbnail: foodIntakePhotoDay.photoThumbnail,
            createdAt: foodIntakePhotoDay.createdAt,
          })
          .from(foodIntakePhotoDay)
          .where(
            and(
              inArray(foodIntakePhotoDay.foodIntakeId, intakeIds),
              input.startDay != null ? gte(foodIntakePhotoDay.day, input.startDay) : undefined,
              input.endDay != null ? lte(foodIntakePhotoDay.day, input.endDay) : undefined
            )
          ),
        db
          .select({
            id: foodIntakeStarRatingDay.id,
            foodIntakeId: foodIntakeStarRatingDay.foodIntakeId,
            day: foodIntakeStarRatingDay.day,
            rating: foodIntakeStarRatingDay.rating,
            createdAt: foodIntakeStarRatingDay.createdAt,
          })
          .from(foodIntakeStarRatingDay)
          .where(
            and(
              inArray(foodIntakeStarRatingDay.foodIntakeId, intakeIds),
              input.startDay != null ? gte(foodIntakeStarRatingDay.day, input.startDay) : undefined,
              input.endDay != null ? lte(foodIntakeStarRatingDay.day, input.endDay) : undefined
            )
          ),
      ]);

      return success({ comments, photos, ratings });
    } catch (err) {
      return error(err instanceof Error ? err.message : "Failed to get food intake day feedback");
    }
  },
};
