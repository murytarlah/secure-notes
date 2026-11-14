export type Note = {
  id: number;
  title: string;
  body: string;
  created_at: string;
  updated_at: string;
};

export const TITLE_MAX = 200;
export const BODY_MAX = 10_000;

/** The columns the app reads. user_id is never needed: RLS already filters. */
export const NOTE_COLUMNS = "id, title, body, created_at, updated_at";

/** Dates in the centre's time zone, the same on the server and every phone. */
export function formatNoteDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

/**
 * Note ids are positive whole numbers (as in /notes/12). Anything else in the
 * address or a form is treated as "not found" and never reaches the database.
 */
export function parseNoteId(value: unknown): number | null {
  const text = String(value ?? "");
  if (!/^[1-9]\d{0,15}$/.test(text)) return null;
  const id = Number(text);
  return Number.isSafeInteger(id) ? id : null;
}

/** Each note keeps one of six sticky-note colours, chosen from its id. */
export function noteTint(id: number) {
  return `note-tint-${id % 6}`;
}

/** How much of a note the notes list shows before "Read more". */
export const PREVIEW_MAX = 100;
export const PREVIEW_LINES = 4;

/**
 * A short preview of a note for the notes list: at most PREVIEW_MAX
 * characters and PREVIEW_LINES lines, cut at a word, keeping line breaks.
 * `cut` says if any text was hidden.
 */
export function notePreview(body: string) {
  const lines = body.split("\n");
  let text = lines.slice(0, PREVIEW_LINES).join("\n");
  let cut = lines.length > PREVIEW_LINES;

  if (text.length > PREVIEW_MAX) {
    const slice = text.slice(0, PREVIEW_MAX);
    const lastSpace = slice.search(/\s\S*$/);
    text = lastSpace > PREVIEW_MAX * 0.6 ? slice.slice(0, lastSpace) : slice;
    cut = true;
  }

  text = text.trimEnd();
  return { text: cut ? `${text}…` : text, cut };
}

/** Buttons on a sticky note: dark ink on a light wash, readable on every colour. */
export const STICKY_BUTTON =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-black/15 bg-white/45 px-3.5 text-sm font-medium transition-colors hover:bg-white/75 disabled:opacity-60";
