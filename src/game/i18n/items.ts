import type { Language } from "./types";

type ItemFeedbackCopy = {
  // "Obtained: " followed by the item name.
  obtained: string;
  // Shown when a pickup does not fit.
  inventoryFull: string;
};

// Item names live with the item catalog (src/game/items); these are the
// sentences around them.
export const itemFeedbackCopy: Record<Language, ItemFeedbackCopy> = {
  es: {
    obtained: "Has obtenido: ",
    inventoryFull: "No tengo espacio para llevar esto.",
  },
  en: {
    obtained: "Obtained: ",
    inventoryFull: "I don't have room to carry this.",
  },
};

// "Obtained: Medicinal herb x1": the notice for something that entered the
// carried inventory, with how many units.
export function formatObtainedNotice(
  language: Language,
  itemName: string,
  quantity: number,
): string {
  return `${itemFeedbackCopy[language].obtained}${itemName} ×${quantity}`;
}

// Short notices of the river (a gathering point, not a conversation).
export const gatherCopy: Record<
  Language,
  { noContainer: string; enough: string }
> = {
  es: {
    noContainer: "Necesito un recipiente para recoger agua.",
    enough: "Ya llevo suficiente agua.",
  },
  en: {
    noContainer: "I need a container to collect water.",
    enough: "I already have enough water.",
  },
};
