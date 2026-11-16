import type { CSSProperties } from "react";

import { PIXEL_FONT_FAMILY } from "./pixelFont";
import styles from "./WorldLabel.module.css";

// A short word floating over a point of the scene ("Sleep" over the bed): world space, centred on
// `x` with its bottom at `y`, with a soft golden glow. It only draws; the owner decides when it shows.
export function WorldLabel({ x, y, zIndex, text }: { x: number; y: number; zIndex: number; text: string }) {
  return (
    <div
      className={styles.label}
      style={{ left: x, top: y, zIndex, ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      data-world-label
      aria-hidden="true"
    >
      {text}
    </div>
  );
}
