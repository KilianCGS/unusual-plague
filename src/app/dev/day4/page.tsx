"use client";

import { useState } from "react";

import type { Language } from "../../../game/i18n/types";
import { useIsClient } from "../../../game/ui/useIsClient";
import { createDay4DevStart } from "../../../game/world/devStart";
import { GameWorld } from "../../../game/world/GameWorld";
import styles from "./page.module.css";

// DEV-ONLY entry to Day 4 (night): the real GameWorld, started in chapter-4 in the
// Doctor's Room with finished Days 1, 2 and 3 (see devStart.ts: every value there is
// TEST DATA, not a decision about the real chapter). The normal game is not
// touched: it never passes a start. "Restart" mounts a fresh game with a fresh
// copy of that state. Nothing is saved.
export default function Day4DevPage() {
  const isClient = useIsClient();
  const [language, setLanguage] = useState<Language>("es");
  const [run, setRun] = useState(0);
  const [closingPreview, setClosingPreview] = useState(false);

  return (
    <>
      {isClient && closingPreview ? (
        <GameWorld key={`closing-${run}-${language}`} language={language} devStart={createDay4DevStart()} />
      ) : isClient ? (
        <GameWorld
          key={`${run}-${language}`}
          language={language}
          devStart={createDay4DevStart()}
        />
      ) : null}
      <aside className={styles.panel}>
        <strong>/dev/day4</strong>
        <span>
          Capítulo 4 (noche) · Habitación del Doctor · Días 1-3 completados
          (datos de prueba)
        </span>
        <span>
          {(["es", "en"] as Language[]).map((candidate) => (
            <button
              key={candidate}
              type="button"
              onClick={() => setLanguage(candidate)}
              disabled={candidate === language}
            >
              {candidate.toUpperCase()}
            </button>
          ))}
          <button
            type="button"
            onClick={() => { setClosingPreview(false); setRun((current) => current + 1); }}
          >
            Reiniciar
          </button>
        </span>
      </aside>
    </>
  );
}
