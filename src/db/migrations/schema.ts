import { pgTable, serial, text, timestamp, integer, foreignKey, unique, jsonb, boolean, real, index, varchar, json, uuid, primaryKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const foodPlanStatus = pgEnum("food_plan_status", ['active', 'inactive', 'draft'])
export const foodplanstatus = pgEnum("foodplanstatus", ['ACTIVE', 'INACTIVE', 'DRAFT'])
export const gymPlanStatus = pgEnum("gym_plan_status", ['draft', 'active', 'completed', 'archived'])


export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	sex: text().default('m').notNull(),
	birthDate: timestamp("birth_date", { mode: 'string' }).defaultNow(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	active: integer().default(0).notNull(),
	timezone: text().default('America/Argentina/Buenos_Aires').notNull(),
	phone: text(),
	logo: text(),
});

export const appointment = pgTable("appointment", {
	id: serial().primaryKey().notNull(),
	userRolesId: integer("user_roles_id"),
	externalCalendarEventId: text("external_calendar_event_id"),
	externalCalendarId: integer("external_calendar_id"),
	athleteId: integer("athlete_id"),
	startDate: timestamp("start_date", { mode: 'string' }),
	endDate: timestamp("end_date", { mode: 'string' }),
	durationId: integer("duration_id"),
	status: text(),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	metadata: jsonb().default({}),
	optCode: text("opt_code").default(''),
}, (table) => [
	foreignKey({
			columns: [table.userRolesId],
			foreignColumns: [userRoles.id],
			name: "appointment_user_roles_id_user_roles_id_fk"
		}),
	foreignKey({
			columns: [table.externalCalendarId],
			foreignColumns: [externalCalendar.id],
			name: "appointment_external_calendar_id_external_calendar_id_fk"
		}),
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "appointment_athlete_id_athlete_id_fk"
		}),
	foreignKey({
			columns: [table.durationId],
			foreignColumns: [appointmentDuration.id],
			name: "appointment_duration_id_appointment_duration_id_fk"
		}),
	unique("appointment_external_calendar_event_id_unique").on(table.externalCalendarEventId),
]);

export const appointmentDuration = pgTable("appointment_duration", {
	id: serial().primaryKey().notNull(),
	userRolesId: integer("user_roles_id"),
	name: text().notNull(),
	durationMin: integer("duration_min").default(60).notNull(),
	isDefault: boolean("is_default").default(false).notNull(),
	color: text(),
	useGoogleCalendar: boolean("use_google_calendar").default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userRolesId],
			foreignColumns: [userRoles.id],
			name: "appointment_duration_user_roles_id_user_roles_id_fk"
		}),
]);

export const athlete = pgTable("athlete", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	lastName: text("last_name").notNull(),
	email: text().notNull(),
	sex: text().default('m').notNull(),
	phone: text().notNull(),
	city: text(),
	state: text(),
	country: text().default('arg').notNull(),
	birthday: timestamp({ mode: 'string' }).defaultNow(),
	bodyWeight: real("body_weight").default(0).notNull(),
	height: real().default(0).notNull(),
	metricSystemId: integer("metric_system_id").default(1).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	socialNumber: text("social_number"),
}, (table) => [
	unique("athlete_email_unique").on(table.email),
]);

export const activityLevel = pgTable("activity_level", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
});

export const activityLevelValues = pgTable("activity_level_values", {
	id: serial().primaryKey().notNull(),
	activityLevelId: integer("activity_level_id"),
	sex: text().notNull(),
	value: real().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.activityLevelId],
			foreignColumns: [activityLevel.id],
			name: "activity_level_values_activity_level_id_activity_level_id_fk"
		}),
]);

export const userRoles = pgTable("user_roles", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	roleId: integer("role_id"),
	level: integer().default(1).notNull(),
	metricSystemId: integer("metric_system_id").default(1).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	scopes: jsonb().default({}),
	metadata: jsonb().default({}),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_roles_user_id_users_id_fk"
		}),
	foreignKey({
			columns: [table.roleId],
			foreignColumns: [roleTypes.id],
			name: "user_roles_role_id_role_types_id_fk"
		}),
]);

export const athleteByUserProfile = pgTable("athlete_by_user_profile", {
	id: serial().primaryKey().notNull(),
	athleteId: integer("athlete_id"),
	userId: integer("user_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "athlete_by_user_profile_athlete_id_athlete_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "athlete_by_user_profile_user_id_users_id_fk"
		}),
]);

export const externalCalendar = pgTable("external_calendar", {
	id: serial().primaryKey().notNull(),
	userRolesId: integer("user_roles_id"),
	calendarId: text("calendar_id"),
	name: text(),
	active: integer().default(1).notNull(),
	sendNotifications: boolean("send_notifications").default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userRolesId],
			foreignColumns: [userRoles.id],
			name: "external_calendar_user_roles_id_user_roles_id_fk"
		}),
]);

export const athleteByUserProfileRole = pgTable("athlete_by_user_profile_role", {
	id: serial().primaryKey().notNull(),
	athleteId: integer("athlete_id"),
	userRolesId: integer("user_roles_id"),
	periodStart: timestamp("period_start", { mode: 'string' }).defaultNow(),
	periodEnd: timestamp("period_end", { mode: 'string' }).defaultNow(),
	active: integer().default(1).notNull(),
	permissions: jsonb().default({}),
}, (table) => [
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "athlete_by_user_profile_role_athlete_id_athlete_id_fk"
		}),
	foreignKey({
			columns: [table.userRolesId],
			foreignColumns: [userRoles.id],
			name: "athlete_by_user_profile_role_user_roles_id_user_roles_id_fk"
		}),
]);

export const nutritionAssessment = pgTable("nutrition_assessment", {
	id: serial().primaryKey().notNull(),
	athleteId: integer("athlete_id"),
	userRolesId: integer("user_roles_id"),
	notes: text(),
	goal: text(),
	activityLevel: integer("activity_level").default(1).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	closedAt: timestamp("closed_at", { mode: 'string' }).defaultNow(),
	isAutoAssessment: boolean("is_auto_assessment").default(false),
}, (table) => [
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "nutrition_assessment_athlete_id_athlete_id_fk"
		}),
	foreignKey({
			columns: [table.userRolesId],
			foreignColumns: [userRoles.id],
			name: "nutrition_assessment_user_roles_id_user_roles_id_fk"
		}),
]);

export const athleteSports = pgTable("athlete_sports", {
	id: serial().primaryKey().notNull(),
	athleteId: integer("athlete_id"),
	sportId: integer("sport_id"),
}, (table) => [
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "athlete_sports_athlete_id_athlete_id_fk"
		}),
	foreignKey({
			columns: [table.sportId],
			foreignColumns: [sports.id],
			name: "athlete_sports_sport_id_sports_id_fk"
		}),
]);

export const sports = pgTable("sports", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	code: text().notNull(),
}, (table) => [
	unique("sports_code_unique").on(table.code),
]);

export const availability = pgTable("availability", {
	id: serial().primaryKey().notNull(),
	userRolesId: integer("user_roles_id"),
	weekDay: text("week_day").notNull(),
	startTime: text("start_time").notNull(),
	endTime: text("end_time").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userRolesId],
			foreignColumns: [userRoles.id],
			name: "availability_user_roles_id_user_roles_id_fk"
		}),
]);

export const nutritionAssessmentAnswer = pgTable("nutrition_assessment_answer", {
	id: serial().primaryKey().notNull(),
	nutritionAssessmentId: integer("nutrition_assessment_id"),
	questionnaireId: integer("questionnaire_id"),
	questionnaireQuestionId: integer("questionnaire_question_id"),
	questionnaireOptionId: integer("questionnaire_option_id").default(0),
	answerText: text("answer_text"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.nutritionAssessmentId],
			foreignColumns: [nutritionAssessment.id],
			name: "nutrition_assessment_answer_nutrition_assessment_id_nutrition_a"
		}),
	foreignKey({
			columns: [table.questionnaireId],
			foreignColumns: [questionnaire.id],
			name: "nutrition_assessment_answer_questionnaire_id_questionnaire_id_f"
		}),
	foreignKey({
			columns: [table.questionnaireQuestionId],
			foreignColumns: [questionnaireQuestion.id],
			name: "nutrition_assessment_answer_questionnaire_question_id_questionn"
		}),
]);

export const questionnaire = pgTable("questionnaire", {
	id: serial().primaryKey().notNull(),
	questionnaireTypeId: integer("questionnaire_type_id"),
	userRolesId: integer("user_roles_id"),
	name: text().notNull(),
	active: integer().default(1).notNull(),
	delete: integer().default(0).notNull(),
	system: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.questionnaireTypeId],
			foreignColumns: [questionnaireType.id],
			name: "questionnaire_questionnaire_type_id_questionnaire_type_id_fk"
		}),
	foreignKey({
			columns: [table.userRolesId],
			foreignColumns: [userRoles.id],
			name: "questionnaire_user_roles_id_user_roles_id_fk"
		}),
]);

export const questionnaireQuestion = pgTable("questionnaire_question", {
	id: serial().primaryKey().notNull(),
	questionnaireQuestionTypeId: integer("questionnaire_question_type_id"),
	questionnaireId: integer("questionnaire_id"),
	questionText: text("question_text").notNull(),
	active: integer().default(1).notNull(),
	delete: integer().default(0).notNull(),
	editable: integer().default(1).notNull(),
	note: text(),
	order: integer().default(1).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.questionnaireQuestionTypeId],
			foreignColumns: [questionnaireQuestionType.id],
			name: "questionnaire_question_questionnaire_question_type_id_questionn"
		}),
	foreignKey({
			columns: [table.questionnaireId],
			foreignColumns: [questionnaire.id],
			name: "questionnaire_question_questionnaire_id_questionnaire_id_fk"
		}),
]);

export const nutritionAssessmentNotesByCategory = pgTable("nutrition_assessment_notes_by_category", {
	id: serial().primaryKey().notNull(),
	nutritionAssessmentId: integer("nutrition_assessment_id"),
	questionnaireQuestionCategoryId: integer("questionnaire_question_category_id"),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.nutritionAssessmentId],
			foreignColumns: [nutritionAssessment.id],
			name: "nutrition_assessment_notes_by_category_nutrition_assessment_id_"
		}),
	foreignKey({
			columns: [table.questionnaireQuestionCategoryId],
			foreignColumns: [questionnaireQuestionsCategory.id],
			name: "nutrition_assessment_notes_by_category_questionnaire_question_c"
		}),
]);

export const questionnaireQuestionsCategory = pgTable("questionnaire_questions_category", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	code: text().notNull(),
	sex: text().default('f,m').notNull(),
	active: integer().default(1).notNull(),
	delete: integer().default(0).notNull(),
	userLevel: integer("user_level").default(1).notNull(),
}, (table) => [
	unique("questionnaire_questions_category_code_unique").on(table.code),
]);

export const nutritionIntakesPlan = pgTable("nutrition_intakes_plan", {
	id: serial().primaryKey().notNull(),
	athleteId: integer("athlete_id"),
	userRolesId: integer("user_roles_id"),
	observation: text().default(''),
	notes: text().default(''),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "nutrition_intakes_plan_athlete_id_athlete_id_fk"
		}),
	foreignKey({
			columns: [table.userRolesId],
			foreignColumns: [userRoles.id],
			name: "nutrition_intakes_plan_user_roles_id_user_roles_id_fk"
		}),
]);

export const nutritionIntakeDayPlan = pgTable("nutrition_intake_day_plan", {
	id: serial().primaryKey().notNull(),
	nutritionIntakesPlanId: integer("nutrition_intakes_plan_id"),
	days: text().default('').notNull(),
	description: text().default(''),
	observation: text().default(''),
	notes: text().default(''),
	kcal: integer().default(0),
	protein: integer().default(0),
	carbohydrate: integer().default(0),
	fat: integer().default(0),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.nutritionIntakesPlanId],
			foreignColumns: [nutritionIntakesPlan.id],
			name: "nutrition_intake_day_plan_nutrition_intakes_plan_id_nutrition_i"
		}),
]);

export const nutritionIntakes = pgTable("nutrition_intakes", {
	id: serial().primaryKey().notNull(),
	nutritionIntakeDayPlanId: integer("nutrition_intake_day_plan_id"),
	name: text().default('').notNull(),
	nutritionIntakesTypeId: integer("nutrition_intakes_type_id"),
	kcal: integer().default(0),
	protein: integer().default(0),
	carbohydrate: integer().default(0),
	fat: integer().default(0),
	observation: text().default(''),
	notes: text().default(''),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.nutritionIntakeDayPlanId],
			foreignColumns: [nutritionIntakeDayPlan.id],
			name: "nutrition_intakes_nutrition_intake_day_plan_id_nutrition_intake"
		}),
	foreignKey({
			columns: [table.nutritionIntakesTypeId],
			foreignColumns: [nutritionIntakesType.id],
			name: "nutrition_intakes_nutrition_intakes_type_id_nutrition_intakes_t"
		}),
]);

export const nutritionIntakesType = pgTable("nutrition_intakes_type", {
	id: serial().primaryKey().notNull(),
	name: text().default('').notNull(),
	code: text().default('').notNull(),
	description: text().default(''),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const questionnaireOption = pgTable("questionnaire_option", {
	id: serial().primaryKey().notNull(),
	questionnaireQuestionId: integer("questionnaire_question_id"),
	optionText: text("option_text").notNull(),
	active: integer().default(1).notNull(),
	delete: integer().default(0).notNull(),
	editable: integer().default(1).notNull(),
	order: integer().default(1).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.questionnaireQuestionId],
			foreignColumns: [questionnaireQuestion.id],
			name: "questionnaire_option_questionnaire_question_id_questionnaire_qu"
		}),
]);

export const questionnaireQuestionByCategory = pgTable("questionnaire_question_by_category", {
	id: serial().primaryKey().notNull(),
	questionnaireQuestionId: integer("questionnaire_question_id"),
	questionnaireQuestionsCategoryId: integer("questionnaire_questions_category_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.questionnaireQuestionId],
			foreignColumns: [questionnaireQuestion.id],
			name: "questionnaire_question_by_category_questionnaire_question_id_qu"
		}),
	foreignKey({
			columns: [table.questionnaireQuestionsCategoryId],
			foreignColumns: [questionnaireQuestionsCategory.id],
			name: "questionnaire_question_by_category_questionnaire_questions_cate"
		}),
]);

export const questionnaireQuestionType = pgTable("questionnaire_question_type", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	code: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("questionnaire_question_type_code_unique").on(table.code),
]);

export const questionnaireType = pgTable("questionnaire_type", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const roleTypes = pgTable("role_types", {
	id: serial().primaryKey().notNull(),
	role: text().notNull(),
});

export const component = pgTable("component", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	measure: text(),
	code: text(),
}, (table) => [
	index("idx_component_code").using("btree", table.code.asc().nullsLast().op("text_ops")),
]);

export const foodComponent = pgTable("food_component", {
	id: serial().primaryKey().notNull(),
	foodId: integer("food_id").notNull(),
	componentId: integer("component_id").notNull(),
	value: text().notNull(),
	measure: text(),
	details: jsonb().default({}),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
}, (table) => [
	index("idx_food_component_component_food").using("btree", table.componentId.asc().nullsLast().op("int4_ops"), table.foodId.asc().nullsLast().op("int4_ops")),
	index("idx_food_component_component_id").using("btree", table.componentId.asc().nullsLast().op("int4_ops")),
	index("idx_food_component_food_component").using("btree", table.foodId.asc().nullsLast().op("int4_ops"), table.componentId.asc().nullsLast().op("int4_ops")),
	index("idx_food_component_food_id").using("btree", table.foodId.asc().nullsLast().op("int4_ops")),
	index("idx_food_component_value").using("btree", table.componentId.asc().nullsLast().op("text_ops"), table.value.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.foodId],
			foreignColumns: [food.id],
			name: "food_component_food_id_food_id_fk"
		}),
	foreignKey({
			columns: [table.componentId],
			foreignColumns: [component.id],
			name: "food_component_component_id_component_id_fk"
		}),
]);

export const foodEquivalenceDetail = pgTable("food_equivalence_detail", {
	id: serial().primaryKey().notNull(),
	foodId: integer("food_id").notNull(),
	foodEquivalenceId: integer("food_equivalence_id").notNull(),
	amount: real().default(0),
	measure: text(),
	component: jsonb().default({}),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
}, (table) => [
	foreignKey({
			columns: [table.foodId],
			foreignColumns: [food.id],
			name: "food_equivalence_detail_food_id_food_id_fk"
		}),
	foreignKey({
			columns: [table.foodEquivalenceId],
			foreignColumns: [foodEquivalence.id],
			name: "food_equivalence_detail_food_equivalence_id_food_equivalence_id"
		}),
]);

export const food = pgTable("food", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	portion: text(),
	portionUnit: text("portion_unit"),
	description: text(),
	image: text(),
	ingredients: text(),
	metadata: jsonb().default({}),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
	foodBrandId: integer("food_brand_id"),
	combined: boolean().default(false),
	generic: boolean().default(false),
}, (table) => [
	index("idx_food_food_brand_id").using("btree", table.foodBrandId.asc().nullsLast().op("int4_ops")),
	index("idx_food_name").using("btree", table.name.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.foodBrandId],
			foreignColumns: [foodBrand.id],
			name: "food_food_brand_id_food_brand_id_fk"
		}),
]);

export const foodEquivalence = pgTable("food_equivalence", {
	id: serial().primaryKey().notNull(),
	userRolesId: integer("user_roles_id"),
	name: text(),
	mainComponent: text("main_component"),
	maxSearchThreshold: text("max_search_threshold"),
	avgComponent: jsonb("avg_component").default({}),
	tag: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
	amount: real().default(0),
	displayName: text("display_name"),
	description: text(),
	image: text(),
	metadata: jsonb().default({}),
	active: boolean().default(true),
}, (table) => [
	foreignKey({
			columns: [table.userRolesId],
			foreignColumns: [userRoles.id],
			name: "food_equivalence_user_roles_id_user_roles_id_fk"
		}),
]);

export const foodIntakeType = pgTable("food_intake_type", {
	id: serial().primaryKey().notNull(),
	name: text(),
});

export const userAddress = pgTable("user_address", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	line1: text("line_1"),
	line2: text("line_2"),
	line3: text("line_3"),
	city: text(),
	state: text(),
	postCode: text("post_code"),
	country: text(),
	isPrimary: boolean("is_primary").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_address_user_id_users_id_fk"
		}),
]);

export const foodBrand = pgTable("food_brand", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	website: text(),
	image: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
});

export const foodIntakeEquivalence = pgTable("food_intake_equivalence", {
	id: serial().primaryKey().notNull(),
	foodIntakeId: integer("food_intake_id").notNull(),
	foodEquivalenceId: integer("food_equivalence_id").notNull(),
	order: real().default(0),
}, (table) => [
	foreignKey({
			columns: [table.foodIntakeId],
			foreignColumns: [foodIntake.id],
			name: "food_intake_equivalence_food_intake_id_food_intake_id_fk"
		}),
	foreignKey({
			columns: [table.foodEquivalenceId],
			foreignColumns: [foodEquivalence.id],
			name: "food_intake_equivalence_food_equivalence_id_food_equivalence_id"
		}),
]);

export const foodIntake = pgTable("food_intake", {
	id: serial().primaryKey().notNull(),
	name: text(),
	foodPlanId: integer("food_plan_id").notNull(),
	foodIntakeTypeId: integer("food_intake_type_id").notNull(),
	description: text(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
	weekDay: text("week_day"),
	order: real().default(0),
}, (table) => [
	foreignKey({
			columns: [table.foodPlanId],
			foreignColumns: [foodPlan.id],
			name: "food_intake_food_plan_id_food_plan_id_fk"
		}),
	foreignKey({
			columns: [table.foodIntakeTypeId],
			foreignColumns: [foodIntakeType.id],
			name: "food_intake_food_intake_type_id_food_intake_type_id_fk"
		}),
]);

export const processedData = pgTable("processed_data", {
	id: serial().primaryKey().notNull(),
	dataType: varchar("data_type"),
	content: json(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("ix_processed_data_data_type").using("btree", table.dataType.asc().nullsLast().op("text_ops")),
	index("ix_processed_data_id").using("btree", table.id.asc().nullsLast().op("int4_ops")),
]);

export const foodPlan = pgTable("food_plan", {
	id: serial().primaryKey().notNull(),
	name: text(),
	userRolesId: integer("user_roles_id"),
	goals: text(),
	recommendations: text(),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
	athleteId: integer("athlete_id"),
	startDate: text("start_date"),
	endDate: text("end_date"),
	status: foodPlanStatus().default('draft'),
	component: jsonb().default({}),
}, (table) => [
	foreignKey({
			columns: [table.userRolesId],
			foreignColumns: [userRoles.id],
			name: "food_plan_user_roles_id_user_roles_id_fk"
		}),
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "food_plan_athlete_id_athlete_id_fk"
		}),
]);

export const athleteSnapshots = pgTable("athlete_snapshots", {
	id: serial().primaryKey().notNull(),
	athleteId: integer("athlete_id"),
	description: text(),
	data: jsonb().default({}),
	filePath: text("file_path"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "athlete_snapshots_athlete_id_athlete_id_fk"
		}),
]);

export const userSocial = pgTable("user_social", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	socialNet: text("social_net").notNull(),
	link: text().notNull(),
	isPublic: boolean("is_public").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
	nickname: text(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_social_user_id_users_id_fk"
		}),
]);

export const nutritionAssessmentMedicalStudies = pgTable("nutrition_assessment_medical_studies", {
	id: serial().primaryKey().notNull(),
	nutritionAssessmentId: integer("nutrition_assessment_id"),
	notes: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
	athleteMedicalStudyId: integer("athlete_medical_study_id"),
}, (table) => [
	foreignKey({
			columns: [table.nutritionAssessmentId],
			foreignColumns: [nutritionAssessment.id],
			name: "nutrition_assessment_medical_studies_nutrition_assessment_id_nu"
		}),
	foreignKey({
			columns: [table.athleteMedicalStudyId],
			foreignColumns: [athleteMedicalStudies.id],
			name: "nutrition_assessment_medical_studies_athlete_medical_study_id_a"
		}),
]);

export const athleteMedicalStudies = pgTable("athlete_medical_studies", {
	id: serial().primaryKey().notNull(),
	athleteId: integer("athlete_id"),
	type: text(),
	studyDate: timestamp("study_date", { mode: 'string' }),
	description: text(),
	data: jsonb().default({}),
	filePath: text("file_path"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
}, (table) => [
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "athlete_medical_studies_athlete_id_athlete_id_fk"
		}),
]);

export const conversationStatus = pgTable("conversation_status", {
	id: serial().primaryKey().notNull(),
	conversationId: integer("conversation_id").notNull(),
	userId: integer("user_id").notNull(),
	lastReadMessageId: integer("last_read_message_id"),
	unreadCount: integer("unread_count").default(0).notNull(),
	isMuted: boolean("is_muted").default(false).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.conversationId],
			foreignColumns: [conversations.id],
			name: "conversation_status_conversation_id_conversations_id_fk"
		}),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [userRoles.id],
			name: "conversation_status_user_id_user_roles_id_fk"
		}),
	foreignKey({
			columns: [table.lastReadMessageId],
			foreignColumns: [messages.id],
			name: "conversation_status_last_read_message_id_messages_id_fk"
		}),
]);

export const messages = pgTable("messages", {
	id: serial().primaryKey().notNull(),
	conversationId: integer("conversation_id").notNull(),
	parentMessageId: integer("parent_message_id"),
	senderId: integer("sender_id").notNull(),
	content: text().notNull(),
	mentions: jsonb().default([]),
	isPinned: boolean("is_pinned").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.conversationId],
			foreignColumns: [conversations.id],
			name: "messages_conversation_id_conversations_id_fk"
		}),
	foreignKey({
			columns: [table.senderId],
			foreignColumns: [userRoles.id],
			name: "messages_sender_id_user_roles_id_fk"
		}),
]);

export const mentionNotifications = pgTable("mention_notifications", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	messageId: integer("message_id").notNull(),
	isRead: boolean("is_read").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [userRoles.id],
			name: "mention_notifications_user_id_user_roles_id_fk"
		}),
	foreignKey({
			columns: [table.messageId],
			foreignColumns: [messages.id],
			name: "mention_notifications_message_id_messages_id_fk"
		}),
]);

export const events = pgTable("events", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	eventType: integer("event_type").default(1).notNull(),
	sportId: integer("sport_id").notNull(),
	date: timestamp({ mode: 'string' }).notNull(),
	time: text().notNull(),
	timezone: text().notNull(),
	isCompetition: boolean("is_competition").default(false).notNull(),
	isPublic: boolean("is_public").default(true).notNull(),
	isSearchable: boolean("is_searchable").default(true).notNull(),
	isOfficial: boolean("is_official").default(false).notNull(),
	basedOn: integer("based_on").default(1).notNull(),
	timeBasedValue: text("time_based_value"),
	distanceBasedValue: real("distance_based_value"),
	distanceBasedUnit: text("distance_based_unit"),
	location: text().notNull(),
	createdBy: integer("created_by").notNull(),
	updatedBy: integer("updated_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.sportId],
			foreignColumns: [sports.id],
			name: "events_sport_id_sports_id_fk"
		}),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [userRoles.id],
			name: "events_created_by_user_roles_id_fk"
		}),
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [userRoles.id],
			name: "events_updated_by_user_roles_id_fk"
		}),
]);

export const eventParticipants = pgTable("event_participants", {
	id: serial().primaryKey().notNull(),
	eventId: integer("event_id").notNull(),
	athleteId: integer("athlete_id").notNull(),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	createdBy: integer("created_by").notNull(),
	updatedBy: integer("updated_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "event_participants_event_id_events_id_fk"
		}),
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "event_participants_athlete_id_athlete_id_fk"
		}),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [userRoles.id],
			name: "event_participants_created_by_user_roles_id_fk"
		}),
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [userRoles.id],
			name: "event_participants_updated_by_user_roles_id_fk"
		}),
]);

export const athleteDayActivity = pgTable("athlete_day_activity", {
	id: serial().primaryKey().notNull(),
	athleteId: integer("athlete_id"),
	userRolesId: integer("user_roles_id"),
	nutritionAssessmentId: integer("nutrition_assessment_id"),
	weekDay: integer("week_day").default(0),
	session: text().default(''),
	activity: text().default(''),
	duration: text().default(''),
	intensity: text().default(''),
	notes: text().default(''),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	sessionTime: timestamp("session_time", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "athlete_day_activity_athlete_id_athlete_id_fk"
		}),
	foreignKey({
			columns: [table.userRolesId],
			foreignColumns: [userRoles.id],
			name: "athlete_day_activity_user_roles_id_user_roles_id_fk"
		}),
	foreignKey({
			columns: [table.nutritionAssessmentId],
			foreignColumns: [nutritionAssessment.id],
			name: "athlete_day_activity_nutrition_assessment_id_nutrition_assessme"
		}),
]);

export const anthropometry = pgTable("anthropometry", {
	id: serial().primaryKey().notNull(),
	athleteId: integer("athlete_id"),
	userRolesId: integer("user_roles_id"),
	nutritionAssessmentId: integer("nutrition_assessment_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	referenceBoneMass: real("reference_bone_mass").default(0),
	basicWeight: real("basic_weight").default(0),
	basicHeight: real("basic_height").default(0),
	basicHeatedHeight: real("basic_heated_height").default(0),
	diameterBiacromial: real("diameter_biacromial").default(0),
	diameterTransverseThorax: real("diameter_transverse_thorax").default(0),
	diameterAnteroposteriorThorax: real("diameter_anteroposterior_thorax").default(0),
	diameterBiiliocrestal: real("diameter_biiliocrestal").default(0),
	diameterHumeralbiepicondylar: real("diameter_humeralbiepicondylar").default(0),
	diameterFemoralbiepicondylar: real("diameter_femoralbiepicondylar").default(0),
	perimeterHead: real("perimeter_head").default(0),
	perimeterArm: real("perimeter_arm").default(0),
	perimeterFlexedArm: real("perimeter_flexed_arm").default(0),
	perimeterForearm: real("perimeter_forearm").default(0),
	perimeterChest: real("perimeter_chest").default(0),
	perimeterWaist: real("perimeter_waist").default(0),
	perimeterHip: real("perimeter_hip").default(0),
	perimeterUpperThigh: real("perimeter_upper_thigh").default(0),
	perimeterMedialThigh: real("perimeter_medial_thigh").default(0),
	perimeterCalf: real("perimeter_calf").default(0),
	foldsTriceps: real("folds_triceps").default(0),
	foldsSubscapular: real("folds_subscapular").default(0),
	foldsSupraspinal: real("folds_supraspinal").default(0),
	foldsAbdominal: real("folds_abdominal").default(0),
	foldsThigh: real("folds_thigh").default(0),
	foldsCalf: real("folds_calf").default(0),
	foldsBiceps: real("folds_biceps").default(0),
	foldsIliacCrest: real("folds_iliac_crest").default(0),
	additionalMeasures: jsonb("additional_measures").default({}),
	isakType: text("isak_type").default('isakII'),
	diameterBistyloid: real("diameter_bistyloid").default(0),
	diameterBitrochanteric: real("diameter_bitrochanteric").default(0),
	diameterBimalleolar: real("diameter_bimalleolar").default(0),
	perimeterNeck: real("perimeter_neck").default(0),
	perimeterAbdominal: real("perimeter_abdominal").default(0),
	perimeterWrist: real("perimeter_wrist").default(0),
	lengthForearm: real("length_forearm").default(0),
	lengthLeg: real("length_leg").default(0),
	lengthArm: real("length_arm").default(0),
	lengthAcromialSitting: real("length_acromial_sitting").default(0),
	lengthSternalHeight: real("length_sternal_height").default(0),
	lengthElbowHeight: real("length_elbow_height").default(0),
	lengthStylionHeight: real("length_stylion_height").default(0),
	lengthMiddleFingerHeight: real("length_middle_finger_height").default(0),
	lengthTrochantericHeight: real("length_trochanteric_height").default(0),
	lengthAcromialStanding: real("length_acromial_standing").default(0),
	foldsForearm: real("folds_forearm").default(0),
	skinfoldCaliperId: text("skinfold_caliper_id").default(''),
}, (table) => [
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "anthropometry_athlete_id_athlete_id_fk"
		}),
	foreignKey({
			columns: [table.userRolesId],
			foreignColumns: [userRoles.id],
			name: "anthropometry_user_roles_id_user_roles_id_fk"
		}),
	foreignKey({
			columns: [table.nutritionAssessmentId],
			foreignColumns: [nutritionAssessment.id],
			name: "anthropometry_nutrition_assessment_id_nutrition_assessment_id_f"
		}),
]);

export const conversations = pgTable("conversations", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	type: text().default('general').notNull(),
	participantIds: jsonb("participant_ids").default([]).notNull(),
	createdBy: integer("created_by").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	lastMessageAt: timestamp("last_message_at", { mode: 'string' }).defaultNow(),
	isActive: boolean("is_active").default(true).notNull(),
	uuid: uuid().defaultRandom().notNull(),
	topics: jsonb().default({}).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [userRoles.id],
			name: "conversations_created_by_user_roles_id_fk"
		}),
]);

export const athletePhotos = pgTable("athlete_photos", {
	id: serial().primaryKey().notNull(),
	athleteId: integer("athlete_id").notNull(),
	photoUrl: text("photo_url").notNull(),
	photoThumbnail: text("photo_thumbnail"),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	createdBy: integer("created_by"),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	updatedBy: integer("updated_by"),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "athlete_photos_athlete_id_athlete_id_fk"
		}),
]);

export const nutritionAssessmentPhotos = pgTable("nutrition_assessment_photos", {
	id: serial().primaryKey().notNull(),
	assessmentId: integer("assessment_id").notNull(),
	photoId: integer("photo_id").notNull(),
	notes: text(),
	photoPosition: integer("photo_position"),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.assessmentId],
			foreignColumns: [nutritionAssessment.id],
			name: "nutrition_assessment_photos_assessment_id_nutrition_assessment_"
		}),
	foreignKey({
			columns: [table.photoId],
			foreignColumns: [athletePhotos.id],
			name: "nutrition_assessment_photos_photo_id_athlete_photos_id_fk"
		}),
]);

export const foodCategoryRelation = pgTable("food_category_relation", {
	id: serial().primaryKey().notNull(),
	foodId: integer("food_id").notNull(),
	foodCategoryId: integer("food_category_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
}, (table) => [
	foreignKey({
			columns: [table.foodId],
			foreignColumns: [food.id],
			name: "food_category_relation_food_id_food_id_fk"
		}),
	foreignKey({
			columns: [table.foodCategoryId],
			foreignColumns: [foodCategory.id],
			name: "food_category_relation_food_category_id_food_category_id_fk"
		}),
]);

export const foodCategory = pgTable("food_category", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	code: text().notNull(),
	description: text(),
	active: boolean().default(true),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
});

export const gymEquipment = pgTable("gym_equipment", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "gym_equipment_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: text().notNull(),
	supportsExtraWeight: boolean("supports_extra_weight").notNull(),
	ownWeightKg: real("own_weight_kg").notNull(),
});

export const gymExerciseMedia = pgTable("gym_exercise_media", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "gym_exercise_media_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	exerciseId: integer("exercise_id").notNull(),
	mediaType: text("media_type").notNull(),
	url: text().notNull(),
	caption: text(),
}, (table) => [
	foreignKey({
			columns: [table.exerciseId],
			foreignColumns: [gymExercise.id],
			name: "gym_exercise_media_exercise_id_gym_exercise_id_fk"
		}).onDelete("cascade"),
]);

export const gymRoutineStage = pgTable("gym_routine_stage", {
	routineId: integer("routine_id").notNull(),
	stageId: integer("stage_id").notNull(),
	orderInRoutine: integer("order_in_routine"),
}, (table) => [
	foreignKey({
			columns: [table.routineId],
			foreignColumns: [gymRoutine.id],
			name: "gym_routine_stage_routine_id_gym_routine_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.stageId],
			foreignColumns: [gymStage.id],
			name: "gym_routine_stage_stage_id_gym_stage_id_fk"
		}).onDelete("cascade"),
]);

export const gymSetExerciseWeight = pgTable("gym_set_exercise_weight", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "gym_set_exercise_weight_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	setExerciseId: integer("set_exercise_id").notNull(),
	weightId: integer("weight_id").notNull(),
	quantity: integer().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.setExerciseId],
			foreignColumns: [gymSetExercise.id],
			name: "gym_set_exercise_weight_set_exercise_id_gym_set_exercise_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.weightId],
			foreignColumns: [gymWeight.id],
			name: "gym_set_exercise_weight_weight_id_gym_weight_id_fk"
		}).onDelete("restrict"),
]);

export const gymWeight = pgTable("gym_weight", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "gym_weight_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	valueKg: real("value_kg").notNull(),
});

export const gymStageSet = pgTable("gym_stage_set", {
	stageId: integer("stage_id").notNull(),
	setId: integer("set_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.stageId],
			foreignColumns: [gymStage.id],
			name: "gym_stage_set_stage_id_gym_stage_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.setId],
			foreignColumns: [gymSet.id],
			name: "gym_stage_set_set_id_gym_set_id_fk"
		}).onDelete("cascade"),
]);

export const colleagues = pgTable("colleagues", {
	id: serial().primaryKey().notNull(),
	userRolesId: integer("user_roles_id").notNull(),
	colleagueId: integer("colleague_id"),
	status: integer().default(0).notNull(),
	inviteData: jsonb("invite_data"),
	code: text().notNull(),
	notes: text(),
	metadata: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
}, (table) => [
	index("colleagues_code_idx").using("btree", table.code.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userRolesId],
			foreignColumns: [userRoles.id],
			name: "colleagues_user_roles_id_user_roles_id_fk"
		}),
	foreignKey({
			columns: [table.colleagueId],
			foreignColumns: [userRoles.id],
			name: "colleagues_colleague_id_user_roles_id_fk"
		}),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [userRoles.id],
			name: "colleagues_created_by_user_roles_id_fk"
		}),
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [userRoles.id],
			name: "colleagues_updated_by_user_roles_id_fk"
		}),
]);

export const colleaguesAthleteColaboration = pgTable("colleagues_athlete_colaboration", {
	id: serial().primaryKey().notNull(),
	colleagueId: integer("colleague_id"),
	athleteId: integer("athlete_id"),
	permission: text().default('read'),
	metadata: jsonb(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
	permissions: jsonb().default({}),
}, (table) => [
	index("colleagues_athlete_colaboration_athlete_idx").using("btree", table.athleteId.asc().nullsLast().op("int4_ops")),
	index("colleagues_athlete_colaboration_colleague_idx").using("btree", table.colleagueId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.colleagueId],
			foreignColumns: [colleagues.id],
			name: "colleagues_athlete_colaboration_colleague_id_colleagues_id_fk"
		}),
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "colleagues_athlete_colaboration_athlete_id_athlete_id_fk"
		}),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [userRoles.id],
			name: "colleagues_athlete_colaboration_created_by_user_roles_id_fk"
		}),
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [userRoles.id],
			name: "colleagues_athlete_colaboration_updated_by_user_roles_id_fk"
		}),
]);

export const foodCombined = pgTable("food_combined", {
	id: serial().primaryKey().notNull(),
	foodId: integer("food_id"),
	combinedFoodId: integer("combined_food_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
}, (table) => [
	foreignKey({
			columns: [table.foodId],
			foreignColumns: [food.id],
			name: "food_combined_food_id_food_id_fk"
		}),
	foreignKey({
			columns: [table.combinedFoodId],
			foreignColumns: [food.id],
			name: "food_combined_combined_food_id_food_id_fk"
		}),
]);

export const nutritionAssessmentReport = pgTable("nutrition_assessment_report", {
	id: serial().primaryKey().notNull(),
	nutritionAssessmentId: integer("nutrition_assessment_id"),
	report: text(),
	reportType: text("report_type").default('colleague-report'),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
}, (table) => [
	foreignKey({
			columns: [table.nutritionAssessmentId],
			foreignColumns: [nutritionAssessment.id],
			name: "nutrition_assessment_report_nutrition_assessment_id_nutrition_a"
		}),
]);

export const gymStage = pgTable("gym_stage", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "gym_stage_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: text().notNull(),
	description: text(),
	displayName: text("display_name"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	createdBy: integer("created_by").notNull(),
	updatedBy: integer("updated_by").notNull(),
	deletedBy: integer("deleted_by"),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [userRoles.id],
			name: "gym_stage_created_by_user_roles_id_fk"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [userRoles.id],
			name: "gym_stage_updated_by_user_roles_id_fk"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.deletedBy],
			foreignColumns: [userRoles.id],
			name: "gym_stage_deleted_by_user_roles_id_fk"
		}).onDelete("restrict"),
]);

export const nutritionAssessmentReportComment = pgTable("nutrition_assessment_report_comment", {
	id: serial().primaryKey().notNull(),
	nutritionAssessmentReportId: integer("nutrition_assessment_report_id"),
	comment: text(),
	edited: boolean().default(false),
	deleted: boolean().default(false),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
}, (table) => [
	foreignKey({
			columns: [table.nutritionAssessmentReportId],
			foreignColumns: [nutritionAssessmentReport.id],
			name: "nutrition_assessment_report_comment_nutrition_assessment_report"
		}),
]);

export const gymExerciseCategory = pgTable("gym_exercise_category", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "gym_exercise_category_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: text().notNull(),
});

export const gymExerciseCategoryExercises = pgTable("gym_exercise_category_exercises", {
	categoryId: integer("category_id").notNull(),
	exerciseId: integer("exercise_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [gymExerciseCategory.id],
			name: "gym_exercise_category_exercises_category_id_gym_exercise_catego"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.exerciseId],
			foreignColumns: [gymExercise.id],
			name: "gym_exercise_category_exercises_exercise_id_gym_exercise_id_fk"
		}).onDelete("cascade"),
]);

export const gymRoutine = pgTable("gym_routine", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "gym_routine_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: text().notNull(),
	objective: text(),
	description: text(),
	weeksDuration: integer("weeks_duration"),
	weeklyAdjustments: text("weekly_adjustments"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	createdBy: integer("created_by").notNull(),
	updatedBy: integer("updated_by").notNull(),
	deletedBy: integer("deleted_by"),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [userRoles.id],
			name: "gym_routine_created_by_user_roles_id_fk"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [userRoles.id],
			name: "gym_routine_updated_by_user_roles_id_fk"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.deletedBy],
			foreignColumns: [userRoles.id],
			name: "gym_routine_deleted_by_user_roles_id_fk"
		}).onDelete("restrict"),
]);

export const gymSet = pgTable("gym_set", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "gym_set_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: text(),
	displayName: text("display_name"),
	description: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	createdBy: integer("created_by").notNull(),
	updatedBy: integer("updated_by").notNull(),
	deletedBy: integer("deleted_by"),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [userRoles.id],
			name: "gym_set_created_by_user_roles_id_fk"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [userRoles.id],
			name: "gym_set_updated_by_user_roles_id_fk"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.deletedBy],
			foreignColumns: [userRoles.id],
			name: "gym_set_deleted_by_user_roles_id_fk"
		}).onDelete("restrict"),
]);

export const gymSetExercise = pgTable("gym_set_exercise", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "gym_set_exercise_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	setId: integer("set_id").notNull(),
	exerciseId: integer("exercise_id").notNull(),
	reps: integer(),
	durationSecs: integer("duration_secs"),
	setsCount: integer("sets_count").default(1).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.setId],
			foreignColumns: [gymSet.id],
			name: "gym_set_exercise_set_id_gym_set_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.exerciseId],
			foreignColumns: [gymExercise.id],
			name: "gym_set_exercise_exercise_id_gym_exercise_id_fk"
		}).onDelete("cascade"),
]);

export const gymPlan = pgTable("gym_plan", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "gym_plan_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	athleteId: integer("athlete_id").notNull(),
	name: text().notNull(),
	objective: text(),
	description: text(),
	notes: text(),
	startDate: text("start_date"),
	endDate: text("end_date"),
	weeksDuration: integer("weeks_duration"),
	weeklyAdjustments: text("weekly_adjustments"),
	status: gymPlanStatus().default('draft'),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	createdBy: integer("created_by").notNull(),
	updatedBy: integer("updated_by").notNull(),
	deletedBy: integer("deleted_by"),
}, (table) => [
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "gym_plan_athlete_id_athlete_id_fk"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [userRoles.id],
			name: "gym_plan_created_by_user_roles_id_fk"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [userRoles.id],
			name: "gym_plan_updated_by_user_roles_id_fk"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.deletedBy],
			foreignColumns: [userRoles.id],
			name: "gym_plan_deleted_by_user_roles_id_fk"
		}).onDelete("restrict"),
]);

export const foodIntakeCommentDay = pgTable("food_intake_comment_day", {
	id: serial().primaryKey().notNull(),
	foodIntakeId: integer("food_intake_id").notNull(),
	day: timestamp({ mode: 'string' }).notNull(),
	comment: text().notNull(),
	athleteId: integer("athlete_id"),
	userRolesId: integer("user_roles_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.foodIntakeId],
			foreignColumns: [foodIntake.id],
			name: "food_intake_comment_day_food_intake_id_food_intake_id_fk"
		}),
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "food_intake_comment_day_athlete_id_athlete_id_fk"
		}),
	foreignKey({
			columns: [table.userRolesId],
			foreignColumns: [userRoles.id],
			name: "food_intake_comment_day_user_roles_id_user_roles_id_fk"
		}),
]);

export const foodIntakePhotoDay = pgTable("food_intake_photo_day", {
	id: serial().primaryKey().notNull(),
	foodIntakeId: integer("food_intake_id").notNull(),
	day: timestamp({ mode: 'string' }).notNull(),
	photoUrl: text("photo_url").notNull(),
	photoThumbnail: text("photo_thumbnail"),
	athleteId: integer("athlete_id"),
	userRolesId: integer("user_roles_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.foodIntakeId],
			foreignColumns: [foodIntake.id],
			name: "food_intake_photo_day_food_intake_id_food_intake_id_fk"
		}),
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "food_intake_photo_day_athlete_id_athlete_id_fk"
		}),
	foreignKey({
			columns: [table.userRolesId],
			foreignColumns: [userRoles.id],
			name: "food_intake_photo_day_user_roles_id_user_roles_id_fk"
		}),
]);

export const foodIntakeStarRatingDay = pgTable("food_intake_star_rating_day", {
	id: serial().primaryKey().notNull(),
	foodIntakeId: integer("food_intake_id").notNull(),
	day: timestamp({ mode: 'string' }).notNull(),
	rating: integer().notNull(),
	athleteId: integer("athlete_id"),
	userRolesId: integer("user_roles_id"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.foodIntakeId],
			foreignColumns: [foodIntake.id],
			name: "food_intake_star_rating_day_food_intake_id_food_intake_id_fk"
		}),
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "food_intake_star_rating_day_athlete_id_athlete_id_fk"
		}),
	foreignKey({
			columns: [table.userRolesId],
			foreignColumns: [userRoles.id],
			name: "food_intake_star_rating_day_user_roles_id_user_roles_id_fk"
		}),
]);

export const gymPlanRoutine = pgTable("gym_plan_routine", {
	planId: integer("plan_id").notNull(),
	routineId: integer("routine_id").notNull(),
	displayName: text("display_name"),
	description: text(),
	notes: text(),
	orderInPlan: integer("order_in_plan"),
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "gym_plan_routine_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
}, (table) => [
	foreignKey({
			columns: [table.planId],
			foreignColumns: [gymPlan.id],
			name: "gym_plan_routine_plan_id_gym_plan_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.routineId],
			foreignColumns: [gymRoutine.id],
			name: "gym_plan_routine_routine_id_gym_routine_id_fk"
		}).onDelete("cascade"),
]);

export const gymPlanRoutinePerformance = pgTable("gym_plan_routine_performance", {
	planRoutineId: integer("plan_routine_id").notNull(),
	athleteId: integer("athlete_id").notNull(),
	performanceStartDate: timestamp("performance_start_date", { mode: 'string' }).defaultNow().notNull(),
	performanceEndDate: timestamp("performance_end_date", { mode: 'string' }).defaultNow().notNull(),
	performanceDurationSecs: integer("performance_duration_secs").default(0).notNull(),
	performanceFeedback: text("performance_feedback"),
	performanceRating: integer("performance_rating").default(0).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.planRoutineId],
			foreignColumns: [gymPlanRoutine.id],
			name: "gym_plan_routine_performance_plan_routine_id_gym_plan_routine_i"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "gym_plan_routine_performance_athlete_id_athlete_id_fk"
		}).onDelete("restrict"),
]);

export const gymExercise = pgTable("gym_exercise", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "gym_exercise_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: text().notNull(),
	mainMuscleGroup: text("main_muscle_group").notNull(),
	description: text(),
	createdBy: integer("created_by").notNull(),
	updatedBy: integer("updated_by").notNull(),
	deletedBy: integer("deleted_by"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	deletedAt: timestamp("deleted_at", { mode: 'string' }),
	isDeleted: boolean("is_deleted").default(false).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [userRoles.id],
			name: "gym_exercise_created_by_user_roles_id_fk"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.updatedBy],
			foreignColumns: [userRoles.id],
			name: "gym_exercise_updated_by_user_roles_id_fk"
		}).onDelete("restrict"),
	foreignKey({
			columns: [table.deletedBy],
			foreignColumns: [userRoles.id],
			name: "gym_exercise_deleted_by_user_roles_id_fk"
		}).onDelete("restrict"),
]);

export const questionnaireQuestionsCategoryByUserRole = pgTable("questionnaire_questions_category_by_user_role", {
	id: serial().primaryKey().notNull(),
	questionnaireQuestionsCategoryId: integer("questionnaire_questions_category_id"),
	userRoleId: integer("user_role_id"),
	active: integer().default(1).notNull(),
	delete: integer().default(0).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	order: integer().default(1).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.questionnaireQuestionsCategoryId],
			foreignColumns: [questionnaireQuestionsCategory.id],
			name: "questionnaire_questions_category_by_user_role_questionnaire_que"
		}),
	foreignKey({
			columns: [table.userRoleId],
			foreignColumns: [userRoles.id],
			name: "questionnaire_questions_category_by_user_role_user_role_id_user"
		}),
]);

export const userPreferences = pgTable("user_preferences", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id"),
	uiPreferences: jsonb().default({}),
	rolePreferences: jsonb().default({}),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_preferences_user_id_users_id_fk"
		}),
]);

export const refreshTokens = pgTable("refresh_tokens", {
	id: serial().primaryKey().notNull(),
	token: text().notNull(),
	userId: integer("user_id").notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "refresh_tokens_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("refresh_tokens_token_unique").on(table.token),
]);

export const documents = pgTable("documents", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	folderId: uuid("folder_id"),
	name: varchar({ length: 512 }).notNull(),
	mimeType: varchar("mime_type", { length: 128 }).notNull(),
	sizeBytes: integer("size_bytes").notNull(),
	storagePath: text("storage_path").notNull(),
	uploadedById: integer("uploaded_by_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("documents_folder_id_idx").using("btree", table.folderId.asc().nullsLast().op("uuid_ops")),
	index("documents_uploaded_by_id_idx").using("btree", table.uploadedById.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.folderId],
			foreignColumns: [folders.id],
			name: "documents_folder_id_folders_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.uploadedById],
			foreignColumns: [userRoles.id],
			name: "documents_uploaded_by_id_user_roles_id_fk"
		}).onDelete("cascade"),
]);

export const documentPermissions = pgTable("document_permissions", {
	documentId: uuid("document_id").primaryKey().notNull(),
	visibility: varchar({ length: 32 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.documentId],
			foreignColumns: [documents.id],
			name: "document_permissions_document_id_documents_id_fk"
		}).onDelete("cascade"),
]);

export const folders = pgTable("folders", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	parentId: uuid("parent_id"),
	ownerCoachId: integer("owner_coach_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	icon: varchar({ length: 64 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("folders_owner_coach_id_idx").using("btree", table.ownerCoachId.asc().nullsLast().op("int4_ops")),
	index("folders_parent_id_idx").using("btree", table.parentId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.ownerCoachId],
			foreignColumns: [userRoles.id],
			name: "folders_owner_coach_id_user_roles_id_fk"
		}).onDelete("cascade"),
]);

export const folderPermissions = pgTable("folder_permissions", {
	folderId: uuid("folder_id").primaryKey().notNull(),
	visibility: varchar({ length: 32 }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.folderId],
			foreignColumns: [folders.id],
			name: "folder_permissions_folder_id_folders_id_fk"
		}).onDelete("cascade"),
]);

export const foodPlanDocument = pgTable("food_plan_document", {
	id: serial().primaryKey().notNull(),
	foodPlanId: integer("food_plan_id").notNull(),
	active: boolean().default(true),
	documentUrl: text("document_url").notNull(),
	documentThumbnail: text("document_thumbnail"),
	documentName: text("document_name"),
	documentMimeType: text("document_mime_type"),
	documentSizeBytes: integer("document_size_bytes"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
	createdBy: integer("created_by"),
	updatedBy: integer("updated_by"),
	order: integer().default(0),
	metadata: jsonb().default({}),
}, (table) => [
	foreignKey({
			columns: [table.foodPlanId],
			foreignColumns: [foodPlan.id],
			name: "food_plan_document_food_plan_id_food_plan_id_fk"
		}),
]);

export const subgroups = pgTable("subgroups", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	teamId: uuid("team_id").notNull(),
	parentId: uuid("parent_id"),
	name: varchar({ length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("subgroups_parent_id_idx").using("btree", table.parentId.asc().nullsLast().op("uuid_ops")),
	index("subgroups_team_id_idx").using("btree", table.teamId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "subgroups_team_id_teams_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "subgroups_parent_id_subgroups_id_fk"
		}).onDelete("cascade"),
]);

export const teams = pgTable("teams", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userRolesId: integer("user_roles_id").notNull(),
	name: varchar({ length: 255 }).notNull(),
	description: text(),
	status: varchar({ length: 20 }).default('active').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("teams_status_idx").using("btree", table.status.asc().nullsLast().op("text_ops")),
	index("teams_user_roles_id_idx").using("btree", table.userRolesId.asc().nullsLast().op("int4_ops")),
	foreignKey({
			columns: [table.userRolesId],
			foreignColumns: [userRoles.id],
			name: "teams_user_roles_id_user_roles_id_fk"
		}).onDelete("cascade"),
]);

export const userRolesLicenses = pgTable("user_roles_licenses", {
	id: serial().primaryKey().notNull(),
	userRoleId: integer("user_role_id"),
	licenseStatus: text("license_status").default('active').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { precision: 3, mode: 'string' }),
}, (table) => [
	foreignKey({
			columns: [table.userRoleId],
			foreignColumns: [userRoles.id],
			name: "user_roles_licenses_user_role_id_user_roles_id_fk"
		}),
]);

export const documentWhitelist = pgTable("document_whitelist", {
	documentId: uuid("document_id").notNull(),
	athleteId: integer("athlete_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.documentId],
			foreignColumns: [documents.id],
			name: "document_whitelist_document_id_documents_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "document_whitelist_athlete_id_athlete_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.documentId, table.athleteId], name: "document_whitelist_document_id_athlete_id_pk"}),
]);

export const folderWhitelist = pgTable("folder_whitelist", {
	folderId: uuid("folder_id").notNull(),
	athleteId: integer("athlete_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.folderId],
			foreignColumns: [folders.id],
			name: "folder_whitelist_folder_id_folders_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "folder_whitelist_athlete_id_athlete_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.folderId, table.athleteId], name: "folder_whitelist_folder_id_athlete_id_pk"}),
]);

export const subgroupAthletes = pgTable("subgroup_athletes", {
	subgroupId: uuid("subgroup_id").notNull(),
	athleteId: integer("athlete_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("subgroup_athletes_athlete_id_idx").using("btree", table.athleteId.asc().nullsLast().op("int4_ops")),
	index("subgroup_athletes_subgroup_id_idx").using("btree", table.subgroupId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.subgroupId],
			foreignColumns: [subgroups.id],
			name: "subgroup_athletes_subgroup_id_subgroups_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "subgroup_athletes_athlete_id_athlete_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.subgroupId, table.athleteId], name: "subgroup_athletes_subgroup_id_athlete_id_pk"}),
]);

export const teamAthletes = pgTable("team_athletes", {
	teamId: uuid("team_id").notNull(),
	athleteId: integer("athlete_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("team_athletes_athlete_id_idx").using("btree", table.athleteId.asc().nullsLast().op("int4_ops")),
	index("team_athletes_team_id_idx").using("btree", table.teamId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "team_athletes_team_id_teams_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "team_athletes_athlete_id_athlete_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.teamId, table.athleteId], name: "team_athletes_team_id_athlete_id_pk"}),
]);

export const athleteBlacklist = pgTable("athlete_blacklist", {
	athleteId: integer("athlete_id").notNull(),
	resourceType: varchar("resource_type", { length: 32 }).notNull(),
	resourceId: uuid("resource_id").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("athlete_blacklist_athlete_id_idx").using("btree", table.athleteId.asc().nullsLast().op("int4_ops")),
	index("athlete_blacklist_resource_idx").using("btree", table.resourceType.asc().nullsLast().op("uuid_ops"), table.resourceId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.athleteId],
			foreignColumns: [athlete.id],
			name: "athlete_blacklist_athlete_id_athlete_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.athleteId, table.resourceType, table.resourceId], name: "athlete_blacklist_athlete_id_resource_type_resource_id_pk"}),
]);
