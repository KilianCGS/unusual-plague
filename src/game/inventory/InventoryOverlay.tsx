import type { CSSProperties } from "react";

import { inventoryCopy } from "../i18n/inventory";
import type { Language } from "../i18n/types";
import { getItemName } from "../items/items";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import type { InventoryState } from "./inventory";
import styles from "./InventoryOverlay.module.css";

const COLUMNS = 4;

// The Doctor's carried items as a grid of slots. Screen-space and not
// interactive. Today every slot is empty, so only empty slots are drawn; an
// occupied slot will get its own look when items exist.
export function InventoryOverlay({
  inventory,
  language,
}: {
  inventory: InventoryState;
  language: Language;
}) {
  const copy = inventoryCopy[language];

  return (
    <div
      className={styles.backdrop}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      data-inventory-overlay
    >
      <div className={styles.border}>
        <div className={styles.paper}>
          <h2 className={styles.title}>{copy.title}</h2>
          <ul
            className={styles.grid}
            style={{ ["--columns" as string]: COLUMNS } as CSSProperties}
          >
            {inventory.slots.map((slot, index) => (
              <li
                key={index}
                className={styles.slot}
                data-inventory-slot
                data-empty={slot === null}
                data-item-id={slot?.itemId}
                aria-label={
                  slot === null
                    ? copy.emptySlot
                    : `${getItemName(slot.itemId, language)} x${slot.quantity}`
                }
              >
                {slot ? (
                  // No item art yet: the localized name and the quantity.
                  <>
                    <span className={styles.name}>
                      {getItemName(slot.itemId, language)}
                    </span>
                    <span className={styles.quantity}>×{slot.quantity}</span>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
