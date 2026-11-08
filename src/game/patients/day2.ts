import { CHAPTER2_PATIENTS } from "./chapter2Patients";
import { getPatientStatus, type PatientCasesState } from "./patientCases";

export const DAY2_COMPLETED_ID = "chapter2.day2.completed";
export const DAY2_PATIENT_IDS: readonly string[] = Object.keys(CHAPTER2_PATIENTS);

export function shouldCloseDay2(
  patients: PatientCasesState, flags: ReadonlySet<string>,
): boolean {
  return !flags.has(DAY2_COMPLETED_ID) && DAY2_PATIENT_IDS.every(
    id => getPatientStatus(patients, id) === "treated",
  );
}
