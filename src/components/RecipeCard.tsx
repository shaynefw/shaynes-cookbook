import Link from "next/link";
import { Recipe } from "@/data/recipes";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="block rounded-xl border border-stone-200 dark:border-stone-800
        p-5 hover:border-stone-400 dark:hover:border-stone-600
        transition-colors group"
    >
      <h2 className="text-lg font-semibold group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
        {recipe.title}
      </h2>
      <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
        {recipe.description}
      </p>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-stone-500 dark:text-stone-500">
        <span>Prep: {recipe.prepTime}</span>
        <span>Cook: {recipe.cookTime}</span>
        <span>Serves: {recipe.servings}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {recipe.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
