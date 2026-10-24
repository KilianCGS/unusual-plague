import type { LogicalRect, SceneCollider } from "../../collision";
import type { Direction } from "../../protagonist/useProtagonistController";

// NEW WORLD MAP. First pass authored on the new background (1.0 unit per asset pixel):
// simple, practical rectangles. Repaint in /dev/collisions (with NEXT_PUBLIC_WORLD=new)
// and save over this file; the export names are the same ones it writes.

// COLLIDERS (red): floor the feet cannot occupy.
export const forestCottageColliders: SceneCollider[] = [
  { id: "forest-cottage-1", x: 0, y: 0, width: 640, height: 160 },
  { id: "forest-cottage-2", x: 40, y: 150, width: 560, height: 400 },
  { id: "forest-cottage-3", x: 150, y: 525, width: 130, height: 90 },
  { id: "forest-cottage-4", x: 0, y: 0, width: 40, height: 1103 },
  { id: "forest-cottage-5", x: 0, y: 600, width: 340, height: 503 },
  { id: "forest-cottage-6", x: 790, y: 0, width: 636, height: 590 },
  { id: "forest-cottage-7", x: 1000, y: 380, width: 426, height: 360 },
  { id: "forest-cottage-8", x: 330, y: 665, width: 1096, height: 438 },
];

// TRANSITIONS (yellow): activation zones.
export const forestCottageTransitions: (LogicalRect & { id: string })[] = [
  { id: "forest-cottage-transition-1", x: 650, y: 0, width: 80, height: 25 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const forestCottageSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [{ id: "forest-cottage-spawn-1", x: 690, y: 100, direction: "south" }];
