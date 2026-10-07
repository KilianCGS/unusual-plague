import type { DecorComposition, DecorInteraction } from "../decor/decorTypes";
import { chapter1Compositions } from "./chapter-1";
import { chapter1Interactions } from "./chapter-1.interactions";

// VERSIONED scene populations, one file per chapter, each produced by
// "COPY CHAPTER" in /dev/decorator. The runtime reads only these files; the
// Decorator's localStorage is authoring-only and the game never touches it.
//
// To add a chapter: save its export as chapter-N.ts here, import it and add it
// to the list below.
const ALL_COMPOSITIONS: DecorComposition[] = [...chapter1Compositions];

const BY_SCENE_AND_CHAPTER = new Map(
  ALL_COMPOSITIONS.map((composition) => [
    `${composition.sceneId}::${composition.chapterId}`,
    composition,
  ]),
);

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
