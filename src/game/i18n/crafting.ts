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
    title: { manual: "Preparar", fire: "Cocinar", mortar: "Triturar" },
    ingredients: "Ingredientes",
    inventoryHeading: "Inventario del Doctor",
    action: { manual: "Preparar", fire: "Cocinar", mortar: "Triturar" },
    close: "Cerrar",
    noRecipe: "Estos ingredientes no parecen combinar bien aquí.",
    noSpace: "No tengo sitio para llevar esto.",
    notNeeded: "(Eso no lo necesito ahora.)",
    neededElsewhere: "(Eso me hace falta para otra cosa.)",
    mortar: { label: "Triturar", back: "← Mesa", ingredient: "Ingrediente" },
    limitReached: "Ya no caben más ingredientes.",
    created: "Has preparado",
    closeModal: "Cerrar",
  },
  en: {
    title: { manual: "Prepare", fire: "Cook", mortar: "Grind" },
    ingredients: "Ingredients",
    inventoryHeading: "Doctor's inventory",
    action: { manual: "Prepare", fire: "Cook", mortar: "Grind" },
    close: "Close",
    noRecipe: "These ingredients don't seem to combine well here.",
    noSpace: "I don't have room to carry this.",
    notNeeded: "(I don't need that right now.)",
    neededElsewhere: "(I need that for something else.)",
    mortar: { label: "Grind", back: "← Table", ingredient: "Ingredient" },
    limitReached: "No more ingredients fit.",
    created: "Prepared",
    closeModal: "Close",
  },
};
