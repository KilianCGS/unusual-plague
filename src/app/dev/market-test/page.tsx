"use client";

import { useEffect, useState } from "react";

import { setMarketTestOverrides, type MarketTestValues } from "../../../game/dev/marketTestOverrides";
import type { Language } from "../../../game/i18n/types";
import { NEW_WORLD_VISUALS } from "../../../game/new-world-map/newWorldVisuals";
import { useIsClient } from "../../../game/ui/useIsClient";
import { createDay2DevStart } from "../../../game/world/devStart";
import { GameWorld } from "../../../game/world/GameWorld";
import styles from "./page.module.css";

// DEV-ONLY "mercado test" (2026-11-16, Kilian): the REAL game, started in the market street, with sliders for
// what decides how it looks on screen: the camera zoom (how much of the street fills the window), the Doctor's
// size, and the size of the inventory bar and the coins. Move them while you walk around; "Copiar valores"
// gives the numbers to paste into newWorldVisuals.ts (market-street: zoomMultiplier, protagonistScale,
// hudScale). Nothing is saved, and the normal game is not touched (it never sets these overrides).
const market = NEW_WORLD_VISUALS.find((visual) => visual.id === "market-street");
const INITIAL: MarketTestValues = {
  zoomMultiplier: market?.zoomMultiplier ?? 1,
  protagonistScale: market?.protagonistScale ?? 1,
  hudScale: market?.hudScale ?? 1,
};

const SLIDERS: { key: keyof MarketTestValues; label: string; min: number; max: number; step: number; hint: string }[] = [
  { key: "zoomMultiplier", label: "Zoom de cámara", min: 1, max: 2.2, step: 0.05, hint: "más = la calle y todos los personajes más grandes" },
  { key: "protagonistScale", label: "Tamaño del Doctor", min: 0.6, max: 1.6, step: 0.05, hint: "solo el Doctor, no el resto" },
  { key: "hudScale", label: "Inventario y monedas", min: 0.5, max: 1.5, step: 0.05, hint: "1 = el tamaño de siempre" },
];

export default function MarketTestPage() {
  const isClient = useIsClient();
  const [language, setLanguage] = useState<Language>("es");
  const [run, setRun] = useState(0);
  const [values, setValues] = useState<MarketTestValues>(INITIAL);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMarketTestOverrides(values);
  }, [values]);

  useEffect(() => () => setMarketTestOverrides(null), []);

  const text = [
    `zoomMultiplier: ${values.zoomMultiplier},`,
    `protagonistScale: ${values.protagonistScale},`,
    `hudScale: ${values.hudScale},`,
  ].join("\n");

  return (
    <>
      {isClient ? (
        <GameWorld
          key={`${run}-${language}`}
          language={language}
          devStart={{ ...createDay2DevStart(), scene: { sceneId: "market-street", spawnName: "from-apothecary-street" } }}
        />
      ) : null}
      <aside className={styles.panel}>
        <strong>/dev/market-test</strong>
        {SLIDERS.map((slider) => (
          <label key={slider.key} className={styles.row}>
            <span>
              {slider.label}: <b>{values[slider.key].toFixed(2)}</b>
            </span>
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={values[slider.key]}
              onChange={(event) => setValues((current) => ({ ...current, [slider.key]: Number(event.target.value) }))}
            />
            <small>{slider.hint}</small>
          </label>
        ))}
        <span className={styles.buttons}>
          {(["es", "en"] as Language[]).map((candidate) => (
            <button key={candidate} type="button" onClick={() => setLanguage(candidate)} disabled={candidate === language}>
              {candidate.toUpperCase()}
            </button>
          ))}
          <button type="button" onClick={() => setValues(INITIAL)}>
            Restablecer
          </button>
          <button type="button" onClick={() => setRun((current) => current + 1)}>
            Reiniciar
          </button>
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard?.writeText(text).then(() => setCopied(true));
              window.setTimeout(() => setCopied(false), 1500);
            }}
          >
            {copied ? "¡Copiado!" : "Copiar valores"}
          </button>
        </span>
        <pre className={styles.output}>{text}</pre>
      </aside>
    </>
  );
}
