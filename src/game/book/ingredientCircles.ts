import type { Language } from "../i18n/types";

// THE QUANTITY CIRCLES of the INGREDIENTES spreads (2026-11-27): every painted page has an empty hand-drawn circle by
// each ingredient; the book writes inside it how many units the Doctor has (his case + the chest of his room).
// Centres and radii in BOOK pixels (688 x 384), measured on the pictures (public/game/ui/book/ingredients/<lang>/), in
// the order of the spreads and, inside each, left page top, left page bottom, right page top, right page bottom.
// If a page is repainted, measure its circles again.
export type IngredientCircle = { itemId: string; x: number; y: number; r: number };

export const INGREDIENT_CIRCLES: Record<Language, IngredientCircle[][]> = {
  es: [
    [{ itemId: "milk", x: 279, y: 45, r: 19 }, { itemId: "medicinal-herb", x: 279, y: 211, r: 19 }, { itemId: "mushroom", x: 590, y: 45, r: 19 }, { itemId: "water", x: 590, y: 211, r: 19 }],
    [{ itemId: "alcohol", x: 267, y: 47, r: 17 }, { itemId: "flour", x: 267, y: 206, r: 17 }, { itemId: "coal", x: 585, y: 46, r: 18 }, { itemId: "cloth", x: 585, y: 206, r: 18 }],
    [{ itemId: "orange", x: 277, y: 43, r: 17 }, { itemId: "mint", x: 276, y: 206, r: 17 }, { itemId: "honey", x: 590, y: 43, r: 17 }, { itemId: "resin", x: 590, y: 206, r: 17 }],
    [{ itemId: "animal-fat", x: 276, y: 44, r: 16 }, { itemId: "garlic", x: 276, y: 209, r: 16 }, { itemId: "salt", x: 592, y: 44, r: 16 }, { itemId: "leech", x: 593, y: 209, r: 16 }],
    [{ itemId: "bone", x: 273, y: 46, r: 17 }, { itemId: "pine-mushroom", x: 273, y: 208, r: 17 }, { itemId: "sugar", x: 577, y: 46, r: 17 }, { itemId: "onion", x: 576, y: 208, r: 17 }],
  ],
  en: [
    [{ itemId: "milk", x: 277, y: 41, r: 16 }, { itemId: "medicinal-herb", x: 277, y: 202, r: 16 }, { itemId: "mushroom", x: 597, y: 41, r: 16 }, { itemId: "water", x: 590, y: 206, r: 16 }],
    [{ itemId: "alcohol", x: 275, y: 43, r: 16 }, { itemId: "flour", x: 275, y: 203, r: 16 }, { itemId: "coal", x: 597, y: 43, r: 16 }, { itemId: "cloth", x: 597, y: 203, r: 16 }],
    [{ itemId: "orange", x: 280, y: 45, r: 16 }, { itemId: "mint", x: 280, y: 199, r: 16 }, { itemId: "honey", x: 594, y: 42, r: 16 }, { itemId: "resin", x: 594, y: 199, r: 16 }],
    [{ itemId: "animal-fat", x: 276, y: 39, r: 16 }, { itemId: "garlic", x: 276, y: 209, r: 16 }, { itemId: "salt", x: 593, y: 39, r: 16 }, { itemId: "leech", x: 593, y: 205, r: 16 }],
    [{ itemId: "bone", x: 276, y: 38, r: 16 }, { itemId: "pine-mushroom", x: 276, y: 202, r: 16 }, { itemId: "sugar", x: 595, y: 38, r: 16 }, { itemId: "onion", x: 595, y: 207, r: 16 }],
  ],
};
