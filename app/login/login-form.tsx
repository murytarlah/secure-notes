"use client";

import { useActionState, useState } from "react";
import { logIn, signUp, type AuthState } from "./actions";

type Mode = "login" | "signup";

const initial: AuthState = {};

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [loginState, loginAction, loginPending] = useActionState(logIn, initial);
  const [signupState, signupAction, signupPending] = useActionState(
    signUp,
    initial,
  );

  const isLogin = mode === "login";
  const state = isLogin ? loginState : signupState;
  const pending = isLogin ? loginPending : signupPending;

  return (
    <div className="ruled relative overflow-hidden rounded-2xl border border-border shadow-page">
      {/* Binding holes down the margin, like a page torn from an exercise book */}
      <div aria-hidden className="absolute inset-y-0 left-3 flex flex-col justify-around py-10">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-3 rounded-full border border-border bg-paper" />
        ))}
      </div>

      <div className="py-8 pr-6 pl-14 sm:pr-8 sm:pl-16">
        <div
          role="tablist"
          aria-label="Log in or create an account"
          className="grid grid-cols-2 rounded-full border border-border bg-paper p-1 text-sm font-medium"
        >
          <TabButton active={isLogin} onClick={() => setMode("login")}>
            Log in
          </TabButton>
          <TabButton active={!isLogin} onClick={() => setMode("signup")}>
            Create account
          </TabButton>
        </div>

        <h2 className="mt-7 font-serif text-2xl font-semibold tracking-tight">
          {isLogin ? "Welcome back" : "Start your notebook"}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {isLogin
            ? "Log in to read and write your student notes."
            : "Use your own email. Your notes stay with this account."}
        </p>

        <form
          key={mode}
          action={isLogin ? loginAction : signupAction}
          className="mt-6 grid gap-4"
          noValidate
        >
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            defaultValue={state.email}
            invalid={Boolean(state.error)}
          />
          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete={isLogin ? "current-password" : "new-password"}
            hint={isLogin ? undefined : "At least 8 characters."}
            invalid={Boolean(state.error)}
          />

          <p
            id="form-error"
            aria-live="polite"
            className={
              state.error
                ? "rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger"
                : state.success
                  ? "rounded-lg bg-success-soft px-3 py-2 text-sm font-medium text-success"
                  : "sr-only"
            }
          >
            {state.error ?? state.success}
          </p>

          <button
            type="submit"
            disabled={pending}
            className="mt-1 inline-flex h-12 items-center justify-center rounded-xl bg-accent px-5 font-semibold text-on-accent transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {pending
              ? isLogin
                ? "Logging in…"
                : "Creating account…"
              : isLogin
                ? "Log in"
                : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`rounded-full px-3 py-2 transition-colors ${
        active ? "bg-surface text-ink shadow-sm" : "text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  hint,
  invalid,
  ...input
}: {
  label: string;
  hint?: string;
  invalid?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = `field-${input.name}`;
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        required
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? "form-error" : hint ? `${id}-hint` : undefined}
        className="h-12 rounded-xl border border-border bg-surface px-3.5 text-base text-ink placeholder:text-muted focus:border-accent focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-0 aria-invalid:border-danger"
        {...input}
      />
      {hint && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
