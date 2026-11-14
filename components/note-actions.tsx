"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { deleteNote } from "@/app/actions";

/**
 * Edit and Delete for one note, with the delete confirmation right where the
 * tutor clicked: no pop-up. "Delete" turns the buttons into
 * "Delete this note? Keep / Delete". Keep, Escape or clicking elsewhere backs out.
 */
export function NoteActions({
  id,
  title,
  viewHref,
  editHref,
  buttonClass,
}: {
  id: number;
  title: string;
  /** Show a View link (on the notes list), so even short notes open in full. */
  viewHref?: string;
  /** Show an Edit link next to Delete. */
  editHref?: string;
  /** Style for the plain buttons, so they suit a sticky note or the page. */
  buttonClass: string;
}) {
  const [confirming, setConfirming] = useState(false);
  // Set the moment the tutor confirms; stays on until the page moves on.
  const [deleting, setDeleting] = useState(false);
  const submitted = useRef(false);
  const deleteRef = useRef<HTMLButtonElement>(null);
  const keepRef = useRef<HTMLButtonElement>(null);
  const wasConfirming = useRef(false);

  // Move focus to "Keep" when asking, and back to "Delete" when backing out,
  // so keyboard and screen-reader users never lose their place.
  useEffect(() => {
    if (confirming) keepRef.current?.focus();
    else if (wasConfirming.current) deleteRef.current?.focus();
    wasConfirming.current = confirming;
  }, [confirming]);

  if (!confirming) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {viewHref && (
          <Link
            href={viewHref}
            aria-label={`View "${title}"`}
            className={buttonClass}
          >
            <EyeIcon />
            View
          </Link>
        )}
        {editHref && (
          <Link
            href={editHref}
            prefetch={true}
            aria-label={`Edit "${title}"`}
            className={buttonClass}
          >
            Edit
          </Link>
        )}
        <button
          ref={deleteRef}
          type="button"
          onClick={() => setConfirming(true)}
          aria-label={`Delete "${title}"`}
          className={buttonClass}
        >
          <TrashIcon />
          Delete
        </button>
      </div>
    );
  }

  if (deleting) {
    // The note is on its way out: say so, and dim the note (see globals.css).
    return (
      <p
        role="status"
        data-deleting
        className="inline-flex h-9 items-center gap-2 text-sm font-semibold"
      >
        <Spinner />
        Deleting note…
      </p>
    );
  }

  return (
    <form
      action={async (formData) => {
        setDeleting(true);
        await deleteNote(formData);
      }}
      role="group"
      aria-label={`Confirm deleting "${title}"`}
      onSubmit={() => {
        submitted.current = true;
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && !submitted.current) setConfirming(false);
      }}
      onBlur={(event) => {
        // Clicking or tabbing away from the question means "keep it",
        // but never once the delete is under way.
        if (submitted.current) return;
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setConfirming(false);
        }
      }}
      className="confirm-pop flex flex-wrap items-center gap-2"
    >
      <input type="hidden" name="id" value={id} />
      <span className="mr-1 text-sm font-semibold" aria-live="polite">
        Delete this note?
      </span>
      <button
        ref={keepRef}
        type="button"
        onClick={() => setConfirming(false)}
        className={buttonClass}
      >
        Keep
      </button>
      <button
        type="submit"
        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#c4231b] px-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#a51b14]"
      >
        <TrashIcon />
        Delete
      </button>
    </form>
  );
}

function Spinner() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-4 animate-spin" fill="none">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />
    </svg>
  );
}
