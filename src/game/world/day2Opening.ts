import { getComposition } from "../compositions";
import type { DecorInstance } from "../decor/decorTypes";
import type { SpawnPoint } from "./worldScenes";

// THE OPENING ENCOUNTER OF DAY 2 (pure rules; GameWorld wires them).
//
// The Doctor leaves the Botica into apothecary-street and a farm woman that
// already exists waits for him there. When the arrival transition is over the
// conversation starts by itself; when it closes, a short fade lets her go and
// the Doctor stays where he is. It happens once per game (session) and the
// woman stays gone afterwards. Nothing here depends on Day 1 and nothing is
// shown to the player until BOTH pieces of data below exist.

// What the encounter remembers (narrative flags, like the rest of the story
// state, NOT the set of collected objects): that it took place, and that she
// left. Her absence is derived from the second one.
export const MESSENGER_MET_ID = "chapter2.messenger.met";
export const MESSENGER_LEFT_ID = "chapter2.messenger.left";
export const MESSENGER_CAPTION_ID = "chapter2.messenger.captionShown";

export function shouldShowMessengerCaption(
  chapterId: string,
  arrival: Arrival,
  claimedRewards: ReadonlySet<string>,
): boolean {
  return (
    shouldStartMessengerEncounter({
      chapterId,
      arrival,
      claimedRewards,
      ready: findMessengerInstance(
        getComposition(MESSENGER_SCENE_ID, chapterId)?.instances,
      ) !== null,
    }) &&
    !claimedRewards.has(MESSENGER_LEFT_ID) &&
    !claimedRewards.has(MESSENGER_CAPTION_ID)
  );
}

// Where it happens: the arrival that follows the Botica's street door.
export const MESSENGER_CHAPTER_ID = "chapter-2";
export const MESSENGER_SCENE_ID = "apothecary-street";
export const MESSENGER_ARRIVAL_NAME = "from-apothecary-interior";

// The existing character reused for her (approved): villager-woman-01.
export const MESSENGER_ASSET_ID = "villager-woman-01";

// Approved Decorator placement (327, 438), scale 1, collider enabled.
export const MESSENGER_INSTANCE_ID: string | null =
  "apothecary-street-villager-woman-01-01";

// Encounter-only arrival pose: preserve the authored arrival X, align the
// Doctor's feet with the approved messenger placement and face her to the west.
// The controller reads this on mount; her later departure cannot move him.
export function getMessengerArrivalSpawn(
  chapterId: string,
  arrival: Arrival,
  spawn: SpawnPoint,
  claimedRewards: ReadonlySet<string>,
): SpawnPoint {
  if (
    chapterId !== MESSENGER_CHAPTER_ID ||
    arrival.sceneId !== MESSENGER_SCENE_ID ||
    arrival.spawnName !== MESSENGER_ARRIVAL_NAME ||
    claimedRewards.has(MESSENGER_MET_ID) ||
    claimedRewards.has(MESSENGER_LEFT_ID)
  )
    return spawn;

  const woman = findMessengerInstance(
    getComposition(MESSENGER_SCENE_ID, chapterId)?.instances,
  );
  return woman ? { ...spawn, y: woman.y, direction: "west" } : spawn;
}

// Opening dialogue approved by Kilian on 2026-11-08.
export const MESSENGER_DIALOGUE_APPROVED = true;

type EncounterData = {
  instanceId: string | null;
  dialogueApproved: boolean;
};

const REAL_DATA: EncounterData = {
  instanceId: MESSENGER_INSTANCE_ID,
  dialogueApproved: MESSENGER_DIALOGUE_APPROVED,
};

// The placed woman of that chapter's composition, or null.
export function findMessengerInstance(
  instances: readonly DecorInstance[] | undefined,
  instanceId: string | null = MESSENGER_INSTANCE_ID,
): DecorInstance | null {
  if (instanceId === null) {
    return null;
  }

  return (
    instances?.find(
      (instance) =>
        instance.instanceId === instanceId &&
        instance.assetId === MESSENGER_ASSET_ID,
    ) ?? null
  );
}

// Whether the encounter can exist at all: there is a valid speaker (her placed
// instance in the composition of this chapter) and the text is approved.
export function isMessengerEncounterReady(
  chapterId: string,
  data: EncounterData = REAL_DATA,
  instances: readonly DecorInstance[] | undefined = getComposition(
    MESSENGER_SCENE_ID,
    chapterId,
  )?.instances,
): boolean {
  return (
    chapterId === MESSENGER_CHAPTER_ID &&
    data.dialogueApproved &&
    findMessengerInstance(instances, data.instanceId) !== null
  );
}

// The arrival the world just completed (set by GameWorld when a transition
// lands, consumed once control returns): the encounter belongs to THAT arrival,
// not to later moments in the same scene.
export type Arrival = { sceneId: string; spawnName: string };

export function shouldStartMessengerEncounter(context: {
  chapterId: string;
  arrival: Arrival | null;
  claimedRewards: ReadonlySet<string>;
  ready: boolean;
}): boolean {
  return (
    context.ready &&
    context.chapterId === MESSENGER_CHAPTER_ID &&
    context.arrival?.sceneId === MESSENGER_SCENE_ID &&
    context.arrival.spawnName === MESSENGER_ARRIVAL_NAME &&
    !context.claimedRewards.has(MESSENGER_MET_ID)
  );
}

// The instances the story keeps out of the world right now. Derived from the
// narrative flags: once she left, her instance (and only it) is not drawn,
// blocks nothing and cannot be talked to, in any later visit.
const NO_HIDDEN: ReadonlySet<string> = new Set();

export function getNarrativeHiddenInstanceIds(
  claimedRewards: ReadonlySet<string>,
  instanceId: string | null = MESSENGER_INSTANCE_ID,
): ReadonlySet<string> {
  return instanceId !== null && claimedRewards.has(MESSENGER_LEFT_ID)
    ? new Set([instanceId])
    : NO_HIDDEN;
}
