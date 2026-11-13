import type { Language } from "./types";

type InventoryCopy = {
  title: string;
  emptySlot: string;
  show: string;
  hide: string;
};

export const inventoryCopy: Record<Language, InventoryCopy> = {
  es: { title: "Inventario", emptySlot: "Hueco vacío", show: "Mostrar inventario", hide: "Ocultar inventario" },
  en: { title: "Inventory", emptySlot: "Empty slot", show: "Show inventory", hide: "Hide inventory" },
};
