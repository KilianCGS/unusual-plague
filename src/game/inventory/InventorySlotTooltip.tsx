import type { Language } from "../i18n/types";
import { getItemName } from "../items/items";
import type { InventorySlot } from "./inventory";
import styles from "./InventorySlotTooltip.module.css";

// The small "Name ×quantity" label of an occupied slot, for the HUD bar and
// the Crafting inventory. Put it as a direct child of the slot element (which
// must be `position: relative` and focusable to reach it by keyboard); the CSS
// shows it on hover / focus-visible. Hidden from assistive tech: the slot has
// its own aria-label.
export function InventorySlotTooltip({
  slot,
  language,
}: {
  slot: InventorySlot;
  language: Language;
}) {
  return (
    <span className={styles.tooltip} aria-hidden="true" data-slot-tooltip>
      {getItemName(slot.itemId, language)} ×{slot.quantity}
    </span>
  );
}
