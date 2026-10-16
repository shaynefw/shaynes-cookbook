import Link from "next/link";
import { BrandMark } from "@/lib/brand";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-stone-300/70 dark:border-stone-700/60">
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-stone-500 dark:text-stone-400">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <BrandMark size={22} />
          <span className="font-display font-semibold text-stone-700 dark:text-stone-300">
            Shayne&apos;s Cookbook
          </span>
        </Link>
        <p>A personal collection of family favorite recipes.</p>
      </div>
    </footer>
  );
}
