import Link from "next/link";
import { BrandMark } from "@/lib/brand";
import { paletteFor } from "@/lib/recipeStyle";
import { highlightParts } from "@/lib/search";
import type { RecipeSummary } from "@/lib/recipeSummary";

function Marked({ text, query }: { text: string; query: string }) {
  return (
    <>
      {highlightParts(text, query).map((p, i) =>
        p.match ? (
          <mark
            key={i}
            className="rounded bg-amber-300/70 dark:bg-amber-500/40 text-inherit px-0.5"
          >
            {p.text}
          </mark>
        ) : (
          <span key={i}>{p.text}</span>
        )
      )}
    </>
  );
}

export default function RecipeCard({
  recipe,
  query = "",
}: {
  recipe: RecipeSummary;
  query?: string;
}) {
  const palette = paletteFor(recipe.slug, recipe.tags);
  const times = [
    recipe.prepTime && recipe.prepTime !== "—" ? `Prep ${recipe.prepTime}` : null,
    recipe.cookTime && recipe.cookTime !== "—" ? `Cook ${recipe.cookTime}` : null,
  ].filter(Boolean) as string[];

  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl
        border border-stone-300/80 dark:border-stone-700/70
        bg-white/60 dark:bg-stone-900/40 shadow-sm
        hover:shadow-xl hover:-translate-y-1 hover:border-amber-500/60
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
    >
      <div className={`relative h-28 overflow-hidden bg-gradient-to-br ${palette.banner}`}>
        <div className="absolute -right-3 -bottom-8 opacity-70 dark:opacity-15 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
          <BrandMark size={132} tile={false} />
        </div>
        {recipe.scalable && (
          <span
            className={`absolute left-4 top-4 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${palette.chip}`}
            title="Amounts adjust to your dish, weight or rice"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-3.5 h-3.5"
              aria-hidden="true"
            >
              <path d="M10 3a.75.75 0 01.75.75v5.5h5.5a.75.75 0 010 1.5h-5.5v5.5a.75.75 0 01-1.5 0v-5.5h-5.5a.75.75 0 010-1.5h5.5v-5.5A.75.75 0 0110 3z" />
            </svg>
            Scalable
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h2
          className={`font-display text-xl font-semibold leading-snug transition-colors ${palette.hover}`}
        >
          <Marked text={recipe.title} query={query} />
        </h2>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-400 leading-relaxed line-clamp-3">
          {recipe.description}
        </p>

        {times.length > 0 && (
          <div className="mt-auto pt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500 dark:text-stone-400">
            {times.map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-3.5 h-3.5"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z"
                    clipRule="evenodd"
                  />
                </svg>
                {t}
              </span>
            ))}
          </div>
        )}

        <div className={`flex flex-wrap gap-1.5 ${times.length > 0 ? "mt-3" : "mt-auto pt-4"}`}>
          {recipe.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
