import { useEffect } from "react";
import type { CSSProperties } from "react";

import type { TutorialHintCopy } from "../i18n/tutorial";
import { useBindings } from "../controls/controlsStore";
import { MOVE_ACTIONS, keyLabel } from "../controls/keybindings";
import type { Language } from "../i18n/types";
import { KeyCap } from "../ui/KeyCap";
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
  language = "es",
}: {
  copy: TutorialHintCopy;
  // Over the inventory bar and the coins (they are on screen from the "bar" step).
  raised?: boolean;
  // Steps that wait for "understood": a button, and the Enter key.
  onContinue?: () => void;
  continueLabel?: string;
  language?: Language;
  // Drawn over the Book (its backdrop sits above the normal hint layer).
  aboveOverlays?: boolean;
}) {
  const bindings = useBindings();
  // "{interact}", "{book}" ... inside a text are the player's own keys.
  const withKeys = (text: string) =>
    text.replace(/\{(interact|book|run|map|objectives)\}/g, (_, action: keyof typeof bindings) =>
      keyLabel(bindings[action][0], language),
    );

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
          {copy.title.map((part, index) => {
            if (typeof part === "string") return <span key={index}>{part}</span>;
            if ("key" in part) return <KeyCap key={index} label={part.key} />;
            if ("action" in part) {
              return <KeyCap key={index} label={keyLabel(bindings[part.action][0], language)} />;
            }
            // the four movement keys of one slot (0 = main keys, 1 = alternatives)
            return (
              <span key={index}>
                {MOVE_ACTIONS.map((action) => (
                  <KeyCap key={action} label={keyLabel(bindings[action][part.move], language)} />
                ))}
              </span>
            );
          })}
        </p>
        {copy.body.split("\n").map((line, index) => (
          <p key={index} className={styles.body}>
            {withKeys(line)}
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
            {continueLabel} <KeyCap label="Enter" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
