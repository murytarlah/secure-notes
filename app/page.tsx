import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AppHeader } from "@/components/app-header";
import { NoteActions } from "@/components/note-actions";
import { createClient } from "@/lib/supabase/server";
import {
  NOTE_COLUMNS,
  STICKY_BUTTON,
  formatNoteDate,
  notePreview,
  noteTint,
  type Note,
} from "@/lib/notes";
import { NewNoteForm } from "./new-note-form";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <AppHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
        <Suspense fallback={<WhoAmISkeleton />}>
          <WhoAmI />
        </Suspense>

        <div className="mt-6">
          <NewNoteForm />
        </div>

        <Suspense fallback={<NotesSkeleton />}>
          <NotesList />
        </Suspense>
      </main>
    </div>
  );
}

async function WhoAmI() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) redirect("/login");

  return (
    <div>
      <p className="text-sm text-muted">
        Logged in as{" "}
        <span className="font-medium break-all text-ink">
          {data.claims.email}
        </span>
      </p>
      <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight">
        My notes
      </h1>
    </div>
  );
}

async function NotesList() {
  const supabase = await createClient();

  // No "where user_id = ...": row-level security only returns this tutor's notes.
  const { data: notes, error } = await supabase
    .from("notes")
    .select(NOTE_COLUMNS)
    .order("created_at", { ascending: false })
    .returns<Note[]>();

  if (error) {
    return (
      <p className="mt-10 rounded-lg bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
        Your notes couldn&apos;t be loaded. Refresh the page to try again.
      </p>
    );
  }

  if (!notes.length) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-border px-6 py-10 text-center">
        <p className="font-serif text-lg font-semibold">No notes yet</p>
        <p className="mt-1 text-sm text-muted">
          Your first note will appear here. Only you can see it.
        </p>
      </div>
    );
  }

  return (
    <section aria-labelledby="notes-heading" className="mt-10">
      <div className="flex items-baseline justify-between">
        <h2 id="notes-heading" className="font-serif text-xl font-semibold">
          Newest first
        </h2>
        <p className="text-sm text-muted">
          {notes.length} {notes.length === 1 ? "note" : "notes"}
        </p>
      </div>

      <ol className="mt-6 grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <li key={note.id} className="min-w-0">
            <NoteCard note={note} />
          </li>
        ))}
      </ol>
    </section>
  );
}

function NoteCard({ note }: { note: Note }) {
  const edited = note.updated_at !== note.created_at;
  const preview = notePreview(note.body);
  const href = `/notes/${note.id}`;
  return (
    <article
      className={`dims-on-delete note-card ${noteTint(note.id)} flex h-full flex-col rounded-sm p-5 pt-6`}
    >
      <header className="grid gap-1">
        <h3 className="font-serif text-lg font-semibold break-words">
          <Link href={href} className="hover:underline underline-offset-4">
            {note.title}
          </Link>
        </h3>
        <p className="text-xs opacity-75">
          <time dateTime={note.created_at}>
            {formatNoteDate(note.created_at)}
          </time>
          {edited && " · edited"}
        </p>
      </header>
      {preview.text && (
        <p className="mt-3 line-clamp-4 leading-relaxed break-words whitespace-pre-wrap">
          {preview.text}
        </p>
      )}
      {preview.cut && (
        <Link
          href={href}
          aria-label={`Read all of "${note.title}"`}
          className="mt-2 self-start text-sm font-semibold underline underline-offset-4 hover:no-underline"
        >
          Read more
        </Link>
      )}
      <footer className="mt-auto pt-5">
        <NoteActions
          id={note.id}
          title={note.title}
          viewHref={href}
          editHref={`${href}?edit=1`}
          buttonClass={STICKY_BUTTON}
        />
      </footer>
    </article>
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

function NotesSkeleton() {
  return (
    <div aria-hidden className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-40 animate-pulse rounded-2xl bg-border/60" />
      ))}
    </div>
  );
}
