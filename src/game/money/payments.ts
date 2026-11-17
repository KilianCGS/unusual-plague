import { BAKER_HUSBAND_ID, INJURED_MINER_ID, TAVERN_PATIENT_ID } from "../patients/chapter1Patients";
import { BLACKSMITH_DAY2_ID, FARMER_DAY2_ID, WOODCUTTER_DAY2_ID } from "../patients/chapter2Patients";
import { PATH_MINER_DAY3_ID, STONECUTTER_DAY3_ID, DUSTER_DAY3_ID } from "../patients/chapter3Patients";

// What each patient pays (in copper coins) once the Doctor has treated them.
// Invented, not round, and to be balanced by Kilian: the coins a chapter earns
// must always cover what that chapter forces the Doctor to buy.
export const PATIENT_PAYMENTS: Readonly<Record<string, number>> = {
  // 2026-11-13: lowered so that money is a NEED, not a surplus (see docs/ECONOMY_REVIEW_NOV13.md):
  // a day earns about what the next day's forced purchases cost.
  // 2026-11-16: +6 coins in total on the baker (+1), the injured miner (+1), the woodcutter (+1), the
  // blacksmith (+2) and the farmer (+1). They let ONE spare unit of salt, bone and onion be sold, and
  // oranges (bought at 1 coin since the Mill branches were removed), without a player who buys everything
  // running out of money for a mandatory purchase. The income has to arrive early (economy-no-deadlock tried
  // the extra on Day 3 and it failed) and not be a multiple of 5 (money test).
  [BAKER_HUSBAND_ID]: 4,
  [TAVERN_PATIENT_ID]: 4,
  [INJURED_MINER_ID]: 7,
  [WOODCUTTER_DAY2_ID]: 4,
  [BLACKSMITH_DAY2_ID]: 6,
  [FARMER_DAY2_ID]: 7,
  [DUSTER_DAY3_ID]: 3,
  [PATH_MINER_DAY3_ID]: 4,
  [STONECUTTER_DAY3_ID]: 6,
};

export function getPatientPayment(patientId: string): number {
  return PATIENT_PAYMENTS[patientId] ?? 0;
}
