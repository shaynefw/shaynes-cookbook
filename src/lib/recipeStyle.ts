// Colour themes for recipe cards and headers. There are no photos, so each
// recipe gets a tinted banner; the theme follows its tags (spicy = red, veg =
// green...) and otherwise comes from the slug so it stays the same every visit.

export interface RecipePalette {
  /** Gradient classes for the banner behind a card or recipe title. */
  banner: string;
  /** Small label chip. */
  chip: string;
  /** Hover colour for the title. */
  hover: string;
}

const PALETTES: Record<string, RecipePalette> = {
  amber: {
    banner:
      "from-amber-200 via-amber-100 to-orange-100 dark:from-amber-800/60 dark:via-amber-900/30 dark:to-stone-900/40",
    chip: "bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200",
    hover: "group-hover:text-amber-700 dark:group-hover:text-amber-300",
  },
  orange: {
    banner:
      "from-orange-200 via-orange-100 to-amber-50 dark:from-orange-800/55 dark:via-orange-900/30 dark:to-stone-900/40",
    chip: "bg-orange-100 text-orange-900 dark:bg-orange-900/50 dark:text-orange-200",
    hover: "group-hover:text-orange-700 dark:group-hover:text-orange-300",
  },
  rose: {
    banner:
      "from-rose-200 via-rose-100 to-orange-50 dark:from-rose-800/55 dark:via-rose-900/30 dark:to-stone-900/40",
    chip: "bg-rose-100 text-rose-900 dark:bg-rose-900/50 dark:text-rose-200",
    hover: "group-hover:text-rose-700 dark:group-hover:text-rose-300",
  },
  emerald: {
    banner:
      "from-emerald-200 via-lime-100 to-amber-50 dark:from-emerald-800/55 dark:via-emerald-900/30 dark:to-stone-900/40",
    chip: "bg-emerald-100 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-200",
    hover: "group-hover:text-emerald-700 dark:group-hover:text-emerald-300",
  },
  teal: {
    banner:
      "from-teal-200 via-cyan-100 to-emerald-50 dark:from-teal-800/55 dark:via-teal-900/30 dark:to-stone-900/40",
    chip: "bg-teal-100 text-teal-900 dark:bg-teal-900/50 dark:text-teal-200",
    hover: "group-hover:text-teal-700 dark:group-hover:text-teal-300",
  },
};

const KEYS = Object.keys(PALETTES);

const BY_TAG: [string[], string][] = [
  [["spicy", "caribbean"], "rose"],
  [["vegan", "vegetarian", "healthy"], "emerald"],
  [["drink", "hydration"], "teal"],
  [["baking", "breakfast"], "amber"],
  [["casserole", "rice cooker", "one-pot", "stew"], "orange"],
];

export function paletteFor(slug: string, tags: string[]): RecipePalette {
  for (const [match, key] of BY_TAG) {
    if (tags.some((t) => match.includes(t))) return PALETTES[key];
  }
  let h = 0;
  for (const c of slug) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return PALETTES[KEYS[h % KEYS.length]];
}
