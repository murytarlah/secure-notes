"use client";

import { useLayoutEffect } from "react";
import { THEME_STORAGE_KEY as STORAGE_KEY } from "@/lib/theme";

function readSaved() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function currentTheme() {
  const set = document.documentElement.getAttribute("data-theme");
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  // In development React clears the attribute on its remount; put it back.
  useLayoutEffect(() => {
    const saved = readSaved();
    if (saved === "light" || saved === "dark") {
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  function toggle() {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private mode: the theme still changes for this visit.
    }
  }

  // Both icons are rendered; CSS shows the right one, so there's no flash.
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      title="Switch theme"
      className={`inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-ink transition-colors hover:border-accent hover:text-accent ${className}`}
    >
      {/* Moon: shown in light theme */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="size-5 dark:hidden"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
      </svg>
      {/* Sun: shown in dark theme */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="hidden size-5 dark:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
