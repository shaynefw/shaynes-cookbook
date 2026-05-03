import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import TextSizeToggle from "./TextSizeToggle";

export default function Header() {
  return (
    <header className="border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-semibold tracking-tight hover:opacity-80 transition-opacity"
        >
          Shayne's Cookbook
        </Link>
        <div className="flex items-center gap-1">
          <TextSizeToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
