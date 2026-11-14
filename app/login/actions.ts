"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
  email?: string;
  /** Sign-up worked and a confirmation link was emailed to `email`. */
  checkEmail?: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;
const MAX_EMAIL = 254;
const MAX_PASSWORD = 72; // Supabase Auth's limit

// Never trust input: read every field as a plain string and check it here,
// before anything goes to Supabase.
function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

export async function logIn(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const { email, password } = readCredentials(formData);
  const wrong = { error: "Wrong email or password", email };

  // Same message for every failure, so it never hints which part was wrong.
  if (
    !EMAIL_PATTERN.test(email) ||
    email.length > MAX_EMAIL ||
    password.length < MIN_PASSWORD ||
    password.length > MAX_PASSWORD
  ) {
    return wrong;
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error?.code === "email_not_confirmed") {
    // Only reachable with the right password, so it reveals nothing new.
    return {
      error: "Confirm your email first: open the link we sent you, then log in.",
      email,
    };
  }
  if (error) return wrong;

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signUp(
  _prev: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const { email, password } = readCredentials(formData);

  if (!EMAIL_PATTERN.test(email) || email.length > MAX_EMAIL) {
    return { error: "Enter a valid email address.", email };
  }
  if (password.length < MIN_PASSWORD) {
    return {
      error: `Your password needs at least ${MIN_PASSWORD} characters.`,
      email,
    };
  }
  if (password.length > MAX_PASSWORD) {
    return {
      error: `Your password can be at most ${MAX_PASSWORD} characters.`,
      email,
    };
  }

  const supabase = await createClient();
  // The link in the confirmation email brings the tutor back to this site.
  const origin = (await headers()).get("origin");
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: origin ? { emailRedirectTo: `${origin}/auth/confirm` } : undefined,
  });

  if (error) {
    if (error.code === "user_already_exists") {
      return { error: "That email already has an account. Log in instead.", email };
    }
    if (error.code === "over_email_send_rate_limit") {
      return explainEmailLimit(supabase, email, password);
    }
    if (error.code === "weak_password") {
      return { error: "Choose a stronger password.", email };
    }
    return { error: "We couldn't create your account. Try again.", email };
  }
  // With "Confirm email" on (Supabase → Authentication → Sign In / Providers),
  // there is no session yet: the tutor confirms by email, then logs in.
  if (!data.session) {
    // Supabase hides "already registered" here by returning a user with no
    // identities instead of an error.
    if (data.user && data.user.identities?.length === 0) {
      return { error: "That email already has an account. Log in instead.", email };
    }
    return { checkEmail: true, email };
  }

  // Confirm email is off: Supabase logged the tutor straight in.
  revalidatePath("/", "layout");
  redirect("/");
}

/**
 * Supabase couldn't send another email (its hourly limit). Usually this means
 * the tutor signed up before and is trying again. Logging in with the same
 * email and password tells us which case it is, without sending an email.
 */
async function explainEmailLimit(
  supabase: Awaited<ReturnType<typeof createClient>>,
  email: string,
  password: string,
): Promise<AuthState> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  // The account exists, the password is right, the email is already confirmed:
  // just let them in.
  if (!error) {
    revalidatePath("/", "layout");
    redirect("/");
  }

  // The account exists but the email hasn't been confirmed yet.
  if (error.code === "email_not_confirmed") {
    return {
      error: `There's already an account for ${email}, but the email isn't verified yet. Check your inbox (and spam) for the link we sent earlier, click it, then log in.`,
      email,
    };
  }

  // We can't tell (no account, or a different password): don't guess.
  return {
    error: "We can't send a confirmation email right now. If you already signed up, check your inbox for our link. Otherwise, try again in a few minutes.",
    email,
  };
}

export async function logOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  // Drop every cached page in the browser so Back can't show notes.
  revalidatePath("/", "layout");
  redirect("/login");
}
