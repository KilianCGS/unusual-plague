import type { PatientCaseDefinition } from "./patientCases";

// DAY 3 (2026-11-12): three patients, one per new ailment of the day. The people are
// the woman dusting in the Botica street (a NEW sprite: the sweeper of Day 1 comes back on
// Day 4 with her broom dropped), the miner of the mountain path and a stonecutter of the quarry; the cases are NEW and all their text awaits Kilian's
// review. The treatments use the cooking recipes: the bone broth (the Witch's bone)
// goes to the miner with scurvy.
export const DUSTER_DAY3_ID = "chapter3-duster";
export const PATH_MINER_DAY3_ID = "chapter3-path-miner";
export const STONECUTTER_DAY3_ID = "chapter3-stonecutter";
// 2026-11-18 (Kilian chose it): the old man with the jug of the tavern street cannot sleep; the fourth case of Day 3.
export const INSOMNIAC_DAY3_ID = "chapter3-insomniac";

export const CHAPTER3_PATIENTS: Record<string, PatientCaseDefinition> = {
  [DUSTER_DAY3_ID]: {
    id: DUSTER_DAY3_ID,
    name: { es: "Mujer del plumero", en: "The woman with the duster" },
    ailmentId: "chest-cough",
    discovered: { es: "Una mujer sacude el polvo con un plumero, tapándose la boca con un paño, en la calle de la panadería.", en: "A woman dusts with a feather duster, a cloth over her mouth, in the bakery street." },
    observation: { es: "Tos persistente y respiración silbante tras limpiar el polvo de un piso cerrado mucho tiempo. Necesita despejar el pecho.", en: "A persistent cough and wheezing after dusting a long-closed floor. She needs to clear her chest." },
    requiredTreatments: [{ itemId: "mint-infusion", quantity: 1 }, { itemId: "balsamic-syrup", quantity: 1 }],
    revealsRecipeIds: ["fire.mint-infusion", "fire.balsamic-syrup"],
    examination: "in-place",
  },
  [PATH_MINER_DAY3_ID]: {
    id: PATH_MINER_DAY3_ID,
    name: { es: "Minero de la cantera", en: "The quarry miner" },
    ailmentId: "scurvy",
    discovered: { es: "Un minero descansa en la cantera, con una mujer a su lado, sujetándose la mejilla.", en: "A miner rests at the quarry, a woman beside him, holding his cheek." },
    observation: { es: "Cansancio, encías sangrantes y heridas que no cierran tras semanas comiendo mal. Necesita fruta y comida de verdad.", en: "Tiredness, bleeding gums and wounds that will not close after weeks of poor eating. He needs fruit and real food." },
    requiredTreatments: [{ itemId: "citrus-drink", quantity: 1 }, { itemId: "bone-broth", quantity: 1 }],
    revealsRecipeIds: ["fire.citrus-drink", "fire.bone-broth"],
    examination: "in-place",
  },
  [STONECUTTER_DAY3_ID]: {
    id: STONECUTTER_DAY3_ID,
    name: { es: "Picapedrero de la cantera", en: "The quarry stonecutter" },
    ailmentId: "fracture",
    discovered: { es: "Un picapedrero se sostiene el brazo en el banco de la cantera.", en: "A stonecutter nurses his arm on the quarry bench." },
    observation: { es: "Brazo hinchado y desviado tras el golpe de un bloque. Duele al girarlo y al apoyarlo. Hay que inmovilizarlo.", en: "A swollen, crooked arm after a falling block. It hurts to turn or lean on it. It must be immobilized." },
    requiredTreatments: [{ itemId: "disinfected-bandage", quantity: 1 }, { itemId: "poultice", quantity: 1 }],
    revealsRecipeIds: ["manual.disinfected-bandage", "manual.poultice"],
    examination: "in-place",
  },
  [INSOMNIAC_DAY3_ID]: {
    id: INSOMNIAC_DAY3_ID,
    name: { es: "Anciano del cántaro", en: "The old man with the jug" },
    ailmentId: "insomnia",
    discovered: { es: "El anciano del cántaro cabecea sentado en la calle de la taberna, con ojeras de varias noches.", en: "The old man with the jug nods off sitting on the tavern street, with the shadows of many nights under his eyes." },
    observation: { es: "Ojeras, irritabilidad y un cansancio que el descanso no cura. Lleva noches sin pegar ojo.", en: "Dark circles, irritability and a tiredness that rest does not cure. He has gone nights without a wink of sleep." },
    requiredTreatments: [{ itemId: "mint-infusion", quantity: 1 }, { itemId: "milk-with-honey", quantity: 1 }],
    revealsRecipeIds: ["fire.mint-infusion", "fire.milk-with-honey"],
    examination: "in-place",
  },
};
