import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// The inside of the house in the Casita del bosque (the future witch's home).
// Deliberately EMPTY: its background is not made yet, and its geometry is to be
// painted by hand in /dev/collisions and saved over this file (same export
// names it writes). Nothing connects to this scene yet: the outside door and
// its spawn are also to be placed by hand in forest-cottage.

// COLLIDERS (red): floor the feet cannot occupy.
export const forestCottageInteriorColliders: SceneCollider[] = [];

// TRANSITIONS (yellow): activation zones.
export const forestCottageInteriorTransitions: (LogicalRect & {
  id: string;
})[] = [];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const forestCottageInteriorSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [];
