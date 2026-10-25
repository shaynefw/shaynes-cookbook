import {
  formatAmount,
  formatKitchenVolume,
  formatVolumeRange,
  toTsp,
  type IngredientUnit,
} from "@/lib/dishScaling";

export type Aisle =
  | "Produce"
  | "Meat & seafood"
  | "Dairy & eggs"
  | "Frozen"
  | "Canned & jarred"
  | "Pasta & dry goods"
  | "Crackers & snacks"
  | "Baking"
  | "Spices & seasonings"
  | "Sauces & condiments"
  | "Asian & international"
  | "Other";

/** Roughly the order you walk through a store. */
export const AISLE_ORDER: Aisle[] = [
  "Produce",
  "Meat & seafood",
  "Dairy & eggs",
  "Frozen",
  "Canned & jarred",
  "Pasta & dry goods",
  "Crackers & snacks",
  "Baking",
  "Spices & seasonings",
  "Sauces & condiments",
  "Asian & international",
  "Other",
];

export interface ShoppingPack {
  /** Singular and plural names, e.g. "12 oz bag" / "12 oz bags". */
  label: string;
  plural: string;
  /** How much one pack holds, in `unit`. */
  size: number;
  unit: IngredientUnit;
  /** What the recipe uses at the reference dish size, split by how it scales. */
  needed: { amount: number; scaleBy: "volume" | "area" }[];
  /** For unit "each": the word to show in "Recipe uses", e.g. "eggs". */
  usesWord?: string;
  /** Same word when the count is 1, e.g. "egg". */
  usesWordSingular?: string;
}

export interface ShoppingItem {
  name: string;
  aisle: Aisle;
  /** How it is sold, e.g. "1 jar". Ignored when `pack` is set. */
  buy?: string;
  /** How much the recipe uses, e.g. "1 tsp". */
  uses?: string;
  note?: string;
  /** Probably already in the kitchen (salt, pepper, oil). */
  pantry?: boolean;
  optional?: boolean;
  /** Count the packs from the scaled amount instead of using `buy`. */
  pack?: ShoppingPack;
  /** Keep `buy` as written but compute "Recipe uses" from the scaled amount. */
  usesScaled?: {
    needed: { amount: number; scaleBy: "volume" | "area" }[];
    unit: IngredientUnit;
    /** Show as cups / spoons (1⅔ cups, ½ cup + 1 tbsp). */
    smart?: boolean;
    /** Show a range: the top end is the low end times this ("1–2 tsp" = 2). */
    rangeFactor?: number;
  };
  /** Different text for a chosen portion size, keyed by the variation's name. */
  variations?: Record<string, { buy?: string; uses?: string }>;
}

export interface ShoppingRow {
  key: string;
  name: string;
  aisle: Aisle;
  buy: string;
  uses?: string;
  note?: string;
  pantry: boolean;
  optional: boolean;
}

export interface ShoppingContext {
  /** Name of the selected portion size; undefined for the full batch. */
  variation?: string;
  /** Scale factors from the dish scaler; undefined means the original size. */
  factors?: { volume: number; area: number };
}

export function resolveShopping(
  items: ShoppingItem[],
  ctx: ShoppingContext
): ShoppingRow[] {
  return items.map((item) => {
    let buy = item.buy ?? "";
    let uses = item.uses;

    const f = ctx.factors ?? { volume: 1, area: 1 };
    const sumNeeded = (needed: { amount: number; scaleBy: "volume" | "area" }[]) =>
      needed.reduce(
        (sum, n) => sum + n.amount * (n.scaleBy === "area" ? f.area : f.volume),
        0
      );

    if (item.pack) {
      const total = sumNeeded(item.pack.needed);
      let count: number;
      if (item.pack.unit === "each") {
        // Whole items: buy what the ingredient list shows (rounded to whole).
        count = Math.max(1, Math.ceil(Math.max(1, Math.round(total)) / item.pack.size));
        const n = Math.max(1, Math.round(total));
        const word =
          n === 1 && item.pack.usesWordSingular ? item.pack.usesWordSingular : item.pack.usesWord;
        uses = word ? `${n} ${word}` : undefined;
      } else {
        // Up to 12% over a whole pack still counts as that pack (1.09 cans of
        // soup reads as "1 can" in the ingredient list, so buy 1, not 2).
        count = Math.max(1, Math.ceil(total / item.pack.size - 0.12));
        uses =
          item.pack.unit === "can" ? undefined : formatAmount(total, item.pack.unit);
      }
      buy = `${count} × ${count === 1 ? item.pack.label : item.pack.plural}`;
    } else if (ctx.variation && item.variations?.[ctx.variation]) {
      const v = item.variations[ctx.variation];
      buy = v.buy ?? buy;
      uses = v.uses ?? uses;
    }

    // A scaled "Recipe uses" amount wins over any static or pack-derived text.
    if (item.usesScaled) {
      const total = sumNeeded(item.usesScaled.needed);
      const u = item.usesScaled.unit;
      const isVolume = u === "cup" || u === "tbsp" || u === "tsp";
      uses =
        item.usesScaled.smart && isVolume
          ? item.usesScaled.rangeFactor
            ? formatVolumeRange(toTsp(total, u), toTsp(total * item.usesScaled.rangeFactor, u))
            : formatKitchenVolume(toTsp(total, u))
          : formatAmount(total, u);
    }

    return {
      key: `${item.aisle}:${item.name}`,
      name: item.name,
      aisle: item.aisle,
      buy,
      uses,
      note: item.note,
      pantry: !!item.pantry,
      optional: !!item.optional,
    };
  });
}

export function groupByAisle(
  rows: ShoppingRow[]
): { aisle: Aisle; rows: ShoppingRow[] }[] {
  return AISLE_ORDER.map((aisle) => ({
    aisle,
    rows: rows.filter((r) => !r.pantry && r.aisle === aisle),
  })).filter((g) => g.rows.length > 0);
}

/** Plain-text version for pasting into Notes or a message. */
export function shoppingListText(title: string, rows: ShoppingRow[]): string {
  const lines = [`Shopping list: ${title}`];
  for (const g of groupByAisle(rows)) {
    lines.push("", g.aisle.toUpperCase());
    for (const r of g.rows) {
      lines.push(`- ${r.name}: ${r.buy}${r.optional ? " (optional)" : ""}`);
    }
  }
  return lines.join("\n");
}
