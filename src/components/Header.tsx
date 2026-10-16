import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import TextSizeToggle from "./TextSizeToggle";
import { BrandMark } from "@/lib/brand";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-30 border-b border-stone-300/70 dark:border-stone-700/60
        bg-[#e8e4e0]/85 dark:bg-[#3d3425]/85 backdrop-blur-md"
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
          aria-label="Shayne's Cookbook home"
        >
          <span className="transition-transform group-hover:-rotate-6">
            <BrandMark size={34} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">
            Shayne&apos;s Cookbook
          </span>
        </Link>
        <div className="flex items-center gap-1">
          <TextSizeToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
