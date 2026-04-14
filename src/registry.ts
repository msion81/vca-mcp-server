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
