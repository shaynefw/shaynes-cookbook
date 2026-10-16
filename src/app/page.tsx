import { getAllRecipes } from "@/data/recipes";
import RecipeBrowser from "@/components/RecipeBrowser";
import { toSummary } from "@/lib/recipeSummary";

export default function Home() {
  const recipes = getAllRecipes().map(toSummary);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-10">
      <RecipeBrowser recipes={recipes} />
    </div>
  );
}
