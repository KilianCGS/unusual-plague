"use client";

import { useState } from "react";

import type { Language } from "../../../game/i18n/types";
import {
  addItem,
  createEmptyInventory,
  type InventoryState,
} from "../../../game/inventory/inventory";
import { InventoryOverlay } from "../../../game/inventory/InventoryOverlay";
import styles from "./page.module.css";

// Inventory preview: the real overlay over a plain background, in both
// languages, with a sample of six stacks (one with no icon yet) to check the
// icons and quantities. In the game it opens with I (Esc closes it).
const SAMPLE: [string, number][] = [
  ["water", 2],
  ["medicinal-herb", 1],
  ["cloth", 12],
  ["alcohol", 1],
  ["medicinal-infusion", 3],
  ["empty-flask", 1],
];

function createSampleInventory(): InventoryState {
  return SAMPLE.reduce(
    (state, [itemId, quantity]) => addItem(state, itemId, quantity) ?? state,
    createEmptyInventory(),
  );
}

export default function InventoryPreviewPage() {
  const [language, setLanguage] = useState<Language>("es");
  const [inventory] = useState(createSampleInventory);

  return (
    <>
      <InventoryOverlay inventory={inventory} language={language} />
      <aside className={styles.panel}>
        <strong>/dev/inventory</strong>
        <span>{inventory.capacity} slots · muestra / sample</span>
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
