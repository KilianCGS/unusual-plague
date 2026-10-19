import {
  getPatientStatus,
  type PatientCaseDefinition,
  type PatientCasesState,
} from "./patientCases";

// Chapter 1 patients. Only the baker's husband exists for now; the tavern
// patient and the injured miner are not cases yet.
export const BAKER_HUSBAND_ID = "baker-husband";

export const CHAPTER1_PATIENTS: Record<string, PatientCaseDefinition> = {
  [BAKER_HUSBAND_ID]: {
    id: BAKER_HUSBAND_ID,
    name: { es: "MARIDO DE LA PANADERA", en: "THE BAKER'S HUSBAND" },
    ailmentId: "common-fever",
    discovered: {
      es: "La panadera ha solicitado una visita. Su marido no se encuentra bien.",
      en: "The baker has asked for a visit. Her husband is not well.",
    },
    observation: {
      es: "Frente ardiendo, escalofríos, sudor frío y dolor de cabeza.",
      en: "Burning forehead, chills, cold sweats and a headache.",
    },
    requiredTreatments: [
      { itemId: "medicinal-infusion", quantity: 1 },
      { itemId: "cold-cloth", quantity: 1 },
    ],
    revealsRecipeIds: ["fire.medicinal-infusion", "manual.cold-cloth"],
  },
};

// Chapter 1 starts with the baker's husband already known: the baker asked for
// the visit. Cases that are not listed are hidden.
export const CHAPTER1_INITIAL_PATIENTS: PatientCasesState = {
  [BAKER_HUSBAND_ID]: "discovered",
};

// Which placed character each case is attached to: the person who has the
// news for the Doctor (the "!" and the conversations). It names a decor
// instance of chapter-1.ts, so the case itself never depends on a scene.
export const CHAPTER1_PATIENT_NPC_INSTANCES: Record<string, string> = {
  [BAKER_HUSBAND_ID]: "bakery-interior-baker-01",
};

// The one-time thank-you of the baker once her husband is treated: Salt x1.
// It is a narrative flag (see GameWorld's claimed rewards), NOT a patient
// status: the case stays "treated" whether or not the gift was collected.
export const BAKER_SALT_REWARD_ID = "chapter1.baker.salt";
export const BAKER_SALT_REWARD = { itemId: "salt", quantity: 1 } as const;

// The one-time thank-you each case may still owe the Doctor.
export const CHAPTER1_PATIENT_REWARDS: Record<string, string> = {
  [BAKER_HUSBAND_ID]: BAKER_SALT_REWARD_ID,
};

// The placed characters that show the "!": the person attached to each case
// that either still has its visit pending (DISCOVERED) or, once TREATED, still
// has a thank-you waiting that was not received yet. Derived from the statuses
// and the claimed rewards, so it is never stored: it vanishes by itself after
// the visit, and again the moment the reward is really received (a reward that
// did not fit in the inventory is not received, so the "!" stays).
export function getAttentionInstanceIds(
  state: PatientCasesState,
  claimedRewards: ReadonlySet<string> = new Set(),
): ReadonlySet<string> {
  return new Set(
    Object.entries(CHAPTER1_PATIENT_NPC_INSTANCES)
      .filter(([patientId]) => {
        const status = getPatientStatus(state, patientId);
        const rewardId = CHAPTER1_PATIENT_REWARDS[patientId];

        return (
          status === "discovered" ||
          (status === "treated" &&
            rewardId !== undefined &&
            !claimedRewards.has(rewardId))
        );
      })
      .map(([, instanceId]) => instanceId),
  );
}

// The conversation partner during the examination (the sick husband, placed
// in the Baker's Bedroom narrative scene).
export const BAKER_HUSBAND_INSTANCE_ID =
  "bakers-bedroom-bakers-husband-sick-01";

// The baker as she stands in the Baker's Bedroom (a second representation of
// the same character; the one in the bakery is bakery-interior-baker-01).
export const BAKER_BEDROOM_INSTANCE_ID = "bakers-bedroom-baker-standing-01";
