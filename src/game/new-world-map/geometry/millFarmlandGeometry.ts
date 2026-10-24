import type { LogicalRect, SceneCollider } from "../../collision";
import type { Direction } from "../../protagonist/useProtagonistController";

// NEW WORLD MAP. First pass authored on the new background (1.4 unit per asset pixel):
// simple, practical rectangles. Repaint in /dev/collisions (with NEXT_PUBLIC_WORLD=new)
// and save over this file; the export names are the same ones it writes.

// COLLIDERS (red): floor the feet cannot occupy.
export const millFarmlandColliders: SceneCollider[] = [
  { id: "mill-farmland-1", x: 0, y: 0, width: 588, height: 1036 },
  { id: "mill-farmland-2", x: 588, y: 0, width: 1896, height: 133 },
  { id: "mill-farmland-3", x: 532, y: 553, width: 749, height: 469 },
  { id: "mill-farmland-4", x: 882, y: 70, width: 455, height: 413 },
  { id: "mill-farmland-5", x: 1659, y: 161, width: 329, height: 322 },
  { id: "mill-farmland-6", x: 1414, y: 196, width: 112, height: 84 },
  { id: "mill-farmland-7", x: 2029, y: 217, width: 183, height: 140 },
  { id: "mill-farmland-8", x: 2198, y: 406, width: 98, height: 77 },
  { id: "mill-farmland-9", x: 2282, y: 0, width: 202, height: 1120 },
  { id: "mill-farmland-10", x: 1407, y: 525, width: 420, height: 217 },
  { id: "mill-farmland-11", x: 1861, y: 525, width: 400, height: 217 },
  { id: "mill-farmland-12", x: 1407, y: 812, width: 840, height: 308 },
  { id: "mill-farmland-13", x: 1931, y: 728, width: 407, height: 133 },
  { id: "mill-farmland-14", x: 0, y: 1127, width: 1302, height: 115 },
  { id: "mill-farmland-15", x: 1302, y: 1183, width: 1182, height: 59 },
  { id: "mill-farmland-16", x: 2198, y: 1120, width: 286, height: 122 },
];

// TRANSITIONS (yellow): activation zones.
export const millFarmlandTransitions: (LogicalRect & { id: string })[] = [
  { id: "mill-farmland-transition-1", x: 0, y: 1043, width: 35, height: 84 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const millFarmlandSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [{ id: "mill-farmland-spawn-1", x: 154, y: 1085, direction: "east" }];
