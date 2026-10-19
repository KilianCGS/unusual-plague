import { apothecaryInteriorInteractions } from "../apothecary/apothecaryInteriorGeometry";
import { outskirtsInteractions } from "../outskirts/outskirtsInteractions";
import { apothecaryStorageInteractions } from "../storage/storage";
import type { InteractionZone } from "./interactionZone";

// Interaction zones painted per scene in /dev/collisions (keyed by the same
// scene ids as DEV_SCENES / WORLD_SCENES), kept apart from the colliders.
// The Apothecary has the crafting table and the stove. Chapter 1's interactions come from its decor instances
// (src/game/compositions/chapter-1.interactions.ts).
const SCENE_INTERACTIONS: Record<string, InteractionZone[]> = {
  "apothecary-interior": [
    ...apothecaryInteriorInteractions,
    ...apothecaryStorageInteractions,
  ],
  outskirts: outskirtsInteractions,
};

const NO_INTERACTIONS: InteractionZone[] = [];

export function getSceneInteractionZones(sceneId: string): InteractionZone[] {
  return SCENE_INTERACTIONS[sceneId] ?? NO_INTERACTIONS;
}
