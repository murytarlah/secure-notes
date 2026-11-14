"use client";

import Link from "next/link";
import { useActionState } from "react";
import { updateNote, type NoteFormState } from "@/app/actions";
import { BODY_MAX, TITLE_MAX, type Note } from "@/lib/notes";

export function EditNoteForm({ note }: { note: Pick<Note, "id" | "title" | "body"> }) {
  const [state, formAction, pending] = useActionState(updateNote, {
    title: note.title,
    body: note.body,
  } satisfies NoteFormState);

  return (
    <form action={formAction} noValidate className="grid gap-4">
      <input type="hidden" name="id" value={note.id} />

      <div className="grid gap-1.5">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          maxLength={TITLE_MAX}
          defaultValue={state.title}
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "note-error" : undefined}
          className="h-12 rounded-xl border border-border bg-surface px-3.5 text-base text-ink focus:border-accent focus:outline-none aria-invalid:border-danger"
        />
      </div>

      <div className="grid gap-1.5">
        <label htmlFor="body" className="text-sm font-medium">
          Note
        </label>
        <textarea
          id="body"
          name="body"
          rows={10}
          maxLength={BODY_MAX}
          defaultValue={state.body}
          className="min-h-48 resize-y rounded-xl border border-border bg-surface px-3.5 py-3 text-base leading-relaxed text-ink focus:border-accent focus:outline-none"
        />
      </div>

      <p
        id="note-error"
        aria-live="polite"
        className={
          state.error
            ? "rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger"
            : "sr-only"
        }
      >
        {state.error}
      </p>

      <div className="flex flex-wrap items-center justify-end gap-3">
        <Link
          href={`/notes/${note.id}`}
          className="inline-flex h-11 items-center rounded-xl px-4 font-medium text-muted transition-colors hover:text-ink"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-6 font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
