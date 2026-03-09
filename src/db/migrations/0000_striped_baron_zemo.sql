-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."food_plan_status" AS ENUM('active', 'inactive', 'draft');--> statement-breakpoint
CREATE TYPE "public"."foodplanstatus" AS ENUM('ACTIVE', 'INACTIVE', 'DRAFT');--> statement-breakpoint
CREATE TYPE "public"."gym_plan_status" AS ENUM('draft', 'active', 'completed', 'archived');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"sex" text DEFAULT 'm' NOT NULL,
	"birth_date" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"active" integer DEFAULT 0 NOT NULL,
	"timezone" text DEFAULT 'America/Argentina/Buenos_Aires' NOT NULL,
	"phone" text,
	"logo" text
);
--> statement-breakpoint
CREATE TABLE "appointment" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_roles_id" integer,
	"external_calendar_event_id" text,
	"external_calendar_id" integer,
	"athlete_id" integer,
	"start_date" timestamp,
	"end_date" timestamp,
	"duration_id" integer,
	"status" text,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"deleted_at" timestamp,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"opt_code" text DEFAULT '',
	CONSTRAINT "appointment_external_calendar_event_id_unique" UNIQUE("external_calendar_event_id")
);
--> statement-breakpoint
CREATE TABLE "appointment_duration" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_roles_id" integer,
	"name" text NOT NULL,
	"duration_min" integer DEFAULT 60 NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"color" text,
	"use_google_calendar" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "athlete" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"sex" text DEFAULT 'm' NOT NULL,
	"phone" text NOT NULL,
	"city" text,
	"state" text,
	"country" text DEFAULT 'arg' NOT NULL,
	"birthday" timestamp DEFAULT now(),
	"body_weight" real DEFAULT 0 NOT NULL,
	"height" real DEFAULT 0 NOT NULL,
	"metric_system_id" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"social_number" text,
	CONSTRAINT "athlete_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "activity_level" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activity_level_values" (
	"id" serial PRIMARY KEY NOT NULL,
	"activity_level_id" integer,
	"sex" text NOT NULL,
	"value" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"role_id" integer,
	"level" integer DEFAULT 1 NOT NULL,
	"metric_system_id" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"scopes" jsonb DEFAULT '{}'::jsonb,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "athlete_by_user_profile" (
	"id" serial PRIMARY KEY NOT NULL,
	"athlete_id" integer,
	"user_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "external_calendar" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_roles_id" integer,
	"calendar_id" text,
	"name" text,
	"active" integer DEFAULT 1 NOT NULL,
	"send_notifications" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "athlete_by_user_profile_role" (
	"id" serial PRIMARY KEY NOT NULL,
	"athlete_id" integer,
	"user_roles_id" integer,
	"period_start" timestamp DEFAULT now(),
	"period_end" timestamp DEFAULT now(),
	"active" integer DEFAULT 1 NOT NULL,
	"permissions" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "nutrition_assessment" (
	"id" serial PRIMARY KEY NOT NULL,
	"athlete_id" integer,
	"user_roles_id" integer,
	"notes" text,
	"goal" text,
	"activity_level" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"closed_at" timestamp DEFAULT now(),
	"is_auto_assessment" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "athlete_sports" (
	"id" serial PRIMARY KEY NOT NULL,
	"athlete_id" integer,
	"sport_id" integer
);
--> statement-breakpoint
CREATE TABLE "sports" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	CONSTRAINT "sports_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "availability" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_roles_id" integer,
	"week_day" text NOT NULL,
	"start_time" text NOT NULL,
	"end_time" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nutrition_assessment_answer" (
	"id" serial PRIMARY KEY NOT NULL,
	"nutrition_assessment_id" integer,
	"questionnaire_id" integer,
	"questionnaire_question_id" integer,
	"questionnaire_option_id" integer DEFAULT 0,
	"answer_text" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "questionnaire" (
	"id" serial PRIMARY KEY NOT NULL,
	"questionnaire_type_id" integer,
	"user_roles_id" integer,
	"name" text NOT NULL,
	"active" integer DEFAULT 1 NOT NULL,
	"delete" integer DEFAULT 0 NOT NULL,
	"system" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "questionnaire_question" (
	"id" serial PRIMARY KEY NOT NULL,
	"questionnaire_question_type_id" integer,
	"questionnaire_id" integer,
	"question_text" text NOT NULL,
	"active" integer DEFAULT 1 NOT NULL,
	"delete" integer DEFAULT 0 NOT NULL,
	"editable" integer DEFAULT 1 NOT NULL,
	"note" text,
	"order" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "nutrition_assessment_notes_by_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"nutrition_assessment_id" integer,
	"questionnaire_question_category_id" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "questionnaire_questions_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"sex" text DEFAULT 'f,m' NOT NULL,
	"active" integer DEFAULT 1 NOT NULL,
	"delete" integer DEFAULT 0 NOT NULL,
	"user_level" integer DEFAULT 1 NOT NULL,
	CONSTRAINT "questionnaire_questions_category_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "nutrition_intakes_plan" (
	"id" serial PRIMARY KEY NOT NULL,
	"athlete_id" integer,
	"user_roles_id" integer,
	"observation" text DEFAULT '',
	"notes" text DEFAULT '',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "nutrition_intake_day_plan" (
	"id" serial PRIMARY KEY NOT NULL,
	"nutrition_intakes_plan_id" integer,
	"days" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '',
	"observation" text DEFAULT '',
	"notes" text DEFAULT '',
	"kcal" integer DEFAULT 0,
	"protein" integer DEFAULT 0,
	"carbohydrate" integer DEFAULT 0,
	"fat" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "nutrition_intakes" (
	"id" serial PRIMARY KEY NOT NULL,
	"nutrition_intake_day_plan_id" integer,
	"name" text DEFAULT '' NOT NULL,
	"nutrition_intakes_type_id" integer,
	"kcal" integer DEFAULT 0,
	"protein" integer DEFAULT 0,
	"carbohydrate" integer DEFAULT 0,
	"fat" integer DEFAULT 0,
	"observation" text DEFAULT '',
	"notes" text DEFAULT '',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "nutrition_intakes_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"code" text DEFAULT '' NOT NULL,
	"description" text DEFAULT '',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "questionnaire_option" (
	"id" serial PRIMARY KEY NOT NULL,
	"questionnaire_question_id" integer,
	"option_text" text NOT NULL,
	"active" integer DEFAULT 1 NOT NULL,
	"delete" integer DEFAULT 0 NOT NULL,
	"editable" integer DEFAULT 1 NOT NULL,
	"order" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "questionnaire_question_by_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"questionnaire_question_id" integer,
	"questionnaire_questions_category_id" integer,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "questionnaire_question_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "questionnaire_question_type_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "questionnaire_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "role_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "component" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"measure" text,
	"code" text
);
--> statement-breakpoint
CREATE TABLE "food_component" (
	"id" serial PRIMARY KEY NOT NULL,
	"food_id" integer NOT NULL,
	"component_id" integer NOT NULL,
	"value" text NOT NULL,
	"measure" text,
	"details" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"created_by" integer,
	"updated_by" integer
);
--> statement-breakpoint
CREATE TABLE "food_equivalence_detail" (
	"id" serial PRIMARY KEY NOT NULL,
	"food_id" integer NOT NULL,
	"food_equivalence_id" integer NOT NULL,
	"amount" real DEFAULT 0,
	"measure" text,
	"component" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"created_by" integer,
	"updated_by" integer
);
--> statement-breakpoint
CREATE TABLE "food" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"portion" text,
	"portion_unit" text,
	"description" text,
	"image" text,
	"ingredients" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"created_by" integer,
	"updated_by" integer,
	"food_brand_id" integer,
	"combined" boolean DEFAULT false,
	"generic" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "food_equivalence" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_roles_id" integer,
	"name" text,
	"main_component" text,
	"max_search_threshold" text,
	"avg_component" jsonb DEFAULT '{}'::jsonb,
	"tag" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"created_by" integer,
	"updated_by" integer,
	"amount" real DEFAULT 0,
	"display_name" text,
	"description" text,
	"image" text,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "food_intake_type" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text
);
--> statement-breakpoint
CREATE TABLE "user_address" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"line_1" text,
	"line_2" text,
	"line_3" text,
	"city" text,
	"state" text,
	"post_code" text,
	"country" text,
	"is_primary" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"created_by" integer,
	"updated_by" integer
);
--> statement-breakpoint
CREATE TABLE "food_brand" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"website" text,
	"image" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"created_by" integer,
	"updated_by" integer
);
--> statement-breakpoint
CREATE TABLE "food_intake_equivalence" (
	"id" serial PRIMARY KEY NOT NULL,
	"food_intake_id" integer NOT NULL,
	"food_equivalence_id" integer NOT NULL,
	"order" real DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "food_intake" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"food_plan_id" integer NOT NULL,
	"food_intake_type_id" integer NOT NULL,
	"description" text,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"created_by" integer,
	"updated_by" integer,
	"week_day" text,
	"order" real DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "processed_data" (
	"id" serial PRIMARY KEY NOT NULL,
	"data_type" varchar,
	"content" json,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "food_plan" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"user_roles_id" integer,
	"goals" text,
	"recommendations" text,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"created_by" integer,
	"updated_by" integer,
	"athlete_id" integer,
	"start_date" text,
	"end_date" text,
	"status" "food_plan_status" DEFAULT 'draft',
	"component" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "athlete_snapshots" (
	"id" serial PRIMARY KEY NOT NULL,
	"athlete_id" integer,
	"description" text,
	"data" jsonb DEFAULT '{}'::jsonb,
	"file_path" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_social" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"social_net" text NOT NULL,
	"link" text NOT NULL,
	"is_public" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"created_by" integer,
	"updated_by" integer,
	"nickname" text
);
--> statement-breakpoint
CREATE TABLE "nutrition_assessment_medical_studies" (
	"id" serial PRIMARY KEY NOT NULL,
	"nutrition_assessment_id" integer,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"created_by" integer,
	"updated_by" integer,
	"athlete_medical_study_id" integer
);
--> statement-breakpoint
CREATE TABLE "athlete_medical_studies" (
	"id" serial PRIMARY KEY NOT NULL,
	"athlete_id" integer,
	"type" text,
	"study_date" timestamp,
	"description" text,
	"data" jsonb DEFAULT '{}'::jsonb,
	"file_path" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"created_by" integer,
	"updated_by" integer
);
--> statement-breakpoint
CREATE TABLE "conversation_status" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"last_read_message_id" integer,
	"unread_count" integer DEFAULT 0 NOT NULL,
	"is_muted" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"conversation_id" integer NOT NULL,
	"parent_message_id" integer,
	"sender_id" integer NOT NULL,
	"content" text NOT NULL,
	"mentions" jsonb DEFAULT '[]'::jsonb,
	"is_pinned" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "mention_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"message_id" integer NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"event_type" integer DEFAULT 1 NOT NULL,
	"sport_id" integer NOT NULL,
	"date" timestamp NOT NULL,
	"time" text NOT NULL,
	"timezone" text NOT NULL,
	"is_competition" boolean DEFAULT false NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"is_searchable" boolean DEFAULT true NOT NULL,
	"is_official" boolean DEFAULT false NOT NULL,
	"based_on" integer DEFAULT 1 NOT NULL,
	"time_based_value" text,
	"distance_based_value" real,
	"distance_based_unit" text,
	"location" text NOT NULL,
	"created_by" integer NOT NULL,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "event_participants" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer NOT NULL,
	"athlete_id" integer NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_by" integer NOT NULL,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "athlete_day_activity" (
	"id" serial PRIMARY KEY NOT NULL,
	"athlete_id" integer,
	"user_roles_id" integer,
	"nutrition_assessment_id" integer,
	"week_day" integer DEFAULT 0,
	"session" text DEFAULT '',
	"activity" text DEFAULT '',
	"duration" text DEFAULT '',
	"intensity" text DEFAULT '',
	"notes" text DEFAULT '',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"session_time" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "anthropometry" (
	"id" serial PRIMARY KEY NOT NULL,
	"athlete_id" integer,
	"user_roles_id" integer,
	"nutrition_assessment_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"reference_bone_mass" real DEFAULT 0,
	"basic_weight" real DEFAULT 0,
	"basic_height" real DEFAULT 0,
	"basic_heated_height" real DEFAULT 0,
	"diameter_biacromial" real DEFAULT 0,
	"diameter_transverse_thorax" real DEFAULT 0,
	"diameter_anteroposterior_thorax" real DEFAULT 0,
	"diameter_biiliocrestal" real DEFAULT 0,
	"diameter_humeralbiepicondylar" real DEFAULT 0,
	"diameter_femoralbiepicondylar" real DEFAULT 0,
	"perimeter_head" real DEFAULT 0,
	"perimeter_arm" real DEFAULT 0,
	"perimeter_flexed_arm" real DEFAULT 0,
	"perimeter_forearm" real DEFAULT 0,
	"perimeter_chest" real DEFAULT 0,
	"perimeter_waist" real DEFAULT 0,
	"perimeter_hip" real DEFAULT 0,
	"perimeter_upper_thigh" real DEFAULT 0,
	"perimeter_medial_thigh" real DEFAULT 0,
	"perimeter_calf" real DEFAULT 0,
	"folds_triceps" real DEFAULT 0,
	"folds_subscapular" real DEFAULT 0,
	"folds_supraspinal" real DEFAULT 0,
	"folds_abdominal" real DEFAULT 0,
	"folds_thigh" real DEFAULT 0,
	"folds_calf" real DEFAULT 0,
	"folds_biceps" real DEFAULT 0,
	"folds_iliac_crest" real DEFAULT 0,
	"additional_measures" jsonb DEFAULT '{}'::jsonb,
	"isak_type" text DEFAULT 'isakII',
	"diameter_bistyloid" real DEFAULT 0,
	"diameter_bitrochanteric" real DEFAULT 0,
	"diameter_bimalleolar" real DEFAULT 0,
	"perimeter_neck" real DEFAULT 0,
	"perimeter_abdominal" real DEFAULT 0,
	"perimeter_wrist" real DEFAULT 0,
	"length_forearm" real DEFAULT 0,
	"length_leg" real DEFAULT 0,
	"length_arm" real DEFAULT 0,
	"length_acromial_sitting" real DEFAULT 0,
	"length_sternal_height" real DEFAULT 0,
	"length_elbow_height" real DEFAULT 0,
	"length_stylion_height" real DEFAULT 0,
	"length_middle_finger_height" real DEFAULT 0,
	"length_trochanteric_height" real DEFAULT 0,
	"length_acromial_standing" real DEFAULT 0,
	"folds_forearm" real DEFAULT 0,
	"skinfold_caliper_id" text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" text DEFAULT 'general' NOT NULL,
	"participant_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_by" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"last_message_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"topics" jsonb DEFAULT '{}'::jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "athlete_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"athlete_id" integer NOT NULL,
	"photo_url" text NOT NULL,
	"photo_thumbnail" text,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"created_by" integer,
	"updated_at" timestamp(3),
	"updated_by" integer,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "nutrition_assessment_photos" (
	"id" serial PRIMARY KEY NOT NULL,
	"assessment_id" integer NOT NULL,
	"photo_id" integer NOT NULL,
	"notes" text,
	"photo_position" integer,
	"created_by" integer,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "food_category_relation" (
	"id" serial PRIMARY KEY NOT NULL,
	"food_id" integer NOT NULL,
	"food_category_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"created_by" integer,
	"updated_by" integer
);
--> statement-breakpoint
CREATE TABLE "food_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"code" text NOT NULL,
	"description" text,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"created_by" integer,
	"updated_by" integer
);
--> statement-breakpoint
CREATE TABLE "gym_equipment" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gym_equipment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"supports_extra_weight" boolean NOT NULL,
	"own_weight_kg" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gym_exercise_media" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gym_exercise_media_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"exercise_id" integer NOT NULL,
	"media_type" text NOT NULL,
	"url" text NOT NULL,
	"caption" text
);
--> statement-breakpoint
CREATE TABLE "gym_routine_stage" (
	"routine_id" integer NOT NULL,
	"stage_id" integer NOT NULL,
	"order_in_routine" integer
);
--> statement-breakpoint
CREATE TABLE "gym_set_exercise_weight" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gym_set_exercise_weight_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"set_exercise_id" integer NOT NULL,
	"weight_id" integer NOT NULL,
	"quantity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gym_weight" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gym_weight_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"value_kg" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gym_stage_set" (
	"stage_id" integer NOT NULL,
	"set_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "colleagues" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_roles_id" integer NOT NULL,
	"colleague_id" integer,
	"status" integer DEFAULT 0 NOT NULL,
	"invite_data" jsonb,
	"code" text NOT NULL,
	"notes" text,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"created_by" integer,
	"updated_by" integer
);
--> statement-breakpoint
CREATE TABLE "colleagues_athlete_colaboration" (
	"id" serial PRIMARY KEY NOT NULL,
	"colleague_id" integer,
	"athlete_id" integer,
	"permission" text DEFAULT 'read',
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"created_by" integer,
	"updated_by" integer,
	"permissions" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "food_combined" (
	"id" serial PRIMARY KEY NOT NULL,
	"food_id" integer,
	"combined_food_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"created_by" integer,
	"updated_by" integer
);
--> statement-breakpoint
CREATE TABLE "nutrition_assessment_report" (
	"id" serial PRIMARY KEY NOT NULL,
	"nutrition_assessment_id" integer,
	"report" text,
	"report_type" text DEFAULT 'colleague-report',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"created_by" integer,
	"updated_by" integer
);
--> statement-breakpoint
CREATE TABLE "gym_stage" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gym_stage_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"description" text,
	"display_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL,
	"deleted_by" integer
);
--> statement-breakpoint
CREATE TABLE "nutrition_assessment_report_comment" (
	"id" serial PRIMARY KEY NOT NULL,
	"nutrition_assessment_report_id" integer,
	"comment" text,
	"edited" boolean DEFAULT false,
	"deleted" boolean DEFAULT false,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"created_by" integer,
	"updated_by" integer
);
--> statement-breakpoint
CREATE TABLE "gym_exercise_category" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gym_exercise_category_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gym_exercise_category_exercises" (
	"category_id" integer NOT NULL,
	"exercise_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gym_routine" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gym_routine_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"objective" text,
	"description" text,
	"weeks_duration" integer,
	"weekly_adjustments" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL,
	"deleted_by" integer
);
--> statement-breakpoint
CREATE TABLE "gym_set" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gym_set_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text,
	"display_name" text,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL,
	"deleted_by" integer
);
--> statement-breakpoint
CREATE TABLE "gym_set_exercise" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gym_set_exercise_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"set_id" integer NOT NULL,
	"exercise_id" integer NOT NULL,
	"reps" integer,
	"duration_secs" integer,
	"sets_count" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gym_plan" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gym_plan_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"athlete_id" integer NOT NULL,
	"name" text NOT NULL,
	"objective" text,
	"description" text,
	"notes" text,
	"start_date" text,
	"end_date" text,
	"weeks_duration" integer,
	"weekly_adjustments" text,
	"status" "gym_plan_status" DEFAULT 'draft',
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL,
	"deleted_by" integer
);
--> statement-breakpoint
CREATE TABLE "food_intake_comment_day" (
	"id" serial PRIMARY KEY NOT NULL,
	"food_intake_id" integer NOT NULL,
	"day" timestamp NOT NULL,
	"comment" text NOT NULL,
	"athlete_id" integer,
	"user_roles_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "food_intake_photo_day" (
	"id" serial PRIMARY KEY NOT NULL,
	"food_intake_id" integer NOT NULL,
	"day" timestamp NOT NULL,
	"photo_url" text NOT NULL,
	"photo_thumbnail" text,
	"athlete_id" integer,
	"user_roles_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "food_intake_star_rating_day" (
	"id" serial PRIMARY KEY NOT NULL,
	"food_intake_id" integer NOT NULL,
	"day" timestamp NOT NULL,
	"rating" integer NOT NULL,
	"athlete_id" integer,
	"user_roles_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "gym_plan_routine" (
	"plan_id" integer NOT NULL,
	"routine_id" integer NOT NULL,
	"display_name" text,
	"description" text,
	"notes" text,
	"order_in_plan" integer,
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gym_plan_routine_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1)
);
--> statement-breakpoint
CREATE TABLE "gym_plan_routine_performance" (
	"plan_routine_id" integer NOT NULL,
	"athlete_id" integer NOT NULL,
	"performance_start_date" timestamp DEFAULT now() NOT NULL,
	"performance_end_date" timestamp DEFAULT now() NOT NULL,
	"performance_duration_secs" integer DEFAULT 0 NOT NULL,
	"performance_feedback" text,
	"performance_rating" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gym_exercise" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gym_exercise_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"main_muscle_group" text NOT NULL,
	"description" text,
	"created_by" integer NOT NULL,
	"updated_by" integer NOT NULL,
	"deleted_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questionnaire_questions_category_by_user_role" (
	"id" serial PRIMARY KEY NOT NULL,
	"questionnaire_questions_category_id" integer,
	"user_role_id" integer,
	"active" integer DEFAULT 1 NOT NULL,
	"delete" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"order" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"uiPreferences" jsonb DEFAULT '{}'::jsonb,
	"rolePreferences" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"created_by" integer,
	"updated_by" integer
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "refresh_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"folder_id" uuid,
	"name" varchar(512) NOT NULL,
	"mime_type" varchar(128) NOT NULL,
	"size_bytes" integer NOT NULL,
	"storage_path" text NOT NULL,
	"uploaded_by_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_permissions" (
	"document_id" uuid PRIMARY KEY NOT NULL,
	"visibility" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "folders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"owner_coach_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"icon" varchar(64) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "folder_permissions" (
	"folder_id" uuid PRIMARY KEY NOT NULL,
	"visibility" varchar(32) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "food_plan_document" (
	"id" serial PRIMARY KEY NOT NULL,
	"food_plan_id" integer NOT NULL,
	"active" boolean DEFAULT true,
	"document_url" text NOT NULL,
	"document_thumbnail" text,
	"document_name" text,
	"document_mime_type" text,
	"document_size_bytes" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3),
	"created_by" integer,
	"updated_by" integer,
	"order" integer DEFAULT 0,
	"metadata" jsonb DEFAULT '{}'::jsonb
);
--> statement-breakpoint
CREATE TABLE "subgroups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" uuid NOT NULL,
	"parent_id" uuid,
	"name" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_roles_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles_licenses" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_role_id" integer,
	"license_status" text DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp(3)
);
--> statement-breakpoint
CREATE TABLE "document_whitelist" (
	"document_id" uuid NOT NULL,
	"athlete_id" integer NOT NULL,
	CONSTRAINT "document_whitelist_document_id_athlete_id_pk" PRIMARY KEY("document_id","athlete_id")
);
--> statement-breakpoint
CREATE TABLE "folder_whitelist" (
	"folder_id" uuid NOT NULL,
	"athlete_id" integer NOT NULL,
	CONSTRAINT "folder_whitelist_folder_id_athlete_id_pk" PRIMARY KEY("folder_id","athlete_id")
);
--> statement-breakpoint
CREATE TABLE "subgroup_athletes" (
	"subgroup_id" uuid NOT NULL,
	"athlete_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subgroup_athletes_subgroup_id_athlete_id_pk" PRIMARY KEY("subgroup_id","athlete_id")
);
--> statement-breakpoint
CREATE TABLE "team_athletes" (
	"team_id" uuid NOT NULL,
	"athlete_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "team_athletes_team_id_athlete_id_pk" PRIMARY KEY("team_id","athlete_id")
);
--> statement-breakpoint
CREATE TABLE "athlete_blacklist" (
	"athlete_id" integer NOT NULL,
	"resource_type" varchar(32) NOT NULL,
	"resource_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "athlete_blacklist_athlete_id_resource_type_resource_id_pk" PRIMARY KEY("athlete_id","resource_type","resource_id")
);
--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_user_roles_id_user_roles_id_fk" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_external_calendar_id_external_calendar_id_fk" FOREIGN KEY ("external_calendar_id") REFERENCES "public"."external_calendar"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_duration_id_appointment_duration_id_fk" FOREIGN KEY ("duration_id") REFERENCES "public"."appointment_duration"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointment_duration" ADD CONSTRAINT "appointment_duration_user_roles_id_user_roles_id_fk" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_level_values" ADD CONSTRAINT "activity_level_values_activity_level_id_activity_level_id_fk" FOREIGN KEY ("activity_level_id") REFERENCES "public"."activity_level"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_role_types_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."role_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_by_user_profile" ADD CONSTRAINT "athlete_by_user_profile_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_by_user_profile" ADD CONSTRAINT "athlete_by_user_profile_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_calendar" ADD CONSTRAINT "external_calendar_user_roles_id_user_roles_id_fk" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_by_user_profile_role" ADD CONSTRAINT "athlete_by_user_profile_role_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_by_user_profile_role" ADD CONSTRAINT "athlete_by_user_profile_role_user_roles_id_user_roles_id_fk" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_assessment" ADD CONSTRAINT "nutrition_assessment_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_assessment" ADD CONSTRAINT "nutrition_assessment_user_roles_id_user_roles_id_fk" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_sports" ADD CONSTRAINT "athlete_sports_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_sports" ADD CONSTRAINT "athlete_sports_sport_id_sports_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability" ADD CONSTRAINT "availability_user_roles_id_user_roles_id_fk" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_assessment_answer" ADD CONSTRAINT "nutrition_assessment_answer_nutrition_assessment_id_nutrition_a" FOREIGN KEY ("nutrition_assessment_id") REFERENCES "public"."nutrition_assessment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_assessment_answer" ADD CONSTRAINT "nutrition_assessment_answer_questionnaire_id_questionnaire_id_f" FOREIGN KEY ("questionnaire_id") REFERENCES "public"."questionnaire"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_assessment_answer" ADD CONSTRAINT "nutrition_assessment_answer_questionnaire_question_id_questionn" FOREIGN KEY ("questionnaire_question_id") REFERENCES "public"."questionnaire_question"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionnaire" ADD CONSTRAINT "questionnaire_questionnaire_type_id_questionnaire_type_id_fk" FOREIGN KEY ("questionnaire_type_id") REFERENCES "public"."questionnaire_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionnaire" ADD CONSTRAINT "questionnaire_user_roles_id_user_roles_id_fk" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionnaire_question" ADD CONSTRAINT "questionnaire_question_questionnaire_question_type_id_questionn" FOREIGN KEY ("questionnaire_question_type_id") REFERENCES "public"."questionnaire_question_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionnaire_question" ADD CONSTRAINT "questionnaire_question_questionnaire_id_questionnaire_id_fk" FOREIGN KEY ("questionnaire_id") REFERENCES "public"."questionnaire"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_assessment_notes_by_category" ADD CONSTRAINT "nutrition_assessment_notes_by_category_nutrition_assessment_id_" FOREIGN KEY ("nutrition_assessment_id") REFERENCES "public"."nutrition_assessment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_assessment_notes_by_category" ADD CONSTRAINT "nutrition_assessment_notes_by_category_questionnaire_question_c" FOREIGN KEY ("questionnaire_question_category_id") REFERENCES "public"."questionnaire_questions_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_intakes_plan" ADD CONSTRAINT "nutrition_intakes_plan_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_intakes_plan" ADD CONSTRAINT "nutrition_intakes_plan_user_roles_id_user_roles_id_fk" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_intake_day_plan" ADD CONSTRAINT "nutrition_intake_day_plan_nutrition_intakes_plan_id_nutrition_i" FOREIGN KEY ("nutrition_intakes_plan_id") REFERENCES "public"."nutrition_intakes_plan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_intakes" ADD CONSTRAINT "nutrition_intakes_nutrition_intake_day_plan_id_nutrition_intake" FOREIGN KEY ("nutrition_intake_day_plan_id") REFERENCES "public"."nutrition_intake_day_plan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_intakes" ADD CONSTRAINT "nutrition_intakes_nutrition_intakes_type_id_nutrition_intakes_t" FOREIGN KEY ("nutrition_intakes_type_id") REFERENCES "public"."nutrition_intakes_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionnaire_option" ADD CONSTRAINT "questionnaire_option_questionnaire_question_id_questionnaire_qu" FOREIGN KEY ("questionnaire_question_id") REFERENCES "public"."questionnaire_question"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionnaire_question_by_category" ADD CONSTRAINT "questionnaire_question_by_category_questionnaire_question_id_qu" FOREIGN KEY ("questionnaire_question_id") REFERENCES "public"."questionnaire_question"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionnaire_question_by_category" ADD CONSTRAINT "questionnaire_question_by_category_questionnaire_questions_cate" FOREIGN KEY ("questionnaire_questions_category_id") REFERENCES "public"."questionnaire_questions_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_component" ADD CONSTRAINT "food_component_food_id_food_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."food"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_component" ADD CONSTRAINT "food_component_component_id_component_id_fk" FOREIGN KEY ("component_id") REFERENCES "public"."component"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_equivalence_detail" ADD CONSTRAINT "food_equivalence_detail_food_id_food_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."food"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_equivalence_detail" ADD CONSTRAINT "food_equivalence_detail_food_equivalence_id_food_equivalence_id" FOREIGN KEY ("food_equivalence_id") REFERENCES "public"."food_equivalence"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food" ADD CONSTRAINT "food_food_brand_id_food_brand_id_fk" FOREIGN KEY ("food_brand_id") REFERENCES "public"."food_brand"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_equivalence" ADD CONSTRAINT "food_equivalence_user_roles_id_user_roles_id_fk" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_address" ADD CONSTRAINT "user_address_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_intake_equivalence" ADD CONSTRAINT "food_intake_equivalence_food_intake_id_food_intake_id_fk" FOREIGN KEY ("food_intake_id") REFERENCES "public"."food_intake"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_intake_equivalence" ADD CONSTRAINT "food_intake_equivalence_food_equivalence_id_food_equivalence_id" FOREIGN KEY ("food_equivalence_id") REFERENCES "public"."food_equivalence"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_intake" ADD CONSTRAINT "food_intake_food_plan_id_food_plan_id_fk" FOREIGN KEY ("food_plan_id") REFERENCES "public"."food_plan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_intake" ADD CONSTRAINT "food_intake_food_intake_type_id_food_intake_type_id_fk" FOREIGN KEY ("food_intake_type_id") REFERENCES "public"."food_intake_type"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_plan" ADD CONSTRAINT "food_plan_user_roles_id_user_roles_id_fk" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_plan" ADD CONSTRAINT "food_plan_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_snapshots" ADD CONSTRAINT "athlete_snapshots_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_social" ADD CONSTRAINT "user_social_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_assessment_medical_studies" ADD CONSTRAINT "nutrition_assessment_medical_studies_nutrition_assessment_id_nu" FOREIGN KEY ("nutrition_assessment_id") REFERENCES "public"."nutrition_assessment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_assessment_medical_studies" ADD CONSTRAINT "nutrition_assessment_medical_studies_athlete_medical_study_id_a" FOREIGN KEY ("athlete_medical_study_id") REFERENCES "public"."athlete_medical_studies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_medical_studies" ADD CONSTRAINT "athlete_medical_studies_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_status" ADD CONSTRAINT "conversation_status_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_status" ADD CONSTRAINT "conversation_status_user_id_user_roles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversation_status" ADD CONSTRAINT "conversation_status_last_read_message_id_messages_id_fk" FOREIGN KEY ("last_read_message_id") REFERENCES "public"."messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_id_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_user_roles_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mention_notifications" ADD CONSTRAINT "mention_notifications_user_id_user_roles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mention_notifications" ADD CONSTRAINT "mention_notifications_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_sport_id_sports_id_fk" FOREIGN KEY ("sport_id") REFERENCES "public"."sports"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_created_by_user_roles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_updated_by_user_roles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_created_by_user_roles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_participants" ADD CONSTRAINT "event_participants_updated_by_user_roles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_day_activity" ADD CONSTRAINT "athlete_day_activity_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_day_activity" ADD CONSTRAINT "athlete_day_activity_user_roles_id_user_roles_id_fk" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_day_activity" ADD CONSTRAINT "athlete_day_activity_nutrition_assessment_id_nutrition_assessme" FOREIGN KEY ("nutrition_assessment_id") REFERENCES "public"."nutrition_assessment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anthropometry" ADD CONSTRAINT "anthropometry_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anthropometry" ADD CONSTRAINT "anthropometry_user_roles_id_user_roles_id_fk" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "anthropometry" ADD CONSTRAINT "anthropometry_nutrition_assessment_id_nutrition_assessment_id_f" FOREIGN KEY ("nutrition_assessment_id") REFERENCES "public"."nutrition_assessment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_created_by_user_roles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_photos" ADD CONSTRAINT "athlete_photos_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_assessment_photos" ADD CONSTRAINT "nutrition_assessment_photos_assessment_id_nutrition_assessment_" FOREIGN KEY ("assessment_id") REFERENCES "public"."nutrition_assessment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_assessment_photos" ADD CONSTRAINT "nutrition_assessment_photos_photo_id_athlete_photos_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."athlete_photos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_category_relation" ADD CONSTRAINT "food_category_relation_food_id_food_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."food"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_category_relation" ADD CONSTRAINT "food_category_relation_food_category_id_food_category_id_fk" FOREIGN KEY ("food_category_id") REFERENCES "public"."food_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_exercise_media" ADD CONSTRAINT "gym_exercise_media_exercise_id_gym_exercise_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."gym_exercise"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_routine_stage" ADD CONSTRAINT "gym_routine_stage_routine_id_gym_routine_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."gym_routine"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_routine_stage" ADD CONSTRAINT "gym_routine_stage_stage_id_gym_stage_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."gym_stage"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_set_exercise_weight" ADD CONSTRAINT "gym_set_exercise_weight_set_exercise_id_gym_set_exercise_id_fk" FOREIGN KEY ("set_exercise_id") REFERENCES "public"."gym_set_exercise"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_set_exercise_weight" ADD CONSTRAINT "gym_set_exercise_weight_weight_id_gym_weight_id_fk" FOREIGN KEY ("weight_id") REFERENCES "public"."gym_weight"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_stage_set" ADD CONSTRAINT "gym_stage_set_stage_id_gym_stage_id_fk" FOREIGN KEY ("stage_id") REFERENCES "public"."gym_stage"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_stage_set" ADD CONSTRAINT "gym_stage_set_set_id_gym_set_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."gym_set"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "colleagues" ADD CONSTRAINT "colleagues_user_roles_id_user_roles_id_fk" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "colleagues" ADD CONSTRAINT "colleagues_colleague_id_user_roles_id_fk" FOREIGN KEY ("colleague_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "colleagues" ADD CONSTRAINT "colleagues_created_by_user_roles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "colleagues" ADD CONSTRAINT "colleagues_updated_by_user_roles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "colleagues_athlete_colaboration" ADD CONSTRAINT "colleagues_athlete_colaboration_colleague_id_colleagues_id_fk" FOREIGN KEY ("colleague_id") REFERENCES "public"."colleagues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "colleagues_athlete_colaboration" ADD CONSTRAINT "colleagues_athlete_colaboration_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "colleagues_athlete_colaboration" ADD CONSTRAINT "colleagues_athlete_colaboration_created_by_user_roles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "colleagues_athlete_colaboration" ADD CONSTRAINT "colleagues_athlete_colaboration_updated_by_user_roles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_combined" ADD CONSTRAINT "food_combined_food_id_food_id_fk" FOREIGN KEY ("food_id") REFERENCES "public"."food"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_combined" ADD CONSTRAINT "food_combined_combined_food_id_food_id_fk" FOREIGN KEY ("combined_food_id") REFERENCES "public"."food"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_assessment_report" ADD CONSTRAINT "nutrition_assessment_report_nutrition_assessment_id_nutrition_a" FOREIGN KEY ("nutrition_assessment_id") REFERENCES "public"."nutrition_assessment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_stage" ADD CONSTRAINT "gym_stage_created_by_user_roles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user_roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_stage" ADD CONSTRAINT "gym_stage_updated_by_user_roles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user_roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_stage" ADD CONSTRAINT "gym_stage_deleted_by_user_roles_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."user_roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nutrition_assessment_report_comment" ADD CONSTRAINT "nutrition_assessment_report_comment_nutrition_assessment_report" FOREIGN KEY ("nutrition_assessment_report_id") REFERENCES "public"."nutrition_assessment_report"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_exercise_category_exercises" ADD CONSTRAINT "gym_exercise_category_exercises_category_id_gym_exercise_catego" FOREIGN KEY ("category_id") REFERENCES "public"."gym_exercise_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_exercise_category_exercises" ADD CONSTRAINT "gym_exercise_category_exercises_exercise_id_gym_exercise_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."gym_exercise"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_routine" ADD CONSTRAINT "gym_routine_created_by_user_roles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user_roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_routine" ADD CONSTRAINT "gym_routine_updated_by_user_roles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user_roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_routine" ADD CONSTRAINT "gym_routine_deleted_by_user_roles_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."user_roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_set" ADD CONSTRAINT "gym_set_created_by_user_roles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user_roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_set" ADD CONSTRAINT "gym_set_updated_by_user_roles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user_roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_set" ADD CONSTRAINT "gym_set_deleted_by_user_roles_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."user_roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_set_exercise" ADD CONSTRAINT "gym_set_exercise_set_id_gym_set_id_fk" FOREIGN KEY ("set_id") REFERENCES "public"."gym_set"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_set_exercise" ADD CONSTRAINT "gym_set_exercise_exercise_id_gym_exercise_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."gym_exercise"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_plan" ADD CONSTRAINT "gym_plan_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_plan" ADD CONSTRAINT "gym_plan_created_by_user_roles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user_roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_plan" ADD CONSTRAINT "gym_plan_updated_by_user_roles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user_roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_plan" ADD CONSTRAINT "gym_plan_deleted_by_user_roles_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."user_roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_intake_comment_day" ADD CONSTRAINT "food_intake_comment_day_food_intake_id_food_intake_id_fk" FOREIGN KEY ("food_intake_id") REFERENCES "public"."food_intake"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_intake_comment_day" ADD CONSTRAINT "food_intake_comment_day_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_intake_comment_day" ADD CONSTRAINT "food_intake_comment_day_user_roles_id_user_roles_id_fk" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_intake_photo_day" ADD CONSTRAINT "food_intake_photo_day_food_intake_id_food_intake_id_fk" FOREIGN KEY ("food_intake_id") REFERENCES "public"."food_intake"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_intake_photo_day" ADD CONSTRAINT "food_intake_photo_day_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_intake_photo_day" ADD CONSTRAINT "food_intake_photo_day_user_roles_id_user_roles_id_fk" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_intake_star_rating_day" ADD CONSTRAINT "food_intake_star_rating_day_food_intake_id_food_intake_id_fk" FOREIGN KEY ("food_intake_id") REFERENCES "public"."food_intake"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_intake_star_rating_day" ADD CONSTRAINT "food_intake_star_rating_day_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_intake_star_rating_day" ADD CONSTRAINT "food_intake_star_rating_day_user_roles_id_user_roles_id_fk" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_plan_routine" ADD CONSTRAINT "gym_plan_routine_plan_id_gym_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."gym_plan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_plan_routine" ADD CONSTRAINT "gym_plan_routine_routine_id_gym_routine_id_fk" FOREIGN KEY ("routine_id") REFERENCES "public"."gym_routine"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_plan_routine_performance" ADD CONSTRAINT "gym_plan_routine_performance_plan_routine_id_gym_plan_routine_i" FOREIGN KEY ("plan_routine_id") REFERENCES "public"."gym_plan_routine"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_plan_routine_performance" ADD CONSTRAINT "gym_plan_routine_performance_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_exercise" ADD CONSTRAINT "gym_exercise_created_by_user_roles_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user_roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_exercise" ADD CONSTRAINT "gym_exercise_updated_by_user_roles_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."user_roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gym_exercise" ADD CONSTRAINT "gym_exercise_deleted_by_user_roles_id_fk" FOREIGN KEY ("deleted_by") REFERENCES "public"."user_roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionnaire_questions_category_by_user_role" ADD CONSTRAINT "questionnaire_questions_category_by_user_role_questionnaire_que" FOREIGN KEY ("questionnaire_questions_category_id") REFERENCES "public"."questionnaire_questions_category"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questionnaire_questions_category_by_user_role" ADD CONSTRAINT "questionnaire_questions_category_by_user_role_user_role_id_user" FOREIGN KEY ("user_role_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploaded_by_id_user_roles_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."user_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_permissions" ADD CONSTRAINT "document_permissions_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folders" ADD CONSTRAINT "folders_owner_coach_id_user_roles_id_fk" FOREIGN KEY ("owner_coach_id") REFERENCES "public"."user_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folder_permissions" ADD CONSTRAINT "folder_permissions_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "food_plan_document" ADD CONSTRAINT "food_plan_document_food_plan_id_food_plan_id_fk" FOREIGN KEY ("food_plan_id") REFERENCES "public"."food_plan"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subgroups" ADD CONSTRAINT "subgroups_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subgroups" ADD CONSTRAINT "subgroups_parent_id_subgroups_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."subgroups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_user_roles_id_user_roles_id_fk" FOREIGN KEY ("user_roles_id") REFERENCES "public"."user_roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles_licenses" ADD CONSTRAINT "user_roles_licenses_user_role_id_user_roles_id_fk" FOREIGN KEY ("user_role_id") REFERENCES "public"."user_roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_whitelist" ADD CONSTRAINT "document_whitelist_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_whitelist" ADD CONSTRAINT "document_whitelist_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folder_whitelist" ADD CONSTRAINT "folder_whitelist_folder_id_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "folder_whitelist" ADD CONSTRAINT "folder_whitelist_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subgroup_athletes" ADD CONSTRAINT "subgroup_athletes_subgroup_id_subgroups_id_fk" FOREIGN KEY ("subgroup_id") REFERENCES "public"."subgroups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subgroup_athletes" ADD CONSTRAINT "subgroup_athletes_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_athletes" ADD CONSTRAINT "team_athletes_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_athletes" ADD CONSTRAINT "team_athletes_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "athlete_blacklist" ADD CONSTRAINT "athlete_blacklist_athlete_id_athlete_id_fk" FOREIGN KEY ("athlete_id") REFERENCES "public"."athlete"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_component_code" ON "component" USING btree ("code" text_ops);--> statement-breakpoint
CREATE INDEX "idx_food_component_component_food" ON "food_component" USING btree ("component_id" int4_ops,"food_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_food_component_component_id" ON "food_component" USING btree ("component_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_food_component_food_component" ON "food_component" USING btree ("food_id" int4_ops,"component_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_food_component_food_id" ON "food_component" USING btree ("food_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_food_component_value" ON "food_component" USING btree ("component_id" text_ops,"value" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_food_food_brand_id" ON "food" USING btree ("food_brand_id" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_food_name" ON "food" USING btree ("name" text_ops);--> statement-breakpoint
CREATE INDEX "ix_processed_data_data_type" ON "processed_data" USING btree ("data_type" text_ops);--> statement-breakpoint
CREATE INDEX "ix_processed_data_id" ON "processed_data" USING btree ("id" int4_ops);--> statement-breakpoint
CREATE INDEX "colleagues_code_idx" ON "colleagues" USING btree ("code" text_ops);--> statement-breakpoint
CREATE INDEX "colleagues_athlete_colaboration_athlete_idx" ON "colleagues_athlete_colaboration" USING btree ("athlete_id" int4_ops);--> statement-breakpoint
CREATE INDEX "colleagues_athlete_colaboration_colleague_idx" ON "colleagues_athlete_colaboration" USING btree ("colleague_id" int4_ops);--> statement-breakpoint
CREATE INDEX "documents_folder_id_idx" ON "documents" USING btree ("folder_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "documents_uploaded_by_id_idx" ON "documents" USING btree ("uploaded_by_id" int4_ops);--> statement-breakpoint
CREATE INDEX "folders_owner_coach_id_idx" ON "folders" USING btree ("owner_coach_id" int4_ops);--> statement-breakpoint
CREATE INDEX "folders_parent_id_idx" ON "folders" USING btree ("parent_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "subgroups_parent_id_idx" ON "subgroups" USING btree ("parent_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "subgroups_team_id_idx" ON "subgroups" USING btree ("team_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "teams_status_idx" ON "teams" USING btree ("status" text_ops);--> statement-breakpoint
CREATE INDEX "teams_user_roles_id_idx" ON "teams" USING btree ("user_roles_id" int4_ops);--> statement-breakpoint
CREATE INDEX "subgroup_athletes_athlete_id_idx" ON "subgroup_athletes" USING btree ("athlete_id" int4_ops);--> statement-breakpoint
CREATE INDEX "subgroup_athletes_subgroup_id_idx" ON "subgroup_athletes" USING btree ("subgroup_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "team_athletes_athlete_id_idx" ON "team_athletes" USING btree ("athlete_id" int4_ops);--> statement-breakpoint
CREATE INDEX "team_athletes_team_id_idx" ON "team_athletes" USING btree ("team_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "athlete_blacklist_athlete_id_idx" ON "athlete_blacklist" USING btree ("athlete_id" int4_ops);--> statement-breakpoint
CREATE INDEX "athlete_blacklist_resource_idx" ON "athlete_blacklist" USING btree ("resource_type" uuid_ops,"resource_id" uuid_ops);
*/