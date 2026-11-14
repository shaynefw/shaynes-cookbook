"use client";

import { useEffect } from "react";

// Registers the service worker in production. In development it removes any
// old worker and its caches, so dev never shows stale pages.
export default function PwaRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) =>
          regs
            // Only our own worker; leave other apps on localhost alone.
            .filter((r) => ((r.active ?? r.waiting ?? r.installing)?.scriptURL ?? "").endsWith("/sw.js"))
            .forEach((r) => r.unregister())
        )
        .catch(() => {});
      if ("caches" in window) {
        caches
          .keys()
          .then((names) =>
            names.filter((n) => n.startsWith("cookbook-")).forEach((n) => caches.delete(n))
          )
          .catch(() => {});
      }
      return;
    }

    const register = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch((err) => console.warn("Service worker not registered:", err));
    };
    if (document.readyState === "complete") {
      register();
      return;
    }
    window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
