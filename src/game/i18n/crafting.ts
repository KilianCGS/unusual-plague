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
  // Feedback line: the station has no free ingredient slot left.
  limitReached: string;
  // Success modal: the heading, then the localized item name.
  created: string;
  closeModal: string;
};

export const craftingCopy: Record<Language, CraftingCopy> = {
  es: {
    title: { manual: "PREPARAR", fire: "COCINAR" },
    ingredients: "INGREDIENTES",
    inventoryHeading: "INVENTARIO DEL DOCTOR",
    action: { manual: "PREPARAR", fire: "COCINAR" },
    close: "Cerrar",
    noRecipe: "Estos ingredientes no parecen combinar bien aquí.",
    noSpace: "No tengo sitio para llevar esto.",
    limitReached: "Ya no caben más ingredientes.",
    created: "Has preparado",
    closeModal: "Cerrar",
  },
  en: {
    title: { manual: "PREPARE", fire: "COOK" },
    ingredients: "INGREDIENTS",
    inventoryHeading: "DOCTOR'S INVENTORY",
    action: { manual: "PREPARE", fire: "COOK" },
    close: "Close",
    noRecipe: "These ingredients don't seem to combine well here.",
    noSpace: "I don't have room to carry this.",
    limitReached: "No more ingredients fit.",
    created: "Prepared",
    closeModal: "Close",
  },
};
