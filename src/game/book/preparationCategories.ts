import type { Language } from "../i18n/types";

// THE GROUPS OF PREPARADOS (2026-11-27, Kilian): each remedy belongs to the group of the ingredient that rules it. The
// known remedies are shown in this order, every page says its group, and the first page of the section is an index of
// the groups. Every recipe of crafting/recipes.ts must have one (a test checks it).
export type PreparationCategory = "herbs" | "liquids" | "naturals" | "others";

export const PREPARATION_CATEGORY_ORDER: readonly PreparationCategory[] = ["herbs", "liquids", "naturals", "others"];

export const PREPARATION_CATEGORY_NAMES: Record<PreparationCategory, Record<Language, string>> = {
  herbs: { es: "Hierbas y vegetales", en: "Herbs and vegetables" },
  liquids: { es: "Líquidos", en: "Liquids" },
  naturals: { es: "Especias y naturales", en: "Spices and naturals" },
  others: { es: "Otros", en: "Others" },
};

// The group of each remedy (by the item it makes).
export const PREPARATION_CATEGORY: Readonly<Record<string, PreparationCategory>> = {
  "crushed-herb": "herbs",
  "medicinal-infusion": "herbs",
  "mint-infusion": "herbs",
  "medicinal-paste": "herbs",
  "chopped-onion": "herbs",
  "chopped-mushroom": "herbs",
  "mushroom-soup": "herbs",
  "crushed-garlic": "herbs",
  "citrus-drink": "herbs",
  syrup: "liquids",
  "balsamic-syrup": "liquids",
  "onion-syrup": "liquids",
  "rehydration-drink": "liquids",
  "milk-with-honey": "liquids",
  "bone-broth": "liquids",
  "strong-broth": "liquids",
  "charcoal-suspension": "liquids",
  "ointment-base": "naturals",
  "medicinal-ointment": "naturals",
  poultice: "naturals",
  "disinfected-bandage": "others",
  "cold-cloth": "others",
  "medicinal-compress": "others",
  "crushed-coal": "others",
};

// The position of a remedy in the book: its group first (an unknown one goes last).
export function preparationCategoryRank(itemId: string): number {
  const category = PREPARATION_CATEGORY[itemId];
  return category ? PREPARATION_CATEGORY_ORDER.indexOf(category) : PREPARATION_CATEGORY_ORDER.length;
}
