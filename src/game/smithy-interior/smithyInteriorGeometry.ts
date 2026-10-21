import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// Authored against the approved 1536x1024 background (576x384 logical units,
// 0.375 unit per asset pixel). Rectangles follow the visible architecture and
// large furniture; practical gameplay collision, not pixel-perfect.

// COLLIDERS (red): floor the feet cannot occupy.
export const smithyInteriorColliders: SceneCollider[] = [
  { id: "smithy-interior-1", x: 0, y: 0, width: 576, height: 139 },
  { id: "smithy-interior-2", x: 37, y: 138, width: 157, height: 24 },
  { id: "smithy-interior-3", x: 37, y: 161, width: 44, height: 12 },
  { id: "smithy-interior-4", x: 195, y: 138, width: 34, height: 24 },
  { id: "smithy-interior-5", x: 245, y: 138, width: 93, height: 22 },
  { id: "smithy-interior-6", x: 339, y: 138, width: 53, height: 14 },
  { id: "smithy-interior-7", x: 459, y: 138, width: 33, height: 14 },
  { id: "smithy-interior-8", x: 483, y: 138, width: 93, height: 67 },
  { id: "smithy-interior-9", x: 0, y: 0, width: 38, height: 300 },
  { id: "smithy-interior-10", x: 551, y: 0, width: 25, height: 300 },
  { id: "smithy-interior-11", x: 28, y: 185, width: 106, height: 55 },
  { id: "smithy-interior-12", x: 22, y: 219, width: 48, height: 78 },
  { id: "smithy-interior-13", x: 65, y: 256, width: 89, height: 41 },
  { id: "smithy-interior-14", x: 498, y: 208, width: 57, height: 57 },
  { id: "smithy-interior-15", x: 502, y: 264, width: 74, height: 36 },
  { id: "smithy-interior-16", x: 438, y: 255, width: 71, height: 44 },
  { id: "smithy-interior-17", x: 360, y: 163, width: 120, height: 74 },
  { id: "smithy-interior-18", x: 0, y: 296, width: 222, height: 88 },
  { id: "smithy-interior-19", x: 219, y: 281, width: 40, height: 103 },
  { id: "smithy-interior-20", x: 318, y: 281, width: 39, height: 103 },
  { id: "smithy-interior-21", x: 356, y: 296, width: 220, height: 88 },
  { id: "smithy-interior-22", x: 240, y: 346, width: 98, height: 38 },
];

// TRANSITIONS (yellow): activation zones. The doorway to the street.
export const smithyInteriorTransitions: (LogicalRect & { id: string })[] = [
  { id: "smithy-interior-transition-1", x: 259, y: 303, width: 59, height: 37 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const smithyInteriorSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [{ id: "smithy-interior-spawn-1", x: 289, y: 285, direction: "north" }];
