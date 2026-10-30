import { newWorldOutskirtsInteractions } from "../new-world-map/newWorldInteractions";
import { apothecaryMainZoneInteractions } from "../apothecary/apothecaryMainZoneGeometry";
import { doctorRoomStorageInteractions } from "../storage/storage";
import type { InteractionZone } from "./interactionZone";

// Interaction zones painted per scene in /dev/collisions (keyed by the same
// scene ids as DEV_SCENES / WORLD_SCENES), kept apart from the colliders.
// The Apothecary has the crafting table and the stove; the Doctor's Room has
// the storage chest. Chapter 1's interactions come from its decor instances
// (src/game/compositions/chapter-1.interactions.ts).
const SCENE_INTERACTIONS: Record<string, InteractionZone[]> = {
  "apothecary-interior": apothecaryMainZoneInteractions,
  // The same zones under the name of the authoring scene, so /dev/collisions
  // opens them (it is the Botica in play, not a second one).
  "apothecary-main-zone": apothecaryMainZoneInteractions,
  // The Doctor's Storage: the chest in his room.
  "doctor-room": doctorRoomStorageInteractions,
  // The river bank, as adapted to the new world.
  outskirts: newWorldOutskirtsInteractions,
};

const NO_INTERACTIONS: InteractionZone[] = [];

export function getSceneInteractionZones(sceneId: string): InteractionZone[] {
  return SCENE_INTERACTIONS[sceneId] ?? NO_INTERACTIONS;
}
