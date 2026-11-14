import type { Metadata } from "next";
import { Brand } from "@/components/brand";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Log in · Inkwell",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
        <Brand />
        <ThemeToggle />
      </header>

      <main className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-10 px-4 pb-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <section className="order-2 lg:order-1">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-accent">
            For WAEC &amp; JAMB tutors
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-[1.1] font-semibold tracking-tight text-balance sm:text-5xl">
            Your notes on each student, for your eyes only.
          </h1>
          <p className="mt-4 max-w-md text-lg text-muted">
            Write down how each student is doing, fix it later, delete it when
            you&apos;re done. No other tutor can open your notes, not even by
            typing in the address.
          </p>

          <ul className="mt-8 grid gap-3 text-sm sm:grid-cols-3 lg:grid-cols-1">
            <Point title="Private to you">
              The database itself checks every note belongs to you.
            </Point>
            <Point title="Made for your phone">
              Write a note between lessons, read it before the parent meeting.
            </Point>
            <Point title="Safe on a shared laptop">
              After you log out, Back and Refresh show nothing.
            </Point>
          </ul>
        </section>

        <section className="order-1 lg:order-2">
          <LoginForm />
        </section>
      </main>
    </div>
  );
}

function Point({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-3 rounded-xl border border-border bg-surface/60 p-3">
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="mt-0.5 size-5 shrink-0 text-accent"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12.5l4.5 4.5L19 7.5" />
      </svg>
      <span>
        <span className="block font-medium">{title}</span>
        <span className="text-muted">{children}</span>
      </span>
    </li>
  );
}
