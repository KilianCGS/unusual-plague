import { CHAPTER1_PATIENTS } from "./chapter1Patients";
import { CHAPTER2_PATIENTS } from "./chapter2Patients";

// Day-specific closing rules still use their own chapter's case list.
export const PATIENT_CASES = { ...CHAPTER1_PATIENTS, ...CHAPTER2_PATIENTS };
