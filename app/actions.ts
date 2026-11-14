"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { BODY_MAX, TITLE_MAX, parseNoteId } from "@/lib/notes";

export type NoteFormState = {
  error?: string;
  /** Changes on every successful save, so the form knows to clear itself. */
  savedAt?: number;
  title?: string;
  body?: string;
};

// Never trust input: read every field as a plain string and check it here.
function readNote(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  // Keep the tutor's line breaks; only normalise Windows line endings.
  const body = String(formData.get("body") ?? "").replace(/\r\n/g, "\n");
  return { title, body };
}

function checkNote({ title, body }: { title: string; body: string }) {
  if (!title) return "Give your note a title, for example the student's name.";
  if (title.length > TITLE_MAX)
    return `Keep the title under ${TITLE_MAX} characters.`;
  if (body.length > BODY_MAX)
    return `This note is too long. Keep it under ${BODY_MAX.toLocaleString()} characters.`;
  return null;
}

export async function createNote(
  _prev: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const note = readNote(formData);
  const problem = checkNote(note);
  if (problem) return { error: problem, ...note };

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims?.sub) redirect("/login");

  // No user_id here: the database fills it in with auth.uid(),
  // and the insert policy refuses any other value.
  const { error } = await supabase
    .from("notes")
    .insert({ title: note.title, body: note.body });

  if (error) {
    return { error: "Your note wasn't saved. Please try again.", ...note };
  }

  revalidatePath("/");
  return { savedAt: Date.now() };
}

export async function updateNote(
  _prev: NoteFormState,
  formData: FormData,
): Promise<NoteFormState> {
  const id = parseNoteId(formData.get("id"));
  if (!id) return { error: "This note can't be found." };

  const note = readNote(formData);
  const problem = checkNote(note);
  if (problem) return { error: problem, ...note };

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/login");

  // Row-level security only lets a tutor update their own notes. For anyone
  // else's id, nothing matches, so no row comes back.
  const { data, error } = await supabase
    .from("notes")
    .update({
      title: note.title,
      body: note.body,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id");

  if (error) {
    return { error: "Your changes weren't saved. Please try again.", ...note };
  }
  if (!data.length) {
    return { error: "This note can't be found. It may have been deleted." };
  }

  revalidatePath("/");
  revalidatePath(`/notes/${id}`);
  redirect("/");
}

export async function deleteNote(formData: FormData) {
  const id = parseNoteId(formData.get("id"));
  if (!id) redirect("/");

  const supabase = await createClient();
  const { data: claims } = await supabase.auth.getClaims();
  if (!claims?.claims?.sub) redirect("/login");

  // Row-level security only lets a tutor delete their own notes.
  await supabase.from("notes").delete().eq("id", id);

  revalidatePath("/");
  revalidatePath(`/notes/${id}`);
  redirect("/");
}
