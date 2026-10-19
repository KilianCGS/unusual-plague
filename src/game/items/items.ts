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
  | "milk"
  | "flour"
  | "orange"
  | "mint"
  | "resin"
  | "animal-fat"
  | "garlic"
  | "leech"
  | "milk-with-honey"
  | "mint-infusion"
  | "balsamic-syrup"
  | "ointment-base"
  | "poultice"
  | "medicinal-compress"
  | "crushed-coal"
  | "charcoal-suspension"
  | "citrus-drink"
  | "empty-flask";

export type ItemDefinition = {
  id: ItemId;
  name: Record<Language, string>;
  // What the Doctor says to himself when he needs this item and does not have
  // enough of it: a natural pointer to where it can be found. Only for items
  // that are gathered; prepared items do not need one.
  sourceHint?: Record<Language, string>;
  // The item's 48x48 inventory icon (a path under /public). THE ONE place an
  // item names its art: the inventory, the storage and the crafting interface
  // all read it from here. An item without one is drawn by its name only.
  icon?: string;
};

const RESOURCE_ICONS = "/game/items/inventory-icons";
const PREPARED_ICONS = "/game/items/prepared-icons";

export const ITEMS: Record<ItemId, ItemDefinition> = {
  "medicinal-herb": {
    id: "medicinal-herb",
    name: { es: "Hierba medicinal", en: "Medicinal herb" },
    icon: `${RESOURCE_ICONS}/medicinal-herb.png`,
    sourceHint: {
      es: "Hace tiempo que no recojo hierbas medicinales. Encontraré algunas en el bosque.",
      en: "It has been a while since I gathered medicinal herbs. I should find some in the forest.",
    },
  },
  cloth: {
    id: "cloth",
    name: { es: "Tela", en: "Cloth" },
    icon: `${RESOURCE_ICONS}/cloth.png`,
    sourceHint: {
      es: "Necesitaré tela limpia. Quizá el mercader tenga.",
      en: "I will need clean cloth. Perhaps the merchant has some.",
    },
  },
  alcohol: {
    id: "alcohol",
    name: { es: "Alcohol", en: "Alcohol" },
    icon: `${RESOURCE_ICONS}/alcohol.png`,
  },
  water: {
    id: "water",
    name: { es: "Agua", en: "Water" },
    icon: `${RESOURCE_ICONS}/water.png`,
    sourceHint: {
      es: "Debería recoger algo de agua del río.",
      en: "I should fetch some water from the river.",
    },
  },
  salt: {
    id: "salt",
    name: { es: "Sal", en: "Salt" },
    icon: `${RESOURCE_ICONS}/salt.png`,
  },
  mushroom: {
    id: "mushroom",
    name: { es: "Hongo", en: "Mushroom" },
    icon: `${RESOURCE_ICONS}/mushroom.png`,
  },
  honey: {
    id: "honey",
    name: { es: "Miel", en: "Honey" },
    icon: `${RESOURCE_ICONS}/honey.png`,
  },
  coal: {
    id: "coal",
    name: { es: "Carbón", en: "Coal" },
    icon: `${RESOURCE_ICONS}/coal.png`,
  },
  "medicinal-paste": {
    id: "medicinal-paste",
    name: { es: "Pasta medicinal", en: "Medicinal paste" },
  },
  "disinfected-bandage": {
    id: "disinfected-bandage",
    name: { es: "Vendaje desinfectado", en: "Disinfected bandage" },
    icon: `${PREPARED_ICONS}/disinfected-bandage.png`,
  },
  "mushroom-soup": {
    id: "mushroom-soup",
    name: { es: "Sopa de hongos", en: "Mushroom soup" },
    icon: `${PREPARED_ICONS}/mushroom-soup.png`,
  },
  "medicinal-ointment": {
    id: "medicinal-ointment",
    name: { es: "Ungüento medicinal", en: "Medicinal ointment" },
    icon: `${PREPARED_ICONS}/medicinal-ointment.png`,
  },
  "medicinal-infusion": {
    id: "medicinal-infusion",
    name: { es: "Infusión medicinal", en: "Medicinal infusion" },
    icon: `${PREPARED_ICONS}/medicinal-infusion.png`,
  },
  "cold-cloth": {
    id: "cold-cloth",
    name: { es: "Paño frío", en: "Cold compress" },
    icon: `${PREPARED_ICONS}/cold-cloth.png`,
  },
  // The Doctor's own flask: a normal physical item with no special logic yet.
  "empty-flask": {
    id: "empty-flask",
    name: { es: "Frasco vacío", en: "Empty flask" },
    icon: `${RESOURCE_ICONS}/empty-flask.png`,
  },
  // CATALOGUED, NOT IMPLEMENTED: these items have their final name and icon so
  // the catalog is complete, but no recipe makes or uses them, no patient asks
  // for them and nothing gives them to the Doctor yet. Gameplay comes later.
  milk: {
    id: "milk",
    name: { es: "Leche", en: "Milk" },
    icon: `${RESOURCE_ICONS}/milk.png`,
  },
  flour: {
    id: "flour",
    name: { es: "Harina", en: "Flour" },
    icon: `${RESOURCE_ICONS}/flour.png`,
  },
  orange: {
    id: "orange",
    name: { es: "Naranja", en: "Orange" },
    icon: `${RESOURCE_ICONS}/orange.png`,
  },
  mint: {
    id: "mint",
    name: { es: "Menta", en: "Mint" },
    icon: `${RESOURCE_ICONS}/mint.png`,
  },
  resin: {
    id: "resin",
    name: { es: "Resina", en: "Resin" },
    icon: `${RESOURCE_ICONS}/resin.png`,
  },
  "animal-fat": {
    id: "animal-fat",
    name: { es: "Grasa animal", en: "Animal fat" },
    icon: `${RESOURCE_ICONS}/animal-fat.png`,
  },
  garlic: {
    id: "garlic",
    name: { es: "Ajo", en: "Garlic" },
    icon: `${RESOURCE_ICONS}/garlic.png`,
  },
  leech: {
    id: "leech",
    name: { es: "Sanguijuela", en: "Leech" },
    icon: `${RESOURCE_ICONS}/leech.png`,
  },
  "milk-with-honey": {
    id: "milk-with-honey",
    name: { es: "Leche con miel", en: "Milk with honey" },
    icon: `${PREPARED_ICONS}/milk-with-honey.png`,
  },
  "mint-infusion": {
    id: "mint-infusion",
    name: { es: "Infusión de menta", en: "Mint infusion" },
    icon: `${PREPARED_ICONS}/mint-infusion.png`,
  },
  "balsamic-syrup": {
    id: "balsamic-syrup",
    name: { es: "Jarabe balsámico", en: "Balsamic syrup" },
    icon: `${PREPARED_ICONS}/balsamic-syrup.png`,
  },
  "ointment-base": {
    id: "ointment-base",
    name: { es: "Base de ungüento", en: "Ointment base" },
    icon: `${PREPARED_ICONS}/ointment-base.png`,
  },
  poultice: {
    id: "poultice",
    name: { es: "Cataplasma", en: "Poultice" },
    icon: `${PREPARED_ICONS}/poultice.png`,
  },
  "medicinal-compress": {
    id: "medicinal-compress",
    name: { es: "Compresa medicinal", en: "Medicinal compress" },
    icon: `${PREPARED_ICONS}/medicinal-compress.png`,
  },
  "crushed-coal": {
    id: "crushed-coal",
    name: { es: "Carbón triturado", en: "Crushed coal" },
    icon: `${PREPARED_ICONS}/crushed-coal.png`,
  },
  "charcoal-suspension": {
    id: "charcoal-suspension",
    name: { es: "Suspensión de carbón", en: "Charcoal suspension" },
    icon: `${PREPARED_ICONS}/charcoal-suspension.png`,
  },
  "citrus-drink": {
    id: "citrus-drink",
    name: { es: "Bebida cítrica", en: "Citrus drink" },
    icon: `${PREPARED_ICONS}/citrus-drink.png`,
  },
};

export function getItem(itemId: string): ItemDefinition | undefined {
  return (ITEMS as Record<string, ItemDefinition | undefined>)[itemId];
}

// The icon of an item, or undefined when it has none (or is not in the catalog).
export function getItemIcon(itemId: string): string | undefined {
  return getItem(itemId)?.icon;
}

// Localized name; an unknown id falls back to the id itself so a missing
// catalog entry is visible instead of blank.
export function getItemName(itemId: string, language: Language): string {
  return getItem(itemId)?.name[language] ?? itemId;
}
