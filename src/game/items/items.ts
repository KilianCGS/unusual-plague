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
  | "medicinal-ointment"
  | "medicinal-infusion"
  | "cold-cloth"
  | "empty-flask";

export type ItemDefinition = {
  id: ItemId;
  name: Record<Language, string>;
  // What the Doctor says to himself when he needs this item and does not have
  // enough of it: a natural pointer to where it can be found. Only for items
  // that are gathered; prepared items do not need one.
  sourceHint?: Record<Language, string>;
};

export const ITEMS: Record<ItemId, ItemDefinition> = {
  "medicinal-herb": {
    id: "medicinal-herb",
    name: { es: "Hierba medicinal", en: "Medicinal herb" },
    sourceHint: {
      es: "Hace tiempo que no recojo hierbas medicinales. Encontraré algunas en el bosque.",
      en: "It has been a while since I gathered medicinal herbs. I should find some in the forest.",
    },
  },
  cloth: {
    id: "cloth",
    name: { es: "Tela", en: "Cloth" },
    sourceHint: {
      es: "Necesitaré tela limpia. Quizá el mercader tenga.",
      en: "I will need clean cloth. Perhaps the merchant has some.",
    },
  },
  alcohol: {
    id: "alcohol",
    name: { es: "Alcohol", en: "Alcohol" },
  },
  water: {
    id: "water",
    name: { es: "Agua", en: "Water" },
    sourceHint: {
      es: "Debería recoger algo de agua del río.",
      en: "I should fetch some water from the river.",
    },
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
  "medicinal-infusion": {
    id: "medicinal-infusion",
    name: { es: "Infusión medicinal", en: "Medicinal infusion" },
  },
  "cold-cloth": {
    id: "cold-cloth",
    name: { es: "Paño frío", en: "Cold compress" },
  },
  // The Doctor's own flask: a normal physical item with no special logic yet.
  "empty-flask": {
    id: "empty-flask",
    name: { es: "Frasco vacío", en: "Empty flask" },
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
