import type { Language } from "../i18n/types";
import { getItemIcon, getItemName } from "../items/items";
import { ItemIcon } from "../items/ItemIcon";
import type { InventorySlot } from "./inventory";

// The VISUAL of one inventory slot, shared by every interface that shows the
// carried inventory (the HUD bar, the Storage and the
// Crafting interfaces). It only draws what a slot holds: the item's icon (from
// the item catalog), its quantity, or the item's localized name when it has no
// art. It owns no state and no layout:
// each interface keeps its own slot element (a list item, a button...) and its
// own CSS, and passes the class names of the parts it styles.
// A CSS module can be passed as it is: the parts read are `itemIcon`, `name`,
// `quantity` and `quantityOverIcon`.
export type InventorySlotClasses = { readonly [className: string]: string };

// "Medicinal herb x3", or the empty-slot label.
export function getInventorySlotLabel(
  slot: InventorySlot | null,
  language: Language,
  emptyLabel: string,
): string {
  return slot === null
    ? emptyLabel
    : `${getItemName(slot.itemId, language)} x${slot.quantity}`;
}

export function InventorySlotContents({
  slot,
  language,
  classes,
  showQuantityFromTwo = false,
}: {
  slot: InventorySlot | null;
  language: Language;
  classes: InventorySlotClasses;
  // true: the quantity is only drawn when there is more than one unit (the HUD
  // bar); false: always, like the overlays have always done.
  showQuantityFromTwo?: boolean;
}) {
  if (slot === null) {
    return null;
  }

  const hasIcon = getItemIcon(slot.itemId) !== undefined;

  return (
    <>
      {hasIcon ? (
        <ItemIcon itemId={slot.itemId} className={classes.itemIcon} />
      ) : (
        <span className={classes.name}>
          {getItemName(slot.itemId, language)}
        </span>
      )}
      {showQuantityFromTwo && slot.quantity <= 1 ? null : (
        <span
          className={`${classes.quantity}${hasIcon ? ` ${classes.quantityOverIcon}` : ""}`}
        >
          ×{slot.quantity}
        </span>
      )}
    </>
  );
}

// A non-interactive slot as a list item (the HUD bar). Interactive interfaces
// use InventorySlotContents inside their own button.
// With `tooltipClassName`, an occupied slot also draws its own small label
// ("Name ×quantity"), shown by the caller's CSS on :hover / :focus-visible, and
// becomes focusable so the label can be reached without a mouse. The browser's
// native title is then left out: it would show a second, duplicate tooltip.
export function InventorySlotView({
  slot,
  language,
  emptyLabel,
  className,
  classes,
  showQuantityFromTwo,
  tooltipClassName,
}: {
  slot: InventorySlot | null;
  language: Language;
  emptyLabel: string;
  className: string;
  classes: InventorySlotClasses;
  showQuantityFromTwo?: boolean;
  tooltipClassName?: string;
}) {
  const tooltip = tooltipClassName !== undefined && slot !== null;

  return (
    <li
      className={className}
      data-inventory-slot
      data-empty={slot === null}
      data-item-id={slot?.itemId}
      title={slot && !tooltip ? getItemName(slot.itemId, language) : undefined}
      tabIndex={tooltip ? 0 : undefined}
      aria-label={getInventorySlotLabel(slot, language, emptyLabel)}
    >
      <InventorySlotContents
        slot={slot}
        language={language}
        classes={classes}
        showQuantityFromTwo={showQuantityFromTwo}
      />
      {tooltip ? (
        <span className={tooltipClassName} aria-hidden="true" data-slot-tooltip>
          {getItemName(slot.itemId, language)} ×{slot.quantity}
        </span>
      ) : null}
    </li>
  );
}
