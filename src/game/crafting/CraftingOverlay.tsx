"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { craftingCopy } from "../i18n/crafting";
import type { Language } from "../i18n/types";
import type { InventoryState } from "../inventory/inventory";
import { getItemName } from "../items/items";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import {
  canAttemptCombine,
  combine,
  createEmptySelection,
  deselectSlot,
  selectItem,
  type CraftSelection,
} from "./crafting";
import type { CraftStation } from "./recipes";
import styles from "./CraftingOverlay.module.css";

const INVENTORY_COLUMNS = 4;

// The crafting interface of one station: the slots of the station on top, the
// real inventory below. Click an inventory item to put ONE unit in the next
// free slot, click a filled slot to take it out. Choosing consumes nothing;
// only COMBINE does, and only when it matches a recipe of this station. All
// the rules live in crafting.ts; this component only draws and forwards clicks.
// Mount it with key={station} so a different station starts with a clean
// selection (closing the overlay always does).
export function CraftingOverlay({
  station,
  inventory,
  language,
  onInventoryChange,
  onClose,
}: {
  station: CraftStation;
  inventory: InventoryState;
  language: Language;
  onInventoryChange: (inventory: InventoryState) => void;
  onClose: () => void;
}) {
  const copy = craftingCopy[language];
  const [selection, setSelection] = useState<CraftSelection>(() =>
    createEmptySelection(station),
  );
  const [failed, setFailed] = useState(false);
  const [createdItemId, setCreatedItemId] = useState<string | null>(null);
  const modalOpen = createdItemId !== null;

  // Esc: closes the success modal first, otherwise the station. Space closes
  // the modal. (Q, I and TAB are blocked by the owner while this is open.)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();

        if (modalOpen) {
          setCreatedItemId(null);
        } else {
          onClose();
        }
      } else if (event.code === "Space" && modalOpen) {
        event.preventDefault();
        setCreatedItemId(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen, onClose]);

  function handleInventoryClick(itemId: string) {
    setFailed(false);
    setSelection((current) => selectItem(inventory, current, itemId));
  }

  function handleSlotClick(slotIndex: number) {
    setFailed(false);
    setSelection((current) => deselectSlot(current, slotIndex));
  }

  function handleCombine() {
    const result = combine(inventory, station, selection);

    if (result.kind === "success") {
      onInventoryChange(result.inventory);
      setSelection(createEmptySelection(station));
      setFailed(false);
      setCreatedItemId(result.recipe.output.itemId);
    } else {
      // Nothing is consumed and the selection stays so it can be corrected.
      setFailed(true);
    }
  }

  return (
    <div
      className={styles.backdrop}
      style={{ ["--ui-font" as string]: PIXEL_FONT_FAMILY } as CSSProperties}
      data-crafting-overlay
      data-crafting-station={station}
    >
      <div className={styles.border}>
        <div
          className={`${styles.paper}${modalOpen ? ` ${styles.inert}` : ""}`}
        >
          <button
            type="button"
            className={styles.close}
            aria-label={copy.close}
            onClick={onClose}
          >
            ×
          </button>
          <h2 className={styles.title}>{copy.title[station]}</h2>

          <div className={styles.selection} data-crafting-selection>
            {selection.map((selected, index) => (
              <div key={index} className={styles.selectionCell}>
                {index > 0 ? <span className={styles.plus}>+</span> : null}
                <button
                  type="button"
                  className={styles.cell}
                  data-selection-slot
                  data-item-id={selected ?? undefined}
                  disabled={selected === null}
                  onClick={() => handleSlotClick(index)}
                >
                  {selected ? getItemName(selected, language) : ""}
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className={styles.combine}
            data-crafting-combine
            disabled={!canAttemptCombine(selection)}
            onClick={handleCombine}
          >
            {copy.combine}
          </button>
          <p className={styles.message} data-crafting-message>
            {failed ? copy.noRecipe : " "}
          </p>

          <hr className={styles.divider} />
          <h3 className={styles.heading}>{copy.inventoryHeading}</h3>
          <div
            className={styles.grid}
            style={
              { ["--columns" as string]: INVENTORY_COLUMNS } as CSSProperties
            }
          >
            {inventory.slots.map((slot, index) => (
              <button
                key={index}
                type="button"
                className={styles.slot}
                data-inventory-slot
                data-item-id={slot?.itemId}
                disabled={slot === null}
                onClick={() => slot && handleInventoryClick(slot.itemId)}
              >
                {slot ? (
                  <>
                    <span className={styles.name}>
                      {getItemName(slot.itemId, language)}
                    </span>
                    <span className={styles.quantity}>×{slot.quantity}</span>
                  </>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>

      {createdItemId ? (
        <div className={styles.modalBackdrop} data-crafting-success>
          <div className={styles.modalBorder}>
            <div className={styles.modal}>
              <button
                type="button"
                className={styles.close}
                aria-label={copy.closeModal}
                onClick={() => setCreatedItemId(null)}
              >
                ×
              </button>
              <p className={styles.createdHeading}>{copy.created}</p>
              <p className={styles.createdName}>
                {getItemName(createdItemId, language)}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
