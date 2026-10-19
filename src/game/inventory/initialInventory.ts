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

// The Doctor's Storage when Chapter 1 begins: his empty flask, ONCE. Together
// with the carried inventory there is exactly one Empty flask in the game.
export function createChapter1Storage(): InventoryState {
  return (
    addItem(createEmptyStorage(), "empty-flask", 1) ?? createEmptyStorage()
  );
}
