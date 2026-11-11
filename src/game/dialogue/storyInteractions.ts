import type { ItemNeed } from "../crafting/needs";
import { resolveGranaryInteraction } from "./chapter2GranaryDialogues";
import { resolveChapter2StoryInteraction } from "./chapter2StoryInteractions";
import { getPatientDefinitions } from "../patients/patientRegistry";
import { gatherCopy, itemFeedbackCopy } from "../i18n/items";
import type { Language } from "../i18n/types";
import {
  addItem,
  canAddItem,
  countItem,
  removeItem,
  type InventoryState,
} from "../inventory/inventory";
import { getItem } from "../items/items";
import {
  getPatientStatus,
  isTreatable,
  treatPatient,
  type PatientCasesState,
  type PatientStatus,
} from "../patients/patientCases";
import {
  BAKER_SALT_REWARD,
  BAKER_SALT_REWARD_ID,
  BAKER_HUSBAND_ID,
  BAKER_HUSBAND_INSTANCE_ID,
  CHAPTER1_PATIENTS,
  FARM_WOMAN_INTRO_ID,
  INJURED_MINER_ID,
  TAVERN_PATIENT_ID,
  WITCH_MET_ID,
  WITCH_WAITED_ID,
} from "../patients/chapter1Patients";
import { getActiveMissingIngredients } from "../patients/patientNeeds";
import {
  bakerAfter,
  bakerDelivery,
  bakerDeliveryWithReward,
  bakerReward,
  bakerRewardNoRoom,
  bakerIntro,
  bakerWaiting,
  husbandExam,
  merchantCloth,
} from "./chapter1PatientDialogues";
import {
  injuredMinerAfter,
  injuredMinerCure,
  injuredMinerExam,
  injuredMinerWaiting,
} from "./chapter1Patient3Dialogues";
import {
  WITCH_QUOTES,
  pickWitchQuote,
  witchFirst,
  witchFirstWithMushroom,
  witchFirstWithMushroomNoRoom,
  witchWaiting,
} from "./chapter1WitchDialogues";
import {
  bartenderAfter,
  bartenderDuring,
  bartenderIntro,
  bartenderWaiting,
  farmWomanIntro,
  farmWomanIntroWithJar,
  tavernPatientAfter,
  tavernPatientCure,
  tavernPatientExam,
  tavernPatientWaiting,
} from "./chapter1TavernDialogues";
import type { Conversation } from "./dialogueTypes";
import { DOCTOR_SPEAKER } from "./dialogueTypes";
import {
  localizeConversation,
  type LocalizedConversation,
} from "./localizedConversation";
import {
  BARTENDER_ALCOHOL_TRADE_ID,
  BARTENDER_JAR_TRADE_ID,
  NPC_TRADES,
  WITCH_HERB_TRADE_ID,
  type NpcTrade,
} from "./npcTrades";

// STORY INTERACTIONS: interactions whose result depends on the story state and
// on what the Doctor carries, so they cannot be a fixed ambient conversation.
// The resolver is pure: it only DECIDES (a conversation and the effects the
// game must apply); GameWorld applies the effects.

export type StoryEffect =
  | { type: "treat"; patientId: string }
  // Moves a case one step forward (the bartender noticing the tavern man).
  | { type: "advance-patient"; patientId: string; to: PatientStatus }
  // Marks a one-time reward as received. Applied together with its item or not
  // at all, so a reward that did not fit is never recorded as given.
  | { type: "claim-reward"; rewardId: string }
  | { type: "give-item"; itemId: string; quantity: number }
  // Takes items out of the carried inventory (all or nothing, with the rest).
  | { type: "take-item"; itemId: string; quantity: number }
  // The Doctor's copper coins (see src/game/money): earning never fails, paying
  // fails (and so does the whole effect list) when the purse is too light.
  | { type: "give-coins"; amount: number }
  | { type: "take-coins"; amount: number };

export type StoryOutcome = {
  // Null for light interactions (the river): only effects and a short notice.
  conversation: Conversation | null;
  // Short feedback shown as a notice (ItemFeedback), without a dialogue.
  notice?: string;
  effects: StoryEffect[];
  // What the game does when the conversation ends: "go-to-examination" moves
  // the story to the patient's own scene; "examine-in-place" means THIS
  // conversation is the examination, so the case is examined when it ends.
  after?: "go-to-examination" | "examine-in-place";
  // The case that `after` is about.
  patientId?: string;
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
// The merchant no longer gives cloth: he SELLS it (src/game/shop/shops.ts).
export const NPC_PROVIDES: Record<string, string[]> = {};

// A source the Doctor can take from while he needs it (not a tap that never
// runs dry). `requires` is the empty vessel he must carry: filling it USES UP
// the vessel (the item comes in it, see ItemDefinition.container) and gives
// `quantity` units at once, enough for the treatments that need it; the
// vessel comes back when the last unit is used (craft()). The river's zone is
// placed by hand in the Outskirts.
export const GATHER_SOURCES: Record<
  string,
  { itemId: string; requires: string; quantity: number }
> = {
  "gather.water": { itemId: "water", requires: "empty-flask", quantity: 2 },
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
    getPatientDefinitions(facts.claimedRewards),
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

// The treatments of a case the Doctor does not carry yet.
function lackingTreatments(
  patientId: string,
  inventory: InventoryState,
): string[] {
  return CHAPTER1_PATIENTS[patientId].requiredTreatments
    .filter(({ itemId, quantity }) => countItem(inventory, itemId) < quantity)
    .map(({ itemId }) => itemId);
}

// The bartender of the tavern: he points the sick man out, then follows the
// case.
function resolveBartender(
  facts: StoryFacts,
  language: Language,
  subjectId: string,
): StoryOutcome {
  const status = getPatientStatus(facts.patients, TAVERN_PATIENT_ID);

  // The injured miner's wound needs alcohol, whatever the tavern case is doing.
  // The trade only answers once that case is examined and the alcohol was not
  // given yet.
  const alcohol = resolveAlcohol(facts, language, subjectId);

  if (alcohol) {
    return alcohol;
  }

  if (status === "hidden") {
    return {
      conversation: localize(bartenderIntro, language, subjectId),
      effects: [
        {
          type: "advance-patient",
          patientId: TAVERN_PATIENT_ID,
          to: "discovered",
        },
      ],
    };
  }

  // Once the man is examined he hands over the jar for the milk, one time.
  if (
    status === "examined" &&
    !facts.claimedRewards?.has(NPC_TRADES[BARTENDER_JAR_TRADE_ID].rewardId)
  ) {
    const jar = resolveTrade(
      NPC_TRADES[BARTENDER_JAR_TRADE_ID],
      facts,
      language,
      subjectId,
    );

    if (jar) {
      return jar;
    }
  }

  const conversation =
    status === "discovered"
      ? bartenderWaiting
      : status === "examined"
        ? bartenderDuring
        : bartenderAfter;

  return {
    conversation: localize(conversation, language, subjectId),
    effects: [],
  };
}

function resolveAlcohol(
  facts: StoryFacts,
  language: Language,
  subjectId: string,
): StoryOutcome | null {
  const trade = NPC_TRADES[BARTENDER_ALCOHOL_TRADE_ID];

  return facts.claimedRewards?.has(trade.rewardId)
    ? null
    : resolveTrade(trade, facts, language, subjectId);
}

// The injured miner: examined where he sits, then treated with both
// preparations. It starts when the Doctor walks up to him, never because of
// any other case or conversation.
function resolveInjuredMiner(
  facts: StoryFacts,
  language: Language,
  subjectId: string,
): StoryOutcome {
  const definition = CHAPTER1_PATIENTS[INJURED_MINER_ID];
  const status = getPatientStatus(facts.patients, INJURED_MINER_ID);

  if (status === "hidden" || status === "discovered") {
    return {
      conversation: localize(injuredMinerExam, language, subjectId),
      effects: [],
      after: "examine-in-place",
      patientId: INJURED_MINER_ID,
    };
  }

  if (
    status === "examined" &&
    isTreatable(facts.patients, definition, facts.inventory)
  ) {
    return {
      conversation: localize(injuredMinerCure, language, subjectId),
      effects: [{ type: "treat", patientId: INJURED_MINER_ID }],
    };
  }

  return {
    conversation: localize(
      status === "examined" ? injuredMinerWaiting : injuredMinerAfter,
      language,
      subjectId,
    ),
    effects: [],
  };
}

// The last small-talk quote Witch told, so that the next one is another one.
// A convenience of the voice only: nothing depends on it.
let lastWitchQuote = -1;

// Test hook: forget the last quote Witch told.
export function resetWitchQuoteHistory() {
  lastWitchQuote = -1;
}

// Witch. She asks the Doctor for a mushroom (once), swaps it for a medicinal
// herb (once) and from then on only talks. None of it depends on a case, on
// another conversation or on the order: if he already carries the mushroom
// when they first talk, the favour is settled in that same conversation.
function resolveWitch(
  facts: StoryFacts,
  language: Language,
  subjectId: string,
): StoryOutcome {
  const trade = NPC_TRADES[WITCH_HERB_TRADE_ID];
  const claimed = facts.claimedRewards ?? new Set<string>();
  const carriesMushroom = countItem(facts.inventory, "mushroom") >= 1;
  const met = claimed.has(WITCH_MET_ID);
  const smallTalk = (): StoryOutcome => {
    lastWitchQuote = pickWitchQuote(lastWitchQuote);

    return {
      conversation: localize(WITCH_QUOTES[lastWitchQuote], language, subjectId),
      effects: [],
    };
  };

  if (claimed.has(trade.rewardId)) {
    return smallTalk();
  }

  // The trade as it would happen right now (atomic: payment first, goods
  // after, so the freed slot counts). Empty effects = it does not fit.
  const swap = carriesMushroom
    ? resolveTrade(trade, facts, language, subjectId)
    : null;
  const fits = swap !== null && swap.effects.length > 0;

  if (!met) {
    const remember: StoryEffect = {
      type: "claim-reward",
      rewardId: WITCH_MET_ID,
    };

    if (!carriesMushroom) {
      return {
        conversation: localize(witchFirst, language, subjectId),
        effects: [remember],
      };
    }

    return fits
      ? {
          conversation: localize(witchFirstWithMushroom, language, subjectId),
          effects: [remember, ...swap.effects],
        }
      : {
          conversation: localize(
            witchFirstWithMushroomNoRoom,
            language,
            subjectId,
          ),
          effects: [remember],
        };
  }

  if (swap) {
    return swap;
  }

  // Still waiting for the mushroom: a short reminder once, then small talk.
  if (!claimed.has(WITCH_WAITED_ID)) {
    return {
      conversation: localize(witchWaiting, language, subjectId),
      effects: [{ type: "claim-reward", rewardId: WITCH_WAITED_ID }],
    };
  }

  return smallTalk();
}

// The man on the tavern floor: examined where he lies, then treated with both
// preparations.
function resolveTavernPatient(
  facts: StoryFacts,
  language: Language,
  subjectId: string,
): StoryOutcome {
  const definition = CHAPTER1_PATIENTS[TAVERN_PATIENT_ID];
  const status = getPatientStatus(facts.patients, TAVERN_PATIENT_ID);

  if (status === "hidden" || status === "discovered") {
    return {
      conversation: localize(tavernPatientExam, language, subjectId),
      effects: [],
      after: "examine-in-place",
      patientId: TAVERN_PATIENT_ID,
    };
  }

  if (
    status === "examined" &&
    isTreatable(facts.patients, definition, facts.inventory)
  ) {
    return {
      conversation: localize(tavernPatientCure, language, subjectId),
      effects: [{ type: "treat", patientId: TAVERN_PATIENT_ID }],
    };
  }

  if (status === "examined") {
    const lacking = lackingTreatments(TAVERN_PATIENT_ID, facts.inventory);
    const waiting =
      (lacking.length === 1
        ? (tavernPatientWaiting as Record<string, LocalizedConversation>)[
            lacking[0]
          ]
        : undefined) ?? tavernPatientWaiting.all;

    return {
      conversation: localize(waiting, language, subjectId),
      effects: [],
    };
  }

  return {
    conversation: localize(tavernPatientAfter, language, subjectId),
    effects: [],
  };
}

// A trade, all or nothing. Pure: it only DECIDES; GameWorld applies the
// effects together or not at all. The payment is taken BEFORE the goods are
// counted into the inventory, so the freed slots count, and a trade that does
// not fit changes nothing and is not marked as done.
export function resolveTrade(
  trade: NpcTrade,
  facts: StoryFacts,
  language: Language,
  subjectId: string,
): StoryOutcome | null {
  if (facts.claimedRewards?.has(trade.rewardId)) {
    return trade.done
      ? { conversation: localize(trade.done, language, subjectId), effects: [] }
      : {
          conversation: null,
          effects: [],
          notice: trade.doneNotice?.[language],
        };
  }

  if (
    trade.requiresPatient &&
    getPatientStatus(facts.patients, trade.requiresPatient.patientId) !==
      trade.requiresPatient.status
  ) {
    return null;
  }

  const lacking = trade.consumes
    .filter(
      ({ itemId, quantity }) => countItem(facts.inventory, itemId) < quantity,
    )
    .map(({ itemId }) => itemId);

  if (lacking.length > 0) {
    const missing = trade.missing;
    const conversation = missing
      ? ((lacking.length === 1 ? missing[lacking[0]] : undefined) ??
        missing.all)
      : null;

    return {
      conversation: conversation
        ? localize(conversation, language, subjectId)
        : null,
      effects: [],
    };
  }

  let after: InventoryState | null = facts.inventory;

  for (const { itemId, quantity } of trade.consumes) {
    after = after ? removeItem(after, itemId, quantity) : null;
  }

  for (const { itemId, quantity } of trade.grants) {
    after = after ? addItem(after, itemId, quantity) : null;
  }

  if (!after) {
    return {
      conversation: trade.noRoom
        ? localize(trade.noRoom, language, subjectId)
        : null,
      effects: [],
      notice: trade.noRoom
        ? undefined
        : itemFeedbackCopy[language].inventoryFull,
    };
  }

  return {
    conversation: trade.ready
      ? localize(trade.ready, language, subjectId)
      : null,
    effects: [
      ...trade.consumes.map(({ itemId, quantity }) => ({
        type: "take-item" as const,
        itemId,
        quantity,
      })),
      ...trade.grants.map(({ itemId, quantity }) => ({
        type: "give-item" as const,
        itemId,
        quantity,
      })),
      ...(trade.payCoins
        ? [{ type: "give-coins" as const, amount: trade.payCoins }]
        : []),
      { type: "claim-reward" as const, rewardId: trade.rewardId },
    ],
  };
}

// The farm woman. Until the sick man is examined she keeps her ambient talk
// (null). The FIRST conversation after that is an introduction, whatever the
// Doctor carries: she is a person presenting a deal, not a reading of the
// inventory. It is remembered with a claimed flag; from then on the trade
// answers by what is missing, ready or done.
function resolveFarmWoman(
  facts: StoryFacts,
  language: Language,
  subjectId: string,
): StoryOutcome | null {
  const trade = NPC_TRADES["chapter1.farm.woman"];
  const examined =
    getPatientStatus(facts.patients, TAVERN_PATIENT_ID) === "examined";
  const introduced = facts.claimedRewards?.has(FARM_WOMAN_INTRO_ID) ?? false;

  if (!examined || introduced || facts.claimedRewards?.has(trade.rewardId)) {
    return resolveTrade(trade, facts, language, subjectId);
  }

  return {
    conversation: localize(
      countItem(facts.inventory, "empty-jar") > 0
        ? farmWomanIntroWithJar
        : farmWomanIntro,
      language,
      subjectId,
    ),
    effects: [{ type: "claim-reward", rewardId: FARM_WOMAN_INTRO_ID }],
  };
}

export function resolveStoryInteraction(
  interactionId: string,
  facts: StoryFacts,
  language: Language,
  subjectId: string,
): StoryOutcome | null {
  const granary = resolveGranaryInteraction(interactionId, facts, language, subjectId);
  if (granary) return granary;
  const chapter2 = resolveChapter2StoryInteraction(interactionId, facts, language, subjectId);
  if (chapter2) return chapter2;
  // The tavern case.
  if (interactionId === "chapter1.tavern.bartender") {
    return resolveBartender(facts, language, subjectId);
  }

  if (interactionId === "chapter1.tavern.sickPatient") {
    return resolveTavernPatient(facts, language, subjectId);
  }

  // The injured miner and Witch (the tavern's guest).
  if (interactionId === "chapter1.mine.injuredMiner") {
    return resolveInjuredMiner(facts, language, subjectId);
  }

  if (interactionId === "chapter1.tavern.witch") {
    return resolveWitch(facts, language, subjectId);
  }

  // The farm woman presents the milk deal before she trades.
  if (interactionId === "chapter1.farm.woman") {
    return resolveFarmWoman(facts, language, subjectId);
  }

  // A character or shelf that hands something over (once).
  const trade = NPC_TRADES[interactionId];

  if (trade) {
    return resolveTrade(trade, facts, language, subjectId);
  }

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
        patientId: BAKER_HUSBAND_ID,
      };
    }

    if (
      status === "examined" &&
      isTreatable(facts.patients, definition, facts.inventory)
    ) {
      // The thank-you is part of the delivery: Salt x1, in the same moment,
      // as long as it fits once the treatments are handed over (they free
      // their slots). If it does not fit, the case is still treated and the
      // gift waits for the next visit (the "treated" branch below), so it is
      // never lost, never given twice and never blocks the treatment.
      const treated = treatPatient(facts.patients, definition, facts.inventory);
      const giftFits =
        treated !== null &&
        !facts.claimedRewards?.has(BAKER_SALT_REWARD_ID) &&
        canAddItem(treated.inventory, BAKER_SALT_REWARD.itemId);

      return giftFits
        ? {
            conversation: localize(
              bakerDeliveryWithReward,
              language,
              subjectId,
            ),
            effects: [
              { type: "treat", patientId },
              {
                type: "give-item",
                itemId: BAKER_SALT_REWARD.itemId,
                quantity: BAKER_SALT_REWARD.quantity,
              },
              { type: "claim-reward", rewardId: BAKER_SALT_REWARD_ID },
            ],
          }
        : {
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
    getPatientDefinitions(facts.claimedRewards),
    facts.inventory,
  );

  // A character who can give what is needed.
  const provides = NPC_PROVIDES[interactionId];
  const wanted = provides?.find((itemId) => missingOf(missing, itemId) > 0);

  if (wanted) {
    return {
      conversation: localize(merchantCloth, language, subjectId),
      // Two scraps at once: the case uses one and one is left over for
      // Day 2 (the compress needs cloth). It takes a single slot either way.
      effects: [{ type: "give-item", itemId: wanted, quantity: 2 }],
    };
  }

  // A source: gives one unit per use while it is needed and he has the tool.
  const decision = getGatherDecision(interactionId, facts);

  if (decision) {
    const copy = gatherCopy[language];

    if (decision === "gather") {
      const source = GATHER_SOURCES[interactionId];

      // The empty vessel is filled (used up) and gives what is still missing,
      // at most `quantity` units: one filling serves both treatments.
      return {
        conversation: null,
        effects: [
          { type: "take-item", itemId: source.requires, quantity: 1 },
          {
            type: "give-item",
            itemId: source.itemId,
            quantity: Math.min(
              source.quantity,
              missingOf(missing, source.itemId),
            ),
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
