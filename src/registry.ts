import type { ToolResponse } from "./types/responses.js";
import {
  toolName,
  description,
  inputSchema,
  handleEventsSearch,
} from "./tools/events.search.js";
import {
  toolName as athleteGetByIdToolName,
  description as athleteGetByIdDescription,
  inputSchema as athleteGetByIdInputSchema,
  handleAthleteGetById,
} from "./tools/athlete.getById.js";
import {
  toolName as athletesSearchToolName,
  description as athletesSearchDescription,
  inputSchema as athletesSearchInputSchema,
  handleAthletesSearch,
} from "./tools/athletes.search.js";
import {
  toolName as assessmentGetByIdToolName,
  description as assessmentGetByIdDescription,
  inputSchema as assessmentGetByIdInputSchema,
  handleAssessmentGetById,
} from "./tools/assessment.getById.js";
import {
  toolName as assessmentsSearchToolName,
  description as assessmentsSearchDescription,
  inputSchema as assessmentsSearchInputSchema,
  handleAssessmentsSearch,
} from "./tools/assessments.search.js";
import {
  toolName as appointmentsSearchToolName,
  description as appointmentsSearchDescription,
  inputSchema as appointmentsSearchInputSchema,
  handleAppointmentsSearch,
} from "./tools/appointments.search.js";
import {
  toolName as athleteStatsToolName,
  description as athleteStatsDescription,
  inputSchema as athleteStatsInputSchema,
  handleAthleteStats,
} from "./tools/athlete.stats.js";
import {
  toolName as assessmentGetFullToolName,
  description as assessmentGetFullDescription,
  inputSchema as assessmentGetFullInputSchema,
  handleAssessmentGetFull,
} from "./tools/assessment.getFull.js";
import {
  toolName as anthropometrySearchToolName,
  description as anthropometrySearchDescription,
  inputSchema as anthropometrySearchInputSchema,
  handleAnthropometrySearch,
} from "./tools/anthropometry.search.js";
import {
  toolName as anthropometryGetByAssessmentToolName,
  description as anthropometryGetByAssessmentDescription,
  inputSchema as anthropometryGetByAssessmentInputSchema,
  handleAnthropometryGetByAssessment,
} from "./tools/anthropometry.getByAssessment.js";
import {
  toolName as questionnaireGetStructureToolName,
  description as questionnaireGetStructureDescription,
  inputSchema as questionnaireGetStructureInputSchema,
  handleQuestionnaireGetStructure,
} from "./tools/questionnaire.getStructure.js";
import {
  toolName as medicalStudiesGetByAssessmentToolName,
  description as medicalStudiesGetByAssessmentDescription,
  inputSchema as medicalStudiesGetByAssessmentInputSchema,
  handleMedicalStudiesGetByAssessment,
} from "./tools/medicalStudies.getByAssessment.js";
import {
  toolName as medicalStudiesGetByAthleteToolName,
  description as medicalStudiesGetByAthleteDescription,
  inputSchema as medicalStudiesGetByAthleteInputSchema,
  handleMedicalStudiesGetByAthlete,
} from "./tools/medicalStudies.getByAthlete.js";
import {
  toolName as brickAddFoodToolName,
  description as brickAddFoodDescription,
  inputSchema as brickAddFoodInputSchema,
  handleBrickAddFood,
} from "./tools/brick.addFood.js";
import {
  toolName as brickCreateToolName,
  description as brickCreateDescription,
  inputSchema as brickCreateInputSchema,
  handleBrickCreate,
} from "./tools/brick.create.js";
import {
  toolName as brickGetDetailToolName,
  description as brickGetDetailDescription,
  inputSchema as brickGetDetailInputSchema,
  handleBrickGetDetail,
} from "./tools/brick.getDetail.js";
import {
  toolName as brickRemoveFoodToolName,
  description as brickRemoveFoodDescription,
  inputSchema as brickRemoveFoodInputSchema,
  handleBrickRemoveFood,
} from "./tools/brick.removeFood.js";
import {
  toolName as brickSearchToolName,
  description as brickSearchDescription,
  inputSchema as brickSearchInputSchema,
  handleBrickSearch,
} from "./tools/brick.search.js";
import {
  toolName as brickSetComponentsToolName,
  description as brickSetComponentsDescription,
  inputSchema as brickSetComponentsInputSchema,
  handleBrickSetComponents,
} from "./tools/brick.setComponents.js";
import {
  toolName as brickUpdateToolName,
  description as brickUpdateDescription,
  inputSchema as brickUpdateInputSchema,
  handleBrickUpdate,
} from "./tools/brick.update.js";
import {
  toolName as componentSearchToolName,
  description as componentSearchDescription,
  inputSchema as componentSearchInputSchema,
  handleComponentSearch,
} from "./tools/component.search.js";
import {
  toolName as foodGetAllCombinedToolName,
  description as foodGetAllCombinedDescription,
  inputSchema as foodGetAllCombinedInputSchema,
  handleFoodGetAllCombined,
} from "./tools/food.getAllCombined.js";
import {
  toolName as foodGetAllGenericToolName,
  description as foodGetAllGenericDescription,
  inputSchema as foodGetAllGenericInputSchema,
  handleFoodGetAllGeneric,
} from "./tools/food.getAllGeneric.js";
import {
  toolName as foodGetAllManufacturedToolName,
  description as foodGetAllManufacturedDescription,
  inputSchema as foodGetAllManufacturedInputSchema,
  handleFoodGetAllManufactured,
} from "./tools/food.getAllManufactured.js";
import {
  toolName as foodGetByComponentToolName,
  description as foodGetByComponentDescription,
  inputSchema as foodGetByComponentInputSchema,
  handleFoodGetByComponent,
} from "./tools/food.getByComponent.js";
import {
  toolName as foodGetByIdToolName,
  description as foodGetByIdDescription,
  inputSchema as foodGetByIdInputSchema,
  handleFoodGetById,
} from "./tools/food.getById.js";
import {
  toolName as foodGetFullFoodDetailToolName,
  description as foodGetFullFoodDetailDescription,
  inputSchema as foodGetFullFoodDetailInputSchema,
  handleFoodGetFullFoodDetail,
} from "./tools/food.getFullFoodDetail.js";
import {
  toolName as foodPlanAddBrickToIntakeToolName,
  description as foodPlanAddBrickToIntakeDescription,
  inputSchema as foodPlanAddBrickToIntakeInputSchema,
  handleFoodPlanAddBrickToIntake,
} from "./tools/foodPlan.addBrickToIntake.js";
import {
  toolName as foodPlanAddIntakeToolName,
  description as foodPlanAddIntakeDescription,
  inputSchema as foodPlanAddIntakeInputSchema,
  handleFoodPlanAddIntake,
} from "./tools/foodPlan.addIntake.js";
import {
  toolName as foodPlanCreateToolName,
  description as foodPlanCreateDescription,
  inputSchema as foodPlanCreateInputSchema,
  handleFoodPlanCreate,
} from "./tools/foodPlan.create.js";
import {
  toolName as foodPlanGetByIdToolName,
  description as foodPlanGetByIdDescription,
  inputSchema as foodPlanGetByIdInputSchema,
  handleFoodPlanGetById,
} from "./tools/foodPlan.getById.js";
import {
  toolName as foodPlanGetFullToolName,
  description as foodPlanGetFullDescription,
  inputSchema as foodPlanGetFullInputSchema,
  handleFoodPlanGetFull,
} from "./tools/foodPlan.getFull.js";
import {
  toolName as foodPlanRemoveBrickFromIntakeToolName,
  description as foodPlanRemoveBrickFromIntakeDescription,
  inputSchema as foodPlanRemoveBrickFromIntakeInputSchema,
  handleFoodPlanRemoveBrickFromIntake,
} from "./tools/foodPlan.removeBrickFromIntake.js";
import {
  toolName as foodPlanRemoveIntakeToolName,
  description as foodPlanRemoveIntakeDescription,
  inputSchema as foodPlanRemoveIntakeInputSchema,
  handleFoodPlanRemoveIntake,
} from "./tools/foodPlan.removeIntake.js";
import {
  toolName as foodPlanSearchToolName,
  description as foodPlanSearchDescription,
  inputSchema as foodPlanSearchInputSchema,
  handleFoodPlanSearch,
} from "./tools/foodPlan.search.js";
import {
  toolName as foodPlanUpdateToolName,
  description as foodPlanUpdateDescription,
  inputSchema as foodPlanUpdateInputSchema,
  handleFoodPlanUpdate,
} from "./tools/foodPlan.update.js";
import {
  toolName as intakeTypeListToolName,
  description as intakeTypeListDescription,
  inputSchema as intakeTypeListInputSchema,
  handleIntakeTypeList,
} from "./tools/intakeType.list.js";
import {
  toolName as foodSearchByNameToolName,
  description as foodSearchByNameDescription,
  inputSchema as foodSearchByNameInputSchema,
  handleFoodSearchByName,
} from "./tools/food.searchByName.js";
import type { z } from "zod";

export interface ToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, { description?: string; type?: string }>;
  zodSchema: z.ZodTypeAny;
  handler: (params: unknown) => Promise<ToolResponse<unknown>>;
}

const tools = new Map<string, ToolDef>();

function register(tool: ToolDef): void {
  tools.set(tool.name, tool);
}

register({
  name: toolName,
  description,
  inputSchema: {
    sport: { type: "string", description: "Filter by sport name or code" },
    location: { type: "string", description: "Filter by location (partial match)" },
    title: { type: "string", description: "Filter by race/event name (partial match)" },
    distance: { type: "number", description: "Filter by distance value (e.g. 21 for 21k, 42 for marathon)" },
    distanceUnit: { type: "string", description: "Filter by distance unit (e.g. km, mi)" },
    limit: { type: "number", description: "Max results (1–100, default 50)" },
  },
  zodSchema: inputSchema,
  handler: handleEventsSearch,
});

register({
  name: athleteGetByIdToolName,
  description: athleteGetByIdDescription,
  inputSchema: {
    id: { type: "number", description: "Athlete ID (required)" },
  },
  zodSchema: athleteGetByIdInputSchema,
  handler: handleAthleteGetById,
});

register({
  name: athletesSearchToolName,
  description: athletesSearchDescription,
  inputSchema: {
    name: { type: "string", description: "Filter by first name (partial match)" },
    lastName: { type: "string", description: "Filter by last name (partial match)" },
    sport: { type: "string", description: "Filter by sport name or code – only athletes who play this sport" },
    sex: { type: "string", description: "Filter by sex (exact match, e.g. m, f)" },
    age: { type: "number", description: "Filter by exact age in years (integer)" },
    limit: { type: "number", description: "Max results (1–100, default 50)" },
  },
  zodSchema: athletesSearchInputSchema,
  handler: handleAthletesSearch,
});

register({
  name: assessmentGetByIdToolName,
  description: assessmentGetByIdDescription,
  inputSchema: {
    id: { type: "number", description: "Assessment ID (required)" },
  },
  zodSchema: assessmentGetByIdInputSchema,
  handler: handleAssessmentGetById,
});

register({
  name: assessmentsSearchToolName,
  description: assessmentsSearchDescription,
  inputSchema: {
    athleteId: { type: "number", description: "Filter by athlete ID" },
    coachId: { type: "number", description: "Filter by coach ID (user_roles id)" },
    startDate: { type: "string", description: "Start of creation-date span (YYYY-MM-DD, inclusive)" },
    endDate: { type: "string", description: "End of creation-date span (YYYY-MM-DD, inclusive)" },
    limit: { type: "number", description: "Max results (1–100, default 50)" },
  },
  zodSchema: assessmentsSearchInputSchema,
  handler: handleAssessmentsSearch,
});

register({
  name: appointmentsSearchToolName,
  description: appointmentsSearchDescription,
  inputSchema: {
    startDate: { type: "string", description: "Start of date span (YYYY-MM-DD)" },
    endDate: { type: "string", description: "End of date span (YYYY-MM-DD)" },
    startTime: { type: "string", description: "Start of time-of-day range (24h HH:mm)" },
    endTime: { type: "string", description: "End of time-of-day range (24h HH:mm)" },
    athleteId: { type: "number", description: "Filter by athlete ID" },
    state: { type: "string", description: "Filter by state: confirmed, cancelled, deleted" },
    coachId: { type: "number", description: "Filter by coach (user_roles id)" },
    limit: { type: "number", description: "Max results (1–100, default 50)" },
  },
  zodSchema: appointmentsSearchInputSchema,
  handler: handleAppointmentsSearch,
});

register({
  name: athleteStatsToolName,
  description: athleteStatsDescription,
  inputSchema: {},
  zodSchema: athleteStatsInputSchema as z.ZodTypeAny,
  handler: handleAthleteStats as (params: unknown) => Promise<ToolResponse<unknown>>,
});

register({
  name: assessmentGetFullToolName,
  description: assessmentGetFullDescription,
  inputSchema: {
    id: { type: "number", description: "Assessment ID (required)" },
  },
  zodSchema: assessmentGetFullInputSchema,
  handler: handleAssessmentGetFull,
});

register({
  name: anthropometrySearchToolName,
  description: anthropometrySearchDescription,
  inputSchema: {
    athleteId: { type: "number", description: "Filter by athlete ID" },
    assessmentId: { type: "number", description: "Filter by exact assessment ID" },
    startDate: { type: "string", description: "Start of date span (YYYY-MM-DD, inclusive)" },
    endDate: { type: "string", description: "End of date span (YYYY-MM-DD, inclusive)" },
    limit: { type: "number", description: "Max results (1–100, default 20)" },
  },
  zodSchema: anthropometrySearchInputSchema,
  handler: handleAnthropometrySearch,
});

register({
  name: anthropometryGetByAssessmentToolName,
  description: anthropometryGetByAssessmentDescription,
  inputSchema: {
    assessmentId: { type: "number", description: "Assessment ID (required)" },
  },
  zodSchema: anthropometryGetByAssessmentInputSchema,
  handler: handleAnthropometryGetByAssessment,
});

register({
  name: questionnaireGetStructureToolName,
  description: questionnaireGetStructureDescription,
  inputSchema: {
    categoryCode: { type: "string", description: "Filter by a single category code (optional)" },
    active: { type: "string", description: "Only active items (default true)" },
  },
  zodSchema: questionnaireGetStructureInputSchema,
  handler: handleQuestionnaireGetStructure,
});

register({
  name: medicalStudiesGetByAssessmentToolName,
  description: medicalStudiesGetByAssessmentDescription,
  inputSchema: {
    assessmentId: { type: "number", description: "Assessment ID (required)" },
  },
  zodSchema: medicalStudiesGetByAssessmentInputSchema,
  handler: handleMedicalStudiesGetByAssessment,
});

register({
  name: medicalStudiesGetByAthleteToolName,
  description: medicalStudiesGetByAthleteDescription,
  inputSchema: {
    athleteId: { type: "number", description: "Athlete ID (required)" },
    type: { type: "string", description: "Filter by study type (partial match, e.g. 'blood', 'xray')" },
    limit: { type: "number", description: "Max results (1–100, default 50)" },
  },
  zodSchema: medicalStudiesGetByAthleteInputSchema,
  handler: handleMedicalStudiesGetByAthlete,
});

register({
  name: foodSearchByNameToolName,
  description: foodSearchByNameDescription,
  inputSchema: {
    name: { type: "string", description: "Food name or fragment (required)" },
    limit: { type: "number", description: "Max results (1-100, default 20)" },
  },
  zodSchema: foodSearchByNameInputSchema,
  handler: handleFoodSearchByName,
});

register({
  name: foodGetAllGenericToolName,
  description: foodGetAllGenericDescription,
  inputSchema: {
    limit: { type: "number", description: "Max results (1-100, default 20)" },
    offset: { type: "number", description: "Pagination offset (default 0)" },
  },
  zodSchema: foodGetAllGenericInputSchema,
  handler: handleFoodGetAllGeneric,
});

register({
  name: foodGetAllCombinedToolName,
  description: foodGetAllCombinedDescription,
  inputSchema: {
    limit: { type: "number", description: "Max results (1-100, default 20)" },
    offset: { type: "number", description: "Pagination offset (default 0)" },
  },
  zodSchema: foodGetAllCombinedInputSchema,
  handler: handleFoodGetAllCombined,
});

register({
  name: foodGetAllManufacturedToolName,
  description: foodGetAllManufacturedDescription,
  inputSchema: {
    brandId: { type: "number", description: "Optional brand ID filter" },
    limit: { type: "number", description: "Max results (1-100, default 20)" },
    offset: { type: "number", description: "Pagination offset (default 0)" },
  },
  zodSchema: foodGetAllManufacturedInputSchema,
  handler: handleFoodGetAllManufactured,
});

register({
  name: foodGetByComponentToolName,
  description: foodGetByComponentDescription,
  inputSchema: {
    componentId: { type: "number", description: "Component ID to filter by" },
    componentName: { type: "string", description: "Optional component name fragment" },
    minValue: { type: "number", description: "Optional minimum numeric component value" },
    maxValue: { type: "number", description: "Optional maximum numeric component value" },
    limit: { type: "number", description: "Max results (1-100, default 20)" },
  },
  zodSchema: foodGetByComponentInputSchema,
  handler: handleFoodGetByComponent,
});

register({
  name: foodGetFullFoodDetailToolName,
  description: foodGetFullFoodDetailDescription,
  inputSchema: {
    foodId: { type: "number", description: "Food ID (required)" },
  },
  zodSchema: foodGetFullFoodDetailInputSchema,
  handler: handleFoodGetFullFoodDetail,
});

register({
  name: foodGetByIdToolName,
  description: foodGetByIdDescription,
  inputSchema: {
    foodId: { type: "number", description: "Food ID (required)" },
  },
  zodSchema: foodGetByIdInputSchema,
  handler: handleFoodGetById,
});

register({
  name: componentSearchToolName,
  description: componentSearchDescription,
  inputSchema: {
    name: { type: "string", description: "Optional component name fragment" },
    limit: { type: "number", description: "Max results (1-100, default 20)" },
  },
  zodSchema: componentSearchInputSchema,
  handler: handleComponentSearch,
});

register({
  name: brickSearchToolName,
  description: brickSearchDescription,
  inputSchema: {
    coachId: { type: "number", description: "Coach ID (user_roles_id) (required)" },
    name: { type: "string", description: "Optional brick name fragment" },
    limit: { type: "number", description: "Max results (1-100, default 20)" },
    offset: { type: "number", description: "Pagination offset (default 0)" },
  },
  zodSchema: brickSearchInputSchema,
  handler: handleBrickSearch,
});

register({
  name: brickGetDetailToolName,
  description: brickGetDetailDescription,
  inputSchema: {
    coachId: { type: "number", description: "Coach ID (user_roles_id) (required)" },
    brickId: { type: "number", description: "Brick ID (required)" },
  },
  zodSchema: brickGetDetailInputSchema,
  handler: handleBrickGetDetail,
});

register({
  name: brickCreateToolName,
  description: brickCreateDescription,
  inputSchema: {
    coachId: { type: "number", description: "Coach ID (user_roles_id) (required)" },
    name: { type: "string", description: "Brick name (required)" },
    amount: { type: "number", description: "Optional amount value" },
    displayName: { type: "string", description: "Optional display name" },
    description: { type: "string", description: "Optional description" },
    image: { type: "string", description: "Optional image URL/path" },
    mainComponent: { type: "string", description: "Optional main component text" },
    maxSearchThreshold: { type: "string", description: "Optional threshold text" },
    tag: { type: "string", description: "Optional tag" },
    metadata: { type: "object", description: "Optional metadata payload" },
    active: { type: "boolean", description: "Optional active state (default true)" },
  },
  zodSchema: brickCreateInputSchema,
  handler: handleBrickCreate,
});

register({
  name: brickUpdateToolName,
  description: brickUpdateDescription,
  inputSchema: {
    coachId: { type: "number", description: "Coach ID (user_roles_id) (required)" },
    brickId: { type: "number", description: "Brick ID (required)" },
    name: { type: "string", description: "Optional brick name" },
    amount: { type: "number", description: "Optional amount value" },
    displayName: { type: "string", description: "Optional display name" },
    description: { type: "string", description: "Optional description" },
    image: { type: "string", description: "Optional image URL/path" },
    mainComponent: { type: "string", description: "Optional main component text" },
    maxSearchThreshold: { type: "string", description: "Optional threshold text" },
    tag: { type: "string", description: "Optional tag" },
    metadata: { type: "object", description: "Optional metadata payload" },
    active: { type: "boolean", description: "Optional active state" },
  },
  zodSchema: brickUpdateInputSchema,
  handler: handleBrickUpdate,
});

register({
  name: brickAddFoodToolName,
  description: brickAddFoodDescription,
  inputSchema: {
    coachId: { type: "number", description: "Coach ID (user_roles_id) (required)" },
    brickId: { type: "number", description: "Brick ID (required)" },
    foodId: { type: "number", description: "Food ID to add (required)" },
    amount: { type: "number", description: "Optional amount for this food entry" },
    measure: { type: "string", description: "Optional measure text" },
    component: { type: "object", description: "Optional custom component payload" },
  },
  zodSchema: brickAddFoodInputSchema,
  handler: handleBrickAddFood,
});

register({
  name: brickRemoveFoodToolName,
  description: brickRemoveFoodDescription,
  inputSchema: {
    coachId: { type: "number", description: "Coach ID (user_roles_id) (required)" },
    brickId: { type: "number", description: "Brick ID (required)" },
    detailId: { type: "number", description: "food_equivalence_detail ID (required)" },
  },
  zodSchema: brickRemoveFoodInputSchema,
  handler: handleBrickRemoveFood,
});

register({
  name: brickSetComponentsToolName,
  description: brickSetComponentsDescription,
  inputSchema: {
    coachId: { type: "number", description: "Coach ID (user_roles_id) (required)" },
    brickId: { type: "number", description: "Brick ID (required)" },
    avgComponent: { type: "object", description: "Manual component facts payload" },
  },
  zodSchema: brickSetComponentsInputSchema,
  handler: handleBrickSetComponents,
});

register({
  name: foodPlanSearchToolName,
  description: foodPlanSearchDescription,
  inputSchema: {
    coachId: { type: "number", description: "Coach ID (user_roles_id) (required)" },
    athleteId: { type: "number", description: "Optional athlete ID filter" },
    status: { type: "string", description: "Optional status: active, inactive, draft" },
    startDate: { type: "string", description: "Optional start date (YYYY-MM-DD)" },
    endDate: { type: "string", description: "Optional end date (YYYY-MM-DD)" },
    limit: { type: "number", description: "Max results (1-100, default 50)" },
  },
  zodSchema: foodPlanSearchInputSchema,
  handler: handleFoodPlanSearch,
});

register({
  name: foodPlanGetByIdToolName,
  description: foodPlanGetByIdDescription,
  inputSchema: {
    coachId: { type: "number", description: "Coach ID (user_roles_id) (required)" },
    foodPlanId: { type: "number", description: "Food plan ID (required)" },
  },
  zodSchema: foodPlanGetByIdInputSchema,
  handler: handleFoodPlanGetById,
});

register({
  name: foodPlanGetFullToolName,
  description: foodPlanGetFullDescription,
  inputSchema: {
    coachId: { type: "number", description: "Coach ID (user_roles_id) (required)" },
    foodPlanId: { type: "number", description: "Food plan ID (required)" },
  },
  zodSchema: foodPlanGetFullInputSchema,
  handler: handleFoodPlanGetFull,
});

register({
  name: foodPlanCreateToolName,
  description: foodPlanCreateDescription,
  inputSchema: {
    coachId: { type: "number", description: "Coach ID (user_roles_id) (required)" },
    athleteId: { type: "number", description: "Optional athlete ID" },
    name: { type: "string", description: "Optional plan name" },
    goals: { type: "string", description: "Optional goals text" },
    recommendations: { type: "string", description: "Optional recommendations text" },
    notes: { type: "string", description: "Optional notes text" },
    startDate: { type: "string", description: "Optional start date (YYYY-MM-DD)" },
    endDate: { type: "string", description: "Optional end date (YYYY-MM-DD)" },
    status: { type: "string", description: "Optional status: active, inactive, draft" },
    component: { type: "object", description: "Optional component summary payload" },
  },
  zodSchema: foodPlanCreateInputSchema,
  handler: handleFoodPlanCreate,
});

register({
  name: foodPlanUpdateToolName,
  description: foodPlanUpdateDescription,
  inputSchema: {
    coachId: { type: "number", description: "Coach ID (user_roles_id) (required)" },
    foodPlanId: { type: "number", description: "Food plan ID (required)" },
    athleteId: { type: "number", description: "Optional athlete ID (can be null)" },
    name: { type: "string", description: "Optional plan name" },
    goals: { type: "string", description: "Optional goals text" },
    recommendations: { type: "string", description: "Optional recommendations text" },
    notes: { type: "string", description: "Optional notes text" },
    startDate: { type: "string", description: "Optional start date (YYYY-MM-DD)" },
    endDate: { type: "string", description: "Optional end date (YYYY-MM-DD)" },
    status: { type: "string", description: "Optional status: active, inactive, draft" },
    component: { type: "object", description: "Optional component summary payload" },
  },
  zodSchema: foodPlanUpdateInputSchema,
  handler: handleFoodPlanUpdate,
});

register({
  name: foodPlanAddIntakeToolName,
  description: foodPlanAddIntakeDescription,
  inputSchema: {
    coachId: { type: "number", description: "Coach ID (user_roles_id) (required)" },
    foodPlanId: { type: "number", description: "Food plan ID (required)" },
    weekDay: { type: "string", description: "Week day label (required)" },
    foodIntakeTypeId: { type: "number", description: "Intake type ID (required)" },
    name: { type: "string", description: "Optional intake name" },
    description: { type: "string", description: "Optional intake description" },
    notes: { type: "string", description: "Optional intake notes" },
    order: { type: "number", description: "Optional order value (default 0)" },
  },
  zodSchema: foodPlanAddIntakeInputSchema,
  handler: handleFoodPlanAddIntake,
});

register({
  name: foodPlanRemoveIntakeToolName,
  description: foodPlanRemoveIntakeDescription,
  inputSchema: {
    coachId: { type: "number", description: "Coach ID (user_roles_id) (required)" },
    foodPlanId: { type: "number", description: "Food plan ID (required)" },
    foodIntakeId: { type: "number", description: "Food intake ID (required)" },
  },
  zodSchema: foodPlanRemoveIntakeInputSchema,
  handler: handleFoodPlanRemoveIntake,
});

register({
  name: foodPlanAddBrickToIntakeToolName,
  description: foodPlanAddBrickToIntakeDescription,
  inputSchema: {
    coachId: { type: "number", description: "Coach ID (user_roles_id) (required)" },
    foodIntakeId: { type: "number", description: "Food intake ID (required)" },
    brickId: { type: "number", description: "Brick ID (required)" },
    order: { type: "number", description: "Optional order value (default 0)" },
  },
  zodSchema: foodPlanAddBrickToIntakeInputSchema,
  handler: handleFoodPlanAddBrickToIntake,
});

register({
  name: foodPlanRemoveBrickFromIntakeToolName,
  description: foodPlanRemoveBrickFromIntakeDescription,
  inputSchema: {
    coachId: { type: "number", description: "Coach ID (user_roles_id) (required)" },
    foodIntakeId: { type: "number", description: "Food intake ID (required)" },
    foodIntakeEquivalenceId: {
      type: "number",
      description: "food_intake_equivalence row ID (required)",
    },
  },
  zodSchema: foodPlanRemoveBrickFromIntakeInputSchema,
  handler: handleFoodPlanRemoveBrickFromIntake,
});

register({
  name: intakeTypeListToolName,
  description: intakeTypeListDescription,
  inputSchema: {},
  zodSchema: intakeTypeListInputSchema,
  handler: handleIntakeTypeList,
});

export const getTool = (name: string): ToolDef | undefined => tools.get(name);

export const listTools = (): ToolDef[] => Array.from(tools.values());

export const handleToolCall = async (
  name: string,
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const tool = tools.get(name);
  if (!tool) {
    return { success: false, error: `Unknown tool: ${name}` };
  }
  return tool.handler(params);
};
