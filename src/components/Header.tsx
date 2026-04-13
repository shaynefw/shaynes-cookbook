import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

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
        <ThemeToggle />
      </div>
    </header>
  );
}
