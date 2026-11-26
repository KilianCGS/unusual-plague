import type { Language } from "../i18n/types";

// THE CATEGORIES OF PREPARADOS (2026-11-27, Kilian): the known recipes are shown grouped, in this order, and every page
// says which group it belongs to. Every recipe of crafting/recipes.ts must have one (a test checks it).
export type PreparationCategory =
  | "bases"
  | "crushed"
  | "cloth"
  | "syrups"
  | "infusions"
  | "broths"
  | "complex";

export const PREPARATION_CATEGORY_ORDER: readonly PreparationCategory[] = [
  "bases",
  "crushed",
  "cloth",
  "syrups",
  "infusions",
  "broths",
  "complex",
];

export const PREPARATION_CATEGORY_NAMES: Record<PreparationCategory, Record<Language, string>> = {
  bases: { es: "Bases", en: "Bases" },
  crushed: { es: "Triturados y troceados", en: "Crushed and chopped" },
  cloth: { es: "Preparados con tela", en: "Cloth remedies" },
  syrups: { es: "Jarabes", en: "Syrups" },
  infusions: { es: "Infusiones", en: "Infusions" },
  broths: { es: "Caldos y bebidas", en: "Broths and drinks" },
  complex: { es: "Preparaciones complejas", en: "Complex preparations" },
};

// The category of each preparation (by the item it makes).
export const PREPARATION_CATEGORY: Readonly<Record<string, PreparationCategory>> = {
  syrup: "bases",
  "ointment-base": "bases",
  "medicinal-paste": "bases",
  "crushed-coal": "crushed",
  "crushed-herb": "crushed",
  "crushed-garlic": "crushed",
  "chopped-onion": "crushed",
  "chopped-mushroom": "crushed",
  "disinfected-bandage": "cloth",
  "cold-cloth": "cloth",
  "medicinal-compress": "cloth",
  "balsamic-syrup": "syrups",
  "onion-syrup": "syrups",
  "medicinal-infusion": "infusions",
  "mint-infusion": "infusions",
  "mushroom-soup": "broths",
  "milk-with-honey": "broths",
  "bone-broth": "broths",
  "strong-broth": "broths",
  "citrus-drink": "broths",
  "rehydration-drink": "broths",
  "medicinal-ointment": "complex",
  poultice: "complex",
  "charcoal-suspension": "complex",
};

// The position of a preparation in the book: its category first (an unknown one goes last), then nothing else changes.
export function preparationCategoryRank(itemId: string): number {
  const category = PREPARATION_CATEGORY[itemId];
  return category ? PREPARATION_CATEGORY_ORDER.indexOf(category) : PREPARATION_CATEGORY_ORDER.length;
}
