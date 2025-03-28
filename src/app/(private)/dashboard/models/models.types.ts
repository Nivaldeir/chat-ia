import { z } from "zod"

export enum EnumModel {
  GPT_4O = "gpt-4o",
  GPT_4O_MINI = "gpt-4o-mini",
  GPT_4O_MINI_2024_07_18 = "gpt-4o-mini-2024-07-18",
  GPT_4O_2024_11_20 = "gpt-4o-2024-11-20",
  GPT_4O_2024_08_06 = "gpt-4o-2024-08-06",
  GPT_4O_2024_05_13 = "gpt-4o-2024-05-13",
  GPT_4_TURBO_PREVIEW = "gpt-4-turbo-preview",
  GPT_4_TURBO_2024_04_09 = "gpt-4-turbo-2024-04-09",
  GPT_4_TURBO = "gpt-4-turbo",
  GPT_4_1106_PREVIEW = "gpt-4-1106-preview",
  GPT_4_0613 = "gpt-4-0613",
  GPT_4_0125_PREVIEW = "gpt-4-0125-preview",
  GPT_4 = "gpt-4",
  GPT_3_5_TURBO_16K = "gpt-3.5-turbo-16k",
  GPT_3_5_TURBO_1106 = "gpt-3.5-turbo-1106",
  GPT_3_5_TURBO_0125 = "gpt-3.5-turbo-0125",
  GPT_3_5_TURBO = "gpt-3.5-turbo"
}

export const formCreateAssistentSchema = z.object({
  name: z.string()
    .min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' })
    .max(50, { message: 'O nome deve ter no máximo 50 caracteres.' }),
  team: z.string(),
  description: z.string().optional(),
  model: z.nativeEnum(EnumModel, {
    errorMap: (issue, _ctx) => {
      switch (issue.code) {
        case 'invalid_type':
          return { message: 'Tipo inválido fornecido para o modelo.' };
        case 'invalid_enum_value':
          return { message: 'Modelo selecionado é inválido. Selecione um modelo válido.' };
        default:
          return { message: 'Valor inválido para o modelo.' };
      }
    },
  }),
  instructions: z.string().optional(),
  files_ids: z
    .array(z.string().optional()).optional(),
  temperature: z.number()
    .min(0, { message: 'A temperatura deve ser no mínimo 0.' })
    .max(1, { message: 'A temperatura deve ser no máximo 1.' }).default(0.7)
    .optional(),
});
