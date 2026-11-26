import type { CSSProperties } from "react";

import styles from "./AttentionMark.module.css";

// A small pixel-art symbol over a character that has news for the Doctor (things he can pick up have a soft glow
// instead: see PickupAura). It lives in world space (inside the scene), centred on `x` with its bottom at `y`: give it
// the point just above the character's head. It only draws; the owner decides who shows which (attentionMarks.ts).
// 2026-11-27 (Kilian): yellow for patients, blue for errands; an exclamation for the person concerned and a question
// mark for whoever has something for the case; a soft aura once the case or the errand has been accepted. 25% smaller.
export type AttentionMarkProps = {
  x: number;
  y: number;
  zIndex: number;
  kind?: "patient" | "errand";
  glyph?: "exclamation" | "question";
  accepted?: boolean;
};

const FILL = { patient: "#ffd60a", errand: "#4a9bff" } as const;

// 7 x 14 pixel drawings: the dark outline first, then the colour.
const EXCLAMATION = {
  outline: "M1 0h5v9H1z M1 10h5v4H1z",
  fill: "M2 1h3v7H2z M2 11h3v2H2z",
};
const QUESTION = {
  outline: "M1 0h5v1h1v5h-1v1h-1v2H2V6h1V5h1V3H3v1H0V1h1z M2 10h3v4H2z",
  fill: "M2 1h3v1h1v3h-1v1h-1v2H3V6h1V5h1V2H2v1H1V2h1z M3 11h1v2H3z",
};

export function AttentionMark({ x, y, zIndex, kind = "patient", glyph = "exclamation", accepted = false }: AttentionMarkProps) {
  const shape = glyph === "question" ? QUESTION : EXCLAMATION;

  return (
    <div
      className={`${styles.mark}${accepted ? ` ${styles.accepted}` : ""}`}
      style={{ left: x, top: y, zIndex, ["--mark-color" as string]: FILL[kind] } as CSSProperties}
      data-attention-mark={kind}
      data-attention-glyph={glyph}
      data-attention-accepted={accepted}
      aria-hidden="true"
    >
      <svg width="9" height="18" viewBox="0 0 7 14" shapeRendering="crispEdges">
        <path d={shape.outline} fill="#2b1a14" />
        <path d={shape.fill} fill={FILL[kind]} />
      </svg>
    </div>
  );
}
