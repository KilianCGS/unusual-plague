import type { InteractionZone } from "../interactions/interactionZone";
import {
  addItem,
  countItem,
  createEmptyInventory,
  removeItem,
  type InventoryItemId,
  type InventoryState,
} from "../inventory/inventory";

// The Doctor's personal storage chest, in his room. It is just another
// InventoryState (same stack model, same operations), so it can be serialized
// next to the carried inventory later. Crafting never reads it: the Doctor has
// to take things out first.
export const STORAGE_CAPACITY = 24;

// What the chest's interaction zone reports to the owner of the game state.
export const STORAGE_INTERACTION_ID = "storage.doctor-room";

// WHERE the Doctor's Storage can be opened: the chest in the Doctor's Room, an
// interaction zone (never a collider) authored by hand in /dev/collisions. No
// requiredDirection: any facing. It is the ONLY access point; the id names the
// access point, not a second storage (there is one Doctor Storage state).
export const doctorRoomStorageInteractions: InteractionZone[] = [
  {
    id: "doctor-room-interaction-1",
    x: 228,
    y: 212,
    width: 9,
    height: 47,
    interactionId: STORAGE_INTERACTION_ID,
  },
];

export function createEmptyStorage(): InventoryState {
  return createEmptyInventory(STORAGE_CAPACITY);
}

export type StackTransfer = {
  source: InventoryState;
  destination: InventoryState;
};

// Moves the COMPLETE stack of an item from one inventory to another. All or
// nothing: returns null (and nothing changes) when the source does not hold the
// item or the destination has neither that stack nor a free slot. Pure.
export function transferStack(
  source: InventoryState,
  destination: InventoryState,
  itemId: InventoryItemId,
): StackTransfer | null {
  const quantity = countItem(source, itemId);

  if (quantity === 0) {
    return null;
  }

  const nextSource = removeItem(source, itemId, quantity);
  const nextDestination = addItem(destination, itemId, quantity);

  return nextSource && nextDestination
    ? { source: nextSource, destination: nextDestination }
    : null;
}
