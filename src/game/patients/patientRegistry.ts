import { CHAPTER1_PATIENTS } from "./chapter1Patients";
import { CHAPTER2_PATIENTS } from "./chapter2Patients";
import { CHAPTER3_PATIENTS } from "./chapter3Patients";
import { getChapter2PatientDefinitions } from "./farmerInvestigation";

// Day-specific closing rules still use their own chapter's case list.
export const PATIENT_CASES = { ...CHAPTER1_PATIENTS, ...CHAPTER2_PATIENTS, ...CHAPTER3_PATIENTS };
export function getPatientDefinitions(flags: ReadonlySet<string> = new Set()) {
  return { ...PATIENT_CASES, ...getChapter2PatientDefinitions(flags) };
}
