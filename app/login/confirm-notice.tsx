"use client";

import { useSearchParams } from "next/navigation";

/** Shown when the tutor arrives from the link in their confirmation email. */
export function ConfirmNotice() {
  const confirm = useSearchParams().get("confirm");
  if (confirm === "ok") {
    return (
      <p
        role="status"
        className="mb-6 rounded-lg bg-success-soft px-3 py-2 text-sm font-medium text-success"
      >
        Email confirmed. Log in with your password to see your notes.
      </p>
    );
  }
  if (confirm === "failed") {
    return (
      <p
        role="status"
        className="mb-6 rounded-lg bg-danger-soft px-3 py-2 text-sm font-medium text-danger"
      >
        That link has expired or was already used. If you confirmed already,
        just log in. Otherwise, create your account again for a new link.
      </p>
    );
  }
  return null;
}
