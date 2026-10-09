import type { CSSProperties } from "react";

import { PIXEL_FONT_FAMILY } from "./pixelFont";
import styles from "./ItemFeedback.module.css";

// A small, non-modal notice for item events ("Obtained: Medicinal herb", "I
// don't have room to carry this."). It only draws the text it is given; the
// owner decides when to show it and for how long, and it never takes input.
// Reusable for other item events later (e.g. a prepared remedy).
export function ItemFeedback({ text }: { text: string }) {
  return (
    <div
      className={styles.feedback}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      data-item-feedback
      role="status"
    >
      <div className={styles.inner}>{text}</div>
    </div>
  );
}
