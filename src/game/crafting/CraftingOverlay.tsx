"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

import { craftingCopy } from "../i18n/crafting";
import type { Language } from "../i18n/types";
import type { InventoryState } from "../inventory/inventory";
import { getItemIcon, getItemName } from "../items/items";
import { ItemIcon } from "../items/ItemIcon";
import { InventorySlotContents } from "../inventory/InventorySlotView";
import { InventorySlotTooltip } from "../inventory/InventorySlotTooltip";
import { PIXEL_FONT_FAMILY } from "../ui/pixelFont";
import {
  availableUnits,
  canAttemptCombine,
  combine,
  createEmptySelection,
  deselectSlot,
  selectItem,
  type CraftSelection,
} from "./crafting";
import type { CraftStation } from "./recipes";
import styles from "./CraftingOverlay.module.css";

// What the feedback line says (null = nothing). It clears as soon as the
// selection changes, so it never needs a timer.
type Message = "no-recipe" | "no-space" | "limit" | null;

type Created = { itemId: string; quantity: number };

// The crafting interface of one station, top to bottom: its name and the
// ingredients counter, the ingredient slots of the station, the button, the
// feedback line and the Doctor's inventory. Click an inventory item to put ONE
// unit in the next free slot, click a filled slot to take it out. Choosing
// consumes nothing (the inventory shows what is still FREE to select, derived
// from the real stock and the selection); only the button does, and only when
// it matches a recipe of this station. All the rules live in crafting.ts; this
// component only draws and forwards clicks. It does not check which recipes
// the Doctor knows (see combine). Mount it with key={station} so a different
// station starts with a clean selection (closing the overlay always does).
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
  const [message, setMessage] = useState<Message>(null);
  const [created, setCreated] = useState<Created | null>(null);
  const modalOpen = created !== null;
  const selectedCount = selection.filter(
    (selected) => selected !== null,
  ).length;

  // Esc: closes the success modal first, otherwise the station. Space closes
  // the modal. (Q and TAB are blocked by the owner while this is open.)
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.repeat) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();

        if (modalOpen) {
          setCreated(null);
        } else {
          onClose();
        }
      } else if (event.code === "Space" && modalOpen) {
        event.preventDefault();
        setCreated(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen, onClose]);

  function handleInventoryClick(itemId: string) {
    if (!selection.includes(null)) {
      // every ingredient slot of the station is taken
      setMessage("limit");
      return;
    }

    // an item with no free unit left does nothing (its slot looks spent)
    if (availableUnits(inventory, selection, itemId) > 0) {
      setMessage(null);
      setSelection(selectItem(inventory, selection, itemId));
    }
  }

  function handleSlotClick(slotIndex: number) {
    setMessage(null);
    setSelection((current) => deselectSlot(current, slotIndex));
  }

  function handleCombine() {
    const result = combine(inventory, station, selection);

    if (result.kind === "success") {
      onInventoryChange(result.inventory);
      setSelection(createEmptySelection(station));
      setMessage(null);
      setCreated({
        itemId: result.recipe.output.itemId,
        quantity: result.recipe.output.quantity,
      });
    } else {
      // Nothing is consumed and the selection stays so it can be corrected.
      setMessage(result.kind);
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
          <p className={styles.counter} data-crafting-counter>
            {copy.ingredients} {selectedCount}/{selection.length}
          </p>

          <div className={styles.selection} data-crafting-selection>
            {selection.map((selected, index) => (
              <div key={index} className={styles.selectionCell}>
                {index > 0 ? <span className={styles.plus}>+</span> : null}
                <button
                  type="button"
                  className={styles.cell}
                  data-selection-slot
                  data-item-id={selected ?? undefined}
                  aria-label={
                    selected ? getItemName(selected, language) : undefined
                  }
                  disabled={selected === null}
                  onClick={() => handleSlotClick(index)}
                >
                  {selected ? (
                    getItemIcon(selected) ? (
                      <ItemIcon itemId={selected} className={styles.cellIcon} />
                    ) : (
                      <span className={styles.cellName}>
                        {getItemName(selected, language)}
                      </span>
                    )
                  ) : null}
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className={styles.action}
            data-crafting-combine
            disabled={!canAttemptCombine(selection)}
            onClick={handleCombine}
          >
            {copy.action[station]}
          </button>
          <p
            className={styles.message}
            role="status"
            data-crafting-message={message ?? undefined}
          >
            {message === "no-recipe"
              ? copy.noRecipe
              : message === "no-space"
                ? copy.noSpace
                : message === "limit"
                  ? copy.limitReached
                  : " "}
          </p>

          <hr className={styles.divider} />
          <h3 className={styles.heading}>{copy.inventoryHeading}</h3>
          <div className={styles.inventory}>
            {inventory.slots.map((slot, index) => {
              // What is still free to select: the real stock minus the units
              // already in the ingredient slots. The inventory is untouched.
              const free = slot
                ? {
                    itemId: slot.itemId,
                    quantity: availableUnits(inventory, selection, slot.itemId),
                  }
                : null;
              const spent = free !== null && free.quantity === 0;

              return (
                <button
                  key={index}
                  type="button"
                  className={styles.slot}
                  data-inventory-slot
                  data-item-id={slot?.itemId}
                  data-spent={spent}
                  disabled={free === null}
                  aria-disabled={spent || undefined}
                  aria-label={
                    free
                      ? `${getItemName(free.itemId, language)} x${free.quantity}`
                      : undefined
                  }
                  onClick={() => slot && handleInventoryClick(slot.itemId)}
                >
                  <InventorySlotContents
                    slot={free}
                    language={language}
                    classes={styles}
                  />
                  {free ? (
                    <InventorySlotTooltip slot={free} language={language} />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {created ? (
        <div className={styles.modalBackdrop} data-crafting-success>
          <div className={styles.modalBorder}>
            <div className={styles.modal}>
              <button
                type="button"
                className={styles.close}
                aria-label={copy.closeModal}
                onClick={() => setCreated(null)}
              >
                ×
              </button>
              <p className={styles.createdHeading}>{copy.created}</p>
              <ItemIcon
                itemId={created.itemId}
                className={styles.createdIcon}
              />
              <p className={styles.createdName}>
                {getItemName(created.itemId, language)} ×{created.quantity}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
