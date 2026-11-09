import type { CraftStation } from "../crafting/recipes";
import type { Language } from "./types";

// Texts of the Compendium that depend on the language. The Ingredientes pages
// are painted once per language (see bookPages.ts) and the Dolencias pages are
// written in Spanish and not translated here yet; the tabs, the cover and the
// PACIENTES / PREPARADOS pages are.
type BookCopy = {
  tabs: {
    patients: string;
    ailments: string;
    ingredients: string;
    preparations: string;
  };
  coverTitle: string;
  coverSubtitle: string;
  coverHint: string;
  openLabel: string;
  previousLabel: string;
  nextLabel: string;
  noPatients: { title: string; note: string };
  treatment: string;
  treated: string;
  noRecipes: { title: string; note: string };
  // One short description per INGREDIENTES spread (the image holds the text).
  ingredientSpreadAlts: [string, string, string, string];
  station: string;
  stations: Record<CraftStation, string>;
};

export const bookCopy: Record<Language, BookCopy> = {
  es: {
    tabs: {
      patients: "PACIENTES",
      ailments: "DOLENCIAS",
      ingredients: "INGREDIENTES",
      preparations: "PREPARADOS",
    },
    coverTitle: "COMPENDIO",
    coverSubtitle: "MÉDICO",
    coverHint: "Clic para abrir",
    openLabel: "Abrir el Compendio",
    previousLabel: "Página anterior",
    nextLabel: "Página siguiente",
    noPatients: { title: "Pacientes", note: "Todavía no hay pacientes." },
    treatment: "TRATAMIENTO",
    treated: "✓ TRATADO",
    noRecipes: {
      title: "Preparados",
      note: "Todavía no hay recetas conocidas.",
    },
    ingredientSpreadAlts: [
      "Ingredientes: leche, hierba medicinal, hongo y agua",
      "Ingredientes: alcohol, harina, carbón y tela",
      "Ingredientes: naranja, menta, miel y resina",
      "Ingredientes: grasa animal, ajo, sal y sanguijuela",
    ],
    station: "Estación",
    stations: { manual: "Mesa", fire: "Cocina", mortar: "Mortero" },
  },
  en: {
    tabs: {
      patients: "PATIENTS",
      ailments: "AILMENTS",
      ingredients: "INGREDIENTS",
      preparations: "REMEDIES",
    },
    coverTitle: "COMPENDIUM",
    coverSubtitle: "MEDICAL",
    coverHint: "Click to open",
    openLabel: "Open the Compendium",
    previousLabel: "Previous page",
    nextLabel: "Next page",
    noPatients: { title: "Patients", note: "There are no patients yet." },
    treatment: "TREATMENT",
    treated: "✓ TREATED",
    noRecipes: { title: "Remedies", note: "No known recipes yet." },
    ingredientSpreadAlts: [
      "Ingredients: milk, medicinal herb, mushroom and water",
      "Ingredients: alcohol, flour, charcoal and cloth",
      "Ingredients: orange, mint, honey and resin",
      "Ingredients: animal fat, garlic, salt and leech",
    ],
    station: "Station",
    stations: { manual: "Work table", fire: "Stove", mortar: "Mortar" },
  },
};

// Names of the ailments the PACIENTES pages mention.
export const ailmentNames: Record<string, Record<Language, string>> = {
  "stomach-ailment": { es: "Mal del estómago", en: "Stomach ailment" },
  "chest-cough": { es: "Tos del pecho", en: "Chest cough" },
  scurvy: { es: "Escorbuto", en: "Scurvy" },
  poisoning: { es: "Envenenamiento", en: "Poisoning" },
  "exhaustion": { es: "Agotamiento", en: "Exhaustion" },
  "infected-wound": { es: "Herida infectada", en: "Infected wound" },
  "suspected-poisoning": { es: "Posible envenenamiento", en: "Suspected poisoning" },
  "common-fever": { es: "Fiebre común", en: "Common fever" },
};
