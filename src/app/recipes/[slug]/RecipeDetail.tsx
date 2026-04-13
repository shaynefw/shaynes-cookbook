"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Recipe } from "@/data/recipes";

function storageKey(slug: string, variation: number, type: "ing" | "steps") {
  return `recipe-${slug}-v${variation}-${type}`;
}

function loadChecked(slug: string, variation: number, type: "ing" | "steps", length: number): boolean[] {
  try {
    const raw = localStorage.getItem(storageKey(slug, variation, type));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === length) return parsed;
    }
  } catch { /* ignore */ }
  return new Array(length).fill(false);
}

function saveChecked(slug: string, variation: number, type: "ing" | "steps", value: boolean[]) {
  try {
    localStorage.setItem(storageKey(slug, variation, type), JSON.stringify(value));
  } catch { /* ignore */ }
}

export default function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const hasVariations = recipe.variations && recipe.variations.length > 0;
  const [selectedVariation, setSelectedVariation] = useState(-1); // -1 = main recipe

  const activeIngredients =
    selectedVariation >= 0 && recipe.variations
      ? recipe.variations[selectedVariation].ingredients
      : recipe.ingredients;
  const activeSteps =
    selectedVariation >= 0 && recipe.variations
      ? recipe.variations[selectedVariation].steps
      : recipe.steps;

  const [checkedIngredients, setCheckedIngredients] = useState<boolean[]>(
    () => loadChecked(recipe.slug, -1, "ing", recipe.ingredients.length)
  );
  const [checkedSteps, setCheckedSteps] = useState<boolean[]>(
    () => loadChecked(recipe.slug, -1, "steps", recipe.steps.length)
  );

  // Load from localStorage when variation changes
  useEffect(() => {
    setCheckedIngredients(loadChecked(recipe.slug, selectedVariation, "ing", activeIngredients.length));
    setCheckedSteps(loadChecked(recipe.slug, selectedVariation, "steps", activeSteps.length));
  }, [selectedVariation, recipe.slug, activeIngredients.length, activeSteps.length]);

  // Screen Wake Lock — keep screen on while viewing recipe
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;

    async function requestWakeLock() {
      try {
        if ("wakeLock" in navigator) {
          wakeLock = await navigator.wakeLock.request("screen");
        }
      } catch {
        // Wake Lock not supported or denied — fail silently
      }
    }

    requestWakeLock();

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        requestWakeLock();
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      wakeLock?.release();
    };
  }, []);

  function toggleIngredient(i: number) {
    setCheckedIngredients((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      saveChecked(recipe.slug, selectedVariation, "ing", next);
      return next;
    });
  }

  function toggleStep(i: number) {
    setCheckedSteps((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      saveChecked(recipe.slug, selectedVariation, "steps", next);
      return next;
    });
  }

  const hasAnyChecked =
    checkedIngredients.some(Boolean) || checkedSteps.some(Boolean);

  function resetAll() {
    const emptyIng = new Array(activeIngredients.length).fill(false);
    const emptySteps = new Array(activeSteps.length).fill(false);
    setCheckedIngredients(emptyIng);
    setCheckedSteps(emptySteps);
    saveChecked(recipe.slug, selectedVariation, "ing", emptyIng);
    saveChecked(recipe.slug, selectedVariation, "steps", emptySteps);
  }

  const completedSteps = checkedSteps.filter(Boolean).length;
  const activeVariation =
    selectedVariation >= 0 && recipe.variations
      ? recipe.variations[selectedVariation]
      : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-stone-500 dark:text-stone-400
          hover:text-stone-800 dark:hover:text-stone-200 transition-colors mb-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
        >
          <path
            fillRule="evenodd"
            d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
            clipRule="evenodd"
          />
        </svg>
        All recipes
      </Link>

      <h1 className="text-2xl font-bold tracking-tight">{recipe.title}</h1>
      <p className="mt-2 text-stone-600 dark:text-stone-400 leading-relaxed">
        {recipe.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-500 dark:text-stone-400">
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

      {/* Reset button */}
      {hasAnyChecked && (
        <button
          onClick={resetAll}
          className="mt-4 inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg
            border border-red-400 dark:border-red-500
            text-stone-600 dark:text-stone-300
            hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path
              fillRule="evenodd"
              d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H4.598a.75.75 0 00-.75.75v3.634a.75.75 0 001.5 0v-2.033l.312.311a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm-10.624-2.85a5.5 5.5 0 019.201-2.465l.312.31H11.77a.75.75 0 000 1.5h3.634a.75.75 0 00.75-.75V3.535a.75.75 0 00-1.5 0v2.033l-.312-.31A7 7 0 002.63 8.384a.75.75 0 001.449.39z"
              clipRule="evenodd"
            />
          </svg>
          Reset all checkmarks
        </button>
      )}

      {/* Portion size switcher */}
      {hasVariations && (
        <div className="mt-6">
          <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-2">
            Portion size
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedVariation(-1)}
              className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                selectedVariation === -1
                  ? "border-amber-600 bg-amber-600 text-white dark:border-amber-500 dark:bg-amber-500"
                  : "border-stone-300 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500"
              }`}
            >
              Full Batch
            </button>
            {recipe.variations!.map((v, i) => (
              <button
                key={v.name}
                onClick={() => setSelectedVariation(i)}
                className={`px-4 py-2 text-sm rounded-lg border transition-colors ${
                  selectedVariation === i
                    ? "border-amber-600 bg-amber-600 text-white dark:border-amber-500 dark:bg-amber-500"
                    : "border-stone-300 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500"
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
          {activeVariation && (
            <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">
              {activeVariation.description} — Yield: {activeVariation.yield}
            </p>
          )}
        </div>
      )}

      {/* Ingredients */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3">Ingredients</h2>
        <ul className="space-y-2">
          {activeIngredients.map((item, i) => (
            <li key={`${selectedVariation}-${i}`}>
              <label className="flex items-start gap-3 cursor-pointer py-1 -mx-2 px-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors">
                <input
                  type="checkbox"
                  checked={checkedIngredients[i] || false}
                  onChange={() => toggleIngredient(i)}
                  className="mt-0.5 w-5 h-5 rounded border-stone-300 dark:border-stone-600
                    text-amber-600 focus:ring-amber-500 focus:ring-offset-0 shrink-0"
                />
                <span
                  className={
                    checkedIngredients[i]
                      ? "line-through text-stone-400 dark:text-stone-600"
                      : ""
                  }
                >
                  {item}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      {/* Steps */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Steps</h2>
          <span className="text-sm text-stone-500 dark:text-stone-400">
            {completedSteps}/{activeSteps.length} done
          </span>
        </div>
        <ol className="space-y-3">
          {activeSteps.map((step, i) => (
            <li key={`${selectedVariation}-${i}`}>
              <label className="flex items-start gap-3 cursor-pointer py-2 -mx-2 px-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors">
                <input
                  type="checkbox"
                  checked={checkedSteps[i] || false}
                  onChange={() => toggleStep(i)}
                  className="mt-0.5 w-5 h-5 rounded border-stone-300 dark:border-stone-600
                    text-amber-600 focus:ring-amber-500 focus:ring-offset-0 shrink-0"
                />
                <div className="flex gap-2">
                  <span className="font-medium text-stone-400 dark:text-stone-600 shrink-0">
                    {i + 1}.
                  </span>
                  <span
                    className={
                      checkedSteps[i]
                        ? "line-through text-stone-400 dark:text-stone-600"
                        : ""
                    }
                  >
                    {step}
                  </span>
                </div>
              </label>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
