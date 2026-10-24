import type { LogicalRect, SceneCollider } from "../../collision";
import type { Direction } from "../../protagonist/useProtagonistController";

// NEW WORLD MAP. First pass authored on the new background (1.0 unit per asset pixel):
// simple, practical rectangles. Repaint in /dev/collisions (with NEXT_PUBLIC_WORLD=new)
// and save over this file; the export names are the same ones it writes.

// COLLIDERS (red): floor the feet cannot occupy.
export const forestColliders: SceneCollider[] = [
  { id: "forest-1", x: 0, y: 0, width: 400, height: 490 },
  { id: "forest-2", x: 400, y: 200, width: 75, height: 240 },
  { id: "forest-3", x: 400, y: 0, width: 370, height: 60 },
  { id: "forest-4", x: 660, y: 300, width: 205, height: 165 },
  { id: "forest-5", x: 880, y: 0, width: 546, height: 525 },
  { id: "forest-6", x: 1100, y: 525, width: 326, height: 75 },
  { id: "forest-7", x: 0, y: 600, width: 540, height: 503 },
  { id: "forest-8", x: 715, y: 720, width: 240, height: 240 },
  { id: "forest-9", x: 1040, y: 600, width: 386, height: 503 },
  { id: "forest-10", x: 830, y: 960, width: 596, height: 143 },
];

// TRANSITIONS (yellow): activation zones.
export const forestTransitions: (LogicalRect & { id: string })[] = [
  { id: "forest-transition-1", x: 0, y: 495, width: 25, height: 100 },
  { id: "forest-transition-2", x: 580, y: 1078, width: 250, height: 25 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const forestSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "forest-spawn-1", x: 110, y: 550, direction: "east" },
  { id: "forest-spawn-2", x: 690, y: 1010, direction: "north" },
];
