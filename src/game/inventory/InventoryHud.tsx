import type { CSSProperties } from "react";

import { inventoryCopy } from "../i18n/inventory";
import type { Language } from "../i18n/types";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import type { InventoryState } from "./inventory";
import { InventorySlotView } from "./InventorySlotView";
import styles from "./InventoryHud.module.css";

// The Doctor's carried items as a small bar at the bottom centre of the game
// frame. Purely presentational: it draws `inventory.slots` as they are (same
// state, same order, no copy) and never takes input. It is positioned
// absolutely, so mount it INSIDE the camera frame (the scene overlay layer):
// that is what keeps it centred on the playable area instead of the window.
// Hovering (or keyboard-focusing) an occupied slot shows its name and quantity
// in a small label, with CSS only; nothing is selectable or usable.
// WHEN it shows is decided by the owner (see inventoryHudVisibility.ts).
export function InventoryHud({
  inventory,
  language,
}: {
  inventory: InventoryState;
  language: Language;
}) {
  const copy = inventoryCopy[language];

  return (
    <div
      className={styles.dock}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      data-inventory-hud
    >
      <ul className={styles.bar} aria-label={copy.title}>
        {inventory.slots.map((slot, index) => (
          <InventorySlotView
            key={index}
            slot={slot}
            language={language}
            emptyLabel={copy.emptySlot}
            className={styles.slot}
            classes={styles}
            showQuantityFromTwo
            tooltip
          />
        ))}
      </ul>
    </div>
  );
}
