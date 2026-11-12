import { BAKER_HUSBAND_ID, INJURED_MINER_ID, TAVERN_PATIENT_ID } from "../patients/chapter1Patients";
import { BLACKSMITH_DAY2_ID, FARMER_DAY2_ID, WOODCUTTER_DAY2_ID } from "../patients/chapter2Patients";
import { PATH_MINER_DAY3_ID, STONECUTTER_DAY3_ID, DUSTER_DAY3_ID } from "../patients/chapter3Patients";

// What each patient pays (in copper coins) once the Doctor has treated them.
// Invented, not round, and to be balanced by Kilian: the coins a chapter earns
// must always cover what that chapter forces the Doctor to buy.
export const PATIENT_PAYMENTS: Readonly<Record<string, number>> = {
  [BAKER_HUSBAND_ID]: 6,
  [TAVERN_PATIENT_ID]: 8,
  [INJURED_MINER_ID]: 11,
  [WOODCUTTER_DAY2_ID]: 7,
  [BLACKSMITH_DAY2_ID]: 9,
  [FARMER_DAY2_ID]: 13,
  // Day 3 (invented, to balance)
  [DUSTER_DAY3_ID]: 8,
  [PATH_MINER_DAY3_ID]: 9,
  [STONECUTTER_DAY3_ID]: 12,
};

export function getPatientPayment(patientId: string): number {
  return PATIENT_PAYMENTS[patientId] ?? 0;
}
