import type { LogicalRect, SceneCollider } from "../../collision";
import type { Direction } from "../../protagonist/useProtagonistController";

// NEW WORLD MAP. First pass authored on the new background (1.0 unit per asset pixel):
// simple, practical rectangles. Repaint in /dev/collisions (with NEXT_PUBLIC_WORLD=new)
// and save over this file; the export names are the same ones it writes.

// COLLIDERS (red): floor the feet cannot occupy.
export const smithyStreetColliders: SceneCollider[] = [
  { id: "smithy-street-1", x: 0, y: 0, width: 1619, height: 425 },
  { id: "smithy-street-2", x: 1250, y: 420, width: 110, height: 70 },
  { id: "smithy-street-3", x: 1425, y: 410, width: 90, height: 70 },
  { id: "smithy-street-4", x: 0, y: 610, width: 75, height: 50 },
  { id: "smithy-street-5", x: 0, y: 655, width: 1619, height: 316 },
];

// TRANSITIONS (yellow): activation zones.
export const smithyStreetTransitions: (LogicalRect & { id: string })[] = [
  { id: "smithy-street-transition-1", x: 470, y: 405, width: 215, height: 40 },
  { id: "smithy-street-transition-2", x: 1594, y: 445, width: 25, height: 200 },
  { id: "smithy-street-transition-3", x: 0, y: 445, width: 25, height: 160 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const smithyStreetSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "smithy-street-spawn-1", x: 1520, y: 545, direction: "west" },
  { id: "smithy-street-spawn-2", x: 90, y: 525, direction: "east" },
  { id: "smithy-street-spawn-3", x: 570, y: 495, direction: "south" },
];
