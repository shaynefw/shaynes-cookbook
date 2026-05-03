"use client";

import { useEffect, useState } from "react";

const sizes = ["size-sm", "size-md", "size-lg", "size-xl", "size-xxl"] as const;
const tooltips = ["Small", "Medium", "Large", "X-Large", "XX-Large"];

export default function TextSizeToggle() {
  const [sizeIndex, setSizeIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("textSize");
    const idx = sizes.indexOf(stored as (typeof sizes)[number]);
    const initial = idx >= 0 ? idx : 0;
    setSizeIndex(initial);
    document.documentElement.classList.remove(...sizes);
    document.documentElement.classList.add(sizes[initial]);
    setMounted(true);
  }, []);

  function cycle() {
    const next = (sizeIndex + 1) % sizes.length;
    setSizeIndex(next);
    document.documentElement.classList.remove(...sizes);
    document.documentElement.classList.add(sizes[next]);
    localStorage.setItem("textSize", sizes[next]);
  }

  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <button
      onClick={cycle}
      aria-label={`Text size: ${tooltips[sizeIndex]}. Click to change.`}
      title={`Size: ${tooltips[sizeIndex]}`}
      className="w-10 h-10 flex items-center justify-center rounded-full
        hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors
        font-semibold select-none"
    >
      <span className={
        ["text-xs", "text-xs", "text-sm", "text-sm", "text-base"][sizeIndex]
      }>A</span>
      <span className={
        ["text-sm", "text-base", "text-lg", "text-xl", "text-2xl"][sizeIndex]
      }>A</span>
    </button>
  );
}
