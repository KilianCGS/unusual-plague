import type { SceneNpc } from "./sceneNpc";

// Keyed by the same scene ids as DEV_SCENES / WORLD_SCENES, so the runtime and
// /dev/scene read the very same definitions.
// Empty on purpose: the people of each scene now come from the Chapter
// compositions (src/game/compositions). This hook stays for scene NPCs that are
// not part of a composition.
const SCENE_NPCS: Record<string, SceneNpc[]> = {};

const NO_NPCS: SceneNpc[] = [];

export function getSceneNpcs(sceneId: string): SceneNpc[] {
  return SCENE_NPCS[sceneId] ?? NO_NPCS;
}
