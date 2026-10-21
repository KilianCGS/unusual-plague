import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// Authored against the approved 1536x1024 background (576x384 logical units,
// 0.375 unit per asset pixel). Rectangles follow the visible architecture and
// large furniture; practical gameplay collision, not pixel-perfect.

// COLLIDERS (red): floor the feet cannot occupy.
export const bakeryInteriorColliders: SceneCollider[] = [
  { id: "bakery-interior-1", x: 0, y: 0, width: 576, height: 120 },
  { id: "bakery-interior-2", x: 39, y: 120, width: 113, height: 17 },
  { id: "bakery-interior-3", x: 41, y: 136, width: 36, height: 24 },
  { id: "bakery-interior-4", x: 221, y: 120, width: 51, height: 14 },
  { id: "bakery-interior-5", x: 262, y: 120, width: 113, height: 15 },
  { id: "bakery-interior-6", x: 375, y: 120, width: 115, height: 29 },
  { id: "bakery-interior-7", x: 489, y: 120, width: 76, height: 51 },
  { id: "bakery-interior-8", x: 0, y: 0, width: 42, height: 300 },
  { id: "bakery-interior-9", x: 556, y: 0, width: 20, height: 300 },
  { id: "bakery-interior-10", x: 223, y: 161, width: 115, height: 61 },
  { id: "bakery-interior-11", x: 258, y: 221, width: 31, height: 10 },
  { id: "bakery-interior-12", x: 26, y: 178, width: 89, height: 57 },
  { id: "bakery-interior-13", x: 0, y: 234, width: 149, height: 66 },
  { id: "bakery-interior-14", x: 397, y: 211, width: 130, height: 73 },
  { id: "bakery-interior-15", x: 526, y: 181, width: 33, height: 99 },
  { id: "bakery-interior-16", x: 375, y: 243, width: 23, height: 33 },
  { id: "bakery-interior-17", x: 525, y: 279, width: 34, height: 21 },
  { id: "bakery-interior-18", x: 0, y: 296, width: 258, height: 88 },
  { id: "bakery-interior-19", x: 317, y: 296, width: 259, height: 88 },
  { id: "bakery-interior-20", x: 240, y: 341, width: 90, height: 43 },
  { id: "bakery-interior-21", x: 215, y: 279, width: 44, height: 18 },
  { id: "bakery-interior-22", x: 316, y: 279, width: 44, height: 18 },
];

// TRANSITIONS (yellow): activation zones. The doorway to the street.
export const bakeryInteriorTransitions: (LogicalRect & { id: string })[] = [
  { id: "bakery-interior-transition-1", x: 258, y: 301, width: 59, height: 37 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const bakeryInteriorSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [{ id: "bakery-interior-spawn-1", x: 289, y: 285, direction: "north" }];
