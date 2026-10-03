"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import styles from "./DialogueBubble.module.css";

const EDGE_MARGIN = 8;
const TAIL_SIZE = 12;
const TAIL_EDGE_INSET = 14;
const GAP_PX = 6;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

// Pixel-parchment speech bubble. It is positioned in SCREEN pixels inside the
// camera frame (like InteractionPrompt), anchored to a point above the
// speaker's head: `anchorX/anchorY` is that point. The bubble sits above it,
// is clamped inside `frameWidth x frameHeight`, and its tail keeps pointing at
// the anchor even when the box had to slide sideways.
//
// The full text is always rendered (hidden) so the box has its final size from
// the first character: it never grows while typing.
export function DialogueBubble({
  anchorX,
  anchorY,
  frameWidth,
  frameHeight,
  visibleText,
  fullText,
  isComplete,
}: {
  anchorX: number;
  anchorY: number;
  frameWidth: number;
  frameHeight: number;
  visibleText: string;
  fullText: string;
  isComplete: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;

    if (element) {
      setSize({ width: element.offsetWidth, height: element.offsetHeight });
    }
  }, [fullText, frameWidth]);

  const left = clamp(
    anchorX - size.width / 2,
    EDGE_MARGIN,
    Math.max(EDGE_MARGIN, frameWidth - size.width - EDGE_MARGIN),
  );
  const top = clamp(
    anchorY - GAP_PX - TAIL_SIZE - size.height,
    EDGE_MARGIN,
    Math.max(EDGE_MARGIN, frameHeight - size.height - EDGE_MARGIN),
  );
  const tailLeft = clamp(
    anchorX - left - TAIL_SIZE / 2,
    TAIL_EDGE_INSET,
    Math.max(TAIL_EDGE_INSET, size.width - TAIL_EDGE_INSET - TAIL_SIZE),
  );

  const style: CSSProperties = {
    left: Math.round(left),
    top: Math.round(top),
    visibility: size.width === 0 ? "hidden" : "visible",
    ["--ui-font" as string]: PIXEL_FONT_FAMILY,
    ["--tail-left" as string]: `${Math.round(tailLeft)}px`,
  };

  return (
    <div ref={ref} className={styles.bubble} style={style} data-dialogue-bubble>
      <div className={styles.paper}>
        <p className={styles.text}>
          <span>{visibleText}</span>
          <span className={styles.rest}>
            {fullText.slice(visibleText.length)}
          </span>
        </p>
        {isComplete ? (
          <span className={styles.more} aria-hidden="true" />
        ) : null}
      </div>
      <span className={styles.tail} aria-hidden="true" />
    </div>
  );
}
