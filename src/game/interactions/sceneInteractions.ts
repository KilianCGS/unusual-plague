import { plazaInteractions } from "../plaza/plazaInteractions";
import type { InteractionZone } from "./interactionZone";

// Interaction zones per scene, keyed by the same scene ids as DEV_SCENES /
// WORLD_SCENES. Painted in /dev/collisions and persisted to a per-scene file,
// like the rest of the geometry, but kept apart from it: they are triggers,
// not colliders.
const SCENE_INTERACTIONS: Record<string, InteractionZone[]> = {
  plaza: plazaInteractions,
};

const NO_INTERACTIONS: InteractionZone[] = [];

export function getSceneInteractionZones(sceneId: string): InteractionZone[] {
  return SCENE_INTERACTIONS[sceneId] ?? NO_INTERACTIONS;
}
