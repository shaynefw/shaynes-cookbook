import { formatIngredient, type ScalableIngredient } from "@/lib/dishScaling";

export interface SubstitutionOption {
  name: string;
  /** What you need instead, for the recipe's reference amount. */
  parts: ScalableIngredient[];
  /** Why/when to pick this one. */
  note?: string;
}

/** "Don't have X? Use one of these", scaled with the recipe. */
export interface IngredientSubstitution {
  /** Panel title, e.g. "No gochujang? Try one of these". */
  title: string;
  /** What the amounts below replace, e.g. "3 tbsp of gochujang". */
  replaces: string;
  options: SubstitutionOption[];
  caution?: string;
  sources?: { name: string; url: string }[];
}

export function renderOption(option: SubstitutionOption, factor: number): string[] {
  return option.parts.map((p) => formatIngredient(p, factor));
}
