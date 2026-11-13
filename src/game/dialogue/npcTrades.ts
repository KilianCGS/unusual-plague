import type { ItemNeed } from "../crafting/needs";
import type { Language } from "../i18n/types";
import {
  BARTENDER_ALCOHOL_REWARD_ID,
  BEEKEEPER_HONEY_REWARD_ID,
  FARM_MILK_REWARD_ID,
  INJURED_MINER_ID,
  MOUNTAIN_MINER_COAL_REWARD_ID,
  TAVERN_JAR_REWARD_ID,
  TAVERN_PATIENT_ID,
  WITCH_HERB_REWARD_ID,
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
import {
  bartenderAlcoholNoRoom,
  bartenderAlcoholReady,
  mountainMinerCoalDone,
  mountainMinerCoalNoRoom,
  mountainMinerCoalReady,
} from "./chapter1Patient3Dialogues";
import { witchTrade, witchTradeNoRoom } from "./chapter1WitchDialogues";
import {
  quarryMinerAsk,
  quarryMinerDone,
  quarryMinerReady,
} from "./chapter2QuarryDialogues";
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
  // Copper coins paid on top of (or instead of) the items: an errand.
  payCoins?: number;
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

// The keys of the trades that are NOT reached by interactionId (their character
// has story states of his own and asks for them): the bartender's jar and
// alcohol, and Witch's herb.
export const BARTENDER_JAR_TRADE_ID = "chapter1.tavern.bartender.jar";
export const BARTENDER_ALCOHOL_TRADE_ID = "chapter1.tavern.bartender.alcohol";
export const WITCH_HERB_TRADE_ID = "chapter1.witch.herb";
// The quarry miner's errand (a bone broth for five coins), done once.
export const QUARRY_BROTH_REWARD_ID = "chapter2.quarry.miner.broth";

export const NPC_TRADES: Record<string, NpcTrade> = {
  // The farm woman gives milk for ONE orange and a jar to put it in (a branch
  // gives three at once, so two oranges are left over for Day 2).
  "chapter1.farm.woman": {
    interactionId: "chapter1.farm.woman",
    rewardId: FARM_MILK_REWARD_ID,
    requiresPatient: { patientId: TAVERN_PATIENT_ID, status: "examined" },
    consumes: [
      { itemId: "orange", quantity: 1 },
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
  // The bartender gives alcohol for the injured miner's wound, free, once,
  // as soon as that case is examined (whatever the other cases are doing).
  [BARTENDER_ALCOHOL_TRADE_ID]: {
    interactionId: "chapter1.tavern.bartender",
    rewardId: BARTENDER_ALCOHOL_REWARD_ID,
    requiresPatient: { patientId: INJURED_MINER_ID, status: "examined" },
    consumes: [],
    grants: [{ itemId: "alcohol", quantity: 1 }],
    ready: bartenderAlcoholReady,
    noRoom: bartenderAlcoholNoRoom,
  },
  // The miner of the Mountain Path has a small piece of clean coal for the
  // injured one's ointment. He is not a quest giver: until the case is
  // examined he is only the ambient miner (resolver returns null).
  "chapter1.mountainPath.miner": {
    interactionId: "chapter1.mountainPath.miner",
    rewardId: MOUNTAIN_MINER_COAL_REWARD_ID,
    requiresPatient: { patientId: INJURED_MINER_ID, status: "examined" },
    consumes: [],
    grants: [{ itemId: "coal", quantity: 1 }],
    ready: mountainMinerCoalReady,
    noRoom: mountainMinerCoalNoRoom,
    done: mountainMinerCoalDone,
  },
  // Witch swaps a mushroom for a medicinal herb because she feels like it.
  // Not tied to any case, and only offered once she has asked (the resolver
  // decides when): she is not a shop.
  [WITCH_HERB_TRADE_ID]: {
    interactionId: "chapter1.tavern.witch",
    rewardId: WITCH_HERB_REWARD_ID,
    consumes: [{ itemId: "mushroom", quantity: 1 }],
    // The herb, and (2026-11-11) a black feather she gives without explaining: it
    // is for no recipe and matters on Day 4.
    grants: [
      { itemId: "medicinal-herb", quantity: 1 },
      { itemId: "black-feather", quantity: 1 },
    ],
    ready: witchTrade,
    noRoom: witchTradeNoRoom,
  },
  // QUARRY ERRAND: the miner on the bench wants a bone broth and pays five
  // coins. The first of the crafted-for-gold errands.
  "chapter2.quarry.miner": {
    interactionId: "chapter2.quarry.miner",
    rewardId: QUARRY_BROTH_REWARD_ID,
    consumes: [{ itemId: "bone-broth", quantity: 1 }],
    grants: [],
    payCoins: 8,
    ready: quarryMinerReady,
    done: quarryMinerDone,
    missing: { all: quarryMinerAsk },
  },
};
