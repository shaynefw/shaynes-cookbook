import { getAllRecipes } from "@/data/recipes";
import RecipeCard from "@/components/RecipeCard";

export default function Home() {
  const recipes = getAllRecipes();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Recipes</h1>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
          {recipes.length} recipes in the collection
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.slug} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
