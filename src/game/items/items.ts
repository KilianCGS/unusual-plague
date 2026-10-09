import type { Language } from "../i18n/types";

// The catalog of everything the Doctor can carry. An item is just an id and a
// name: the inventory stores ids and quantities and does not care whether an
// item came from the world, from an NPC or from a recipe, nor whether it is a
// raw resource or a prepared remedy. Add an entry here to add an item; nothing
// else needs to change.
export type ItemId =
  | "medicinal-herb"
  | "cloth"
  | "alcohol"
  | "water"
  | "salt"
  | "mushroom"
  | "honey"
  | "coal"
  | "medicinal-paste"
  | "disinfected-bandage"
  | "mushroom-soup"
  | "medicinal-ointment";

export type ItemDefinition = {
  id: ItemId;
  name: Record<Language, string>;
};

export const ITEMS: Record<ItemId, ItemDefinition> = {
  "medicinal-herb": {
    id: "medicinal-herb",
    name: { es: "Hierba medicinal", en: "Medicinal herb" },
  },
  cloth: {
    id: "cloth",
    name: { es: "Tela", en: "Cloth" },
  },
  alcohol: {
    id: "alcohol",
    name: { es: "Alcohol", en: "Alcohol" },
  },
  water: {
    id: "water",
    name: { es: "Agua", en: "Water" },
  },
  salt: {
    id: "salt",
    name: { es: "Sal", en: "Salt" },
  },
  mushroom: {
    id: "mushroom",
    name: { es: "Hongo", en: "Mushroom" },
  },
  honey: {
    id: "honey",
    name: { es: "Miel", en: "Honey" },
  },
  coal: {
    id: "coal",
    name: { es: "Carbón", en: "Coal" },
  },
  "medicinal-paste": {
    id: "medicinal-paste",
    name: { es: "Pasta medicinal", en: "Medicinal paste" },
  },
  "disinfected-bandage": {
    id: "disinfected-bandage",
    name: { es: "Vendaje desinfectado", en: "Disinfected bandage" },
  },
  "mushroom-soup": {
    id: "mushroom-soup",
    name: { es: "Sopa de hongos", en: "Mushroom soup" },
  },
  "medicinal-ointment": {
    id: "medicinal-ointment",
    name: { es: "Ungüento medicinal", en: "Medicinal ointment" },
  },
};

export function getItem(itemId: string): ItemDefinition | undefined {
  return (ITEMS as Record<string, ItemDefinition | undefined>)[itemId];
}

// Localized name; an unknown id falls back to the id itself so a missing
// catalog entry is visible instead of blank.
export function getItemName(itemId: string, language: Language): string {
  return getItem(itemId)?.name[language] ?? itemId;
}
