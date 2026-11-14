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
