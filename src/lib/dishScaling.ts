export type DishShape = "rectangle" | "round" | "oval";

export interface DishDims {
  shape: DishShape;
  /** Length in inches (diameter for round dishes). */
  length: number;
  /** Width in inches (ignored for round dishes). */
  width: number;
  /** Inside depth in inches. */
  depth: number;
}

export interface DishPreset {
  id: string;
  label: string;
  dims: DishDims;
}

export type IngredientUnit = "cup" | "tbsp" | "tsp" | "oz" | "can";

export interface ScalableIngredient {
  /** Amount for the reference dish. */
  amount: number;
  unit: IngredientUnit;
  name: string;
  note?: string;
  /** "volume" = part of the filling, "area" = covers the top. */
  scaleBy: "volume" | "area";
  /** Optional "about N x <label>" hint, e.g. how many 5 oz cans. */
  alt?: { size: number; label: string };
}

export interface DishScalerConfig {
  reference: DishDims;
  referenceServings: number;
  /** Empty space (inches) to leave between the filling and the rim. */
  headroom: number;
  presets: DishPreset[];
  defaultPresetId: string;
  ingredients: ScalableIngredient[];
}

export interface ScaleFactors {
  /** Footprint (surface area) vs. the reference dish. */
  area: number;
  /** Usable volume vs. the reference dish. */
  volume: number;
  /** Filling depth vs. the reference dish (volume / area). */
  layer: number;
  /** Usable volume in US cups. */
  cups: number;
  /** Filling depth in inches. */
  fillDepth: number;
}

const CUBIC_INCHES_PER_CUP = 14.4375;

export function footprint(d: DishDims): number {
  if (d.shape === "round") return Math.PI * (d.length / 2) ** 2;
  if (d.shape === "oval") return (Math.PI / 4) * d.length * d.width;
  return d.length * d.width;
}

export function isValidDish(d: DishDims, headroom: number): boolean {
  const ok = (n: number) => Number.isFinite(n) && n > 0;
  if (!ok(d.length) || !ok(d.depth)) return false;
  if (d.shape !== "round" && !ok(d.width)) return false;
  return d.depth > headroom;
}

export function scaleFactors(
  dish: DishDims,
  reference: DishDims,
  headroom: number
): ScaleFactors {
  const area = footprint(dish) / footprint(reference);
  const fillDepth = Math.max(dish.depth - headroom, 0);
  const refFill = reference.depth - headroom;
  const volume = (footprint(dish) * fillDepth) / (footprint(reference) * refFill);
  return {
    area,
    volume,
    layer: fillDepth / refFill,
    cups: (footprint(dish) * fillDepth) / CUBIC_INCHES_PER_CUP,
    fillDepth,
  };
}

// ---------- kitchen-friendly formatting ----------

const GLYPHS: Record<string, string> = {
  "0.125": "⅛",
  "0.25": "¼",
  "0.333": "⅓",
  "0.375": "⅜",
  "0.5": "½",
  "0.625": "⅝",
  "0.667": "⅔",
  "0.75": "¾",
  "0.875": "⅞",
};

// Standard measuring-cup sizes only.
const CUP_FRACTIONS = [0, 0.25, 0.333, 0.5, 0.667, 0.75, 1];
const EIGHTH_FRACTIONS = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];
const HALF_FRACTIONS = [0, 0.5, 1];
const QUARTER_FRACTIONS = [0, 0.25, 0.5, 0.75, 1];

function snap(value: number, fractions: number[]): string {
  let whole = Math.floor(value);
  const frac = value - whole;
  let best = fractions[0];
  for (const f of fractions) {
    if (Math.abs(f - frac) < Math.abs(best - frac)) best = f;
  }
  if (best === 1) {
    whole += 1;
    best = 0;
  }
  const glyph = best === 0 ? "" : GLYPHS[String(best)];
  if (whole === 0) return glyph || "0";
  return `${whole}${glyph}`;
}

function quantity(amount: number, unit: IngredientUnit): { text: string; unit: string } {
  switch (unit) {
    case "cup": {
      if (amount < 0.2) {
        const tbsp = amount * 16;
        return { text: snap(tbsp, QUARTER_FRACTIONS), unit: "tbsp" };
      }
      const text = snap(amount, CUP_FRACTIONS);
      return { text, unit: isSingular(text) ? "cup" : "cups" };
    }
    case "tbsp":
      return { text: snap(amount, QUARTER_FRACTIONS), unit: "tbsp" };
    case "tsp":
      return { text: snap(amount, EIGHTH_FRACTIONS), unit: "tsp" };
    case "oz":
      return { text: snap(amount, HALF_FRACTIONS), unit: "oz" };
    case "can": {
      const text = snap(amount, HALF_FRACTIONS);
      return { text, unit: isSingular(text) ? "can" : "cans" };
    }
  }
}

/** "1", "½", "¾" read as singular ("1 cup", "¾ cup"); "1½", "2" as plural. */
function isSingular(text: string): boolean {
  return text === "1" || /^[⅛¼⅓⅜½⅝⅔¾⅞]$/.test(text);
}

/** "1⅓ cups", "3 cans": an amount in kitchen-friendly form. */
export function formatAmount(amount: number, unit: IngredientUnit): string {
  const q = quantity(amount, unit);
  return `${q.text} ${q.unit}`;
}

export function formatIngredient(ing: ScalableIngredient, factor: number): string {
  const q = quantity(ing.amount * factor, ing.unit);
  let line = `${q.text} ${q.unit} ${ing.name}`;
  if (ing.note) line += `, ${ing.note}`;
  if (ing.alt) {
    const n = snap((ing.amount * factor) / ing.alt.size, HALF_FRACTIONS);
    line += ` (about ${n} × ${ing.alt.label})`;
  }
  return line;
}

export function renderIngredients(
  config: DishScalerConfig,
  dish: DishDims
): string[] {
  const f = scaleFactors(dish, config.reference, config.headroom);
  return config.ingredients.map((ing) =>
    formatIngredient(ing, ing.scaleBy === "area" ? f.area : f.volume)
  );
}

export function estimateServings(config: DishScalerConfig, factor: number): number {
  return Math.max(1, Math.round(config.referenceServings * factor));
}

export function formatCups(cups: number): string {
  return snap(cups, QUARTER_FRACTIONS);
}

/** Bake-time guidance based on how thick the filling layer is vs. the original. */
export function bakeHint(layer: number): string {
  if (layer > 1.15) {
    return "Your filling will be deeper than the original, so expect 30–40 minutes. If the top browns before the middle is bubbling, cover loosely with foil.";
  }
  if (layer < 0.85) {
    return "Your filling will be shallower than the original, so start checking at about 20 minutes.";
  }
  return "Your filling will be about the same depth as the original: bake 25–30 minutes.";
}
