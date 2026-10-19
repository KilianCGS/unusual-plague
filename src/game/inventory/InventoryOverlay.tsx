import type { CSSProperties } from "react";

import { inventoryCopy } from "../i18n/inventory";
import type { Language } from "../i18n/types";
import { getItemIcon, getItemName } from "../items/items";
import { ItemIcon } from "../items/ItemIcon";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import type { InventoryState } from "./inventory";
import styles from "./InventoryOverlay.module.css";

const COLUMNS = 6;

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
                title={slot ? getItemName(slot.itemId, language) : undefined}
                aria-label={
                  slot === null
                    ? copy.emptySlot
                    : `${getItemName(slot.itemId, language)} x${slot.quantity}`
                }
              >
                {slot ? (
                  // The item's icon (from the item catalog) and the quantity;
                  // an item without art is drawn by its localized name.
                  <>
                    {getItemIcon(slot.itemId) ? (
                      <ItemIcon
                        itemId={slot.itemId}
                        className={styles.itemIcon}
                      />
                    ) : (
                      <span className={styles.name}>
                        {getItemName(slot.itemId, language)}
                      </span>
                    )}
                    <span
                      className={`${styles.quantity}${getItemIcon(slot.itemId) ? ` ${styles.quantityOverIcon}` : ""}`}
                    >
                      ×{slot.quantity}
                    </span>
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
