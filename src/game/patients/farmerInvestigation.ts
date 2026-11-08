import { CHAPTER2_PATIENTS, FARMER_DAY2_ID } from "./chapter2Patients";
import { getPatientStatus, type PatientCasesState } from "./patientCases";

export const FARMER_SAMPLE_ID = "chapter2.farmer.sampleCollected";
export const FARMER_ANALYSIS_ID = "chapter2.farmer.sampleAnalyzed";
export const FARMER_RECIPE_IDS = ["manual.charcoal-suspension", "fire.medicinal-infusion"];
const NONE: ReadonlySet<string> = new Set();

export function canAnalyzeFarmerSample(patients: PatientCasesState, flags: ReadonlySet<string>): boolean {
  return getPatientStatus(patients, FARMER_DAY2_ID) === "examined" &&
    flags.has(FARMER_SAMPLE_ID) && !flags.has(FARMER_ANALYSIS_ID);
}

// Investigation knowledge is derived from narrative flags, not a new inventory
// item. The used leech stays with the sample; it cannot be used a second time.
export function getChapter2PatientDefinitions(flags: ReadonlySet<string> = NONE) {
  const farmer = CHAPTER2_PATIENTS[FARMER_DAY2_ID];
  if (!flags.has(FARMER_SAMPLE_ID)) return CHAPTER2_PATIENTS;
  const analyzed = flags.has(FARMER_ANALYSIS_ID);
  return {
    ...CHAPTER2_PATIENTS,
    [FARMER_DAY2_ID]: {
      ...farmer,
      ailmentId: analyzed ? "poisoning" : farmer.ailmentId,
      observation: analyzed ? {
        es: "Debilidad, sudor frío y náuseas. Muestra analizada: el cuadro apunta a un envenenamiento, de origen aún desconocido.",
        en: "Weakness, cold sweats and nausea. Sample analyzed: the findings point to poisoning, its source still unknown.",
      } : farmer.observation,
      investigation: analyzed ? undefined : {
        es: "Muestra obtenida. Analizarla en la mesa de trabajo de la botica.",
        en: "Sample obtained. Analyze it at the apothecary's work table.",
      },
      requiredTreatments: analyzed ? [
        { itemId: "charcoal-suspension", quantity: 1 },
        { itemId: "medicinal-infusion", quantity: 1 },
      ] : [],
      revealsRecipeIds: analyzed ? FARMER_RECIPE_IDS : [],
    },
  };
}
