import { countItem, type InventoryState } from "../inventory/inventory";
import {
  getPatientStatus,
  hasRequiredTreatments,
  type PatientCaseDefinition,
  type PatientCasesState,
} from "./patientCases";

// Chapter 1 patients: the baker's husband and the man on the tavern floor. The
// injured miner is not a case yet.
export const BAKER_HUSBAND_ID = "baker-husband";
export const TAVERN_PATIENT_ID = "tavern-patient";

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
  [TAVERN_PATIENT_ID]: {
    id: TAVERN_PATIENT_ID,
    name: { es: "HOMBRE DE LA TABERNA", en: "THE MAN IN THE TAVERN" },
    ailmentId: "stomach-ailment",
    discovered: {
      es: "El tabernero dice que un hombre lleva un buen rato en el suelo, quejándose.",
      en: "The bartender says a man has been groaning on the floor for a good while.",
    },
    observation: {
      es: "Dolor de vientre, náuseas y pesadez tras beber de más.",
      en: "Stomach pain, nausea and heaviness after drinking too much.",
    },
    requiredTreatments: [
      { itemId: "mushroom-soup", quantity: 1 },
      { itemId: "milk-with-honey", quantity: 1 },
    ],
    revealsRecipeIds: ["fire.mushroom-soup", "fire.milk-with-honey"],
    // He is examined where he lies: no scene of his own.
    examination: "in-place",
  },
};

// Chapter 1 starts with the baker's husband already known: the baker asked for
// the visit. Cases that are not listed are hidden (the tavern man is found out
// by the bartender, or by looking at him).
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

// The one-time trades of the tavern case (claimed-reward flags, session only):
// the jar from the bartender, the milk from the farm woman, the honey of the
// beekeeper. See npcTrades.ts.
export const TAVERN_JAR_REWARD_ID = "chapter1.tavern.emptyJar";
export const FARM_MILK_REWARD_ID = "chapter1.farm.milk";
// Not a reward: the memory that the farm woman already PRESENTED the milk deal
// (so her first conversation about it is an introduction, told once).
export const FARM_WOMAN_INTRO_ID = "chapter1.farm.womanIntro";
export const BEEKEEPER_HONEY_REWARD_ID = "chapter1.beekeeper.honey";

// The one-time thank-you each case may still owe the Doctor.
export const CHAPTER1_PATIENT_REWARDS: Record<string, string> = {
  [BAKER_HUSBAND_ID]: BAKER_SALT_REWARD_ID,
};

// The placed characters of the tavern case (the man on the floor and the
// bartender who points him out) and of the trades that feed it.
export const TAVERN_PATIENT_INSTANCE_ID =
  "tavern-interior-tavern-patient-sick-01";
export const TAVERN_BARTENDER_INSTANCE_ID = "tavern-interior-bartender-01";
export const FARM_WOMAN_INSTANCE_ID = "farm-villager-woman-01-01";
export const BEEKEEPER_INSTANCE_ID = "mill-farmland-beekeeper-01";

// The placed characters that show the "!". Derived from the cases, the claimed
// rewards and the inventory, so it is never stored: it vanishes by itself once
// the character has nothing left to give or to say that moves a case forward.
//   The baker: her visit is pending (DISCOVERED), or her thank-you was not
//   received yet once her husband is TREATED (a reward that did not fit is not
//   received, so the "!" stays).
//   The bartender: the tavern case has not been noticed yet (HIDDEN).
//   The man on the floor: noticed but not examined, or examined and the Doctor
//   carries both treatments.
//   The farm woman: the case is examined, the milk was not traded yet and the
//   Doctor carries what she asks for. The beekeeper: examined, honey pending.
export function getAttentionInstanceIds(
  state: PatientCasesState,
  claimedRewards: ReadonlySet<string> = new Set(),
  inventory?: InventoryState,
): ReadonlySet<string> {
  const instances = new Set(
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
  const tavern = getPatientStatus(state, TAVERN_PATIENT_ID);

  if (tavern === "hidden") {
    instances.add(TAVERN_BARTENDER_INSTANCE_ID);
  } else if (tavern === "discovered") {
    instances.add(TAVERN_PATIENT_INSTANCE_ID);
  } else if (tavern === "examined") {
    if (
      inventory &&
      hasRequiredTreatments(CHAPTER1_PATIENTS[TAVERN_PATIENT_ID], inventory)
    ) {
      instances.add(TAVERN_PATIENT_INSTANCE_ID);
    }

    if (
      inventory &&
      !claimedRewards.has(FARM_MILK_REWARD_ID) &&
      countItem(inventory, "orange") >= 3 &&
      countItem(inventory, "empty-jar") >= 1
    ) {
      instances.add(FARM_WOMAN_INSTANCE_ID);
    }

    // the bartender still has the jar for the milk
    if (!claimedRewards.has(TAVERN_JAR_REWARD_ID)) {
      instances.add(TAVERN_BARTENDER_INSTANCE_ID);
    }

    if (!claimedRewards.has(BEEKEEPER_HONEY_REWARD_ID)) {
      instances.add(BEEKEEPER_INSTANCE_ID);
    }
  }

  return instances;
}

// The conversation partner during the examination (the sick husband, placed
// in the Baker's Bedroom narrative scene).
export const BAKER_HUSBAND_INSTANCE_ID =
  "bakers-bedroom-bakers-husband-sick-01";

// The baker as she stands in the Baker's Bedroom (a second representation of
// the same character; the one in the bakery is bakery-interior-baker-01).
export const BAKER_BEDROOM_INSTANCE_ID = "bakers-bedroom-baker-standing-01";
