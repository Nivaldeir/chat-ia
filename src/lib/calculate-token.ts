type ModelPricing = {
  input: number;
  output: number;
};

enum EnumModel {
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

const pricing: Record<EnumModel, ModelPricing> = {
  [EnumModel.GPT_4O]: { input: 0.005 / 1000, output: 0.015 / 1000 },
  [EnumModel.GPT_4O_MINI]: { input: 0.004 / 1000, output: 0.012 / 1000 },
  [EnumModel.GPT_4O_MINI_2024_07_18]: { input: 0.004 / 1000, output: 0.012 / 1000 },
  [EnumModel.GPT_4O_2024_11_20]: { input: 0.005 / 1000, output: 0.015 / 1000 },
  [EnumModel.GPT_4O_2024_08_06]: { input: 0.005 / 1000, output: 0.015 / 1000 },
  [EnumModel.GPT_4O_2024_05_13]: { input: 0.005 / 1000, output: 0.015 / 1000 },
  [EnumModel.GPT_4_TURBO_PREVIEW]: { input: 0.01 / 1000, output: 0.03 / 1000 },
  [EnumModel.GPT_4_TURBO_2024_04_09]: { input: 0.01 / 1000, output: 0.03 / 1000 },
  [EnumModel.GPT_4_TURBO]: { input: 0.01 / 1000, output: 0.03 / 1000 },
  [EnumModel.GPT_4_1106_PREVIEW]: { input: 0.02 / 1000, output: 0.04 / 1000 },
  [EnumModel.GPT_4_0613]: { input: 0.03 / 1000, output: 0.06 / 1000 },
  [EnumModel.GPT_4_0125_PREVIEW]: { input: 0.02 / 1000, output: 0.04 / 1000 },
  [EnumModel.GPT_4]: { input: 0.03 / 1000, output: 0.06 / 1000 },
  [EnumModel.GPT_3_5_TURBO_16K]: { input: 0.0015 / 1000, output: 0.002 / 1000 },
  [EnumModel.GPT_3_5_TURBO_1106]: { input: 0.0015 / 1000, output: 0.002 / 1000 },
  [EnumModel.GPT_3_5_TURBO_0125]: { input: 0.0015 / 1000, output: 0.002 / 1000 },
  [EnumModel.GPT_3_5_TURBO]: { input: 0.0015 / 1000, output: 0.002 / 1000 }
};

export function calculateTokenCost(model: EnumModel, inputTokens: number, outputTokens: number): number {
  const modelPricing = pricing[model];
  if (!modelPricing) {
    throw new Error("Modelo não encontrado. Escolha um modelo válido do EnumModel");
  }
  
  const cost = inputTokens * modelPricing.input + outputTokens * modelPricing.output;
  return parseFloat(cost.toFixed(4));
}
