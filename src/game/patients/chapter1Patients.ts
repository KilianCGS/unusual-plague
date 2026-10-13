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

// The placed characters that show the "!": the person attached to each case
// that is still only discovered (its visit is pending). Derived from the
// statuses, so it is never stored and it vanishes by itself after the visit.
export function getAttentionInstanceIds(
  state: PatientCasesState,
): ReadonlySet<string> {
  return new Set(
    Object.entries(CHAPTER1_PATIENT_NPC_INSTANCES)
      .filter(
        ([patientId]) => getPatientStatus(state, patientId) === "discovered",
      )
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
