"use client";

import { useEffect, useState } from "react";
import {
  amountFactor,
  cupOf,
  hasCups,
  riceMl,
  type AmountScalerConfig,
} from "@/lib/amountScaling";
import { formatCount, formatKitchenVolume, toTsp } from "@/lib/dishScaling";

interface AmountInput {
  amount: string;
  cupId: string;
}

export interface AmountState {
  input: AmountInput;
  /** The typed amount as a number (NaN when empty or invalid). */
  value: number;
  valid: boolean;
  setAmount: (v: string) => void;
  setCup: (id: string) => void;
  reset: () => void;
}

/** Holds the amount of rice typed in; remembers it per recipe. */
export function useAmountState(
  slug: string,
  config?: AmountScalerConfig
): AmountState {
  const defaults: AmountInput = {
    amount: String(config?.defaultAmount ?? 1),
    cupId: config?.defaultCupId ?? "",
  };
  const [input, setInput] = useState<AmountInput>(defaults);
  const key = `amount-scaler-${slug}`;

  useEffect(() => {
    if (!config) return;
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const saved = JSON.parse(raw) as AmountInput;
      const cupOk = !hasCups(config) || (config.cupOptions ?? []).some((c) => c.id === saved.cupId);
      if (typeof saved.amount === "string" && cupOk) setInput(saved);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  function persist(next: AmountInput) {
    setInput(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  const value = parseFloat(input.amount);
  return {
    input,
    value,
    valid: Number.isFinite(value) && value > 0,
    setAmount: (v) => persist({ ...input, amount: v }),
    setCup: (id) => persist({ ...input, cupId: id }),
    reset: () => persist(defaults),
  };
}

const fieldClass = `w-full px-3 py-2 rounded-lg bg-white dark:bg-stone-950
  border border-stone-300 dark:border-stone-700
  focus:border-amber-500 dark:focus:border-amber-500
  focus:ring-1 focus:ring-amber-500 outline-none`;

export default function AmountScaler({
  config,
  state,
}: {
  config: AmountScalerConfig;
  state: AmountState;
}) {
  const cups = hasCups(config);
  const cup = cupOf(config, state.input.cupId);
  const factor = state.valid ? amountFactor(config, state.value, state.input.cupId) : 1;
  const ml = state.valid && cup ? riceMl(config, state.value, cup.id) : 0;
  const noun = config.unitNoun
    ? state.value === 1
      ? config.unitNoun.singular
      : config.unitNoun.plural
    : "";

  return (
    <section
      className="mt-6 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/40 p-5"
      aria-labelledby="amount-scaler-heading"
    >
      <h2 id="amount-scaler-heading" className="font-display text-xl font-semibold mb-1">
        {config.title}
      </h2>
      <p className="text-sm text-stone-500 dark:text-stone-400 mb-4 leading-snug">
        {config.intro}
      </p>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[120px]">
          <label
            htmlFor="amount-input"
            className="block text-sm text-stone-600 dark:text-stone-400 mb-1"
          >
            {config.inputLabel}
          </label>
          <input
            id="amount-input"
            type="number"
            min={0}
            step="any"
            inputMode="decimal"
            value={state.input.amount}
            onChange={(e) => state.setAmount(e.target.value.replace(/^-+/, ""))}
            className={fieldClass}
          />
        </div>
        {cups && (
          <div className="flex-[2] min-w-[200px]">
            <label
              htmlFor="amount-cup"
              className="block text-sm text-stone-600 dark:text-stone-400 mb-1"
            >
              Which cup?
            </label>
            <select
              id="amount-cup"
              value={state.input.cupId}
              onChange={(e) => state.setCup(e.target.value)}
              className={fieldClass}
            >
              {(config.cupOptions ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        )}
        <button
          type="button"
          onClick={state.reset}
          className="px-4 py-2 text-sm rounded-lg
            border border-stone-300 dark:border-stone-700
            hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="mt-4 text-sm" aria-live="polite">
        {state.valid ? (
          cups ? (
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              That is about <strong className="font-semibold">{Math.round(ml)} mL</strong> of dry
              rice ({formatCount(ml / 240)} standard cups). Everything below is scaled{" "}
              <strong className="font-semibold">×{factor.toFixed(2)}</strong> compared with the
              recipe as written.
            </p>
          ) : (
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              Making{" "}
              <strong className="font-semibold">
                {formatCount(state.value)} {noun}
              </strong>
              {config.perUnit && (
                <>
                  : about{" "}
                  <strong className="font-semibold">
                    {Math.round(state.value * config.perUnit.ml)} mL
                  </strong>{" "}
                  ({formatKitchenVolume(toTsp((state.value * config.perUnit.ml) / 250, "cup"))}){" "}
                  {config.perUnit.label}
                </>
              )}
              . Everything below is scaled{" "}
              <strong className="font-semibold">×{factor.toFixed(2)}</strong> compared with the
              recipe as written.
            </p>
          )
        ) : (
          <p className="text-red-700 dark:text-red-400">
            Enter an amount greater than zero. Showing the original amounts until then.
          </p>
        )}
        {cups && config.cupNote && (
          <p className="mt-2 text-amber-800 dark:text-amber-300 leading-relaxed">
            <strong className="font-semibold">Which cup?</strong> {config.cupNote}
          </p>
        )}
      </div>
    </section>
  );
}
