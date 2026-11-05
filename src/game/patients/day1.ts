import type { SceneId } from "../world/worldScenes";
import { CHAPTER1_PATIENTS } from "./chapter1Patients";
import { getPatientStatus, type PatientCasesState } from "./patientCases";

// THE END OF DAY 1. Everything here is DERIVED from what already exists: the
// cases of Chapter 1 (CHAPTER1_PATIENTS and their statuses) and two memories in
// the claimed flags (what the Doctor already said, and that the day is over).
// There is no second source of truth and no order between the cases.
//
//   in-progress  not every case is treated
//   work-done    all treated: the Doctor said it is enough and may go home
//                whenever he likes (walking or by fast travel)
//   completed    he got home and the day was closed
export type Day1Status = "in-progress" | "work-done" | "completed";

// The Doctor's remark that the work is done, said once.
export const DAY1_WORK_DONE_ID = "chapter1.day1.workDone";
// The day was closed: the unmistakable final state of Day 1.
export const DAY1_COMPLETED_ID = "chapter1.day1.completed";

// Home is the Botica. Arriving there, however the Doctor got there (the street
// door on foot or fast travel, both land on its street arrival), closes the day.
// The Doctor's Room above it needs no extra walk.
export const DAY1_HOME_SCENE: SceneId = "apothecary-interior";

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

export function getDay1Status(
  patients: PatientCasesState,
  claimedRewards: ReadonlySet<string>,
): Day1Status {
  if (claimedRewards.has(DAY1_COMPLETED_ID)) {
    return "completed";
  }

  return areAllDay1PatientsTreated(patients) ? "work-done" : "in-progress";
}

// The moment the third case is treated, whichever it is: the remark, once.
export function shouldAnnounceDay1WorkDone(
  patients: PatientCasesState,
  claimedRewards: ReadonlySet<string>,
): boolean {
  return (
    areAllDay1PatientsTreated(patients) &&
    !claimedRewards.has(DAY1_WORK_DONE_ID) &&
    !claimedRewards.has(DAY1_COMPLETED_ID)
  );
}

// Being in the Botica with the day's work done (and said) closes the day. It
// looks only at the state and the scene, never at HOW the Doctor arrived.
export function shouldCloseDay1(context: {
  patients: PatientCasesState;
  claimedRewards: ReadonlySet<string>;
  sceneId: string;
}): boolean {
  return (
    context.sceneId === DAY1_HOME_SCENE &&
    areAllDay1PatientsTreated(context.patients) &&
    context.claimedRewards.has(DAY1_WORK_DONE_ID) &&
    !context.claimedRewards.has(DAY1_COMPLETED_ID)
  );
}
