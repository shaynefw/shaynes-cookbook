import { renderOption, type IngredientSubstitution } from "@/lib/substitutions";

export default function Substitutions({
  data,
  factor,
}: {
  data: IngredientSubstitution;
  /** Same scale factor the ingredient list is using. */
  factor: number;
}) {
  return (
    <details className="mt-4 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/40">
      <summary className="cursor-pointer list-none px-5 py-3 font-medium flex items-center justify-between gap-3 [&::-webkit-details-marker]:hidden">
        <span>{data.title}</span>
        <span className="text-sm font-normal text-stone-500 dark:text-stone-400">
          {data.options.length} ideas
        </span>
      </summary>

      <div className="px-5 pb-5">
        <p className="text-sm text-stone-500 dark:text-stone-400 leading-snug">
          Each idea below replaces {data.replaces} and scales with the amounts above.
          They are starting points, so taste and adjust.
        </p>

        <ul className="mt-4 space-y-5">
          {data.options.map((o) => (
            <li key={o.name}>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
                {o.name}
              </h3>
              <ul className="mt-1 list-disc pl-5">
                {renderOption(o, factor).map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              {o.note && (
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400 leading-snug">
                  {o.note}
                </p>
              )}
            </li>
          ))}
        </ul>

        {data.caution && (
          <p className="mt-5 text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
            <strong className="font-semibold">Heads up:</strong> {data.caution}
          </p>
        )}

        {data.sources && data.sources.length > 0 && (
          <p className="mt-3 text-xs text-stone-500 dark:text-stone-400 leading-relaxed">
            Based on several recipe sites, whose ratios differ:{" "}
            {data.sources.map((s, i) => (
              <span key={s.url}>
                {i > 0 && ", "}
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-stone-800 dark:hover:text-stone-200"
                >
                  {s.name}
                </a>
              </span>
            ))}
            .
          </p>
        )}
      </div>
    </details>
  );
}
