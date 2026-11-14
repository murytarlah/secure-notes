/**
 * The Inkwell mark: a calligraphic "i" just written by a quill.
 * Drawn in the theme's ink colour, so it follows the light/dark switch.
 */
export function InkwellMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={className}>
      {/* Quill feather */}
      <path
        d="M12 13.4C12.5 8.7 15.9 4.3 22 1.6c-.5 1.6-1.2 3-2 4.2l.9-.1c-.8 1.4-1.7 2.6-2.8 3.6l.8.1C17.3 11.1 15 12.7 12 13.4Z"
        className="fill-accent"
      />
      {/* Vein, in the page colour */}
      <path
        d="M12.6 12.8C15 9.6 17.9 6.1 21.4 2.3"
        fill="none"
        className="stroke-paper"
        strokeWidth=".55"
        strokeLinecap="round"
      />
      {/* Quill tip, touching the end of the i */}
      <path
        d="M12.4 13 10.9 15.4"
        className="stroke-accent"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* Calligraphic i */}
      <path
        d="M2.6 13.4c1.4-2.3 3.3-3.6 5.1-3.5 1 .1 1.3.9.9 2.1l-1.9 5.6c-.5 1.5.4 2.1 1.6 1.4.9-.5 1.7-1.4 2.4-2.5"
        fill="none"
        className="stroke-accent"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.4" cy="6.5" r="1.4" className="fill-accent" />
    </svg>
  );
}

export function Brand({ size = "md" }: { size?: "md" | "lg" }) {
  const mark = size === "lg" ? "size-11" : "size-9";
  const text = size === "lg" ? "text-2xl" : "text-xl";
  return (
    <span className="inline-flex items-center gap-2">
      <InkwellMark className={mark} />
      <span className={`font-serif ${text} leading-none font-bold tracking-tight`}>
        <span className="text-ink">Ink</span>
        <span className="text-accent">well</span>
      </span>
    </span>
  );
}
