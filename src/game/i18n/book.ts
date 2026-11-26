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
  ingredientSpreadAlts: string[];
  station: string;
  stations: Record<CraftStation, string>;
  // 2026-11-27: the index of PREPARADOS says what can be made, and the way back to the patient a recipe was opened from.
  indexLegend: string;
  backToPatient: string;
};

export const bookCopy: Record<Language, BookCopy> = {
  es: {
    tabs: {
      patients: "Pacientes",
      ailments: "Dolencias",
      ingredients: "Ingredientes",
      preparations: "Preparados",
    },
    coverTitle: "Compendio",
    coverSubtitle: "Médico",
    coverHint: "Clic para abrir",
    openLabel: "Abrir el Compendio",
    previousLabel: "Página anterior",
    nextLabel: "Página siguiente",
    noPatients: { title: "Pacientes", note: "Todavía no hay pacientes." },
    treatment: "Tratamiento",
    treated: "✓ TRATADO",
    noRecipes: {
      title: "Preparados",
      note: "Todavía no hay recetas conocidas.",
    },
    ingredientSpreadAlts: [
      "Ingredientes: leche, champiñón de cueva, hierba medicinal y agua",
      "Ingredientes: alcohol, carbón, harina y tela",
      "Ingredientes: naranja, miel, menta y resina",
      "Ingredientes: grasa animal, sal, ajo y sanguijuela",
      "Ingredientes: hueso, azúcar, seta de pino y cebolla",
    ],
    station: "Estación",
    stations: { manual: "Mesa", fire: "Cocina", mortar: "Mortero", chop: "Tabla" },
    indexLegend: "En verde, ingredientes disponibles. Saca del baúl los que necesites.",
    backToPatient: "← Paciente",
  },
  en: {
    tabs: {
      patients: "Patients",
      ailments: "Ailments",
      ingredients: "Ingredients",
      preparations: "Remedies",
    },
    coverTitle: "Compendium",
    coverSubtitle: "Medical",
    coverHint: "Click to open",
    openLabel: "Open the Compendium",
    previousLabel: "Previous page",
    nextLabel: "Next page",
    noPatients: { title: "Patients", note: "There are no patients yet." },
    treatment: "Treatment",
    treated: "✓ TREATED",
    noRecipes: { title: "Remedies", note: "No known recipes yet." },
    ingredientSpreadAlts: [
      "Ingredients: milk, mushroom, medicinal herb and water",
      "Ingredients: alcohol, charcoal, flour and cloth",
      "Ingredients: orange, honey, mint and resin",
      "Ingredients: animal fat, salt, garlic and leech",
      "Ingredients: bone, sugar, pine mushroom and onion",
    ],
    station: "Station",
    stations: { manual: "Work table", fire: "Stove", mortar: "Mortar", chop: "Board" },
    indexLegend: "Green means the ingredients are available. Move items from the chest into your bag to craft.",
    backToPatient: "← Patient",
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
  burn: { es: "Quemadura", en: "Burn" },
  fracture: { es: "Fractura", en: "Fracture" },
  insomnia: { es: "Insomnio", en: "Insomnia" },
};
