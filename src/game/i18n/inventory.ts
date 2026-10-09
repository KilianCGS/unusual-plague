import type { Language } from "./types";

type InventoryCopy = {
  title: string;
  emptySlot: string;
};

export const inventoryCopy: Record<Language, InventoryCopy> = {
  es: { title: "INVENTARIO", emptySlot: "Hueco vacío" },
  en: { title: "INVENTORY", emptySlot: "Empty slot" },
};
