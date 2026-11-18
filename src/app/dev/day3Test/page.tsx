"use client";

import { useMemo, useState } from "react";

import { getChapterInteractions, getComposition } from "../../../game/compositions";
import { getDecorAsset } from "../../../game/decor/decorAssets";
import type { Language } from "../../../game/i18n/types";
import { addItem } from "../../../game/inventory/inventory";
import { useIsClient } from "../../../game/ui/useIsClient";
import { createDay3DevStart, type GameDevStart } from "../../../game/world/devStart";
import { GameWorld } from "../../../game/world/GameWorld";
import { WORLD_SCENES, type SceneId } from "../../../game/world/worldScenes";
import styles from "./page.module.css";

// /dev/day3Test (2026-11-18): a test bench for DAY 3. The real GameWorld in chapter 3 with Days 1 and 2 finished
// (the same TEST DATA as /dev/day3, see devStart.ts), plus:
//   * a list of the places of Day 3 with WHO TALKS in each one: a button takes the Doctor to that place's first
//     arrival (no walking), so every person Kilian placed can be tried quickly;
//   * the purse (20 / 60 coins) and the chest (empty, or with the raw ingredients of the three cases);
//   * ES / EN and a fresh restart.
// Nothing here is a decision about the real chapter and nothing is saved.
const CHAPTER = "chapter-3";

// The places of Day 3, in a walking order (the Botica first).
const PLACES: { sceneId: SceneId; label: string }[] = [
  { sceneId: "apothecary-street", label: "Calle de la botica" },
  { sceneId: "market-street", label: "Mercado (puestos fijos)" },
  { sceneId: "plaza", label: "Plaza (rezos, ancianos, mercader)" },
  { sceneId: "bakery-street", label: "Calle panadería (mujer del plumero)" },
  { sceneId: "bakery-interior", label: "Panadería (saco de harina)" },
  { sceneId: "tavern-street", label: "Calle taberna" },
  { sceneId: "tavern-interior", label: "Taberna (alcohol)" },
  { sceneId: "outskirts", label: "Río" },
  { sceneId: "farm", label: "Granja" },
  { sceneId: "mill-farmland", label: "Molino (apicultor: miel)" },
  { sceneId: "forest", label: "Bosque (leñador)" },
  { sceneId: "forest-glade", label: "Claro (bruja y cuervos)" },
  { sceneId: "smithy-street", label: "Calle herrería (niña, carpintero)" },
  { sceneId: "smithy-interior", label: "Herrería (herrero sano)" },
  { sceneId: "mountain-path", label: "Camino de la mina (guardia, niños)" },
  { sceneId: "quarry", label: "Cantera (minero y picapedrero)" },
  { sceneId: "granary-interior", label: "Granero (sin el agricultor)" },
];

// What the three cases need from the world (raw ingredients), for the "stocked chest" option.
const CASE_INGREDIENTS: [string, number][] = [
  ["mint", 1], ["sugar", 2], ["honey", 2], ["garlic", 1], ["orange", 1], ["bone", 1], ["salt", 1],
  ["cloth", 1], ["alcohol", 1], ["medicinal-herb", 1], ["flour", 1],
];

function spawnOf(sceneId: SceneId): string | undefined {
  return Object.keys(WORLD_SCENES[sceneId]?.arrivals ?? {})[0];
}

// Who can be talked to in a place on Day 3 (asset label + the interaction it opens).
function peopleIn(sceneId: SceneId): string[] {
  const interactions = getChapterInteractions(CHAPTER);
  const list: string[] = [];
  for (const instance of getComposition(sceneId, CHAPTER)?.instances ?? []) {
    const interaction = interactions[instance.instanceId];
    if (!interaction) continue;
    list.push(`${getDecorAsset(instance.assetId)?.label ?? instance.assetId}`);
  }
  return list;
}

export default function Day3TestPage() {
  const isClient = useIsClient();
  const [language, setLanguage] = useState<Language>("es");
  const [run, setRun] = useState(0);
  const [place, setPlace] = useState<SceneId | null>(null);
  const [coins, setCoins] = useState(20);
  const [stockedChest, setStockedChest] = useState(false);

  const places = useMemo(() => PLACES.filter(({ sceneId }) => WORLD_SCENES[sceneId] && spawnOf(sceneId)), []);
  const peopleByPlace = useMemo(() => Object.fromEntries(places.map(({ sceneId }) => [sceneId, peopleIn(sceneId)])), [places]);

  const devStart = useMemo<GameDevStart>(() => {
    const start = createDay3DevStart();
    let storage = start.storage;
    if (stockedChest) {
      for (const [itemId, quantity] of CASE_INGREDIENTS) storage = addItem(storage, itemId, quantity) ?? storage;
    }
    const spawnName = place ? spawnOf(place) : undefined;
    // `run` is read so a restart builds a fresh copy of the state
    void run;
    return {
      ...start,
      coins,
      storage,
      ...(place && spawnName ? { scene: { sceneId: place, spawnName } } : null),
    };
  }, [place, coins, stockedChest, run]);

  return (
    <>
      {isClient ? (
        <GameWorld key={`${run}-${language}-${place ?? "start"}-${coins}-${stockedChest}`} language={language} devStart={devStart} />
      ) : null}
      <aside className={styles.panel}>
        <strong>/dev/day3Test</strong>
        <span>Capítulo 3 · Días 1 y 2 completados (datos de prueba)</span>
        <span>
          {(["es", "en"] as Language[]).map((candidate) => (
            <button key={candidate} type="button" onClick={() => setLanguage(candidate)} disabled={candidate === language}>
              {candidate.toUpperCase()}
            </button>
          ))}
          <button type="button" onClick={() => { setPlace(null); setRun((current) => current + 1); }}>
            Reiniciar (Habitación)
          </button>
        </span>
        <span>
          Monedas:
          {[20, 60].map((amount) => (
            <button key={amount} type="button" onClick={() => setCoins(amount)} disabled={coins === amount}>
              {amount}
            </button>
          ))}
          Cofre:
          <button type="button" onClick={() => setStockedChest(false)} disabled={!stockedChest}>vacío</button>
          <button type="button" onClick={() => setStockedChest(true)} disabled={stockedChest}>con ingredientes</button>
        </span>
        <strong>Ir a… (empieza ahí; cambiar de sitio reinicia el día)</strong>
        {places.map(({ sceneId, label }) => (
          <div key={sceneId} className={styles.place}>
            <button type="button" className={styles.placeButton} onClick={() => setPlace(sceneId)} disabled={place === sceneId}>
              {label}
            </button>
            {peopleByPlace[sceneId]?.length ? <span className={styles.people}>{peopleByPlace[sceneId].join(" · ")}</span> : null}
          </div>
        ))}
      </aside>
    </>
  );
}
