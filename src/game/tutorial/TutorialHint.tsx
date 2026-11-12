import { useEffect } from "react";
import type { CSSProperties } from "react";

import type { TutorialHintCopy } from "../i18n/tutorial";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import styles from "./TutorialHint.module.css";

// A small contextual help box at the bottom of the screen. It never takes
// focus, blocks input or dims the world: it only shows the text it is given.
export function TutorialHint({
  copy,
  aboveOverlays = false,
  raised = false,
  onContinue,
  continueLabel,
}: {
  copy: TutorialHintCopy;
  // Over the inventory bar and the coins (they are on screen from the "bar" step).
  raised?: boolean;
  // Steps that wait for "understood": a button, and the Enter key.
  onContinue?: () => void;
  continueLabel?: string;
  // Drawn over the Book (its backdrop sits above the normal hint layer).
  aboveOverlays?: boolean;
}) {
  useEffect(() => {
    if (!onContinue) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.repeat) {
        event.preventDefault();
        onContinue();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onContinue]);

  return (
    <div
      className={`${styles.hint}${aboveOverlays ? ` ${styles.aboveOverlays}` : ""}${raised ? ` ${styles.raised}` : ""}`}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      data-tutorial-hint
      role="status"
    >
      <div className={styles.inner}>
        <p className={styles.title}>
          {copy.title.map((part, index) =>
            typeof part === "string" ? (
              <span key={index}>{part}</span>
            ) : (
              <kbd key={index} className={styles.key}>
                {part.key}
              </kbd>
            ),
          )}
        </p>
        {copy.body.split("\n").map((line, index) => (
          <p key={index} className={styles.body}>
            {line}
          </p>
        ))}
        {onContinue ? (
          <button
            type="button"
            className={styles.continue}
            data-tutorial-continue
            onClick={(event) => {
              // Space / Enter belong to the game: never keep focus.
              event.currentTarget.blur();
              onContinue();
            }}
          >
            {continueLabel} <kbd className={styles.key}>Enter</kbd>
          </button>
        ) : null}
      </div>
    </div>
  );
}
