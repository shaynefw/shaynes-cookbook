"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "iosInstallHintDismissed";

// Safari on iPhone and iPad has no install prompt, so we explain the manual steps.
export default function IosInstallHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIos =
      /iPhone|iPad|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const standalone =
      (navigator as Navigator & { standalone?: boolean }).standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISS_KEY) === "1";
    } catch {}
    setShow(isIos && !standalone && !dismissed);
  }, []);

  function dismiss() {
    setShow(false);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  }

  if (!show) return null;

  return (
    <div
      className="flex items-center gap-3 rounded-2xl border border-amber-300/50 dark:border-amber-700/30
        bg-amber-100/60 dark:bg-amber-900/20 px-4 py-3 text-sm text-stone-700 dark:text-stone-300"
    >
      <p>Install this cookbook: tap the Share button, then Add to Home Screen.</p>
      <button
        onClick={dismiss}
        className="shrink-0 rounded-full border border-amber-600 dark:border-amber-500 px-3 py-1
          font-semibold text-amber-700 dark:text-amber-400
          hover:bg-amber-50 dark:hover:bg-amber-950 transition-colors"
      >
        Got it
      </button>
    </div>
  );
}
