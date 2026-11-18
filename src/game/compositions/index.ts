import { NEW_WORLD_SCENE_IDS } from "../new-world-map/worldVariant";
import { newWorldChapter1Compositions } from "../new-world-map/newWorldCompositions";
import type { DecorComposition, DecorInteraction } from "../decor/decorTypes";
import { getDecorAsset } from "../decor/decorAssets";
import { chapter1Compositions } from "./chapter-1";
import { chapter2Compositions } from "./chapter-2";
import { artifactsCompositions } from "./artifacts";
import { chapter3Compositions } from "./chapter-3";
import { chapter1Interactions } from "./chapter-1.interactions";
import { chapter2Interactions } from "./chapter-2.interactions";
import { chapter3Interactions } from "./chapter-3.interactions";
import { chapter4Interactions } from "./artifacts.interactions";
import { mergeSharedEnvironmentInstances } from "./shared-environment";
import { getDays1To3EnvironmentInstances } from "./days-1-3-environment";

// VERSIONED scene populations, one file per chapter, each produced by
// "COPY CHAPTER" in /dev/decorator. The runtime reads only these files; the
// Decorator's localStorage is authoring-only and the game never touches it.
//
// To add a chapter: save its export as chapter-N.ts here, import it and add it
// to the list below.

// WHAT DAY 2 KEEPS FROM DAY 1 (2026-11-16): Day 2's export has no merchant and no quarry camp, which
// left the Doctor without a shop (sugar and cloth are only sold there) and the camp empty. These Day 1
// placements (same positions, authored by Kilian) are carried over until he places Day 2's own.
// The quarry's stool stonecutter becomes the giver of the bone broth errand.
const CARRIED_TO_CHAPTER_2: Readonly<Record<string, readonly string[]>> = {
  plaza: [
    "plaza-villager-sitting-01",
    "plaza-merchant-cart-01",
    "plaza-merchant-table-01",
    "plaza-villager-woman-02-01",
    "plaza-merchant-humble-01",
  ],
  // (2026-11-16: Kilian's new camp: no woman any more; the campfire stays lit. The resting stonecutter, the
  // Day 1 coal giver, is not carried.)
  quarry: ["quarry-stonecutter-shovel-01", "quarry-stonecutter-stool-01", "quarry-campfire-01"],
};
const QUARRY_ERRAND_GIVER_INSTANCE_ID = "quarry-stonecutter-stool-01";
// WHAT DAY 3 DOES NOT INHERIT FROM DAY 2 (2026-11-18). Day 3 starts from Day 2's population and what Kilian places is
// added on top, but a placement cannot delete one, so the people who were patients on Day 2 and are cured by Day 3 are
// listed here: the injured blacksmith (Day 3 has his healthy one, placed by Kilian) and the sick farmer lying in the
// granary. (The tired woodcutter stays on his stump until Kilian places another pose of him.)
export const NOT_INHERITED_IN_CHAPTER_3: readonly string[] = [
  "smithy-interior-blacksmith-day2-hurt-hand-01",
  "granary-interior-farmer-hoeing-sick-lying-01",
];
// THE MARKET STREET (2026-11-16) is authored once, for Day 1, and stays the same on Days 2 and 3 (Day 3
// inherits Day 2): its population and its stall interactions are carried over. 2026-11-17 (Kilian): the
// STALLS are fixed every day for convenience when buying, but the people standing in front of them are
// NOT carried: each day he places his own there.
const MARKET_STREET_SCENE_ID = "market-street";
const MARKET_STREET_CUSTOMER_IDS: readonly string[] = ["market-street-villager-back-man-01", "market-street-villager-back-old-01"];
const marketStreetCarried = (instances: DecorComposition["instances"]) =>
  instances.filter((instance) => !MARKET_STREET_CUSTOMER_IDS.includes(instance.instanceId));
const carriedCompositions: DecorComposition[] = Object.entries(CARRIED_TO_CHAPTER_2).map(([sceneId, ids]) => ({
  sceneId,
  chapterId: "chapter-2",
  instances: newWorldChapter1Compositions
    .filter((composition) => composition.sceneId === sceneId)
    .flatMap((composition) => composition.instances)
    .filter((instance) => ids.includes(instance.instanceId)),
}));
const marketStreetDay1 = chapter1Compositions.find((composition) => composition.sceneId === MARKET_STREET_SCENE_ID);
if (marketStreetDay1) {
  carriedCompositions.push({ sceneId: MARKET_STREET_SCENE_ID, chapterId: "chapter-2", instances: marketStreetCarried(marketStreetDay1.instances) });
}
// The exterior scenes of the new world take their population from
// newWorldCompositions (authored in /dev/decorator on the new maps). The old
// placements of those scenes stay in chapter-1.ts as legacy, unused; its
// interiors are still the ones in use.
const ALL_COMPOSITIONS: DecorComposition[] = [
  ...chapter1Compositions.filter(
    (composition) =>
      !(NEW_WORLD_SCENE_IDS as readonly string[]).includes(composition.sceneId),
  ),
  ...newWorldChapter1Compositions,
  // Day 2 has no legacy placements to exclude: its export is read as it is.
  ...chapter2Compositions,
  ...carriedCompositions,
  ...chapter3Compositions,
  // Day 4 (the night) is authored in the Decorator as the chapter "artifacts" and read as
  // "chapter-4": the people absorbed in their artifacts.
  ...artifactsCompositions.map((composition) => ({ ...composition, chapterId: "chapter-4" })),
];

// A scene + chapter can be listed more than once; their instances are merged.
const BY_SCENE_AND_CHAPTER = new Map<string, DecorComposition>();

for (const composition of ALL_COMPOSITIONS) {
  const key = `${composition.sceneId}::${composition.chapterId}`;
  const existing = BY_SCENE_AND_CHAPTER.get(key);

  BY_SCENE_AND_CHAPTER.set(
    key,
    existing
      ? {
          ...existing,
          instances: [...existing.instances, ...composition.instances],
        }
      : composition,
  );
}

// The population of one scene in one chapter, or undefined when that scene has
// none in that chapter (the scene is then simply empty of decor instances).
export function getComposition(
  sceneId: string,
  chapterId: string,
): DecorComposition | undefined {
  const composition = BY_SCENE_AND_CHAPTER.get(`${sceneId}::${chapterId}`);
  // Day 3 INHERITS the population of Day 2: what is placed for Day 3 is added on top
  // (the same instance id placed again in Day 3 replaces the Day 2 one).
  const inherited =
    chapterId === "chapter-3"
      ? (BY_SCENE_AND_CHAPTER.get(`${sceneId}::chapter-2`)?.instances ?? []).filter(
          (instance) => !NOT_INHERITED_IN_CHAPTER_3.includes(instance.instanceId),
        )
      : [];
  // What the Doctor did not pick up on an earlier day stays where it was (Kilian, 2026-11-15):
  // the collectibles of Day 1 are kept in Days 2 and 3. A picked one is hidden by the collected
  // set (ids last the whole game), so this only brings back what is still on the ground.
  const leftover =
    chapterId === "chapter-2" || chapterId === "chapter-3"
      ? (BY_SCENE_AND_CHAPTER.get(`${sceneId}::chapter-1`)?.instances ?? []).filter(
          (i) => !!getDecorAsset(i.assetId)?.collectibleItemId,
        )
      : [];
  const ownIds = new Set((composition?.instances ?? []).map((i) => i.instanceId));
  const knownIds = new Set([...ownIds, ...inherited.map((i) => i.instanceId)]);
  // The ambient life that is the same on Days 1 to 3 (and not on Day 4): fish shadows, butterflies, bats.
  const ambientLife = getDays1To3EnvironmentInstances(sceneId, chapterId).filter((i) => !ownIds.has(i.instanceId));
  const instances = mergeSharedEnvironmentInstances(sceneId, [
    ...leftover.filter((i) => !knownIds.has(i.instanceId)),
    ...inherited.filter((i) => !ownIds.has(i.instanceId)),
    ...ambientLife,
    ...(composition?.instances ?? []),
  ]);
  if (!composition && instances.length === 0) return undefined;
  return { ...composition, sceneId, chapterId, instances };
}

// Which instances can be interacted with in a chapter, keyed by instanceId.
// Kept apart from the composition so COPY CHAPTER never overwrites it.
const INTERACTIONS_BY_CHAPTER: Record<
  string,
  Record<string, DecorInteraction>
> = {
  "chapter-1": chapter1Interactions,
  "chapter-2": carriedAndChapter2Interactions(),
  // Day 3 inherits Day 2's interactions; its own (the new people) win on a clash.
  "chapter-3": chapter3AllInteractions(),
  // Day 4 (2026-11-17): derived from what is placed in the Decorator chapter "artifacts" (see artifacts.interactions.ts).
  "chapter-4": chapter4Interactions,
};

const NO_INTERACTIONS: Record<string, DecorInteraction> = {};

export function getChapterInteractions(
  chapterId: string,
): Record<string, DecorInteraction> {
  return INTERACTIONS_BY_CHAPTER[chapterId] ?? NO_INTERACTIONS;
}

// Day 3 (2026-11-16, Kilian): the stonecutter on the quarry bench is the same man, now with the fracture case
// (Day 2 he asks for the bone broth). Its zone is kept; only WHAT he says changes. The rest of Day 3's people
// (the woman with the duster, the path miner, the Witch of the glade) wait for Kilian's placements.
function chapter3AllInteractions(): Record<string, DecorInteraction> {
  const inherited = { ...carriedAndChapter2Interactions(), ...chapter3Interactions };
  for (const id of NOT_INHERITED_IN_CHAPTER_3) delete inherited[id];
  const bench = inherited[QUARRY_ERRAND_GIVER_INSTANCE_ID];
  if (bench) inherited[QUARRY_ERRAND_GIVER_INSTANCE_ID] = { ...bench, interactionId: "chapter3.quarry.stonecutter" };
  // 2026-11-18: the old man with the jug has the insomnia case on Day 3 (his Day 2 errand was the onion syrup).
  const elder = inherited["tavern-street-elderly-man-with-jug-01"];
  if (elder) inherited["tavern-street-elderly-man-with-jug-01"] = { ...elder, interactionId: "chapter3.tavernStreet.elder" };
  return inherited;
}

// Day 2's interactions plus those of the carried-over Day 1 placements (their Day 1 zones; the stool
// stonecutter asks for the bone broth instead of chatting).
function carriedAndChapter2Interactions(): Record<string, DecorInteraction> {
  const carried: Record<string, DecorInteraction> = {};
  for (const ids of Object.values(CARRIED_TO_CHAPTER_2)) {
    for (const id of ids) {
      if (chapter1Interactions[id]) carried[id] = chapter1Interactions[id];
    }
  }
  for (const instance of marketStreetCarried(marketStreetDay1?.instances ?? [])) {
    if (chapter1Interactions[instance.instanceId]) carried[instance.instanceId] = chapter1Interactions[instance.instanceId];
  }
  if (carried[QUARRY_ERRAND_GIVER_INSTANCE_ID]) {
    carried[QUARRY_ERRAND_GIVER_INSTANCE_ID] = { ...carried[QUARRY_ERRAND_GIVER_INSTANCE_ID], interactionId: "chapter2.quarry.miner" };
  }
  return { ...carried, ...chapter2Interactions };
}
