import { getComposition } from "../compositions";
import { getDecorAsset } from "../decor/decorAssets";
import { createChapter1Inventory } from "../inventory/initialInventory";
import { addItem, type InventoryState } from "../inventory/inventory";
import {
  BARTENDER_ALCOHOL_REWARD_ID,
  BAKER_SALT_REWARD_ID,
  BEEKEEPER_HONEY_REWARD_ID,
  CHAPTER1_PATIENTS,
  FARM_MILK_REWARD_ID,
  FARM_WOMAN_INTRO_ID,
  MOUNTAIN_MINER_COAL_REWARD_ID,
  TAVERN_JAR_REWARD_ID,
  WITCH_HERB_REWARD_ID,
  WITCH_MET_ID,
  WITCH_WAITED_ID,
} from "../patients/chapter1Patients";
import type { PatientCasesState } from "../patients/patientCases";
import { DAY1_COMPLETED_ID } from "../patients/day1";
import { createEmptyStorage } from "../storage/storage";
import type { TutorialStep } from "../tutorial/tutorialFlow";
import { WORLD_SCENES } from "./worldScenes";
import { CHAPTER2_PATIENTS } from "../patients/chapter2Patients";
import { FARMER_SAMPLE_ID, FARMER_ANALYSIS_ID, FARMER_RECIPE_IDS } from "../patients/farmerInvestigation";
import { MESSENGER_MET_ID, MESSENGER_LEFT_ID } from "./day2Opening";

// A DEVELOPMENT start: the state GameWorld begins with when it is handed one
// (see /dev/day2). The real game never passes it, so a normal game starts as
// always. Everything below is TEST DATA that reproduces what a finished Day 1
// leaves behind; none of it is a decision about how the real chapter begins.
export type GameDevStart = {
  chapterId: string;
  patients: PatientCasesState;
  claimedRewards: ReadonlySet<string>;
  knownRecipeIds: ReadonlySet<string>;
  inventory: InventoryState;
  storage: InventoryState;
  collected: ReadonlySet<string>;
  tutorialStep: TutorialStep;
};

// The resources Day 1's treatments consume: taken, so their instances are in
// the collected set exactly as after a real Day 1 (this is what makes an
// instance id shared with Day 2 visible during tests).
const DAY1_CONSUMED_ITEM_IDS = ["medicinal-herb", "mushroom", "orange"];

function getDay1CollectedInstanceIds(): ReadonlySet<string> {
  const ids = new Set<string>();

  for (const sceneId of Object.keys(WORLD_SCENES)) {
    for (const instance of getComposition(sceneId, "chapter-1")?.instances ??
      []) {
      const itemId = getDecorAsset(instance.assetId)?.collectibleItemId;

      if (itemId && DAY1_CONSUMED_ITEM_IDS.includes(itemId)) {
        ids.add(instance.instanceId);
      }
    }
  }

  return ids;
}

function day2StartInventory() {
  let inventory = createChapter1Inventory();
  for (const [itemId, quantity] of [["empty-flask", 1], ["orange", 2], ["cloth", 1], ["medicinal-herb", 2]] as const) {
    inventory = addItem(inventory, itemId, quantity) ?? inventory;
  }
  return inventory;
}

// TEST DATA: Day 1 completed. All three cases treated, every one-time exchange
// of Day 1 received, every recipe shown, the closing already played. The
// Doctor carries his empty flask (TEST FIXTURE) and the chest is empty.
export function createDay2DevStart(): GameDevStart {
  const patients: PatientCasesState = Object.fromEntries(
    Object.keys(CHAPTER1_PATIENTS).map((patientId) => [patientId, "treated"]),
  );

  return {
    chapterId: "chapter-2",
    patients,
    claimedRewards: new Set([
      DAY1_COMPLETED_ID,
      BAKER_SALT_REWARD_ID,
      TAVERN_JAR_REWARD_ID,
      FARM_MILK_REWARD_ID,
      FARM_WOMAN_INTRO_ID,
      BEEKEEPER_HONEY_REWARD_ID,
      BARTENDER_ALCOHOL_REWARD_ID,
      MOUNTAIN_MINER_COAL_REWARD_ID,
      WITCH_MET_ID,
      WITCH_WAITED_ID,
      WITCH_HERB_REWARD_ID,
    ]),
    knownRecipeIds: new Set(
      Object.values(CHAPTER1_PATIENTS).flatMap(
        (definition) => definition.revealsRecipeIds,
      ),
    ),
    // TEST FIXTURE: the empty flask plus what Day 1 leaves over by design
    // (two oranges, one scrap of cloth) plus two medicinal herbs, standing in for
    // the forest pickups until they are placed.
    inventory: day2StartInventory(),
    storage: createEmptyStorage(),
    collected: getDay1CollectedInstanceIds(),
    // The tutorial of the first morning is over.
    tutorialStep: "done",
  };
}

// TEST DATA: jump to the last conversation already closed, not a real save.
export function createDay2ClosingDevStart(): GameDevStart {
  const start = createDay2DevStart();
  return {
    ...start,
    patients: { ...start.patients, ...Object.fromEntries(Object.keys(CHAPTER2_PATIENTS).map(id => [id, "treated" as const])) },
    claimedRewards: new Set([...start.claimedRewards, FARMER_SAMPLE_ID, FARMER_ANALYSIS_ID,
      MESSENGER_MET_ID, MESSENGER_LEFT_ID, "chapter2.witch.leech"]),
    knownRecipeIds: new Set([...start.knownRecipeIds, ...FARMER_RECIPE_IDS,
      ...Object.values(CHAPTER2_PATIENTS).flatMap(definition => definition.revealsRecipeIds)]),
  };
}
