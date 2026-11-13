import type { CSSProperties } from "react";

import { PIXEL_FONT_FAMILY } from "./pixelFont";
import styles from "./DayEndSign.module.css";

// The wooden sign at the top right that says the day is over ("Go to the apothecary"). It takes
// the place of the fast travel chip, which is off while it shows. It only draws and takes no input.
export function DayEndSign({ text }: { text: string }) {
  return (
    <div
      className={styles.sign}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      data-day-end-sign
      role="status"
    >
      <span className={styles.arrow} aria-hidden />
      <span className={styles.text}>{text}</span>
    </div>
  );
}
