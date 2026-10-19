"use client";

import { useEffect } from "react";
import type { CSSProperties } from "react";

import { storageCopy } from "../i18n/storage";
import type { Language } from "../i18n/types";
import type { InventoryState } from "../inventory/inventory";
import { getItemIcon, getItemName } from "../items/items";
import { ItemIcon } from "../items/ItemIcon";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import styles from "./StorageOverlay.module.css";

export type StorageSide = "storage" | "inventory";

// Two panels: the Apothecary storage and the Doctor's carried inventory. Click
// an item to move its whole stack to the other side. The rules live in
// storage.ts; this component only draws and forwards clicks. Esc or the close
// button closes it (the owner blocks the other interfaces while it is open).
export function StorageOverlay({
  storage,
  inventory,
  language,
  onTransfer,
  onClose,
}: {
  storage: InventoryState;
  inventory: InventoryState;
  language: Language;
  onTransfer: (from: StorageSide, itemId: string) => void;
  onClose: () => void;
}) {
  const copy = storageCopy[language];

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !event.repeat) {
        event.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const panel = (
    side: StorageSide,
    title: string,
    state: InventoryState,
    columns: number,
  ) => (
    <section className={styles.panel} data-storage-panel={side}>
      <h2 className={styles.title}>{title}</h2>
      <div
        className={styles.grid}
        style={{ ["--columns" as string]: columns } as CSSProperties}
      >
        {state.slots.map((slot, index) => (
          <button
            key={index}
            type="button"
            className={styles.slot}
            data-storage-slot
            data-item-id={slot?.itemId}
            disabled={slot === null}
            title={slot ? getItemName(slot.itemId, language) : undefined}
            aria-label={
              slot === null
                ? copy.emptySlot
                : `${getItemName(slot.itemId, language)} x${slot.quantity}`
            }
            onClick={() => slot && onTransfer(side, slot.itemId)}
          >
            {slot ? (
              <>
                {getItemIcon(slot.itemId) ? (
                  <ItemIcon itemId={slot.itemId} className={styles.itemIcon} />
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
          </button>
        ))}
      </div>
    </section>
  );

  return (
    <div
      className={styles.backdrop}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      data-storage-overlay
    >
      <div className={styles.border}>
        <div className={styles.paper}>
          <button
            type="button"
            className={styles.close}
            aria-label={copy.close}
            onClick={onClose}
          >
            ×
          </button>
          {panel("storage", copy.storageTitle, storage, 6)}
          {panel("inventory", copy.inventoryTitle, inventory, 6)}
        </div>
      </div>
    </div>
  );
}
