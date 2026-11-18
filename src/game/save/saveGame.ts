import type { InventoryState } from "../inventory/inventory";
import type { PatientCasesState } from "../patients/patientCases";
import type { GameDevStart } from "../world/devStart";

// SAVING (2026-11-18, Kilian chose "autosave at dawn + copy/paste a game"). The game state is plain data, so a
// save is the same shape a development start already takes (GameDevStart): loading one is starting the game
// "as if" the day had begun with that state, in the Doctor's room, the tutorial over.
//
// A save is written when each new day BEGINS (Day 2, 3 and 4), never in the middle of a scene or a conversation,
// so resuming never has to rebuild a half-played moment. It lives in localStorage (this browser only); "copy"
// turns it into a text the player can paste into another browser. Nothing here touches the game rules.
export const SAVE_KEY = "unusual-plague.save.v1";
const SAVE_VERSION = 1;
const TEXT_PREFIX = "UP1:";

export type SaveGame = {
  version: number;
  chapterId: string;
  patients: PatientCasesState;
  claimedRewards: string[];
  knownRecipeIds: string[];
  inventory: InventoryState;
  storage: InventoryState;
  collected: string[];
  coins: number;
  savedAt: number;
};

export function createSave(state: {
  chapterId: string;
  patients: PatientCasesState;
  claimedRewards: ReadonlySet<string>;
  knownRecipeIds: ReadonlySet<string>;
  inventory: InventoryState;
  storage: InventoryState;
  collected: ReadonlySet<string>;
  coins: number;
}): SaveGame {
  return {
    version: SAVE_VERSION,
    chapterId: state.chapterId,
    patients: state.patients,
    claimedRewards: [...state.claimedRewards],
    knownRecipeIds: [...state.knownRecipeIds],
    inventory: state.inventory,
    storage: state.storage,
    collected: [...state.collected],
    coins: state.coins,
    savedAt: Date.now(),
  };
}

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

function isInventory(value: unknown): value is InventoryState {
  if (typeof value !== "object" || value === null) return false;
  const { capacity, slots } = value as InventoryState;
  return (
    Number.isInteger(capacity) &&
    capacity > 0 &&
    capacity <= 64 &&
    Array.isArray(slots) &&
    slots.length === capacity &&
    slots.every(
      (slot) =>
        slot === null ||
        (typeof slot === "object" &&
          typeof slot.itemId === "string" &&
          Number.isInteger(slot.quantity) &&
          slot.quantity > 0),
    )
  );
}

// Anything that is not a well-formed save of THIS version is refused (null): a broken or foreign text can
// never start a half-built game.
export function validateSave(value: unknown): SaveGame | null {
  if (typeof value !== "object" || value === null) return null;
  const save = value as SaveGame;
  const days = ["chapter-2", "chapter-3", "chapter-4"];
  if (save.version !== SAVE_VERSION || !days.includes(save.chapterId)) return null;
  if (typeof save.patients !== "object" || save.patients === null || Array.isArray(save.patients)) return null;
  if (!Object.values(save.patients).every((status) => typeof status === "string")) return null;
  if (!isStringArray(save.claimedRewards) || !isStringArray(save.knownRecipeIds) || !isStringArray(save.collected)) return null;
  if (!isInventory(save.inventory) || !isInventory(save.storage)) return null;
  if (!Number.isInteger(save.coins) || save.coins < 0) return null;
  return save;
}

export function toDevStart(save: SaveGame): GameDevStart {
  return {
    chapterId: save.chapterId,
    patients: save.patients,
    claimedRewards: new Set(save.claimedRewards),
    knownRecipeIds: new Set(save.knownRecipeIds),
    inventory: save.inventory,
    storage: save.storage,
    collected: new Set(save.collected),
    tutorialStep: "done",
    coins: save.coins,
  };
}

// ---- the text a player copies and pastes ------------------------------------------------------------------------
export function saveToText(save: SaveGame): string {
  const bytes = new TextEncoder().encode(JSON.stringify(save));
  let binary = "";
  bytes.forEach((byte) => (binary += String.fromCharCode(byte)));
  return TEXT_PREFIX + btoa(binary);
}

export function saveFromText(text: string): SaveGame | null {
  try {
    const trimmed = text.trim();
    if (!trimmed.startsWith(TEXT_PREFIX)) return null;
    const binary = atob(trimmed.slice(TEXT_PREFIX.length));
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return validateSave(JSON.parse(new TextDecoder().decode(bytes)));
  } catch {
    return null;
  }
}

// ---- the browser's storage (every access guarded: it can be blocked or full) -------------------------------------
export function writeSave(save: SaveGame): boolean {
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    return true;
  } catch {
    return false;
  }
}

export function readSave(): SaveGame | null {
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    return raw ? validateSave(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

export function clearSave(): void {
  try {
    window.localStorage.removeItem(SAVE_KEY);
  } catch {
    /* nothing to clear */
  }
}
