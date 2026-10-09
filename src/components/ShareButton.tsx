"use client";

import { useEffect, useRef, useState } from "react";

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 20 20",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "w-5 h-5 shrink-0",
  "aria-hidden": true,
};

const itemClass = `flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-left
  hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors`;

export default function ShareButton({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on outside click or Escape while the menu is open.
  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Share the page address without any query string or hash.
  const url =
    typeof window !== "undefined"
      ? window.location.origin + window.location.pathname
      : "";
  const message = `${title} from Shayne's Cookbook`;
  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function onShareClick() {
    if (open) {
      setOpen(false);
      return;
    }
    // On a phone, go straight to the system share sheet (WhatsApp, Messages...).
    const isTouch =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;
    if (isTouch && canNativeShare) {
      try {
        await navigator.share({ title, text: message, url });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        // Otherwise fall through to the menu.
      }
    }
    setOpen(true);
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, text: message, url });
      setOpen(false);
    } catch {
      /* cancelled */
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  const text = encodeURIComponent(`${message}\n${url}`);

  return (
    <div ref={wrapRef} className="relative inline-block">
      <button
        ref={buttonRef}
        type="button"
        onClick={onShareClick}
        aria-expanded={open}
        aria-haspopup="true"
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
          <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
          <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
        </svg>
        Share
      </button>

      {open && (
        <div
          role="group"
          aria-label={`Share ${title}`}
          className="absolute left-0 z-20 mt-2 w-60 rounded-xl p-1.5 shadow-lg
            border border-stone-300 dark:border-stone-700
            bg-white dark:bg-stone-900"
        >
          <a
            href={`https://wa.me/?text=${text}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            <svg {...iconProps} className="w-5 h-5 shrink-0 text-green-600 dark:text-green-500">
              <path d="M4 4h12a1 1 0 011 1v8a1 1 0 01-1 1H9l-4 3v-3H4a1 1 0 01-1-1V5a1 1 0 011-1z" />
            </svg>
            WhatsApp
          </a>
          <a
            href={`sms:?&body=${text}`}
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            <svg {...iconProps} className="w-5 h-5 shrink-0 text-blue-600 dark:text-blue-400">
              <path d="M4 4h12a1 1 0 011 1v8a1 1 0 01-1 1H9l-4 3v-3H4a1 1 0 01-1-1V5a1 1 0 011-1z" />
              <path d="M7 8.5h6M7 11h3.5" />
            </svg>
            Text message
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(message)}&body=${text}`}
            onClick={() => setOpen(false)}
            className={itemClass}
          >
            <svg {...iconProps}>
              <rect x="3" y="5" width="14" height="10" rx="2" />
              <path d="M3.5 7l6.5 4.5L16.5 7" />
            </svg>
            Email
          </a>
          <button type="button" onClick={copyLink} className={itemClass}>
            <svg {...iconProps}>
              <rect x="7.5" y="7.5" width="9" height="9" rx="2" />
              <path d="M12.5 7.5V5.5a2 2 0 00-2-2h-5a2 2 0 00-2 2v5a2 2 0 002 2h2" />
            </svg>
            {copied ? "Link copied!" : "Copy link"}
          </button>
          {canNativeShare && (
            <button type="button" onClick={nativeShare} className={itemClass}>
              <svg {...iconProps}>
                <circle cx="5" cy="10" r="1.4" />
                <circle cx="10" cy="10" r="1.4" />
                <circle cx="15" cy="10" r="1.4" />
              </svg>
              More options…
            </button>
          )}
        </div>
      )}
    </div>
  );
}
