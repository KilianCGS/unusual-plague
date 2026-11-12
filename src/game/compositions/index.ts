import { NEW_WORLD_SCENE_IDS } from "../new-world-map/worldVariant";
import { newWorldChapter1Compositions } from "../new-world-map/newWorldCompositions";
import type { DecorComposition, DecorInteraction } from "../decor/decorTypes";
import { chapter1Compositions } from "./chapter-1";
import { chapter2Compositions } from "./chapter-2";
import { chapter3Compositions } from "./chapter-3";
import { chapter1Interactions } from "./chapter-1.interactions";
import { chapter2Interactions } from "./chapter-2.interactions";
import { chapter3Interactions } from "./chapter-3.interactions";
import { mergeSharedEnvironmentInstances } from "./shared-environment";

// VERSIONED scene populations, one file per chapter, each produced by
// "COPY CHAPTER" in /dev/decorator. The runtime reads only these files; the
// Decorator's localStorage is authoring-only and the game never touches it.
//
// To add a chapter: save its export as chapter-N.ts here, import it and add it
// to the list below.
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
  ...chapter3Compositions,
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
      ? BY_SCENE_AND_CHAPTER.get(`${sceneId}::chapter-2`)?.instances ?? []
      : [];
  const ownIds = new Set((composition?.instances ?? []).map((i) => i.instanceId));
  const instances = mergeSharedEnvironmentInstances(sceneId, [
    ...inherited.filter((i) => !ownIds.has(i.instanceId)),
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
  "chapter-2": chapter2Interactions,
  // Day 3 inherits Day 2's interactions; its own (the new people) win on a clash.
  "chapter-3": { ...chapter2Interactions, ...chapter3Interactions },
};

const NO_INTERACTIONS: Record<string, DecorInteraction> = {};

export function getChapterInteractions(
  chapterId: string,
): Record<string, DecorInteraction> {
  return INTERACTIONS_BY_CHAPTER[chapterId] ?? NO_INTERACTIONS;
}
