"use client";

import { useState } from "react";

import type { TutorialHintStep } from "../../../game/i18n/tutorial";
import { tutorialContinueCopy, tutorialCopy } from "../../../game/i18n/tutorial";
import { ACK_STEPS, isTutorialHudUnlocked } from "../../../game/tutorial/tutorialFlow";
import type { Language } from "../../../game/i18n/types";
import { TutorialHint } from "../../../game/tutorial/TutorialHint";
import styles from "./page.module.css";

const STEPS: TutorialHintStep[] = [
  "goal",
  "book",
  "book-cover",
  "book-page",
  "book-preparations",
  "book-ailments",
  "book-patients",
  "book-close",
  "map",
  "move",
  "chest-approach",
  "chest-interact",
  "take-flask",
  "bar",
  "exit-room",
  "botica",
  "exit-botica",
  "run",
];

// Tutorial preview: every hint of the real component, in both languages,
// without playing through the game. (The real flow lives in GameWorld.)
export default function TutorialPreviewPage() {
  const [language, setLanguage] = useState<Language>("es");
  const [step, setStep] = useState<TutorialHintStep>("book");

  return (
    <>
      <TutorialHint
        copy={tutorialCopy[language][step]}
        onContinue={ACK_STEPS.includes(step) ? () => undefined : undefined}
        continueLabel={tutorialContinueCopy[language].label}
        language={language}
        raised={isTutorialHudUnlocked(step)}
      />
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
