import {
  NEW_WORLD_MAP,
  NEW_WORLD_SCENE_IDS,
} from "../new-world-map/worldVariant";
import { newWorldChapter1Compositions } from "../new-world-map/newWorldCompositions";
import type { DecorComposition, DecorInteraction } from "../decor/decorTypes";
import { chapter1Compositions } from "./chapter-1";
import { chapter1Interactions } from "./chapter-1.interactions";

// VERSIONED scene populations, one file per chapter, each produced by
// "COPY CHAPTER" in /dev/decorator. The runtime reads only these files; the
// Decorator's localStorage is authoring-only and the game never touches it.
//
// To add a chapter: save its export as chapter-N.ts here, import it and add it
// to the list below.
// In the new world the scenes it redraws start from ITS compositions (empty
// until they are authored in /dev/decorator): the old placements were made for
// the old maps. They stay in chapter-1.ts, untouched.
const ALL_COMPOSITIONS: DecorComposition[] = NEW_WORLD_MAP
  ? [
      ...chapter1Compositions.filter(
        (composition) =>
          !(NEW_WORLD_SCENE_IDS as readonly string[]).includes(
            composition.sceneId,
          ),
      ),
      ...newWorldChapter1Compositions,
    ]
  : [...chapter1Compositions];

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
  return BY_SCENE_AND_CHAPTER.get(`${sceneId}::${chapterId}`);
}

// Which instances can be interacted with in a chapter, keyed by instanceId.
// Kept apart from the composition so COPY CHAPTER never overwrites it.
const INTERACTIONS_BY_CHAPTER: Record<
  string,
  Record<string, DecorInteraction>
> = {
  "chapter-1": chapter1Interactions,
};

const NO_INTERACTIONS: Record<string, DecorInteraction> = {};

export function getChapterInteractions(
  chapterId: string,
): Record<string, DecorInteraction> {
  return INTERACTIONS_BY_CHAPTER[chapterId] ?? NO_INTERACTIONS;
}
