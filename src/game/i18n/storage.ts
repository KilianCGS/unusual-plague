import type { Language } from "./types";

type StorageCopy = {
  storageTitle: string;
  inventoryTitle: string;
  close: string;
  emptySlot: string;
  // Shown when the destination has no room for a new item type.
  noRoomInInventory: string;
  noRoomInStorage: string;
};

export const storageCopy: Record<Language, StorageCopy> = {
  es: {
    storageTitle: "Almacén",
    inventoryTitle: "Inventario",
    close: "Cerrar",
    emptySlot: "Hueco vacío",
    noRoomInInventory: "No tengo espacio para llevar esto.",
    noRoomInStorage: "El almacén está lleno.",
  },
  en: {
    storageTitle: "Storage",
    inventoryTitle: "Inventory",
    close: "Close",
    emptySlot: "Empty slot",
    noRoomInInventory: "I don't have room to carry this.",
    noRoomInStorage: "The storage is full.",
  },
};
