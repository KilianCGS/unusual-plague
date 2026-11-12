import type { SceneId } from "./worldScenes";

// Interiors: running is off here. Pressing Space only makes the Doctor say why.
// The Botica (a hand-built interior scene) is also slower than the street.
export const NO_RUN_SCENES: readonly SceneId[] = [
  "apothecary-interior",
  "doctor-room",
  "bakery-interior",
  "bakers-bedroom",
  "tavern-interior",
  "smithy-interior",
  "mine-interior",
  "mine-natural-cave",
  "forest-cottage-interior",
  "granary-interior",
];

export function isRunAllowed(sceneId: SceneId): boolean {
  return !NO_RUN_SCENES.includes(sceneId);
}

// The Botica walks at 70% of the street speed (30% slower).
export const INDOOR_SPEED_FACTOR = 0.7;
