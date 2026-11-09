import type { CraftStation } from "../crafting/recipes";
import type { Language } from "./types";

type CraftingCopy = {
  title: Record<CraftStation, string>;
  // The label of the ingredients counter ("INGREDIENTES 1/2").
  ingredients: string;
  inventoryHeading: string;
  // The button that tries the selection, per station.
  action: Record<CraftStation, string>;
  close: string;
  // Feedback line: the selection is not a recipe of this station.
  noRecipe: string;
  // Feedback line: a valid recipe whose result does not fit in the inventory.
  noSpace: string;
  // Feedback line: a valid recipe nobody needs right now (nothing is consumed).
  notNeeded: string;
  // Feedback line: the station has no free ingredient slot left.
  limitReached: string;
  // Feedback line: the ingredient is needed for something else (the craft would
  // leave a known case short).
  neededElsewhere: string;
  // The mortar on the work table: its hover label, the way back to the table.
  mortar: { label: string; back: string; ingredient: string };
  // Success modal: the heading, then the localized item name.
  created: string;
  closeModal: string;
};

export const craftingCopy: Record<Language, CraftingCopy> = {
  es: {
    title: { manual: "PREPARAR", fire: "COCINAR", mortar: "TRITURAR" },
    ingredients: "INGREDIENTES",
    inventoryHeading: "INVENTARIO DEL DOCTOR",
    action: { manual: "PREPARAR", fire: "COCINAR", mortar: "TRITURAR" },
    close: "Cerrar",
    noRecipe: "Estos ingredientes no parecen combinar bien aquí.",
    noSpace: "No tengo sitio para llevar esto.",
    notNeeded: "(Eso no lo necesito ahora.)",
    neededElsewhere: "(Eso me hace falta para otra cosa.)",
    mortar: { label: "Triturar", back: "← Mesa", ingredient: "INGREDIENTE" },
    limitReached: "Ya no caben más ingredientes.",
    created: "Has preparado",
    closeModal: "Cerrar",
  },
  en: {
    title: { manual: "PREPARE", fire: "COOK", mortar: "GRIND" },
    ingredients: "INGREDIENTS",
    inventoryHeading: "DOCTOR'S INVENTORY",
    action: { manual: "PREPARE", fire: "COOK", mortar: "GRIND" },
    close: "Close",
    noRecipe: "These ingredients don't seem to combine well here.",
    noSpace: "I don't have room to carry this.",
    notNeeded: "(I don't need that right now.)",
    neededElsewhere: "(I need that for something else.)",
    mortar: { label: "Grind", back: "← Table", ingredient: "INGREDIENT" },
    limitReached: "No more ingredients fit.",
    created: "Prepared",
    closeModal: "Close",
  },
};
