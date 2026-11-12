import { CHAPTER3_PATIENTS } from "./chapter3Patients";
import { getPatientStatus, type PatientCasesState } from "./patientCases";

// THE END OF DAY 3, like Day 1 and Day 2: derived from the cases and one memory in
// the claimed flags. When the last case is treated the day closes by itself.
export const DAY3_COMPLETED_ID = "chapter3.day3.completed";
export const DAY3_PATIENT_IDS: readonly string[] = Object.keys(CHAPTER3_PATIENTS);

export function shouldCloseDay3(
  patients: PatientCasesState, flags: ReadonlySet<string>,
): boolean {
  return !flags.has(DAY3_COMPLETED_ID) && DAY3_PATIENT_IDS.every(
    id => getPatientStatus(patients, id) === "treated",
  );
}
