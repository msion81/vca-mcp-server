import { z } from "zod";

export const foodIntakeDayFeedbackGetByFoodPlanSchema = z.object({
  coachId: z.number().int().positive(),
  foodPlanId: z.number().int().positive(),
  startDay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD").optional(),
  endDay: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD").optional(),
});

export type FoodIntakeDayFeedbackGetByFoodPlanInput = z.infer<
  typeof foodIntakeDayFeedbackGetByFoodPlanSchema
>;

export interface FoodIntakeCommentDayRecord {
  id: number;
  foodIntakeId: number;
  day: string;
  comment: string;
  createdAt: string | null;
}

export interface FoodIntakePhotoDayRecord {
  id: number;
  foodIntakeId: number;
  day: string;
  photoUrl: string;
  photoThumbnail: string | null;
  createdAt: string | null;
}

export interface FoodIntakeStarRatingDayRecord {
  id: number;
  foodIntakeId: number;
  day: string;
  rating: number;
  createdAt: string | null;
}

export interface FoodIntakeDayFeedback {
  comments: FoodIntakeCommentDayRecord[];
  photos: FoodIntakePhotoDayRecord[];
  ratings: FoodIntakeStarRatingDayRecord[];
}
