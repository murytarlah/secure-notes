import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { createClient } from "@/lib/supabase/server";
import { logOut } from "./login/actions";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-paper/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Brand />
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

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <Suspense fallback={<WhoAmISkeleton />}>
          <WhoAmI />
        </Suspense>

        <section className="ruled mt-8 rounded-2xl border border-border py-12 pr-6 pl-14 shadow-page">
          <h2 className="font-serif text-xl font-semibold">No notes yet</h2>
          <p className="mt-2 text-muted">
            Your notes will appear here, newest first. Only you can see them.
          </p>
        </section>
      </main>
    </div>
  );
}

async function WhoAmI() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims?.email;
  if (!data?.claims?.sub) redirect("/login");

  return (
    <div>
      <p className="text-sm text-muted">
        Logged in as{" "}
        <span className="font-medium text-ink break-all">{email}</span>
      </p>
      <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight">
        My notes
      </h1>
    </div>
  );
}

function WhoAmISkeleton() {
  return (
    <div aria-hidden>
      <div className="h-5 w-56 animate-pulse rounded bg-border" />
      <div className="mt-2 h-9 w-40 animate-pulse rounded bg-border" />
    </div>
  );
}
