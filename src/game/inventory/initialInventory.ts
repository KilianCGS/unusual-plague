import {
  addItem,
  createEmptyInventory,
  type InventoryState,
} from "./inventory";

// What the Doctor carries when Chapter 1 begins: his own empty flask, in an
// ordinary slot of the 6. It has no special logic yet.
export function createChapter1Inventory(): InventoryState {
  return (
    addItem(createEmptyInventory(), "empty-flask", 1) ?? createEmptyInventory()
  );
}
