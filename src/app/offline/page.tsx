import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/lib/brand";

export const metadata: Metadata = {
  title: "Offline",
  robots: { index: false },
};

export default function OfflinePage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center">
      <div className="flex justify-center mb-6">
        <BrandMark size={72} />
      </div>
      <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">
        You&apos;re offline
      </h1>
      <p className="mt-4 text-stone-600 dark:text-stone-300">
        This page is not saved on your device yet. Recipes you opened before are still
        available.
      </p>
      <Link
        href="/"
        className="inline-block mt-8 rounded-full bg-amber-600 hover:bg-amber-700 text-white
          dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950
          font-semibold px-6 py-3 transition-colors"
      >
        Back to all recipes
      </Link>
    </div>
  );
}
