import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { NoteActions } from "@/components/note-actions";
import { createClient } from "@/lib/supabase/server";
import {
  NOTE_COLUMNS,
  STICKY_BUTTON,
  formatNoteDate,
  noteTint,
  parseNoteId,
  type Note,
} from "@/lib/notes";
import { EditNoteForm } from "./edit-note-form";

export const metadata: Metadata = {
  title: "Note · Inkwell",
};

/**
 * One note. It opens read-only; "Edit" (or ?edit=1 in the address, which the
 * Edit button on the notes list uses) switches to the edit form.
 */
export default function NotePage({
  params,
  searchParams,
}: PageProps<"/notes/[id]">) {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-accent"
        >
          <span aria-hidden>←</span> My notes
        </Link>

        <Suspense fallback={<NoteSkeleton />}>
          {Promise.all([params, searchParams]).then(([{ id }, query]) => (
            <NoteView rawId={id} editing={query.edit !== undefined} />
          ))}
        </Suspense>
      </main>
    </div>
  );
}

async function NoteView({
  rawId,
  editing,
}: {
  rawId: string;
  editing: boolean;
}) {
  const id = parseNoteId(rawId);
  if (!id) notFound();

  const supabase = await createClient();

  // Row-level security: another tutor's note simply isn't there for this user,
  // so it comes back as "not found", never as the note.
  const { data: note } = await supabase
    .from("notes")
    .select(NOTE_COLUMNS)
    .eq("id", id)
    .maybeSingle<Note>();

  if (!note) notFound();

  const edited = note.updated_at !== note.created_at;
  const dates = (
    <>
      Written {formatNoteDate(note.created_at)}
      {edited && ` · last edited ${formatNoteDate(note.updated_at)}`}
    </>
  );

  if (editing) {
    return (
      <section
        className="dims-on-delete ruled relative mt-4 overflow-hidden rounded-2xl border border-border py-6 pr-5 pl-14 shadow-page sm:pr-7"
        aria-labelledby="edit-heading"
      >
        <div aria-hidden className="tint-strip absolute inset-x-0 top-0 h-1.5" />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1
              id="edit-heading"
              className="font-serif text-2xl font-semibold tracking-tight"
            >
              Edit note
            </h1>
            <p className="mt-1 text-xs text-muted">{dates}</p>
          </div>
          <NoteActions
            id={note.id}
            title={note.title}
            buttonClass="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 text-sm font-medium transition-colors hover:border-danger hover:text-danger"
          />
        </div>

        <div className="mt-6">
          <EditNoteForm note={note} />
        </div>
      </section>
    );
  }

  // Read-only: the whole note as one big sticky note.
  return (
    <article
      className={`dims-on-delete note-card ${noteTint(note.id)} mt-8 rounded-sm px-6 pt-8 pb-6 sm:px-10 sm:pt-10`}
      aria-labelledby="note-title"
    >
      <h1
        id="note-title"
        className="font-serif text-3xl leading-tight font-semibold tracking-tight break-words"
      >
        {note.title}
      </h1>
      <p className="mt-2 text-sm opacity-75">{dates}</p>

      {note.body ? (
        <p className="mt-6 text-lg leading-relaxed break-words whitespace-pre-wrap">
          {note.body}
        </p>
      ) : (
        <p className="mt-6 italic opacity-70">This note has no text yet.</p>
      )}

      <footer className="mt-10 border-t border-black/10 pt-5">
        <NoteActions
          id={note.id}
          title={note.title}
          editHref={`/notes/${note.id}?edit=1`}
          buttonClass={STICKY_BUTTON}
        />
      </footer>
    </article>
  );
}

function NoteSkeleton() {
  return (
    <div
      aria-hidden
      className="mt-8 h-[24rem] animate-pulse rounded-2xl bg-border/60"
    />
  );
}
