import {
  formatCount,
  formatIngredient,
  type ScalableIngredient,
} from "@/lib/dishScaling";

/** Standard US measuring cup, in mL. */
export const STANDARD_CUP_ML = 240;

export interface CupOption {
  id: string;
  /** Shown in the picker, e.g. "Rice-cooker cup (180 mL)". */
  label: string;
  /** Used in sentences: "rice-cooker cup" / "cup". */
  noun: string;
  ml: number;
}

/** A recipe that scales with how much of one main ingredient (rice) you cook. */
export interface AmountScalerConfig {
  /** Label for the number box, e.g. "Cups of rice". */
  inputLabel: string;
  /** The ingredient being counted, e.g. "jasmine rice". */
  riceName: string;
  /** Amount the recipe is written for, in `referenceCupId` cups. */
  reference: number;
  defaultAmount: number;
  cupOptions: CupOption[];
  /** The cup the original recipe is assumed to use. */
  referenceCupId: string;
  defaultCupId: string;
  /** Everything except the counted ingredient itself. */
  ingredients: ScalableIngredient[];
}

export function cupOf(config: AmountScalerConfig, id: string): CupOption {
  return (
    config.cupOptions.find((c) => c.id === id) ??
    config.cupOptions.find((c) => c.id === config.defaultCupId) ??
    config.cupOptions[0]
  );
}

/** How much of everything else to use, relative to the recipe as written. */
export function amountFactor(
  config: AmountScalerConfig,
  amount: number,
  cupId: string
): number {
  const cup = cupOf(config, cupId);
  const ref = cupOf(config, config.referenceCupId);
  return (amount * cup.ml) / (config.reference * ref.ml);
}

export function riceMl(config: AmountScalerConfig, amount: number, cupId: string): number {
  return amount * cupOf(config, cupId).ml;
}

export function riceLine(
  config: AmountScalerConfig,
  amount: number,
  cupId: string
): string {
  const cup = cupOf(config, cupId);
  const n = formatCount(amount);
  const noun = amount <= 1 ? cup.noun : `${cup.noun}s`;
  let line = `${n} ${noun} ${config.riceName}`;
  if (cup.ml !== STANDARD_CUP_ML) {
    const std = (amount * cup.ml) / STANDARD_CUP_ML;
    line += ` (about ${formatCount(std)} standard ${std <= 1 ? "cup" : "cups"})`;
  }
  return line;
}

export function renderAmountIngredients(
  config: AmountScalerConfig,
  amount: number,
  cupId: string
): string[] {
  const f = amountFactor(config, amount, cupId);
  return [
    riceLine(config, amount, cupId),
    ...config.ingredients.map((ing) => formatIngredient(ing, f)),
  ];
}
