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
    es: "Mezcla de hierba machacada y carbón triturado para aplicar sobre la zona afectada.",
    en: "A mixture of crushed herb and ground charcoal applied to the affected area.",
  },
  "mushroom-soup": {
    es: "Caldo suave de champiñones, agua y una pizca de sal.",
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
  syrup: {
    es: "Agua y azúcar cocidas hasta espesar. Base de otros jarabes.",
    en: "Water and sugar cooked until thick. The base of other syrups.",
  },
  "balsamic-syrup": {
    es: "Jarabe base cocido con miel y ajo machacado para calmar la tos.",
    en: "Base syrup cooked with honey and crushed garlic to soothe a cough.",
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
    es: "Carbón reducido a polvo en el mortero. Requiere otra preparación.",
    en: "Charcoal ground to powder in the mortar. Requires further preparation.",
  },
  "crushed-herb": {
    es: "Hierba medicinal machacada en el mortero. Base para la pasta y el ungüento.",
    en: "Medicinal herb ground in the mortar. The base for the paste and the ointment.",
  },
  // The four below are NEW text (2026-11-14), awaiting Kilian's review.
  "chopped-onion": {
    es: "Cebolla cortada en trozos pequeños sobre la tabla. Lista para cocinar.",
    en: "Onion cut into small pieces on the board. Ready for cooking.",
  },
  "chopped-mushroom": {
    es: "Champiñones cortados en láminas y trozos. Lista para el caldo.",
    en: "Mushrooms cut into slices and pieces. Ready for the broth.",
  },
  "crushed-garlic": {
    es: "Ajo machacado en el mortero hasta quedar casi en polvo. Base del jarabe.",
    en: "Garlic ground in the mortar until almost a powder. The base of the syrup.",
  },
  "charcoal-suspension": {
    es: "Carbón triturado mezclado con agua. Preparado de administración oral.",
    en: "Ground charcoal mixed with water. A preparation taken by mouth.",
  },
  "citrus-drink": {
    es: "Bebida de naranja y agua preparada al fuego.",
    en: "A drink made from orange and water over the stove.",
  },
  // The six below are NEW text (2026-11-11), awaiting Kilian's review.
  "bone-broth": {
    es: "Hueso hervido despacio con agua y sal. Un caldo que repone.",
    en: "Bone simmered slowly with water and salt. A restoring broth.",
  },
  "onion-syrup": {
    es: "Cebolla y azúcar cocidas hasta formar un jarabe espeso para la tos.",
    en: "Onion and sugar cooked into a thick syrup for a cough.",
  },
  "rehydration-drink": {
    es: "Agua con azúcar y sal. Devuelve las fuerzas a quien está agotado.",
    en: "Water with sugar and salt. Restores the strength of the exhausted.",
  },
  "strong-broth": {
    es: "Cebolla, hueso y agua cocidos largo rato. Un caldo oscuro y fuerte.",
    en: "Onion, bone and water cooked for a long time. A dark, strong broth.",
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
