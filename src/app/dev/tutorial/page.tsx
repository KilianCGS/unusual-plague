"use client";

import { useState } from "react";

import type { TutorialHintStep } from "../../../game/i18n/tutorial";
import { tutorialCopy } from "../../../game/i18n/tutorial";
import type { Language } from "../../../game/i18n/types";
import { TutorialHint } from "../../../game/tutorial/TutorialHint";
import styles from "./page.module.css";

const STEPS: TutorialHintStep[] = [
  "book",
  "book-page",
  "book-tab",
  "book-close",
  "map",
  "move",
  "chest-approach",
  "chest-interact",
  "take-flask",
];

// Tutorial preview: every hint of the real component, in both languages,
// without playing through the game. (The real flow lives in GameWorld.)
export default function TutorialPreviewPage() {
  const [language, setLanguage] = useState<Language>("es");
  const [step, setStep] = useState<TutorialHintStep>("book");

  return (
    <>
      <TutorialHint copy={tutorialCopy[language][step]} />
      <aside className={styles.panel}>
        <strong>/dev/tutorial</strong>
        <span>
          {STEPS.map((candidate) => (
            <button
              key={candidate}
              type="button"
              onClick={() => setStep(candidate)}
              disabled={candidate === step}
            >
              {candidate}
            </button>
          ))}
        </span>
        <span>
          <button type="button" onClick={() => setLanguage("es")}>
            ES
          </button>{" "}
          <button type="button" onClick={() => setLanguage("en")}>
            EN
          </button>
        </span>
      </aside>
    </>
  );
}
