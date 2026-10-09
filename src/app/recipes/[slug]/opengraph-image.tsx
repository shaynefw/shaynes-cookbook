import { ImageResponse } from "next/og";
import { getAllRecipes, getRecipeBySlug } from "@/data/recipes";
import { clip, OG_SIZE, OgCard } from "@/lib/ogCard";

export const alt = "Recipe from Shayne's Cookbook";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllRecipes().map((r) => ({ slug: r.slug }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);

  const facts: string[] = [];
  if (recipe) {
    if (recipe.prepTime && recipe.prepTime !== "—") facts.push(`Prep ${recipe.prepTime}`);
    if (recipe.cookTime && recipe.cookTime !== "—") facts.push(`Cook ${recipe.cookTime}`);
  }

  return new ImageResponse(
    (
      <OgCard
        title={recipe?.title ?? "Shayne's Cookbook"}
        blurb={clip(recipe?.description ?? "A personal collection of family favorite recipes.", 150)}
        facts={facts}
        tags={(recipe?.tags ?? []).slice(0, 3)}
      />
    ),
    { ...size }
  );
}
