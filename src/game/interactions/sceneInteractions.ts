import type { InteractionZone } from "./interactionZone";

// Interaction zones painted per scene in /dev/collisions (keyed by the same
// scene ids as DEV_SCENES / WORLD_SCENES), kept apart from the colliders.
// Empty for now: Chapter 1's interactions come from its decor instances
// (src/game/compositions/chapter-1.interactions.ts).
const SCENE_INTERACTIONS: Record<string, InteractionZone[]> = {};

const NO_INTERACTIONS: InteractionZone[] = [];

export function getSceneInteractionZones(sceneId: string): InteractionZone[] {
  return SCENE_INTERACTIONS[sceneId] ?? NO_INTERACTIONS;
}
