"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import { BrandMark } from "@/lib/brand";
import { searchRecipes } from "@/lib/search";
import type { RecipeSummary } from "@/lib/recipeSummary";

type Sort = "newest" | "az";
const VISIBLE_TAGS = 10;

export default function RecipeBrowser({ recipes }: { recipes: RecipeSummary[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [sort, setSort] = useState<Sort>("newest");
  const [showAllTags, setShowAllTags] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const ready = useRef(false);

  // Read ?q= and ?tag= from the address once, so searches can be shared.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q");
    const t = params.get("tag");
    if (q) setQuery(q);
    if (t) setTag(t);
    ready.current = true;
  }, []);

  // Keep the address in step with the search (without adding history entries).
  useEffect(() => {
    if (!ready.current) return;
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (tag) params.set("tag", tag);
    const qs = params.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  }, [query, tag]);

  // Press "/" anywhere to jump to the search box.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      const typing =
        !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
      if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of recipes) for (const t of r.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([name, count]) => ({ name, count }));
  }, [recipes]);

  const results = useMemo(() => {
    const searching = query.trim().length > 0;
    let list = searchRecipes(recipes, query);
    if (tag) list = list.filter((r) => r.tags.includes(tag));
    if (!searching) {
      list = [...list];
      if (sort === "newest") list.reverse();
      else list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list;
  }, [recipes, query, tag, sort]);

  const searching = query.trim().length > 0;
  const shownTags = showAllTags ? tags : tags.slice(0, VISIBLE_TAGS);
  const hiddenCount = tags.length - VISIBLE_TAGS;
  const summary = searching || tag
    ? `${results.length} of ${recipes.length} recipes`
    : `${recipes.length} recipes`;

  function clearAll() {
    setQuery("");
    setTag(null);
    inputRef.current?.focus();
  }

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden rounded-3xl border border-amber-300/50 dark:border-amber-700/30
          bg-gradient-to-br from-amber-100 via-orange-50 to-stone-100
          dark:from-amber-900/30 dark:via-stone-800/40 dark:to-stone-900/40
          px-4 py-8 sm:px-12 sm:py-14"
      >
        <div className="pointer-events-none absolute -right-10 -top-6 opacity-60 dark:opacity-10 hidden sm:block">
          <BrandMark size={300} tile={false} />
        </div>
        <div className="relative max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
            Shayne&apos;s Cookbook
          </p>
          <h1 className="mt-3 font-display text-[calc(2.25rem*var(--hs,1))] sm:text-[calc(3rem*var(--hs,1))] font-semibold leading-[1.1] tracking-tight">
            What are we cooking today?
          </h1>
          <p className="mt-3 text-stone-600 dark:text-stone-300 leading-relaxed">
            Family favorites with amounts that scale to your dish, and a shopping list for each one.
          </p>

          <form
            role="search"
            onSubmit={(e) => e.preventDefault()}
            className="mt-7"
          >
            <label htmlFor="recipe-search" className="sr-only">
              Search recipes by name, ingredient or tag
            </label>
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="pointer-events-none absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                ref={inputRef}
                id="recipe-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setQuery("");
                }}
                placeholder="Search recipes or ingredients"
                autoComplete="off"
                enterKeyHint="search"
                className="w-full h-14 pl-11 pr-12 sm:pl-12 sm:pr-24 rounded-2xl text-base
                  bg-white dark:bg-stone-950 shadow-md
                  border border-stone-300 dark:border-stone-700
                  placeholder:text-stone-400
                  focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40 outline-none
                  [&::-webkit-search-cancel-button]:hidden"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {query ? (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      inputRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="w-8 h-8 inline-flex items-center justify-center rounded-full
                      text-stone-500 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                      aria-hidden="true"
                    >
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                ) : (
                  <kbd
                    className="hidden sm:inline-flex items-center justify-center w-6 h-6 rounded-md text-xs font-medium
                      border border-stone-300 dark:border-stone-700 text-stone-400"
                    aria-hidden="true"
                  >
                    /
                  </kbd>
                )}
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* Tag chips */}
      <div
        className={`mt-6 flex items-center gap-2 sm:flex-wrap sm:overflow-visible
          ${showAllTags ? "flex-wrap" : "flex-nowrap overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"}`}
        role="group"
        aria-label="Filter by tag"
      >
        <button
          type="button"
          aria-pressed={tag === null}
          onClick={() => setTag(null)}
          className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
            tag === null
              ? "bg-amber-600 border-amber-600 text-white dark:bg-amber-500 dark:border-amber-500 dark:text-stone-950"
              : "border-stone-300 dark:border-stone-700 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40"
          }`}
        >
          All
        </button>
        {shownTags.map((t) => (
          <button
            key={t.name}
            type="button"
            aria-pressed={tag === t.name}
            onClick={() => setTag(tag === t.name ? null : t.name)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm border transition-colors ${
              tag === t.name
                ? "bg-amber-600 border-amber-600 text-white dark:bg-amber-500 dark:border-amber-500 dark:text-stone-950"
                : "border-stone-300 dark:border-stone-700 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40"
            }`}
          >
            {t.name}
            <span className="ml-1.5 text-xs opacity-60">{t.count}</span>
          </button>
        ))}
        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setShowAllTags((v) => !v)}
            aria-expanded={showAllTags}
            className="shrink-0 px-3 py-1.5 rounded-full text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 underline-offset-2 hover:underline"
          >
            {showAllTags ? "Show fewer" : `+${hiddenCount} more`}
          </button>
        )}
      </div>

      {/* Result count + sort */}
      <div className="mt-6 mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-stone-500 dark:text-stone-400" aria-live="polite">
          {summary}
          {tag && (
            <>
              {" "}
              tagged <strong className="font-medium text-stone-700 dark:text-stone-200">{tag}</strong>
            </>
          )}
        </p>
        {!searching && (
          <div className="flex items-center gap-2 text-sm">
            <label htmlFor="recipe-sort" className="text-stone-500 dark:text-stone-400">
              Sort
            </label>
            <select
              id="recipe-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 px-2.5 py-1.5
                focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="az">A to Z</option>
            </select>
          </div>
        )}
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (
            <RecipeCard key={r.slug} recipe={r} query={query} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-stone-400/70 dark:border-stone-600 px-6 py-12 text-center">
          <p className="font-display text-xl font-semibold">
            Nothing matches{searching ? <> &ldquo;{query.trim()}&rdquo;</> : " that filter"}
          </p>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400 max-w-md mx-auto leading-relaxed">
            Try a shorter word, or search by an ingredient such as carrots, kimchi or cheddar. You can also
            clear the filters to see everything.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={clearAll}
              className="px-4 py-2 rounded-full text-sm font-medium bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:text-stone-950 dark:hover:bg-amber-400 transition-colors"
            >
              Show all recipes
            </button>
          </div>
          {tags.length > 0 && (
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {tags.slice(0, 5).map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setTag(t.name);
                  }}
                  className="px-3 py-1 rounded-full text-sm border border-stone-300 dark:border-stone-700 hover:border-amber-500 transition-colors"
                >
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
