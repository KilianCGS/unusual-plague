import type { CSSProperties } from "react";

import type { TutorialHintCopy } from "../i18n/tutorial";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import styles from "./TutorialHint.module.css";

// A small contextual help box at the bottom of the screen. It never takes
// focus, blocks input or dims the world: it only shows the text it is given.
export function TutorialHint({ copy }: { copy: TutorialHintCopy }) {
  return (
    <div
      className={styles.hint}
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
        <p className={styles.body}>{copy.body}</p>
      </div>
    </div>
  );
}
