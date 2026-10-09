import type { CraftStation } from "../crafting/recipes";
import type { Language } from "./types";

type CraftingCopy = {
  title: Record<CraftStation, string>;
  inventoryHeading: string;
  combine: string;
  close: string;
  // Shown under COMBINE when the selection is not a recipe of this station.
  noRecipe: string;
  // Success modal: the heading, then the localized item name.
  created: string;
  closeModal: string;
};

export const craftingCopy: Record<Language, CraftingCopy> = {
  es: {
    title: { manual: "PREPARAR", fire: "COCINAR" },
    inventoryHeading: "INVENTARIO",
    combine: "COMBINAR",
    close: "Cerrar",
    noRecipe: "Estos ingredientes no parecen combinar bien aquí.",
    created: "Has creado",
    closeModal: "Cerrar",
  },
  en: {
    title: { manual: "PREPARE", fire: "COOK" },
    inventoryHeading: "INVENTORY",
    combine: "COMBINE",
    close: "Close",
    noRecipe: "These ingredients don't seem to combine well here.",
    created: "Created",
    closeModal: "Close",
  },
};
