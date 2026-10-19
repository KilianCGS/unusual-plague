import type { ItemNeed } from "../crafting/needs";
import { gatherCopy } from "../i18n/items";
import type { Language } from "../i18n/types";
import {
  canAddItem,
  countItem,
  type InventoryState,
} from "../inventory/inventory";
import { getItem } from "../items/items";
import {
  getPatientStatus,
  isTreatable,
  type PatientCasesState,
} from "../patients/patientCases";
import {
  BAKER_SALT_REWARD,
  BAKER_SALT_REWARD_ID,
  BAKER_HUSBAND_ID,
  BAKER_HUSBAND_INSTANCE_ID,
  CHAPTER1_PATIENTS,
} from "../patients/chapter1Patients";
import { getActiveMissingIngredients } from "../patients/patientNeeds";
import {
  bakerAfter,
  bakerDelivery,
  bakerReward,
  bakerRewardNoRoom,
  bakerIntro,
  bakerWaiting,
  husbandExam,
  merchantCloth,
} from "./chapter1PatientDialogues";
import type { Conversation } from "./dialogueTypes";
import { DOCTOR_SPEAKER } from "./dialogueTypes";
import {
  localizeConversation,
  type LocalizedConversation,
} from "./localizedConversation";

// STORY INTERACTIONS: interactions whose result depends on the story state and
// on what the Doctor carries, so they cannot be a fixed ambient conversation.
// The resolver is pure: it only DECIDES (a conversation and the effects the
// game must apply); GameWorld applies the effects.

export type StoryEffect =
  | { type: "treat"; patientId: string }
  // Marks a one-time reward as received. Applied together with its item or not
  // at all, so a reward that did not fit is never recorded as given.
  | { type: "claim-reward"; rewardId: string }
  | { type: "give-item"; itemId: string; quantity: number };

export type StoryOutcome = {
  // Null for light interactions (the river): only effects and a short notice.
  conversation: Conversation | null;
  // Short feedback shown as a notice (ItemFeedback), without a dialogue.
  notice?: string;
  effects: StoryEffect[];
  // What the game does when the conversation ends.
  after?: "go-to-examination";
};

export type StoryFacts = {
  patients: PatientCasesState;
  inventory: InventoryState;
  // Narrative flags, separate from the medical status of the cases: the
  // one-time rewards already received (absent = none).
  claimedRewards?: ReadonlySet<string>;
};

// interactionId of the interactable that belongs to a patient case.
export const PATIENT_INTERACTION_IDS: Record<string, string> = {
  "chapter1.bakery.baker": BAKER_HUSBAND_ID,
};

// The merchant is not a shop: when the Doctor KNOWS he needs something this
// character can give and does not carry enough of it, the conversation gives
// it. Which items each character can give.
export const NPC_PROVIDES: Record<string, string[]> = {
  "chapter1.plaza.merchant": ["cloth"],
};

// A source the Doctor can take from while he needs it (not a tap that never
// runs dry). `requires` is a tool he must carry (it is never consumed). The
// river's zone is placed by hand in the Outskirts.
export const GATHER_SOURCES: Record<
  string,
  { itemId: string; requires: string }
> = {
  "gather.water": { itemId: "water", requires: "empty-flask" },
};

export type GatherDecision = "gather" | "no-container" | "not-needed";

// Pure: can the Doctor take one unit from this source right now? Derived from
// the tool he carries and from what the KNOWN patient needs still lack; there
// is no "depleted" flag, so a new need re-enables the source by itself.
export function getGatherDecision(
  interactionId: string,
  facts: StoryFacts,
): GatherDecision | null {
  const source = GATHER_SOURCES[interactionId];

  if (!source) {
    return null;
  }

  if (countItem(facts.inventory, source.requires) < 1) {
    return "no-container";
  }

  const missing = getActiveMissingIngredients(
    facts.patients,
    CHAPTER1_PATIENTS,
    facts.inventory,
  );

  return missingOf(missing, source.itemId) > 0 ? "gather" : "not-needed";
}

function missingOf(missing: readonly ItemNeed[], itemId: string): number {
  return missing.find((need) => need.itemId === itemId)?.quantity ?? 0;
}

function localize(
  conversation: LocalizedConversation,
  language: Language,
  subjectId: string,
): Conversation {
  return localizeConversation(conversation, language, subjectId);
}

export function resolveStoryInteraction(
  interactionId: string,
  facts: StoryFacts,
  language: Language,
  subjectId: string,
): StoryOutcome | null {
  // The people who carry a patient case.
  const patientId = PATIENT_INTERACTION_IDS[interactionId];

  if (patientId) {
    const definition = CHAPTER1_PATIENTS[patientId];
    const status = getPatientStatus(facts.patients, patientId);

    if (status === "discovered") {
      return {
        conversation: localize(bakerIntro, language, subjectId),
        effects: [],
        after: "go-to-examination",
      };
    }

    if (
      status === "examined" &&
      isTreatable(facts.patients, definition, facts.inventory)
    ) {
      return {
        conversation: localize(bakerDelivery, language, subjectId),
        effects: [{ type: "treat", patientId }],
      };
    }

    if (status === "examined") {
      return {
        conversation: localize(bakerWaiting, language, subjectId),
        effects: [],
      };
    }

    if (status === "treated") {
      // First visit after the treatment: her thank-you, Salt x1, ONCE. Whether
      // it was received is its own flag (Salt may be used up later), and it is
      // only given if it really fits in the carried inventory.
      if (!facts.claimedRewards?.has(BAKER_SALT_REWARD_ID)) {
        return canAddItem(facts.inventory, BAKER_SALT_REWARD.itemId)
          ? {
              conversation: localize(bakerReward, language, subjectId),
              effects: [
                {
                  type: "give-item",
                  itemId: BAKER_SALT_REWARD.itemId,
                  quantity: BAKER_SALT_REWARD.quantity,
                },
                { type: "claim-reward", rewardId: BAKER_SALT_REWARD_ID },
              ],
            }
          : {
              conversation: localize(bakerRewardNoRoom, language, subjectId),
              effects: [],
            };
      }

      return {
        conversation: localize(bakerAfter, language, subjectId),
        effects: [],
      };
    }

    return null;
  }

  const missing = getActiveMissingIngredients(
    facts.patients,
    CHAPTER1_PATIENTS,
    facts.inventory,
  );

  // A character who can give what is needed.
  const provides = NPC_PROVIDES[interactionId];
  const wanted = provides?.find((itemId) => missingOf(missing, itemId) > 0);

  if (wanted) {
    return {
      conversation: localize(merchantCloth, language, subjectId),
      effects: [{ type: "give-item", itemId: wanted, quantity: 1 }],
    };
  }

  // A source: gives one unit per use while it is needed and he has the tool.
  const decision = getGatherDecision(interactionId, facts);

  if (decision) {
    const copy = gatherCopy[language];

    if (decision === "gather") {
      return {
        conversation: null,
        effects: [
          {
            type: "give-item",
            itemId: GATHER_SOURCES[interactionId].itemId,
            quantity: 1,
          },
        ],
      };
    }

    return {
      conversation: null,
      effects: [],
      notice: decision === "no-container" ? copy.noContainer : copy.enough,
    };
  }

  return null;
}

// The Doctor thinking out loud about each missing ingredient (one line per
// ingredient he lacks), or null when nothing is missing. The line comes from
// the item's own sourceHint.
export function buildMissingIngredientConversation(
  missing: readonly ItemNeed[],
  language: Language,
): Conversation | null {
  const lines = missing.flatMap(({ itemId }) => {
    const hint = getItem(itemId)?.sourceHint?.[language];

    return hint ? [{ speaker: DOCTOR_SPEAKER, text: hint }] : [];
  });

  return lines.length > 0 ? { id: "doctor.missing-ingredients", lines } : null;
}

// The examination of a patient: the conversation in the narrative scene. Its
// "subject" is the patient's placed instance, so the bubble follows him.
export function getExaminationConversation(
  patientId: string,
  language: Language,
): Conversation | null {
  return patientId === BAKER_HUSBAND_ID
    ? localize(husbandExam, language, BAKER_HUSBAND_INSTANCE_ID)
    : null;
}
