import { createEmptyStorage } from "../storage/storage";
import {
  addItem,
  createEmptyInventory,
  type InventoryState,
} from "./inventory";

// What the Doctor carries when Chapter 1 begins: nothing. His empty flask is
// waiting in his Storage chest (see createChapter1Storage); he takes it on his
// way out, as the opening monologue says.
export function createChapter1Inventory(): InventoryState {
  return createEmptyInventory();
}

// The Doctor's Storage when Chapter 1 begins: his TWO empty flasks (2026-11-16, Kilian: filling at the river
// gives 2 waters, so he carries 2 flasks, one for each). Together with the carried inventory there are
// exactly two Empty flasks in the game; taking them moves the whole stack.
export function createChapter1Storage(): InventoryState {
  return (
    addItem(createEmptyStorage(), "empty-flask", 3) ?? createEmptyStorage()
  );
}
