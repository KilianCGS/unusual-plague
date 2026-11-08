import type { PatientCaseDefinition } from "./patientCases";

export const FARMER_DAY2_ID = "chapter2-farmer";
export const WOODCUTTER_DAY2_ID = "chapter2-woodcutter";
export const BLACKSMITH_DAY2_ID = "chapter2-blacksmith";

export const CHAPTER2_PATIENTS: Record<string, PatientCaseDefinition> = {
  [WOODCUTTER_DAY2_ID]: {
    id: WOODCUTTER_DAY2_ID,
    name: { es: "LEÑADOR DEL BOSQUE", en: "THE WOODCUTTER" },
    ailmentId: "exhaustion",
    discovered: { es: "El leñador descansa junto al hacha en el bosque.", en: "The woodcutter is resting beside his axe in the forest." },
    observation: { es: "Agotamiento tras trabajar sin pausas, sed y mareo. Necesita descansar y recuperar fuerzas.", en: "Exhaustion after working without breaks, thirst and dizziness. He needs rest and time to regain his strength." },
    requiredTreatments: [{ itemId: "citrus-drink", quantity: 1 }, { itemId: "mint-infusion", quantity: 1 }],
    revealsRecipeIds: ["fire.citrus-drink", "fire.mint-infusion"],
    examination: "in-place",
  },
  [BLACKSMITH_DAY2_ID]: {
    id: BLACKSMITH_DAY2_ID,
    name: { es: "HERRERO HERIDO", en: "THE INJURED BLACKSMITH" },
    ailmentId: "infected-wound",
    discovered: { es: "El herrero espera en el taller, sujetándose una mano.", en: "The blacksmith is waiting in his workshop, cradling one hand." },
    observation: { es: "Pequeña herida en la mano, inflamada y dolorosa. Ha seguido trabajando pese a las molestias.", en: "A small, swollen and painful wound on his hand. He has continued working despite the discomfort." },
    requiredTreatments: [{ itemId: "poultice", quantity: 1 }, { itemId: "medicinal-compress", quantity: 1 }],
    revealsRecipeIds: ["manual.poultice", "manual.medicinal-compress"],
    examination: "in-place",
  },
  [FARMER_DAY2_ID]: {
    id: FARMER_DAY2_ID,
    name: { es: "AGRICULTOR DEL MOLINO", en: "THE MILL FARMER" },
    ailmentId: "suspected-poisoning",
    discovered: {
      es: "El agricultor descansa en el granero. Una anciana lo acompaña.",
      en: "The farmer is resting in the granary. An elderly woman is keeping him company.",
    },
    observation: {
      es: "Debilidad, sudor frío y náuseas. Sospecha de envenenamiento; falta determinar su origen.",
      en: "Weakness, cold sweats and nausea. Suspected poisoning; its source remains unknown.",
    },
    investigation: {
      es: "Necesito una muestra de sangre antes de preparar un remedio. Buscar un medio de obtenerla.",
      en: "I need a blood sample before preparing a remedy. Find a way to obtain one.",
    },
    requiredTreatments: [],
    revealsRecipeIds: [],
    examination: "in-place",
  },
};
