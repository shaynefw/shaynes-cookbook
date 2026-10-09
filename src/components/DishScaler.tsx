"use client";

import { useEffect, useState } from "react";
import {
  bakeHint,
  estimateServings,
  formatCups,
  isValidDish,
  scaleFactors,
  type DishDims,
  type DishScalerConfig,
  type DishShape,
} from "@/lib/dishScaling";

const STORAGE_KEY = "dish-scaler-v1";

interface DishInput {
  presetId: string;
  shape: DishShape;
  length: string;
  width: string;
  depth: string;
}

function inputFromDims(presetId: string, d: DishDims): DishInput {
  return {
    presetId,
    shape: d.shape,
    length: String(d.length),
    width: String(d.width),
    depth: String(d.depth),
  };
}

function dimsFromInput(i: DishInput): DishDims {
  return {
    shape: i.shape,
    length: parseFloat(i.length),
    width: parseFloat(i.width),
    depth: parseFloat(i.depth),
  };
}

export interface DishState {
  input: DishInput;
  dims: DishDims;
  selectPreset: (id: string) => void;
  update: (patch: Partial<Omit<DishInput, "presetId">>) => void;
  reset: () => void;
}

/** Holds the dish the user typed in; remembers it between visits. */
export function useDishState(config?: DishScalerConfig): DishState {
  const fallback: DishDims = config?.reference ?? {
    shape: "rectangle",
    length: 13,
    width: 9,
    depth: 2,
  };
  const defaultPreset = config?.presets.find(
    (p) => p.id === config.defaultPresetId
  );
  const defaultInput = inputFromDims(
    defaultPreset?.id ?? "original",
    defaultPreset?.dims ?? fallback
  );

  const [input, setInput] = useState<DishInput>(defaultInput);

  // Load the remembered dish after mount (avoids a server/client mismatch).
  useEffect(() => {
    if (!config) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as DishInput;
      const shapeOk = ["rectangle", "round", "oval"].includes(saved.shape);
      if (!shapeOk || typeof saved.length !== "string") return;
      // A saved preset re-reads the preset's current size, so corrected
      // preset dimensions reach people who saved an older version.
      const preset = config.presets.find((p) => p.id === saved.presetId);
      setInput(preset ? inputFromDims(preset.id, preset.dims) : saved);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function persist(next: DishInput) {
    setInput(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }

  return {
    input,
    dims: dimsFromInput(input),
    selectPreset(id) {
      const preset = config?.presets.find((p) => p.id === id);
      if (preset) persist(inputFromDims(preset.id, preset.dims));
    },
    update(patch) {
      persist({ ...input, ...patch, presetId: "custom" });
    },
    reset() {
      persist(defaultInput);
    },
  };
}

const fieldClass = `w-full px-3 py-2 rounded-lg bg-white dark:bg-stone-950
  border border-stone-300 dark:border-stone-700
  focus:border-amber-500 dark:focus:border-amber-500
  focus:ring-1 focus:ring-amber-500 outline-none`;

function NumberField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex-1 min-w-[96px]">
      <label
        htmlFor={id}
        className="block text-sm text-stone-600 dark:text-stone-400 mb-1"
      >
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={0}
        step="any"
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/^-+/, ""))}
        className={fieldClass}
      />
    </div>
  );
}

export default function DishScaler({
  config,
  state,
}: {
  config: DishScalerConfig;
  state: DishState;
}) {
  const { input, dims } = state;
  const valid = isValidDish(dims, config.headroom);
  const f = valid
    ? scaleFactors(dims, config.reference, config.headroom)
    : null;
  const isRound = input.shape === "round";

  return (
    <section
      className="mt-6 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/40 p-5"
      aria-labelledby="dish-scaler-heading"
    >
      <h2 id="dish-scaler-heading" className="text-lg font-semibold mb-1">
        Fit to your baking dish
      </h2>
      <p className="text-sm text-stone-500 dark:text-stone-400 mb-4 leading-snug">
        Pick your dish or type its size. The ingredient amounts below update to
        fill it. Measure inside the rim, and depth from the bottom to the rim.
        A square dish is just a rectangle with equal length and width.
      </p>

      <div>
        <label
          htmlFor="dish-preset"
          className="block text-sm text-stone-600 dark:text-stone-400 mb-1"
        >
          Dish
        </label>
        <select
          id="dish-preset"
          value={input.presetId}
          onChange={(e) => state.selectPreset(e.target.value)}
          className={fieldClass}
        >
          {config.presets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
          {input.presetId === "custom" && (
            <option value="custom">Custom size</option>
          )}
        </select>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[140px]">
          <label
            htmlFor="dish-shape"
            className="block text-sm text-stone-600 dark:text-stone-400 mb-1"
          >
            Shape
          </label>
          <select
            id="dish-shape"
            value={input.shape}
            onChange={(e) =>
              state.update({ shape: e.target.value as DishShape })
            }
            className={fieldClass}
          >
            <option value="rectangle">Rectangle</option>
            <option value="round">Round</option>
            <option value="oval">Oval</option>
          </select>
        </div>
        <NumberField
          id="dish-length"
          label={isRound ? "Diameter (in)" : "Length (in)"}
          value={input.length}
          onChange={(v) => state.update({ length: v })}
        />
        {!isRound && (
          <NumberField
            id="dish-width"
            label="Width (in)"
            value={input.width}
            onChange={(v) => state.update({ width: v })}
          />
        )}
        <NumberField
          id="dish-depth"
          label="Depth (in)"
          value={input.depth}
          onChange={(v) => state.update({ depth: v })}
        />
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
        {f ? (
          <>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              Your dish holds about{" "}
              <strong className="font-semibold">
                {formatCups(f.cups)} cups
              </strong>{" "}
              of casserole (leaving {config.headroom}″ below the rim) and serves
              about{" "}
              <strong className="font-semibold">
                {estimateServings(config, f.volume)}
              </strong>
              . The filling is scaled ×{f.volume.toFixed(2)} and the toppings ×
              {f.area.toFixed(2)} compared with the original{" "}
              {config.reference.length}″ × {config.reference.width}″ dish.
            </p>
            <p className="mt-2 text-amber-800 dark:text-amber-300 leading-relaxed">
              <strong className="font-semibold">Baking note:</strong>{" "}
              {bakeHint(f.layer)}
            </p>
          </>
        ) : (
          <p className="text-red-700 dark:text-red-400">
            Enter a length, width and depth (depth must be more than{" "}
            {config.headroom}″). Showing the original amounts until then.
          </p>
        )}
      </div>
    </section>
  );
}
