import Link from "next/link";
import { Brand } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { logOut } from "@/app/login/actions";

/** The header on every logged-in page: logo, theme switch and Log out. */
export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-paper/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link href="/" aria-label="Inkwell, my notes" className="rounded-xl">
          <Brand />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <form action={logOut}>
            <button
              type="submit"
              className="inline-flex h-10 items-center rounded-full border border-border bg-surface px-4 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
