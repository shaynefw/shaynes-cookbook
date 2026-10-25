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

/**
 * A recipe whose amounts scale with how much of one thing you make: cups of
 * rice, mugs of tea. Plain data only (it is passed from server to client).
 */
export interface AmountScalerConfig {
  /** Panel title, e.g. "Scale by rice". */
  title: string;
  /** One-line explanation under the title. */
  intro: string;
  /** Label for the number box, e.g. "Cups of rice". */
  inputLabel: string;
  /** If set, the counted ingredient gets its own first line, e.g. "jasmine rice". */
  riceName?: string;
  /** Amount the recipe is written for (in `referenceCupId` cups if cups are used). */
  reference: number;
  defaultAmount: number;
  /** Singular and plural names for what is being counted, e.g. "large mug". */
  unitNoun?: { singular: string; plural: string };
  /** Shown as "That makes about N mL (...) of water": per one unit. */
  perUnit?: { ml: number; label: string };
  /** Optional cup picker (rice). Leave out when there is only one sensible size. */
  cupOptions?: CupOption[];
  /** The cup the original recipe is assumed to use. */
  referenceCupId?: string;
  defaultCupId?: string;
  /** Highlighted explanation shown with the cup picker. */
  cupNote?: string;
  /** Everything except the counted ingredient itself. */
  ingredients: ScalableIngredient[];
}

export function hasCups(config: AmountScalerConfig): boolean {
  return !!config.cupOptions && config.cupOptions.length > 0;
}

export function cupOf(config: AmountScalerConfig, id: string): CupOption | undefined {
  const opts = config.cupOptions ?? [];
  return (
    opts.find((c) => c.id === id) ??
    opts.find((c) => c.id === config.defaultCupId) ??
    opts[0]
  );
}

/** How much of everything else to use, relative to the recipe as written. */
export function amountFactor(
  config: AmountScalerConfig,
  amount: number,
  cupId: string
): number {
  const cup = cupOf(config, cupId);
  const ref = config.referenceCupId ? cupOf(config, config.referenceCupId) : undefined;
  if (!cup || !ref) return amount / config.reference;
  return (amount * cup.ml) / (config.reference * ref.ml);
}

export function riceMl(config: AmountScalerConfig, amount: number, cupId: string): number {
  return amount * (cupOf(config, cupId)?.ml ?? 0);
}

export function riceLine(
  config: AmountScalerConfig,
  amount: number,
  cupId: string
): string {
  const cup = cupOf(config, cupId);
  const n = formatCount(amount);
  const noun = cup ? (amount <= 1 ? cup.noun : `${cup.noun}s`) : "";
  let line = [n, noun, config.riceName].filter(Boolean).join(" ");
  if (cup && cup.ml !== STANDARD_CUP_ML) {
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
  const lines = config.ingredients.map((ing) => formatIngredient(ing, f));
  return config.riceName ? [riceLine(config, amount, cupId), ...lines] : lines;
}
