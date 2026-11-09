import type { CSSProperties } from "react";

import { PIXEL_FONT_FAMILY } from "./pixelFont";
import styles from "./AttentionMark.module.css";

// A small "!" over a character that has news for the Doctor, or a "?" over a
// thing in the world he can pick up (kind="item"). It lives in world
// space (inside the scene), centred on `x` with its bottom at `y`: give it the
// point just above the character's head and it follows the character wherever
// the character is placed. It only draws; the owner decides who shows it.
export function AttentionMark({
  x,
  y,
  zIndex,
  kind = "news",
}: {
  x: number;
  y: number;
  zIndex: number;
  kind?: "news" | "item";
}) {
  return (
    <div
      className={kind === "item" ? `${styles.mark} ${styles.item}` : styles.mark}
      style={
        {
          left: x,
          top: y,
          zIndex,
          ["--ui-font" as string]: PIXEL_FONT_FAMILY,
        } as CSSProperties
      }
      data-attention-mark={kind}
      aria-hidden="true"
    >
      {kind === "item" ? "?" : "!"}
    </div>
  );
}
