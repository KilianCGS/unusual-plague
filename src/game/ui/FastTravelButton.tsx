import type { CSSProperties } from "react";

import { PIXEL_FONT_FAMILY } from "./pixelFont";
import styles from "./FastTravelButton.module.css";

// The small parchment chip that offers the fast travel. It only exists while
// the action is available (the owner decides), sits in the top-right corner
// and takes input only when it is clicked.
export function FastTravelButton({
  label,
  onTravel,
}: {
  label: string;
  onTravel: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.button}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      data-fast-travel
      onClick={(event) => {
        // Space / Enter belong to the game (run, interact): never keep focus.
        event.currentTarget.blur();
        onTravel();
      }}
    >
      <span className={styles.face}>{label}</span>
    </button>
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
