import type { Recipe } from "@/data/recipes";

/** The slim version of a recipe the home page needs (keeps the page small). */
export interface RecipeSummary {
  slug: string;
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  tags: string[];
  /** Has a "scale to your dish / rice" feature. */
  scalable: boolean;
  /** Ingredient lines, searchable. */
  ingredients: string;
}

export function toSummary(r: Recipe): RecipeSummary {
  return {
    slug: r.slug,
    title: r.title,
    description: r.description,
    prepTime: r.prepTime,
    cookTime: r.cookTime,
    tags: r.tags,
    scalable: !!(r.dishScaler || r.amountScaler || r.calculator),
    ingredients: r.ingredients.join(" ; "),
  };
}
