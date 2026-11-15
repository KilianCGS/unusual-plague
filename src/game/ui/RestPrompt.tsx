"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";

import styles from "../controls/PauseMenu.module.css";
import { dayEndCopy } from "../i18n/dayEnd";
import type { Language } from "../i18n/types";
import { PIXEL_FONT_FAMILY } from "./pixelFont";

// "Sleep now?" Asked when the Doctor comes home after the day's last case: the day only ends if
// the player says so; otherwise he keeps exploring (what he does not pick up stays where it is).
// Same wood frame and parchment as the pause menu. Esc means "keep exploring".
export function RestPrompt({
  language,
  onSleep,
  onKeepExploring,
}: {
  language: Language;
  onSleep: () => void;
  onKeepExploring: () => void;
}) {
  const copy = dayEndCopy[language].rest;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.repeat) return;
      event.stopImmediatePropagation();
      onKeepExploring();
    }
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [onKeepExploring]);

  return (
    <div
      className={styles.backdrop}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      data-rest-prompt
    >
      <section className={styles.frame} role="dialog" aria-modal="true" aria-label={copy.title}>
        <div className={styles.paper}>
          <h2 className={styles.title}>{copy.title}</h2>
          <p className={styles.warning}>{copy.question}</p>
          <div className={styles.buttons}>
            <button type="button" className={styles.button} data-rest-sleep onClick={onSleep}>
              {copy.sleep}
            </button>
            <button type="button" className={styles.button} data-rest-keep onClick={onKeepExploring}>
              {copy.keep}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
