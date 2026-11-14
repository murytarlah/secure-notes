/**
 * The Inkwell mark: an ink bottle with a keyhole in it.
 * Notes written in ink, locked to the tutor who wrote them.
 */
export function InkwellMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className}>
      {/* Lip and neck of the bottle */}
      <rect x="8" y="3.5" width="8" height="2.2" rx="1.1" fill="currentColor" />
      <rect x="9.5" y="5.2" width="5" height="3" fill="currentColor" />
      {/* Body */}
      <path
        d="M5.5 11.2A3.2 3.2 0 0 1 8.7 8h6.6a3.2 3.2 0 0 1 3.2 3.2v6.1a3.2 3.2 0 0 1-3.2 3.2H8.7a3.2 3.2 0 0 1-3.2-3.2Z"
        fill="currentColor"
      />
      {/* Keyhole, cut in the background colour */}
      <circle cx="12" cy="13.2" r="1.7" className="fill-accent" />
      <path d="M11.1 14.2h1.8l.5 3.6h-2.8Z" className="fill-accent" />
    </svg>
  );
}

export function Brand({ size = "md" }: { size?: "md" | "lg" }) {
  const box = size === "lg" ? "size-11" : "size-9";
  const text = size === "lg" ? "text-2xl" : "text-xl";
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`${box} inline-flex items-center justify-center rounded-xl bg-accent text-on-accent shadow-page`}
      >
        <InkwellMark className="size-[68%]" />
      </span>
      <span className={`font-serif ${text} font-semibold tracking-tight`}>
        Inkwell
      </span>
    </span>
  );
}
