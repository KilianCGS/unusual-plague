import type { ItemNeed } from "../crafting/needs";
import type { Language } from "../i18n/types";
import {
  BEEKEEPER_HONEY_REWARD_ID,
  FARM_MILK_REWARD_ID,
  TAVERN_JAR_REWARD_ID,
  TAVERN_PATIENT_ID,
} from "../patients/chapter1Patients";
import type { PatientStatus } from "../patients/patientCases";
import {
  bartenderJarNoRoom,
  bartenderJarReady,
  beekeeperDone,
  beekeeperNoRoom,
  beekeeperReady,
  farmWomanDone,
  farmWomanMissing,
  farmWomanNoRoom,
  farmWomanReady,
} from "./chapter1TavernDialogues";
import type { LocalizedConversation } from "./localizedConversation";

// NPC TRADES: "consume X, receive Y", once. One small data shape for what a
// character (or a shelf) hands over, with or without taking something in
// exchange. The resolver (storyInteractions.ts) turns a trade into the generic
// story effects take-item / give-item / claim-reward, which GameWorld applies
// ALL OR NOTHING, so a trade can never take the payment without giving the
// goods, nor give them twice.
export type NpcTrade = {
  // The interaction that triggers it.
  interactionId: string;
  // The claimed-reward flag that marks it as done (session only). A done trade
  // never repeats.
  rewardId: string;
  // The trade is only on offer while this case has this status.
  requiresPatient?: { patientId: string; status: PatientStatus };
  // What the Doctor hands over (may be nothing) and what he receives.
  consumes: ItemNeed[];
  grants: ItemNeed[];
  // Conversations; a trade without them (a shelf) answers with a notice.
  ready?: LocalizedConversation;
  noRoom?: LocalizedConversation;
  done?: LocalizedConversation;
  // When something is lacking: by the single missing item, or `all` otherwise.
  missing?: Record<string, LocalizedConversation> & {
    all: LocalizedConversation;
  };
  doneNotice?: Record<Language, string>;
};

// The key of the bartender's jar in NPC_TRADES.
export const BARTENDER_JAR_TRADE_ID = "chapter1.tavern.bartender.jar";

export const NPC_TRADES: Record<string, NpcTrade> = {
  // The farm woman gives milk for three oranges and a jar to put it in.
  "chapter1.farm.woman": {
    interactionId: "chapter1.farm.woman",
    rewardId: FARM_MILK_REWARD_ID,
    requiresPatient: { patientId: TAVERN_PATIENT_ID, status: "examined" },
    consumes: [
      { itemId: "orange", quantity: 3 },
      { itemId: "empty-jar", quantity: 1 },
    ],
    grants: [{ itemId: "milk", quantity: 1 }],
    ready: farmWomanReady,
    noRoom: farmWomanNoRoom,
    done: farmWomanDone,
    missing: farmWomanMissing,
  },
  // The beekeeper gives honey for nothing, once, while the sick man needs it.
  "chapter1.mill.beekeeper": {
    interactionId: "chapter1.mill.beekeeper",
    rewardId: BEEKEEPER_HONEY_REWARD_ID,
    requiresPatient: { patientId: TAVERN_PATIENT_ID, status: "examined" },
    consumes: [],
    grants: [{ itemId: "honey", quantity: 1 }],
    ready: beekeeperReady,
    noRoom: beekeeperNoRoom,
    done: beekeeperDone,
  },
  // The bartender hands over the jar for the milk, free, once, after the sick
  // man was examined. It is not reached through NPC_TRADES by interactionId
  // (the bartender has his own story states): resolveBartender asks for it.
  [BARTENDER_JAR_TRADE_ID]: {
    interactionId: "chapter1.tavern.bartender",
    rewardId: TAVERN_JAR_REWARD_ID,
    requiresPatient: { patientId: TAVERN_PATIENT_ID, status: "examined" },
    consumes: [],
    grants: [{ itemId: "empty-jar", quantity: 1 }],
    ready: bartenderJarReady,
    noRoom: bartenderJarNoRoom,
  },
};
