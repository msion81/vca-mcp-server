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
