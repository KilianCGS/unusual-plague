import type { Language } from "../i18n/types";
import { BAKER_HUSBAND_ID, INJURED_MINER_ID, TAVERN_PATIENT_ID } from "../patients/chapter1Patients";
import { BLACKSMITH_DAY2_ID, FARMER_DAY2_ID, WOODCUTTER_DAY2_ID } from "../patients/chapter2Patients";
import { getPatientStatus, type PatientCasesState } from "../patients/patientCases";

// THE ERRANDS PANEL: what the Doctor has pending, derived from the cases (never
// stored). A case becomes an errand the moment the Doctor knows about it (the
// case is "discovered": he has spoken with whoever asked) and is done once it
// is treated. Other kinds of errand (small favours) can be added as further
// sources of the same shape.
//
// Every text here is NEW and awaits Kilian's review.
export type Objective = { id: string; text: string; done: boolean };

export const PATIENT_OBJECTIVES: Readonly<Record<string, Record<Language, string>>> = {
  [BAKER_HUSBAND_ID]: { es: "Tratar al marido de la panadera", en: "Treat the baker's husband" },
  [TAVERN_PATIENT_ID]: { es: "Tratar al hombre de la taberna", en: "Treat the man in the tavern" },
  [INJURED_MINER_ID]: { es: "Tratar al minero herido", en: "Treat the injured miner" },
  [WOODCUTTER_DAY2_ID]: { es: "Tratar al leñador", en: "Treat the woodcutter" },
  [BLACKSMITH_DAY2_ID]: { es: "Tratar al herrero herido", en: "Treat the injured blacksmith" },
  [FARMER_DAY2_ID]: { es: "Tratar al agricultor del molino", en: "Treat the mill farmer" },
};

export const objectivesCopy: Record<Language, { title: string; toggleHint: string }> = {
  es: { title: "RECADOS", toggleHint: "[R]" },
  en: { title: "ERRANDS", toggleHint: "[R]" },
};

export function getObjectives(patients: PatientCasesState, language: Language): Objective[] {
  return Object.entries(PATIENT_OBJECTIVES).flatMap(([patientId, text]) => {
    const status = getPatientStatus(patients, patientId);

    return status === "hidden"
      ? []
      : [{ id: patientId, text: text[language], done: status === "treated" }];
  });
}
