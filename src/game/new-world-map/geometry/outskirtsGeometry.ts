import type { LogicalRect, SceneCollider } from "../../collision";
import type { Direction } from "../../protagonist/useProtagonistController";

// NEW WORLD MAP. First pass authored on the new background (0.85 unit per asset pixel):
// simple, practical rectangles. Repaint in /dev/collisions (with NEXT_PUBLIC_WORLD=new)
// and save over this file; the export names are the same ones it writes.

// COLLIDERS (red): floor the feet cannot occupy.
export const outskirtsColliders: SceneCollider[] = [
  { id: "outskirts-1", x: 476, y: 0, width: 251, height: 336 },
  { id: "outskirts-2", x: 437, y: 310, width: 333, height: 77 },
  { id: "outskirts-3", x: 437, y: 454, width: 333, height: 95 },
  { id: "outskirts-4", x: 480, y: 544, width: 247, height: 321 },
  { id: "outskirts-5", x: 0, y: 0, width: 264, height: 357 },
  { id: "outskirts-6", x: 259, y: 191, width: 64, height: 166 },
  { id: "outskirts-7", x: 259, y: 0, width: 115, height: 128 },
  { id: "outskirts-8", x: 867, y: 0, width: 448, height: 353 },
  { id: "outskirts-9", x: 0, y: 510, width: 136, height: 355 },
  { id: "outskirts-10", x: 131, y: 629, width: 214, height: 236 },
  { id: "outskirts-11", x: 323, y: 765, width: 111, height: 100 },
  { id: "outskirts-12", x: 867, y: 654, width: 448, height: 211 },
  { id: "outskirts-13", x: 969, y: 476, width: 346, height: 179 },
];

// TRANSITIONS (yellow): activation zones.
export const outskirtsTransitions: (LogicalRect & { id: string })[] = [
  { id: "outskirts-transition-1", x: 1292, y: 382, width: 22, height: 107 },
  { id: "outskirts-transition-2", x: 374, y: 0, width: 68, height: 22 },
  { id: "outskirts-transition-3", x: 0, y: 382, width: 22, height: 107 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const outskirtsSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "outskirts-spawn-1", x: 404, y: 94, direction: "south" },
  { id: "outskirts-spawn-2", x: 85, y: 438, direction: "east" },
  { id: "outskirts-spawn-3", x: 1224, y: 438, direction: "west" },
];
