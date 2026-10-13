import type { CraftStation } from "../crafting/recipes";
import type { Language } from "./types";

// Texts of the Compendium that depend on the language. The Dolencias and
// Ingredientes pages are painted / written in Spanish and are not translated
// here yet; the tabs, the cover and the PACIENTES / PREPARADOS pages are.
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
    station: "Estación",
    stations: { manual: "Mesa", fire: "Cocina" },
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
    station: "Station",
    stations: { manual: "Work table", fire: "Stove" },
  },
};

// Names of the ailments the PACIENTES pages mention.
export const ailmentNames: Record<string, Record<Language, string>> = {
  "common-fever": { es: "Fiebre común", en: "Common fever" },
};
