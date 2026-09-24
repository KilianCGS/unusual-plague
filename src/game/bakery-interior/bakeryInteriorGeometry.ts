import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const bakeryInteriorColliders: SceneCollider[] = [
  { id: "bakery-interior-1", x: 244, y: 3, width: 144, height: 144 },
  { id: "bakery-interior-2", x: 0, y: 0, width: 242, height: 88 },
  { id: "bakery-interior-3", x: 106, y: 81, width: 39, height: 26 },
  { id: "bakery-interior-4", x: 87, y: 133, width: 78, height: 54 },
  { id: "bakery-interior-5", x: 10, y: 187, width: 155, height: 43 },
  { id: "bakery-interior-6", x: 6, y: 114, width: 52, height: 72 },
  { id: "bakery-interior-7", x: 3, y: 82, width: 104, height: 23 },
  { id: "bakery-interior-8", x: 10, y: 102, width: 47, height: 13 },
  { id: "bakery-interior-9", x: 229, y: 194, width: 145, height: 47 },
  { id: "bakery-interior-10", x: 343, y: 145, width: 30, height: 47 },
  { id: "bakery-interior-11", x: 0, y: 230, width: 165, height: 12 },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const bakeryInteriorTransitions: (LogicalRect & { id: string })[] = [
  { id: "bakery-interior-transition-1", x: 166, y: 216, width: 61, height: 25 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const bakeryInteriorSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "bakery-interior-spawn-1", x: 200, y: 178, direction: "south" },
];
