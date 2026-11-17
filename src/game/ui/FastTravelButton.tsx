import type { CSSProperties } from "react";

import { PIXEL_FONT_FAMILY } from "./pixelFont";
import styles from "./FastTravelButton.module.css";

// The small parchment chip that offers the fast travel. It only exists while
// the action is available (the owner decides), sits in the top-right corner
// and takes input only when it is clicked.
export function FastTravelButton({
  label,
  onTravel,
  fill = 1,
  glow = false,
}: {
  label: string;
  onTravel: () => void;
  // 0..1: the recharge bar (1 = ready to use).
  fill?: number;
  // True while the tutorial is explaining the button (until the Doctor presses Enter): it BLINKS and a yellow
  // arrow under it bobs, pointing at where it is (2026-11-16, Kilian).
  glow?: boolean;
}) {
  const ready = fill >= 1;
  return (
    <div className={styles.anchor}>
    <button
      type="button"
      className={`${styles.button}${glow ? ` ${styles.glow}` : ""}`}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      data-fast-travel
      data-ready={ready}
      data-glow={glow || undefined}
      aria-disabled={!ready}
      onClick={(event) => {
        // Space / Enter belong to the game (run, interact): never keep focus.
        event.currentTarget.blur();
        if (ready) onTravel();
      }}
    >
      <span className={`${styles.face}${ready ? "" : ` ${styles.recharging}`}`}>
        {label}
        {ready ? null : (
          <span className={styles.bar} aria-hidden>
            <span className={styles.barFill} style={{ width: `${Math.round(fill * 100)}%` }} />
          </span>
        )}
      </span>
    </button>
      {glow ? <span className={styles.arrow} aria-hidden data-fast-travel-arrow /> : null}
    </div>
  );
}

// The line over the black screen of the trip.
export function TravelCaption({ text }: { text: string }) {
  return (
    <div
      className={styles.caption}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      data-travel-caption
      role="status"
    >
      {text}
    </div>
  );
}
