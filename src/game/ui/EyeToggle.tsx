// A small pixel eye: open = "shown", slashed/closed = "hidden". Used to show / hide
// the inventory bar and the errands list. Pure SVG, hard-edged, no text.
export function EyeToggle({
  shown,
  label,
  onToggle,
  className,
}: {
  shown: boolean;
  label: string;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      aria-label={label}
      aria-pressed={shown}
      data-eye-toggle
      onClick={(event) => {
        // Space / Enter belong to the game: never keep focus.
        event.currentTarget.blur();
        event.stopPropagation();
        onToggle();
      }}
    >
      <EyeIcon shown={shown} />
    </button>
  );
}

// The bare picture (no button), for headers that already are the toggle.
export function EyeIcon({ shown }: { shown: boolean }) {
  return (
    <svg width="24" height="16" viewBox="0 0 12 8" shapeRendering="crispEdges" aria-hidden>
        {shown ? (
          <>
            <path d="M3 0h6v1h2v1h1v1H0V2h1V1h2z" fill="#f4ead5" />
            <path d="M0 3h12v2H0z" fill="#f4ead5" />
            <path d="M3 5h6v1H8v1H4V6H3z" fill="#f4ead5" />
            <path d="M5 2h2v4H5z" fill="#2b1a14" />
            <path d="M5 3h1v1H5z" fill="#f4ead5" />
          </>
        ) : (
          <>
            <path d="M0 3h12v1H0z" fill="#f4ead5" />
            <path d="M2 4h1v1H2zM4 5h1v1H4zM7 5h1v1H7zM9 4h1v1H9z" fill="#f4ead5" />
          </>
        )}
      </svg>
  );
}
