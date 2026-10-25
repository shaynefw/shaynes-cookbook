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

/** "each" = whole items (eggs, zucchini), shown with no unit word. */
export type IngredientUnit = "cup" | "tbsp" | "tsp" | "oz" | "can" | "each" | "inch";

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
  /** A fixed line that never scales, e.g. "salt, to taste". */
  text?: string;
  /** Show cups / spoons the way a cook would measure them (1⅔ cups, ½ cup + 1 tbsp). */
  smart?: boolean;
  /** Adds "(about 250 g)" or "(about 375 mL)", scaled with the amount. */
  metric?: { perUnit: number; unit: "g" | "mL" | "cm" };
  /** Name to use when the amount isn't 1 (whole items): "garlic cloves". */
  plural?: string;
  /** Top of a range ("1–2 tsp"): `amount` is the low end. Volume units only. */
  amountMax?: number;
}

export interface DishScalerConfig {
  reference: DishDims;
  referenceServings: number;
  /** Empty space (inches) to leave between the filling and the rim. */
  headroom: number;
  presets: DishPreset[];
  defaultPresetId: string;
  ingredients: ScalableIngredient[];
  /** Recipe-specific bake-time wording; falls back to a generic casserole note. */
  bakeNotes?: { same: string; deeper: string; shallower: string };
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
    case "each":
      return { text: String(Math.max(1, Math.round(amount))), unit: "" };
    case "inch":
      return { text: snap(amount, QUARTER_FRACTIONS), unit: amount <= 1 ? "inch" : "inches" };
  }
}

/** "1", "½", "¾" read as singular ("1 cup", "¾ cup"); "1½", "2" as plural. */
function isSingular(text: string): boolean {
  return text === "1" || /^[⅛¼⅓⅜½⅝⅔¾⅞]$/.test(text);
}

/** "1⅓ cups", "3 cans": an amount in kitchen-friendly form. */
export function formatAmount(amount: number, unit: IngredientUnit): string {
  const q = quantity(amount, unit);
  return `${q.text} ${q.unit}`.trim();
}

const TSP_PER_UNIT = { cup: 48, tbsp: 3, tsp: 1 } as const;

export function toTsp(amount: number, unit: "cup" | "tbsp" | "tsp"): number {
  return amount * TSP_PER_UNIT[unit];
}

/** A whole-number-or-fraction count like "2½" (nearest ⅛). */
export function formatCount(n: number): string {
  return snap(n, EIGHTH_FRACTIONS);
}

/** Spoon sizes only: "1 tbsp + 1¼ tsp". `t` is in teaspoons. */
function spoonForm(t: number): string {
  const q = Math.round(t * 4) / 4;
  let tbsp = Math.floor(q / 3 + 1e-9);
  let rest = Math.round((q - tbsp * 3) * 4) / 4;
  if (rest >= 3) {
    tbsp += 1;
    rest = 0;
  }
  const parts: string[] = [];
  if (tbsp > 0) parts.push(`${tbsp} tbsp`);
  if (rest > 0) parts.push(`${snap(rest, EIGHTH_FRACTIONS)} tsp`);
  return parts.join(" + ") || "0 tsp";
}

/**
 * Express a volume (in teaspoons) in whatever the cook would reach for:
 * a plain cup fraction (1⅔ cups) when it fits, spoons for small amounts
 * (6 tbsp, 1 tbsp + 1 tsp), otherwise cups plus spoons (1½ cups + 1 tbsp).
 */
export function formatKitchenVolume(tsp: number): string {
  if (tsp <= 0) return "0 tsp";
  if (tsp < 12) return spoonForm(tsp);

  const tol = Math.max(1.5, tsp * 0.03);
  const whole = Math.floor(tsp / 48);
  let best = { f: 0, err: Infinity };
  for (const f of CUP_FRACTIONS) {
    const err = Math.abs((whole + f) * 48 - tsp);
    if (err < best.err) best = { f, err };
  }
  if (best.err <= tol) {
    const text = snap(whole + best.f, CUP_FRACTIONS);
    return `${text} ${isSingular(text) ? "cup" : "cups"}`;
  }

  if (tsp <= 24) return spoonForm(tsp);

  // Cups in quarter-cup steps, plus the leftover in half-tablespoons.
  let quarters = Math.floor(tsp / 12);
  let halfTbsp = Math.round(((tsp - quarters * 12) / 3) * 2); // 0..8
  if (halfTbsp >= 8) {
    quarters += 1;
    halfTbsp = 0;
  }
  const cupsText = snap(quarters / 4, QUARTER_FRACTIONS);
  const cupsPart = `${cupsText} ${isSingular(cupsText) ? "cup" : "cups"}`;
  return halfTbsp === 0
    ? cupsPart
    : `${cupsPart} + ${snap(halfTbsp / 2, HALF_FRACTIONS)} tbsp`;
}

/** "1–2 tsp", or "2 tsp to 1 tbsp + 2 tsp" when the two ends use different units. */
export function formatVolumeRange(lowTsp: number, highTsp: number): string {
  // Small ranges read best as plain spoons: "2–4 tsp", "1–2 tbsp" (not "1 tbsp + 1 tsp").
  if (highTsp <= 12.01) {
    const whole3 = (v: number) => Math.abs(v / 3 - Math.round(v / 3)) < 0.01;
    if (lowTsp >= 3 && whole3(lowTsp) && whole3(highTsp)) {
      return `${Math.round(lowTsp / 3)}–${Math.round(highTsp / 3)} tbsp`;
    }
    return `${snap(lowTsp, EIGHTH_FRACTIONS)}–${snap(highTsp, EIGHTH_FRACTIONS)} tsp`;
  }
  const a = formatKitchenVolume(lowTsp);
  const b = formatKitchenVolume(highTsp);
  const ma = a.match(/^(\S+) (tsp|tbsp|cups?)$/);
  const mb = b.match(/^(\S+) (tsp|tbsp|cups?)$/);
  if (ma && mb && ma[2] === mb[2]) return `${ma[1]}–${mb[1]} ${mb[2]}`;
  return `${a} to ${b}`;
}

export function formatIngredient(ing: ScalableIngredient, factor: number): string {
  if (ing.text !== undefined) return ing.text;
  const amount = ing.amount * factor;
  let line: string;
  if (ing.smart && (ing.unit === "cup" || ing.unit === "tbsp" || ing.unit === "tsp")) {
    const volume =
      ing.amountMax !== undefined
        ? formatVolumeRange(toTsp(amount, ing.unit), toTsp(ing.amountMax * factor, ing.unit))
        : formatKitchenVolume(toTsp(amount, ing.unit));
    line = `${volume} ${ing.name}`;
  } else if (ing.unit === "inch") {
    line = `${snap(amount, QUARTER_FRACTIONS)}-inch ${ing.name}`;
  } else {
    const q = quantity(amount, ing.unit);
    const name = ing.plural && q.text !== "1" ? ing.plural : ing.name;
    line = [q.text, q.unit, name].filter(Boolean).join(" ");
  }
  if (ing.note) line += `, ${ing.note}`;
  if (ing.metric) {
    const raw = amount * ing.metric.perUnit;
    const v = ing.metric.unit === "cm" ? Math.round(raw * 2) / 2 : Math.round(raw / 5) * 5;
    line += ` (about ${v} ${ing.metric.unit})`;
  }
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
export function bakeHint(
  layer: number,
  notes?: { same: string; deeper: string; shallower: string }
): string {
  const n = notes ?? {
    deeper:
      "Your filling will be deeper than the original, so expect 30–40 minutes. If the top browns before the middle is bubbling, cover loosely with foil.",
    shallower:
      "Your filling will be shallower than the original, so start checking at about 20 minutes.",
    same: "Your filling will be about the same depth as the original: bake 25–30 minutes.",
  };
  if (layer > 1.15) return n.deeper;
  if (layer < 0.85) return n.shallower;
  return n.same;
}
