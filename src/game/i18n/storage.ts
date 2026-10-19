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
    storageTitle: "ALMACÉN",
    inventoryTitle: "INVENTARIO",
    close: "Cerrar",
    emptySlot: "Hueco vacío",
    noRoomInInventory: "No tengo espacio para llevar esto.",
    noRoomInStorage: "El almacén está lleno.",
  },
  en: {
    storageTitle: "STORAGE",
    inventoryTitle: "INVENTORY",
    close: "Close",
    emptySlot: "Empty slot",
    noRoomInInventory: "I don't have room to carry this.",
    noRoomInStorage: "The storage is full.",
  },
};
