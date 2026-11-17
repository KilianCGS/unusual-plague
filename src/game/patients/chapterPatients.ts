import { CHAPTER1_PATIENTS } from "./chapter1Patients";
import { CHAPTER2_PATIENTS } from "./chapter2Patients";
import { CHAPTER3_PATIENTS } from "./chapter3Patients";

// The cases that belong to each day (2026-11-16): what the Doctor may prepare on a day is what ITS cases
// need, whether he has met them yet or not. Day 4 has no cases of its own.
export const PATIENT_IDS_BY_CHAPTER: Readonly<Record<string, readonly string[]>> = {
  "chapter-1": Object.keys(CHAPTER1_PATIENTS),
  "chapter-2": Object.keys(CHAPTER2_PATIENTS),
  "chapter-3": Object.keys(CHAPTER3_PATIENTS),
};
