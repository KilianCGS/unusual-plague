import { RECIPES } from "../crafting/recipes";
import { ailmentNames } from "../i18n/book";
import type { Language } from "../i18n/types";
import { getItemName, type ItemId } from "../items/items";
import { FARMER_ANALYSIS_ID, FARMER_SAMPLE_ID } from "../patients/farmerInvestigation";
import { getPatientDefinitions } from "../patients/patientRegistry";

// Book prose describes existing preparations; it never defines treatment rules.
export const PREPARATION_DESCRIPTIONS: Partial<Record<ItemId, Record<Language, string>>> = {
  "disinfected-bandage": {
    es: "Tela limpia tratada con alcohol para cubrir y proteger una herida.",
    en: "Clean cloth treated with alcohol to cover and protect a wound.",
  },
  "medicinal-paste": {
    es: "Hierbas machacadas y ligadas con miel. Base espesa para otros preparados.",
    en: "Crushed herbs bound with honey. A thick base for further preparations.",
  },
  "medicinal-ointment": {
    es: "Mezcla de hierba medicinal y carbón para aplicar sobre la zona afectada.",
    en: "A mixture of medicinal herb and charcoal applied to the affected area.",
  },
  "mushroom-soup": {
    es: "Caldo suave de hongos, agua y una pizca de sal.",
    en: "A light mushroom broth made with water and a pinch of salt.",
  },
  "milk-with-honey": {
    es: "Leche calentada con miel. Un alimento suave y reconfortante.",
    en: "Milk warmed with honey. Gentle, comforting nourishment.",
  },
  "medicinal-infusion": {
    es: "Hierba medicinal reposada en agua caliente. Se administra como bebida.",
    en: "Medicinal herb steeped in hot water, taken as a drink.",
  },
  "cold-cloth": {
    es: "Paño limpio humedecido con agua para refrescar la frente del enfermo.",
    en: "A clean cloth dampened with water to cool the patient's forehead.",
  },
  "mint-infusion": {
    es: "Hojas de menta infusionadas en agua. Bebida de aroma fresco.",
    en: "Mint leaves steeped in water. A fresh, aromatic drink.",
  },
  "balsamic-syrup": {
    es: "Infusión de menta cocida con miel y ajo hasta obtener un jarabe.",
    en: "Mint infusion cooked with honey and garlic to make a syrup.",
  },
  "ointment-base": {
    es: "Grasa animal ligada con resina. Base para preparar compresas medicinales.",
    en: "Animal fat combined with resin. A base for medicinal compresses.",
  },
  poultice: {
    es: "Pasta medicinal espesada con harina para su aplicación externa.",
    en: "Medicinal paste thickened with flour for external application.",
  },
  "medicinal-compress": {
    es: "Tela impregnada con base de ungüento para cubrir la zona dolorida.",
    en: "Cloth coated with ointment base to cover the painful area.",
  },
  "crushed-coal": {
    es: "Carbón reducido a polvo en la mesa de trabajo. Requiere otra preparación.",
    en: "Charcoal ground to powder at the work table. Requires further preparation.",
  },
  "charcoal-suspension": {
    es: "Carbón triturado mezclado con agua. Preparado de administración oral.",
    en: "Ground charcoal mixed with water. A preparation taken by mouth.",
  },
  "citrus-drink": {
    es: "Bebida de naranja y agua preparada al fuego.",
    en: "A drink made from orange and water over the stove.",
  },
};

// Read the completed investigation definition for the medical indication only.
// This changes no patient knowledge, flags, recipe discovery or gameplay state.
export function getPreparationUse(itemId: ItemId, language: Language): string {
  const definitions = getPatientDefinitions(new Set([FARMER_SAMPLE_ID, FARMER_ANALYSIS_ID]));
  const ailments = [...new Set(Object.values(definitions)
    .filter(patient => patient.requiredTreatments.some(treatment => treatment.itemId === itemId))
    .map(patient => patient.ailmentId))];
  if (ailments.length) {
    const names = ailments.map(id => ailmentNames[id]?.[language] ?? id).join(" · ");
    return `${language === "es" ? "Parte del tratamiento de" : "Part of the treatment for"}: ${names}.`;
  }
  const products = RECIPES.filter(recipe => recipe.inputs.some(input => input.itemId === itemId));
  if (products.length) {
    const names = products.map(recipe => getItemName(recipe.output.itemId, language)).join(", ");
    return language === "es"
      ? `Preparado intermedio para: ${names}. No se administra por sí solo.`
      : `Intermediate preparation for: ${names}. Not administered on its own.`;
  }
  return language === "es"
    ? "Su indicación aún no está registrada en el compendio."
    : "Its indication has not yet been recorded in the compendium.";
}
