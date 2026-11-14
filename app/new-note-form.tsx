"use client";

import { useActionState } from "react";
import { createNote, type NoteFormState } from "./actions";
import { BODY_MAX, TITLE_MAX } from "@/lib/notes";

const initial: NoteFormState = {};

export function NewNoteForm() {
  const [state, formAction, pending] = useActionState(createNote, initial);

  return (
    <form
      action={formAction}
      noValidate
      className="ruled relative overflow-hidden rounded-2xl border border-border py-6 pr-5 pl-14 shadow-page sm:pr-7"
    >
      <div aria-hidden className="tint-strip absolute inset-x-0 top-0 h-1.5" />
      <h2 className="font-serif text-xl font-semibold tracking-tight">
        New note
      </h2>

      <div className="mt-4 grid gap-1.5">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          maxLength={TITLE_MAX}
          placeholder="e.g. Tolu, maths"
          defaultValue={state.title}
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "note-error" : undefined}
          className="h-12 rounded-xl border border-border bg-surface px-3.5 text-base text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none aria-invalid:border-danger"
        />
      </div>

      <div className="mt-4 grid gap-1.5">
        <label htmlFor="body" className="text-sm font-medium">
          Note
        </label>
        <textarea
          id="body"
          name="body"
          rows={4}
          maxLength={BODY_MAX}
          placeholder="How is the student doing? What should you work on next time?"
          defaultValue={state.body}
          className="min-h-28 resize-y rounded-xl border border-border bg-surface px-3.5 py-3 text-base leading-relaxed text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none"
        />
      </div>

      <p
        id="note-error"
        aria-live="polite"
        className={
          state.error
            ? "mt-4 rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger"
            : "sr-only"
        }
      >
        {state.error ?? (state.savedAt ? "Note saved." : "")}
      </p>

      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-6 font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save note"}
        </button>
      </div>
    </form>
  );
}
