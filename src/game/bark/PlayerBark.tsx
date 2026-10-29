import type { CSSProperties } from "react";

import { DialogueBubble } from "../dialogue/DialogueBubble";
import styles from "./PlayerBark.module.css";

// A remark of the Doctor that does NOT stop the game: the Doctor's own speech
// bubble, hung from his head, that goes away by itself (a CSS animation of
// BARK_SECONDS; `onDone` runs when it ends). It is not a conversation: no
// state, no input, nothing waits for it, and it never takes the pointer. It
// is drawn in the scene overlay layer, so it follows the Doctor. Its owner
// removes it at once when plain play stops (see useRunBark).
export const BARK_SECONDS = 3;

export function PlayerBark({
  text,
  anchorX,
  anchorY,
  frameWidth,
  frameHeight,
  onDone,
}: {
  text: string;
  anchorX: number;
  anchorY: number;
  frameWidth: number;
  frameHeight: number;
  onDone: () => void;
}) {
  return (
    <div
      className={styles.bark}
      style={
        { ["--bark-seconds" as string]: `${BARK_SECONDS}s` } as CSSProperties
      }
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) {
          onDone();
        }
      }}
      data-player-bark
    >
      <DialogueBubble
        anchorX={anchorX}
        anchorY={anchorY}
        frameWidth={frameWidth}
        frameHeight={frameHeight}
        visibleText={text}
        fullText={text}
        isComplete={false}
        isDoctor
      />
    </div>
  );
}
