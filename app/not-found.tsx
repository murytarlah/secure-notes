import Link from "next/link";
import { InkwellMark } from "@/components/brand";

/**
 * Shown for any address that doesn't exist, including another tutor's note:
 * to this user, it doesn't exist.
 */
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <InkwellMark className="size-20" />
      <h1 className="mt-6 font-serif text-3xl font-semibold tracking-tight">
        Not found
      </h1>
      <p className="mt-2 max-w-sm text-muted">
        There&apos;s no note at this address in your notebook.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-11 items-center rounded-xl bg-accent px-6 font-semibold text-on-accent transition-colors hover:bg-accent-hover"
      >
        Back to my notes
      </Link>
    </main>
  );
}
