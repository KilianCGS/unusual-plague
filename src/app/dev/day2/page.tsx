"use client";

import { useState } from "react";

import type { Language } from "../../../game/i18n/types";
import { useIsClient } from "../../../game/ui/useIsClient";
import { createDay2DevStart, createDay2ClosingDevStart } from "../../../game/world/devStart";
import { GameWorld } from "../../../game/world/GameWorld";
import styles from "./page.module.css";

// DEV-ONLY entry to Day 2: the real GameWorld, started in chapter-2 in the
// Doctor's Room with a finished Day 1 (see devStart.ts: every value there is
// TEST DATA, not a decision about the real chapter). The normal game is not
// touched: it never passes a start. "Restart" mounts a fresh game with a fresh
// copy of that state. Nothing is saved.
export default function Day2DevPage() {
  const isClient = useIsClient();
  const [language, setLanguage] = useState<Language>("es");
  const [run, setRun] = useState(0);
  const [closingPreview, setClosingPreview] = useState(false);
  const [streetEnd, setStreetEnd] = useState(false);

  return (
    <>
      {isClient && streetEnd ? (
        <GameWorld
          key={`street-${run}-${language}`}
          language={language}
          devStart={{ ...createDay2ClosingDevStart(), scene: { sceneId: "plaza", spawnName: "from-apothecary-street" } }}
        />
      ) : isClient && closingPreview ? (
        <GameWorld key={`closing-${run}-${language}`} language={language} devStart={createDay2ClosingDevStart()} />
      ) : isClient ? (
        <GameWorld
          key={`${run}-${language}`}
          language={language}
          devStart={createDay2DevStart()}
        />
      ) : null}
      <aside className={styles.panel}>
        <strong>/dev/day2</strong>
        <span>
          Capítulo 2 · Habitación del Doctor · Día 1 completado (datos de
          prueba)
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
            onClick={() => { setClosingPreview(false); setStreetEnd(false); setRun((current) => current + 1); }}
          >
            Reiniciar
          </button>
          <button type="button" onClick={() => { setClosingPreview(true); setStreetEnd(false); setRun(current => current + 1); }}>
            Probar cierre
          </button>
          <button type="button" onClick={() => { setStreetEnd(true); setRun(current => current + 1); }}>
            Fin de día (en la plaza)
          </button>
        </span>
      </aside>
    </>
  );
}
