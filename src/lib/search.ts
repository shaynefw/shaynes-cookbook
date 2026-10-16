import type { RecipeSummary } from "@/lib/recipeSummary";

/** Lowercase, strip accents and punctuation: "Crème Brûlée!" -> "creme brulee". */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/** True when two words are within one edit (typo, missing or extra letter). */
function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  const la = a.length;
  const lb = b.length;
  if (Math.abs(la - lb) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < la && j < lb) {
    if (a[i] === b[j]) {
      i++;
      j++;
      continue;
    }
    if (++edits > 1) return false;
    if (la > lb) i++;
    else if (lb > la) j++;
    else {
      i++;
      j++;
    }
  }
  return edits + (la - i) + (lb - j) <= 1;
}

interface Indexed {
  title: string;
  titleWords: string[];
  tags: string;
  tagWords: string[];
  ingredients: string;
  ingredientWords: string[];
  description: string;
}

const cache = new WeakMap<RecipeSummary, Indexed>();

function indexOf(r: RecipeSummary): Indexed {
  let idx = cache.get(r);
  if (!idx) {
    const title = normalize(r.title);
    const tags = normalize(r.tags.join(" "));
    const ingredients = normalize(r.ingredients);
    idx = {
      title,
      titleWords: title.split(" "),
      tags,
      tagWords: tags.split(" "),
      ingredients,
      ingredientWords: Array.from(new Set(ingredients.split(" "))),
      description: normalize(r.description),
    };
    cache.set(r, idx);
  }
  return idx;
}

/** Score one query word against a recipe; 0 means "no match". */
function scoreToken(t: string, x: Indexed): number {
  let best = 0;
  if (x.titleWords.some((w) => w.startsWith(t))) best = 10;
  else if (x.title.includes(t)) best = 7;
  if (x.tagWords.some((w) => w.startsWith(t))) best = Math.max(best, 8);
  else if (x.tags.includes(t)) best = Math.max(best, 6);
  if (x.ingredientWords.some((w) => w.startsWith(t))) best = Math.max(best, 5);
  else if (x.ingredients.includes(t)) best = Math.max(best, 4);
  if (x.description.includes(t)) best = Math.max(best, 2);

  // Light stemming so "bake" finds "baking" and "carrots" finds "carrot".
  if (best < 5 && t.length >= 4) {
    const stem = t.replace(/(ing|es|s|e)$/, "");
    if (stem.length >= 3 && stem !== t) {
      const near = (w: string) => w.startsWith(stem) && w.length <= t.length + 2;
      if ([...x.titleWords, ...x.tagWords, ...x.ingredientWords].some(near)) {
        best = Math.max(best, 4);
      }
    }
  }

  if (best === 0 && t.length >= 4) {
    const fuzzy = [...x.titleWords, ...x.tagWords, ...x.ingredientWords].some(
      (w) => w.length >= 4 && withinOneEdit(t, w)
    );
    if (fuzzy) best = 3;
  }
  return best;
}

/**
 * Every word you type must match somewhere (name, tag, ingredient or
 * description). Results are ranked, with name and tag matches first.
 * An empty query returns the list unchanged.
 */
export function searchRecipes(items: RecipeSummary[], query: string): RecipeSummary[] {
  const tokens = normalize(query).split(" ").filter(Boolean);
  if (tokens.length === 0) return items;
  const phrase = tokens.join(" ");

  const scored: { item: RecipeSummary; score: number; order: number }[] = [];
  items.forEach((item, order) => {
    const x = indexOf(item);
    let total = 0;
    for (const t of tokens) {
      const s = scoreToken(t, x);
      if (s === 0) return;
      total += s;
    }
    if (tokens.length > 1 && x.title.includes(phrase)) total += 5;
    scored.push({ item, score: total, order });
  });

  scored.sort((a, b) => b.score - a.score || a.order - b.order);
  return scored.map((s) => s.item);
}

/** Split text into pieces so matching query words can be highlighted. */
export function highlightParts(text: string, query: string): { text: string; match: boolean }[] {
  const tokens = Array.from(
    new Set(query.toLowerCase().split(/\s+/).filter((t) => t.length > 0))
  );
  if (tokens.length === 0) return [{ text, match: false }];

  const pattern = new RegExp(
    tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
    "gi"
  );
  const parts: { text: string; match: boolean }[] = [];
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    const start = m.index ?? 0;
    if (start > last) parts.push({ text: text.slice(last, start), match: false });
    parts.push({ text: m[0], match: true });
    last = start + m[0].length;
  }
  if (last < text.length) parts.push({ text: text.slice(last), match: false });
  return parts.length > 0 ? parts : [{ text, match: false }];
}
