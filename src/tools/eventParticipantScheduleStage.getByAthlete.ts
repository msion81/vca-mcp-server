import {
  eventParticipantScheduleStageGetByAthleteSchema,
  type EventParticipantScheduleStageGetByAthleteInput,
} from "../schemas/eventParticipantScheduleStage.js";
import { eventParticipantScheduleStageService } from "../services/eventParticipantScheduleStage.service.js";
import { error, type ToolResponse } from "../types/responses.js";

export const toolName = "eventParticipantScheduleStage.getByAthlete";

export const description =
  "List an athlete's schedule stages for an event/edition (optionally filtered by a specific event).";

export const inputSchema = eventParticipantScheduleStageGetByAthleteSchema;

export const handleEventParticipantScheduleStageGetByAthlete = async (
  params: unknown
): Promise<ToolResponse<unknown>> => {
  const parsed = eventParticipantScheduleStageGetByAthleteSchema.safeParse(params);
  if (!parsed.success) return error(parsed.error.message);

  return eventParticipantScheduleStageService.getByAthlete(
    parsed.data as EventParticipantScheduleStageGetByAthleteInput
  );
};
