"use client";

import { useState } from "react";

import { CraftingOverlay } from "../../../game/crafting/CraftingOverlay";
import type { CraftStation } from "../../../game/crafting/recipes";
import type { Language } from "../../../game/i18n/types";
import {
  addItem,
  createEmptyInventory,
  type InventoryState,
} from "../../../game/inventory/inventory";
import styles from "./page.module.css";

// Crafting preview. The REAL crafting interface with a throwaway inventory: it
// never touches the game. Both stations (the work table = manual, the stove =
// fire) are also in the Apothecary of the real game; here the presets make
// the hard states easy to reach.
const PRESETS: Record<string, [string, number][]> = {
  // A bit of everything, to try recipes, wrong combinations and stacks.
  "test set": [
    ["cloth", 2],
    ["alcohol", 2],
    ["water", 1],
    ["salt", 1],
    ["mushroom", 1],
    ["honey", 1],
    ["medicinal-herb", 2],
    ["coal", 1],
  ],
  // Six item types, all in stacks: cloth + alcohol is a valid recipe whose
  // result (a new type) has no free slot even after the inputs are used.
  "full set": [
    ["cloth", 2],
    ["alcohol", 2],
    ["water", 3],
    ["salt", 1],
    ["honey", 1],
    ["coal", 1],
  ],
  // Exactly the chained recipe: herb + honey -> paste, paste + coal -> ointment.
  "chain set": [
    ["medicinal-herb", 1],
    ["honey", 1],
    ["coal", 1],
  ],
};

function buildInventory(preset: string): InventoryState {
  return PRESETS[preset].reduce<InventoryState>(
    (state, [itemId, quantity]) => addItem(state, itemId, quantity) ?? state,
    createEmptyInventory(),
  );
}

export default function CraftingPreviewPage() {
  const [language, setLanguage] = useState<Language>("es");
  const [station, setStation] = useState<CraftStation>("manual");
  const [open, setOpen] = useState(true);
  const [inventory, setInventory] = useState(() => buildInventory("test set"));

  return (
    <>
      {open ? (
        <CraftingOverlay
          key={station}
          station={station}
          inventory={inventory}
          language={language}
          onInventoryChange={setInventory}
          onClose={() => setOpen(false)}
        />
      ) : null}
      <aside className={styles.panel}>
        <strong>/dev/crafting</strong>
        <span>
          station:{" "}
          {(["manual", "fire"] as CraftStation[]).map((candidate) => (
            <button
              key={candidate}
              type="button"
              disabled={candidate === station}
              onClick={() => {
                setStation(candidate);
                setOpen(true);
              }}
            >
              {candidate}
            </button>
          ))}
        </span>
        <span>
          inventory:{" "}
          {Object.keys(PRESETS).map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setInventory(buildInventory(preset))}
            >
              {preset}
            </button>
          ))}
        </span>
        <span>
          <button type="button" onClick={() => setLanguage("es")}>
            ES
          </button>{" "}
          <button type="button" onClick={() => setLanguage("en")}>
            EN
          </button>{" "}
          <button type="button" onClick={() => setOpen(true)} disabled={open}>
            open
          </button>
        </span>
        <span>Esc: cerrar / Space: cerrar el aviso</span>
      </aside>
    </>
  );
}
