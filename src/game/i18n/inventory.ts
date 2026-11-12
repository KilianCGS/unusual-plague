import type { Language } from "./types";

type InventoryCopy = {
  title: string;
  emptySlot: string;
  show: string;
  hide: string;
};

export const inventoryCopy: Record<Language, InventoryCopy> = {
  es: { title: "INVENTARIO", emptySlot: "Hueco vacío", show: "Mostrar inventario", hide: "Ocultar inventario" },
  en: { title: "INVENTORY", emptySlot: "Empty slot", show: "Show inventory", hide: "Hide inventory" },
};
