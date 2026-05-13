import { z } from "zod";

/** coachId = user_roles.id (same as injected coach scope). */
export const coachGetTimezoneSchema = z.object({
  coachId: z.number().int().positive(),
});

export type CoachGetTimezoneInput = z.infer<typeof coachGetTimezoneSchema>;
