"use client";

import { useState } from "react";

import type { Language } from "../../../game/i18n/types";
import { createEmptyInventory } from "../../../game/inventory/inventory";
import { InventoryOverlay } from "../../../game/inventory/InventoryOverlay";
import styles from "./page.module.css";

// Inventory preview: the real overlay over a plain background, in both
// languages. In the game it opens with I (Esc closes it).
export default function InventoryPreviewPage() {
  const [language, setLanguage] = useState<Language>("es");
  const [inventory] = useState(createEmptyInventory);

  return (
    <>
      <InventoryOverlay inventory={inventory} language={language} />
      <aside className={styles.panel}>
        <strong>/dev/inventory</strong>
        <span>{inventory.capacity} slots · todos vacíos / all empty</span>
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
