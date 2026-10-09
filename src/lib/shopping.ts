import { formatAmount, type IngredientUnit } from "@/lib/dishScaling";

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

    if (item.pack) {
      const f = ctx.factors ?? { volume: 1, area: 1 };
      const total = item.pack.needed.reduce(
        (sum, n) => sum + n.amount * (n.scaleBy === "area" ? f.area : f.volume),
        0
      );
      // Up to 12% over a whole pack still counts as that pack (1.09 cans of
      // soup reads as "1 can" in the ingredient list, so buy 1, not 2).
      const count = Math.max(1, Math.ceil(total / item.pack.size - 0.12));
      buy = `${count} × ${count === 1 ? item.pack.label : item.pack.plural}`;
      uses = item.pack.unit === "can" ? undefined : formatAmount(total, item.pack.unit);
    } else if (ctx.variation && item.variations?.[ctx.variation]) {
      const v = item.variations[ctx.variation];
      buy = v.buy ?? buy;
      uses = v.uses ?? uses;
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
