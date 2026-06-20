"use client";

import { useState } from "react";
import type { CalculatorConfig } from "@/data/recipes";

const FRAC_MAP: Record<number, string> = {
  1: "1/8",
  2: "1/4",
  3: "3/8",
  4: "1/2",
  5: "5/8",
  6: "3/4",
  7: "7/8",
};

function formatTsp(value: number): string {
  if (value <= 0) return "0 tsp";
  const eighths = Math.round(value * 8);
  if (eighths === 0) return "< 1/8 tsp";
  const whole = Math.floor(eighths / 8);
  const rem = eighths % 8;
  if (rem === 0) return `${whole} tsp`;
  const frac = FRAC_MAP[rem];
  if (whole === 0) return `${frac} tsp`;
  return `${whole} ${frac} tsp`;
}

function formatTbspBreakdown(value: number): string | null {
  if (value < 3) return null;
  const eighths = Math.round(value * 8);
  const tbsp = Math.floor(eighths / 24);
  const remEighths = eighths - tbsp * 24;
  if (remEighths === 0) return `${tbsp} tbsp`;
  const remTsp = remEighths / 8;
  return `${tbsp} tbsp + ${formatTsp(remTsp)}`;
}

function formatInputNumber(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return String(Number(n.toFixed(2)));
}

export default function RecipeCalculator({
  config,
}: {
  config: CalculatorConfig;
}) {
  const [raw, setRaw] = useState<string>(String(config.defaultValue));
  const parsed = parseFloat(raw);
  const amount = Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  const showResults = amount > 0;

  const rows = config.ingredients.map((ing) => ({
    name: ing.name,
    tsp: ing.perUnit * amount,
  }));

  const unitWord = amount === 1 ? config.unitSingular : config.unitPlural;
  const summary = showResults
    ? `For ${formatInputNumber(amount)} ${unitWord}${
        config.summarySuffix ? ` ${config.summarySuffix}` : ""
      }, use ` +
      rows
        .map((r) => `${formatTsp(r.tsp)} ${r.name.toLowerCase()}`)
        .join(", ") +
      "."
    : "";

  return (
    <section
      className="mt-6 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/40 p-5"
      aria-labelledby="recipe-calculator-heading"
    >
      <h2
        id="recipe-calculator-heading"
        className="text-lg font-semibold mb-3"
      >
        Scale by weight
      </h2>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[180px]">
          <label
            htmlFor="recipe-calculator-amount"
            className="block text-sm text-stone-600 dark:text-stone-400 mb-1"
          >
            {config.inputLabel}
          </label>
          <input
            id="recipe-calculator-amount"
            type="number"
            min={0}
            step="any"
            inputMode="decimal"
            value={raw}
            onChange={(e) => setRaw(e.target.value.replace(/^-+/, ""))}
            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-stone-950
              border border-stone-300 dark:border-stone-700
              focus:border-amber-500 dark:focus:border-amber-500
              focus:ring-1 focus:ring-amber-500 outline-none"
          />
        </div>
        <button
          type="button"
          onClick={() => setRaw(String(config.defaultValue))}
          className="px-4 py-2 text-sm rounded-lg
            border border-stone-300 dark:border-stone-700
            hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          Reset
        </button>
      </div>

      <ul
        className="mt-5 divide-y divide-stone-200 dark:divide-stone-800"
        aria-live="polite"
      >
        {rows.map((r) => {
          const tbsp = showResults ? formatTbspBreakdown(r.tsp) : null;
          return (
            <li
              key={r.name}
              className="py-2.5 flex items-baseline justify-between gap-3"
            >
              <span className="text-stone-700 dark:text-stone-300">
                {r.name}
              </span>
              <span className="text-right">
                <span className="font-medium tabular-nums">
                  {showResults ? formatTsp(r.tsp) : "—"}
                </span>
                {tbsp && (
                  <span className="block text-xs text-stone-500 dark:text-stone-400 tabular-nums">
                    = {tbsp}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      {showResults && (
        <p className="mt-4 text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
          {summary}
        </p>
      )}
    </section>
  );
}
