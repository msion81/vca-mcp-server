import { z } from "zod";

export const questionnaireGetStructureSchema = z.object({
  categoryCode: z.string().optional(),
  active: z.boolean().optional().default(true),
});

export type QuestionnaireGetStructureInput = z.infer<typeof questionnaireGetStructureSchema>;

export interface QuestionnaireOption {
  id: number;
  optionText: string;
  order: number;
}

export interface QuestionnaireQuestion {
  id: number;
  questionText: string;
  questionTypeId: number | null;
  note: string | null;
  order: number;
  options: QuestionnaireOption[];
}

export interface QuestionnaireCategory {
  id: number;
  name: string;
  code: string;
  sex: string;
  questions: QuestionnaireQuestion[];
}

export const questionnaireCheckAnsweredSchema = z.object({
  coachId: z.number().int().positive(),
  athleteId: z.number().int().positive(),
  // Si falta, cae al cuestionario tipo=1 (pre-anamnesis) del coach — mismo
  // fallback que ya usa vca-server (questionnairePreAnamnesis).
  questionnaireId: z.number().int().positive().optional(),
  // ISO instant: solo cuentan respuestas posteriores a este momento (el
  // appointment.createdAt del OPT que se está evaluando).
  since: z.string().datetime({ offset: true }),
});

export type QuestionnaireCheckAnsweredInput = z.infer<typeof questionnaireCheckAnsweredSchema>;

export interface QuestionnaireAnsweredResult {
  answered: boolean;
  lastAnsweredAt: string | null;
}
