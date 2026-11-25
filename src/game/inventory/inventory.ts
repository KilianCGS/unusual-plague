// What the Doctor physically carries RIGHT NOW (not what he knows: that is the
// Book). A fixed number of slots; each slot is empty or holds ONE TYPE of item
// with a quantity (Medicinal herb x3 is one slot). The inventory only knows
// item ids and quantities: where an item came from, or what it is, does not
// matter. There is deliberately no stack limit yet.
//
// Every operation is pure: it returns a new state and never mutates the one it
// receives, so it is safe to use with React state.
// 2026-11-25 (Kilian): the carried inventory is the Doctor's open case: 15 places in 3 rows of 5, fixed (the Day 2
// backpack no longer adds a slot).
export const INVENTORY_CAPACITY = 15;
export const INVENTORY_COLUMNS = 5;

// An id from the item catalog (src/game/items). Kept as a string here so the
// inventory does not depend on the catalog.
export type InventoryItemId = string;

export type InventorySlot = {
  itemId: InventoryItemId;
  quantity: number;
};

export type InventoryState = {
  capacity: number;
  // Always exactly `capacity` entries; null = empty slot.
  slots: (InventorySlot | null)[];
};

export function createEmptyInventory(
  capacity: number = INVENTORY_CAPACITY,
): InventoryState {
  return { capacity, slots: Array.from({ length: capacity }, () => null) };
}

// The seamstress's backpack (Day 2): the same inventory with `extra` more empty
// slots at the end, so what is carried keeps its place.
export function growInventory(
  inventory: InventoryState,
  extra: number = 1,
): InventoryState {
  // A backpack only ever adds whole slots; anything else leaves the inventory as it is.
  if (!Number.isInteger(extra) || extra <= 0) {
    return inventory;
  }

  return {
    ...inventory,
    capacity: inventory.capacity + extra,
    slots: [...inventory.slots, ...Array.from({ length: extra }, () => null)],
  };
}

// Puts the content of slot `from` in slot `to`: into an empty slot it moves, into an occupied one the two swap
// places. Nothing is merged, split or lost (there is one slot per item type). Returns the same inventory when
// the move is not a move (same slot, or out of range).
export function moveSlot(
  inventory: InventoryState,
  from: number,
  to: number,
): InventoryState {
  const last = inventory.slots.length - 1;

  if (
    !Number.isInteger(from) ||
    !Number.isInteger(to) ||
    from === to ||
    from < 0 ||
    to < 0 ||
    from > last ||
    to > last
  ) {
    return inventory;
  }

  const slots = [...inventory.slots];
  [slots[from], slots[to]] = [slots[to], slots[from]];

  return { ...inventory, slots };
}

export function countOccupiedSlots(inventory: InventoryState): number {
  return inventory.slots.filter((slot) => slot !== null).length;
}

// Index of the slot that holds this item type, or -1.
export function findItemSlotIndex(
  inventory: InventoryState,
  itemId: InventoryItemId,
): number {
  return inventory.slots.findIndex((slot) => slot?.itemId === itemId);
}

// How many of an item the Doctor carries (0 when none).
export function countItem(
  inventory: InventoryState,
  itemId: InventoryItemId,
): number {
  return inventory.slots.find((slot) => slot?.itemId === itemId)?.quantity ?? 0;
}

// Returns the inventory with `quantity` fewer of the item, or null when there
// are not that many. A slot that reaches zero becomes empty again.
export function removeItem(
  inventory: InventoryState,
  itemId: InventoryItemId,
  quantity: number = 1,
): InventoryState | null {
  const index = findItemSlotIndex(inventory, itemId);
  const slot = index === -1 ? null : inventory.slots[index];

  if (!slot || !Number.isInteger(quantity) || quantity <= 0) {
    return null;
  }

  if (slot.quantity < quantity) {
    return null;
  }

  return {
    ...inventory,
    slots: inventory.slots.map((current, i) =>
      i !== index
        ? current
        : slot.quantity === quantity
          ? null
          : { itemId, quantity: slot.quantity - quantity },
    ),
  };
}

// An item can be added when its type already has a slot (the stack just grows)
// or when there is an empty slot for it. A full inventory still accepts the
// types it already holds.
export function canAddItem(
  inventory: InventoryState,
  itemId: InventoryItemId,
): boolean {
  return (
    findItemSlotIndex(inventory, itemId) !== -1 ||
    inventory.slots.some((slot) => slot === null)
  );
}

// Returns the inventory with `quantity` more of the item, or null when it does
// not fit (check with canAddItem). A new type takes the first empty slot.
export function addItem(
  inventory: InventoryState,
  itemId: InventoryItemId,
  quantity: number = 1,
): InventoryState | null {
  if (!Number.isInteger(quantity) || quantity <= 0) {
    return null;
  }

  const existing = findItemSlotIndex(inventory, itemId);
  const target =
    existing !== -1 ? existing : inventory.slots.findIndex((s) => s === null);

  if (target === -1) {
    return null;
  }

  const current = inventory.slots[target];

  return {
    ...inventory,
    slots: inventory.slots.map((slot, index) =>
      index === target
        ? { itemId, quantity: (current?.quantity ?? 0) + quantity }
        : slot,
    ),
  };
}

// The invariants every inventory must keep: as many slots as its capacity,
// every occupied slot holding a positive whole quantity, and no item type in
// two slots. Occupied slots can therefore never exceed the capacity.
export function isValidInventory(inventory: InventoryState): boolean {
  const ids = inventory.slots.flatMap((slot) => (slot ? [slot.itemId] : []));

  return (
    inventory.slots.length === inventory.capacity &&
    new Set(ids).size === ids.length &&
    inventory.slots.every(
      (slot) =>
        slot === null ||
        (slot.itemId !== "" &&
          Number.isInteger(slot.quantity) &&
          slot.quantity > 0),
    )
  );
}
