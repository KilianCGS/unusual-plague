import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const smithyInteriorColliders: SceneCollider[] = [
  { id: "smithy-interior-1", x: 497, y: 444, width: 42, height: 137 },
  { id: "smithy-interior-2", x: 539, y: 467, width: 294, height: 114 },
  { id: "smithy-interior-3", x: 768, y: 0, width: 65, height: 465 },
  { id: "smithy-interior-4", x: 0, y: 0, width: 824, height: 216 },
  { id: "smithy-interior-5", x: 206, y: 216, width: 186, height: 64 },
  { id: "smithy-interior-6", x: 480, y: 217, width: 205, height: 46 },
  { id: "smithy-interior-7", x: 688, y: 216, width: 84, height: 11 },
  { id: "smithy-interior-8", x: 331, y: 287, width: 88, height: 106 },
  { id: "smithy-interior-9", x: 292, y: 446, width: 39, height: 135 },
  { id: "smithy-interior-10", x: 0, y: 211, width: 83, height: 370 },
  { id: "smithy-interior-11", x: 82, y: 467, width: 224, height: 114 },
  { id: "smithy-interior-12", x: 77, y: 432, width: 111, height: 33 },
  { id: "smithy-interior-13", x: 77, y: 409, width: 77, height: 24 },
  { id: "smithy-interior-14", x: 150, y: 212, width: 57, height: 75 },
  { id: "smithy-interior-15", x: 78, y: 214, width: 72, height: 28 },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const smithyInteriorTransitions: (LogicalRect & { id: string })[] = [
  { id: "smithy-interior-transition-1", x: 334, y: 529, width: 162, height: 51 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const smithyInteriorSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "smithy-interior-spawn-1", x: 417, y: 481, direction: "north" },
];
