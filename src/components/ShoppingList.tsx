"use client";

import { useEffect, useState } from "react";
import {
  groupByAisle,
  shoppingListText,
  type ShoppingRow,
} from "@/lib/shopping";

function storageKey(slug: string, variation: string) {
  return `shop-${slug}-${variation}`;
}

export default function ShoppingList({
  slug,
  title,
  variation,
  rows,
}: {
  slug: string;
  title: string;
  /** Name of the selected portion size ("" for the full batch). */
  variation: string;
  rows: ShoppingRow[];
}) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  // Load ticks for this recipe and portion size after mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(slug, variation));
      setChecked(raw ? JSON.parse(raw) : {});
    } catch {
      setChecked({});
    }
  }, [slug, variation]);

  function save(next: Record<string, boolean>) {
    setChecked(next);
    try {
      localStorage.setItem(storageKey(slug, variation), JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  function toggle(key: string) {
    save({ ...checked, [key]: !checked[key] });
  }

  async function copyList() {
    const remaining = rows.filter((r) => !r.pantry && !checked[r.key]);
    try {
      await navigator.clipboard.writeText(shoppingListText(title, remaining));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  const groups = groupByAisle(rows);
  const pantry = rows.filter((r) => r.pantry);
  const toBuy = rows.filter((r) => !r.pantry);
  const doneCount = toBuy.filter((r) => checked[r.key]).length;
  const anyChecked = rows.some((r) => checked[r.key]);

  function renderRow(r: ShoppingRow) {
    const done = !!checked[r.key];
    return (
      <li key={r.key}>
        <label className="flex items-start gap-3 cursor-pointer py-2 -mx-2 px-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors">
          <input
            type="checkbox"
            checked={done}
            onChange={() => toggle(r.key)}
            className="mt-0.5 w-5 h-5 rounded border-stone-300 dark:border-stone-600
              text-amber-600 focus:ring-amber-500 focus:ring-offset-0 shrink-0"
          />
          <span className={done ? "text-stone-400 dark:text-stone-600" : ""}>
            <span className={`font-medium ${done ? "line-through" : ""}`}>
              {r.name}
              {r.optional && (
                <span className="ml-2 text-xs font-normal text-stone-500 dark:text-stone-400">
                  optional
                </span>
              )}
            </span>
            <span className="block text-stone-700 dark:text-stone-300">
              <span className="text-sm text-stone-500 dark:text-stone-400">
                Buy:{" "}
              </span>
              {r.buy}
            </span>
            {r.uses && (
              <span className="block text-sm text-stone-500 dark:text-stone-400">
                Recipe uses: {r.uses}
              </span>
            )}
            {r.note && (
              <span className="block text-sm text-stone-500 dark:text-stone-400">
                {r.note}
              </span>
            )}
          </span>
        </label>
      </li>
    );
  }

  return (
    <>
      {/* Sits in the same button row as Share; the panel opens on its own line below. */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="shopping-list-panel"
        className="inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg
          border border-amber-600 dark:border-amber-500
          text-stone-700 dark:text-stone-200
          hover:bg-amber-50 dark:hover:bg-amber-950 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4"
          aria-hidden="true"
        >
          <path d="M1 1.75A.75.75 0 011.75 1h1.628a1.75 1.75 0 011.734 1.51L5.18 3a65.25 65.25 0 0113.36 1.412.75.75 0 01.58.875 48.645 48.645 0 01-1.618 6.2.75.75 0 01-.712.513H6a2.503 2.503 0 00-2.292 1.5H17.25a.75.75 0 010 1.5H2.76a.75.75 0 01-.748-.807 4.002 4.002 0 012.716-3.486L3.626 2.716a.25.25 0 00-.248-.216H1.75A.75.75 0 011 1.75zM6 17.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
        Shopping list
        <span className="text-stone-500 dark:text-stone-400">
          {doneCount > 0 ? `${doneCount}/${toBuy.length}` : toBuy.length}
        </span>
      </button>

      {open && (
      <div
        id="shopping-list-panel"
        className="basis-full rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/40 p-5"
      >
        <h2 className="text-lg font-semibold mb-1">Shopping list</h2>
        <p className="text-sm text-stone-500 dark:text-stone-400 leading-snug">
          How each item is usually sold, so you buy the jar or bag, not the
          teaspoon. Pack sizes vary by brand and store.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={copyList}
            className="px-3 py-1.5 text-sm rounded-lg border border-stone-300 dark:border-stone-700
              hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {copied ? "Copied!" : "Copy list"}
          </button>
          {anyChecked && (
            <button
              type="button"
              onClick={() => save({})}
              className="px-3 py-1.5 text-sm rounded-lg border border-stone-300 dark:border-stone-700
                hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            >
              Clear ticks
            </button>
          )}
        </div>

        {groups.map((g) => (
          <div key={g.aisle} className="mt-5">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
              {g.aisle}
            </h3>
            <ul className="mt-1 divide-y divide-stone-200 dark:divide-stone-800">
              {g.rows.map(renderRow)}
            </ul>
          </div>
        ))}

        {pantry.length > 0 && (
          <div className="mt-5 pt-5 border-t border-stone-200 dark:border-stone-800">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-400">
              Probably already in your pantry
            </h3>
            <ul className="mt-1 divide-y divide-stone-200 dark:divide-stone-800">
              {pantry.map(renderRow)}
            </ul>
          </div>
        )}
      </div>
      )}
    </>
  );
}
