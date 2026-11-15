// A small pixel eye: open = "shown", closed (lashes) = "hidden". Used to show / hide the inventory
// bar and the errands list. The pictures are PixelLab pixel art (2026-11-15; the old drawn eye read
// as an arrow), kept at their own pixel size so they stay crisp.
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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={shown ? "/game/ui/eye-open.png" : "/game/ui/eye-closed.png"}
      alt=""
      draggable={false}
      style={{ imageRendering: "pixelated", display: "block" }}
      aria-hidden
    />
  );
}
