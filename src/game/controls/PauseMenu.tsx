"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { VolumeControl } from "../audio/VolumeControl";
import { controlsCopy } from "../i18n/controls";
import type { Language } from "../i18n/types";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import styles from "./PauseMenu.module.css";

// The pause menu (Esc while nothing else is open): resume, open the controls, or go back
// to the title screen (after a warning: nothing is saved yet). It owns no game rules; the
// game decides when it can open and blocks the Doctor while it is up.
export function PauseMenu({
  language,
  onResume,
  onControls,
  onQuit,
  onSave,
  controlsOpen,
}: {
  language: Language;
  onResume: () => void;
  onControls: () => void;
  onQuit?: () => void;
  // Saves the game now (the real game only); true when it was written.
  onSave?: () => boolean;
  // The controls screen is on top: this menu stops listening to Esc.
  controlsOpen: boolean;
}) {
  const copy = controlsCopy[language].pause;
  const [confirming, setConfirming] = useState(false);
  // What the last press of "Save game" did (shown under the buttons).
  const [saveResult, setSaveResult] = useState<"saved" | "failed" | null>(null);

  useEffect(() => {
    if (controlsOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.repeat) return;
      if (confirming) setConfirming(false);
      else onResume();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [controlsOpen, confirming, onResume]);

  return (
    <div
      className={styles.backdrop}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      data-pause-menu
      hidden={controlsOpen}
    >
      <section className={styles.frame} role="dialog" aria-modal="true" aria-label={copy.title}>
        <div className={styles.paper}>
          <h2 className={styles.title}>{copy.title}</h2>
          {confirming ? (
            <>
              <p className={styles.warning}>{copy.quitWarning}</p>
              <div className={styles.buttons}>
                <button type="button" className={styles.danger} data-pause-quit-confirm onClick={() => onQuit?.()}>
                  {copy.quitConfirm}
                </button>
                <button type="button" className={styles.button} onClick={() => setConfirming(false)}>
                  {copy.quitCancel}
                </button>
              </div>
            </>
          ) : (
            <>
            <VolumeControl language={language} />
            <div className={styles.buttons}>
              <button type="button" className={styles.button} data-pause-resume onClick={onResume}>
                {copy.resume}
              </button>
              {onSave ? (
                <button
                  type="button"
                  className={styles.button}
                  data-pause-save
                  onClick={() => setSaveResult(onSave() ? "saved" : "failed")}
                >
                  {copy.save}
                </button>
              ) : null}
              <button type="button" className={styles.button} data-pause-controls onClick={onControls}>
                {copy.controls}
              </button>
              {onQuit ? (
                <button type="button" className={styles.button} data-pause-quit onClick={() => setConfirming(true)}>
                  {copy.quit}
                </button>
              ) : null}
            </div>
            {saveResult ? (
              <p className={styles.warning} role="status" data-pause-save-result={saveResult}>
                {saveResult === "saved" ? copy.saved : copy.saveFailed}
              </p>
            ) : null}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
