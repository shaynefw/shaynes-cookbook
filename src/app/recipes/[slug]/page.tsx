import { notFound } from "next/navigation";
import { getAllRecipes, getRecipeBySlug } from "@/data/recipes";
import RecipeDetail from "./RecipeDetail";

export function generateStaticParams() {
  return getAllRecipes().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) return { title: "Recipe not found" };
  const url = `/recipes/${recipe.slug}`;
  return {
    title: `${recipe.title} — Shayne's Cookbook`,
    description: recipe.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      siteName: "Shayne's Cookbook",
      title: recipe.title,
      description: recipe.description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: recipe.title,
      description: recipe.description,
    },
  };
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe = getRecipeBySlug(slug);
  if (!recipe) notFound();
  return <RecipeDetail recipe={recipe} />;
}
