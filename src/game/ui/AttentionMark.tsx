import type { CSSProperties } from "react";

import styles from "./AttentionMark.module.css";

// A small "!" over a character that has news for the Doctor (things he can
// pick up have a soft glow instead: see PickupAura). It lives in world
// space (inside the scene), centred on `x` with its bottom at `y`: give it the
// point just above the character's head and it follows the character wherever
// the character is placed. It only draws; the owner decides who shows it.
// It is a drawn pixel-art exclamation mark (2026-11-15), not a letter: a yellow bar and dot with
// a dark outline.
export function AttentionMark({
  x,
  y,
  zIndex,
}: {
  x: number;
  y: number;
  zIndex: number;
}) {
  return (
    <div
      className={styles.mark}
      style={{ left: x, top: y, zIndex } as CSSProperties}
      data-attention-mark="news"
      aria-hidden="true"
    >
      <svg width="12" height="24" viewBox="0 0 7 14" shapeRendering="crispEdges">
        <path d="M1 0h5v9H1z M1 10h5v4H1z" fill="#2b1a14" />
        <path d="M2 1h3v7H2z M2 11h3v2H2z" fill="#ffd60a" />
      </svg>
    </div>
  );
}
