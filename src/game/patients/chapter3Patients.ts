import type { PatientCaseDefinition } from "./patientCases";

// DAY 3 (2026-11-12): three patients, one per new ailment of the day. The people are
// the woman dusting in the Botica street (a NEW sprite: the sweeper of Day 1 comes back on
// Day 4 with her broom dropped), the miner of the mountain path and a stonecutter of the quarry; the cases are NEW and all their text awaits Kilian's
// review. The treatments use the cooking recipes: the bone broth (the Witch's bone)
// goes to the miner with scurvy.
export const DUSTER_DAY3_ID = "chapter3-duster";
export const PATH_MINER_DAY3_ID = "chapter3-path-miner";
export const STONECUTTER_DAY3_ID = "chapter3-stonecutter";

export const CHAPTER3_PATIENTS: Record<string, PatientCaseDefinition> = {
  [DUSTER_DAY3_ID]: {
    id: DUSTER_DAY3_ID,
    name: { es: "MUJER DEL PLUMERO", en: "THE WOMAN WITH THE DUSTER" },
    ailmentId: "chest-cough",
    discovered: { es: "Una mujer sacude el polvo con un plumero, tapándose la boca con un paño, en la calle de la botica.", en: "A woman dusts with a feather duster, a cloth over her mouth, in the apothecary street." },
    observation: { es: "Tos persistente y respiración silbante tras limpiar el polvo de un piso cerrado mucho tiempo. Necesita despejar el pecho.", en: "A persistent cough and wheezing after dusting a long-closed floor. She needs to clear her chest." },
    requiredTreatments: [{ itemId: "mint-infusion", quantity: 1 }, { itemId: "balsamic-syrup", quantity: 1 }],
    revealsRecipeIds: ["fire.mint-infusion", "fire.balsamic-syrup"],
    examination: "in-place",
  },
  [PATH_MINER_DAY3_ID]: {
    id: PATH_MINER_DAY3_ID,
    name: { es: "MINERO DEL CAMINO", en: "THE PATH MINER" },
    ailmentId: "scurvy",
    discovered: { es: "El minero del camino se sujeta la mejilla mientras descansa de la pica.", en: "The path miner holds his cheek as he rests from the pick." },
    observation: { es: "Cansancio, encías sangrantes y heridas que no cierran tras semanas comiendo mal. Necesita fruta y comida de verdad.", en: "Tiredness, bleeding gums and wounds that will not close after weeks of poor eating. He needs fruit and real food." },
    requiredTreatments: [{ itemId: "citrus-drink", quantity: 1 }, { itemId: "bone-broth", quantity: 1 }],
    revealsRecipeIds: ["fire.citrus-drink", "fire.bone-broth"],
    examination: "in-place",
  },
  [STONECUTTER_DAY3_ID]: {
    id: STONECUTTER_DAY3_ID,
    name: { es: "PICAPEDRERO DE LA CANTERA", en: "THE QUARRY STONECUTTER" },
    ailmentId: "fracture",
    discovered: { es: "Un picapedrero se sostiene el brazo en el banco de la cantera.", en: "A stonecutter nurses his arm on the quarry bench." },
    observation: { es: "Brazo hinchado y desviado tras el golpe de un bloque. Duele al girarlo y al apoyarlo. Hay que inmovilizarlo.", en: "A swollen, crooked arm after a falling block. It hurts to turn or lean on it. It must be immobilized." },
    requiredTreatments: [{ itemId: "disinfected-bandage", quantity: 1 }, { itemId: "poultice", quantity: 1 }],
    revealsRecipeIds: ["manual.disinfected-bandage", "manual.poultice"],
    examination: "in-place",
  },
};
