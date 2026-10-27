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

/** A kind of rice (or other main ingredient) with its own tested water ratio. */
export interface RiceType {
  id: string;
  /** Shown in the picker. */
  label: string;
  /** Name used on the first ingredient line, e.g. "parboiled rice". */
  riceName: string;
  /** Shown under the pickers. */
  note?: string;
  /**
   * For these ingredients the amount is `ratio` x the rice amount, measured in the
   * same cup as the rice (1 cup of rice -> 1⅛ cups of water = ratio 1.125).
   */
  overrides?: { key: string; ratio: number }[];
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
  /** Optional rice types, each able to override some amounts (like the water). */
  riceTypes?: RiceType[];
  defaultRiceTypeId?: string;
  /** Everything except the counted ingredient itself. */
  ingredients: ScalableIngredient[];
}

export function hasTypes(config: AmountScalerConfig): boolean {
  return !!config.riceTypes && config.riceTypes.length > 0;
}

export function typeOf(config: AmountScalerConfig, id?: string): RiceType | undefined {
  const types = config.riceTypes ?? [];
  return types.find((t) => t.id === id) ?? types.find((t) => t.id === config.defaultRiceTypeId) ?? types[0];
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
  cupId: string,
  typeId?: string
): string {
  const cup = cupOf(config, cupId);
  const n = formatCount(amount);
  const noun = cup ? (amount <= 1 ? cup.noun : `${cup.noun}s`) : "";
  const riceName = typeOf(config, typeId)?.riceName ?? config.riceName;
  let line = [n, noun, riceName].filter(Boolean).join(" ");
  if (cup && cup.ml !== STANDARD_CUP_ML) {
    const std = (amount * cup.ml) / STANDARD_CUP_ML;
    line += ` (about ${formatCount(std)} standard ${std <= 1 ? "cup" : "cups"})`;
  }
  return line;
}

/** An ingredient measured in the same cup as the rice, e.g. "1⅛ cups water (about 270 mL)". */
function sameCupLine(
  config: AmountScalerConfig,
  ing: ScalableIngredient,
  amount: number,
  ratio: number,
  cupId: string
): string {
  const cup = cupOf(config, cupId);
  const a = amount * ratio;
  const noun = cup ? (a <= 1 ? cup.noun : `${cup.noun}s`) : a <= 1 ? "cup" : "cups";
  let line = `${formatCount(a)} ${noun} ${ing.name}`;
  if (ing.note) line += `, ${ing.note}`;
  if (ing.metric?.unit === "mL") {
    const ml = a * (cup?.ml ?? STANDARD_CUP_ML);
    line += ` (about ${Math.round(ml / 5) * 5} mL)`;
  }
  return line;
}

export function renderAmountIngredients(
  config: AmountScalerConfig,
  amount: number,
  cupId: string,
  typeId?: string
): string[] {
  const f = amountFactor(config, amount, cupId);
  const overrides = typeOf(config, typeId)?.overrides ?? [];
  const lines = config.ingredients.map((ing) => {
    const o = ing.key ? overrides.find((x) => x.key === ing.key) : undefined;
    return o ? sameCupLine(config, ing, amount, o.ratio, cupId) : formatIngredient(ing, f);
  });
  const hasRice = !!(config.riceName || typeOf(config, typeId)?.riceName);
  return hasRice ? [riceLine(config, amount, cupId, typeId), ...lines] : lines;
}
