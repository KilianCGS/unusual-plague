import { CHAPTER1_PATIENTS } from "./chapter1Patients";
import { getPatientStatus, type PatientCasesState } from "./patientCases";

// THE END OF DAY 1. Everything here is DERIVED from what already exists: the
// cases of Chapter 1 (CHAPTER1_PATIENTS and their statuses) and one memory in
// the claimed flags (that the day was closed). There is no second source of
// truth and no order between the cases.
//
//   in-progress  not every case is treated, or the closing has not started
//   completed    the closing started: the Doctor goes home to rest and the
//                story moves on to the next chapter
//
// There is no "go home" step for the player: when the LAST treatment's
// conversation is over, the day closes by itself (see GameWorld).
export type Day1Status = "in-progress" | "completed";

// The day was closed: the unmistakable final state of Day 1. It is claimed the
// moment the closing STARTS, so nothing can start it twice, and it is never
// reused for Day 2.
export const DAY1_COMPLETED_ID = "chapter1.day1.completed";

// The three cases of the day, every one that Chapter 1 defines.
export const DAY1_PATIENT_IDS: readonly string[] =
  Object.keys(CHAPTER1_PATIENTS);

export function areAllDay1PatientsTreated(
  patients: PatientCasesState,
): boolean {
  return DAY1_PATIENT_IDS.every(
    (patientId) => getPatientStatus(patients, patientId) === "treated",
  );
}

export function getDay1Status(claimedRewards: ReadonlySet<string>): Day1Status {
  return claimedRewards.has(DAY1_COMPLETED_ID) ? "completed" : "in-progress";
}

// The day closes when every case is treated and it has not closed yet. It looks
// only at the cases and the memory: never at the order, the scene, the
// inventory, or how the last case was reached. GameWorld asks it only at a
// moment of plain play (no conversation, interface or fade), which is how the
// closing waits for the last conversation and its effects to finish.
export function shouldCloseDay1(
  patients: PatientCasesState,
  claimedRewards: ReadonlySet<string>,
): boolean {
  return (
    areAllDay1PatientsTreated(patients) &&
    !claimedRewards.has(DAY1_COMPLETED_ID)
  );
}
