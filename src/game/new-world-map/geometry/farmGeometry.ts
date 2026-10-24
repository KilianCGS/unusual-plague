import type { LogicalRect, SceneCollider } from "../../collision";
import type { Direction } from "../../protagonist/useProtagonistController";

// NEW WORLD MAP. First pass authored on the new background (1.2 unit per asset pixel):
// simple, practical rectangles. Repaint in /dev/collisions (with NEXT_PUBLIC_WORLD=new)
// and save over this file; the export names are the same ones it writes.

// COLLIDERS (red): floor the feet cannot occupy.
export const farmColliders: SceneCollider[] = [
  { id: "farm-1", x: 0, y: 0, width: 36, height: 1134 },
  { id: "farm-2", x: 30, y: 246, width: 402, height: 54 },
  { id: "farm-3", x: 36, y: 522, width: 426, height: 58 },
  { id: "farm-4", x: 426, y: 96, width: 360, height: 372 },
  { id: "farm-5", x: 360, y: 0, width: 840, height: 204 },
  { id: "farm-6", x: 708, y: 192, width: 456, height: 54 },
  { id: "farm-7", x: 1140, y: 192, width: 30, height: 456 },
  { id: "farm-8", x: 708, y: 594, width: 462, height: 54 },
  { id: "farm-9", x: 708, y: 420, width: 24, height: 228 },
  { id: "farm-10", x: 1014, y: 186, width: 126, height: 162 },
  { id: "farm-11", x: 1200, y: 0, width: 698, height: 684 },
  { id: "farm-12", x: 222, y: 1056, width: 204, height: 78 },
  { id: "farm-13", x: 276, y: 984, width: 276, height: 78 },
  { id: "farm-14", x: 360, y: 912, width: 360, height: 78 },
  { id: "farm-15", x: 480, y: 828, width: 276, height: 96 },
  { id: "farm-16", x: 834, y: 774, width: 480, height: 138 },
  { id: "farm-17", x: 1308, y: 708, width: 240, height: 198 },
  { id: "farm-18", x: 1524, y: 648, width: 168, height: 150 },
  { id: "farm-19", x: 1656, y: 528, width: 168, height: 168 },
  { id: "farm-20", x: 1776, y: 420, width: 122, height: 180 },
  { id: "farm-21", x: 396, y: 1032, width: 1502, height: 102 },
  { id: "farm-22", x: 1752, y: 720, width: 146, height: 228 },
];

// TRANSITIONS (yellow): activation zones.
export const farmTransitions: (LogicalRect & { id: string })[] = [
  { id: "farm-transition-1", x: 1867, y: 948, width: 30, height: 96 },
  { id: "farm-transition-2", x: 54, y: 1104, width: 108, height: 30 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const farmSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "farm-spawn-1", x: 1776, y: 996, direction: "west" },
  { id: "farm-spawn-2", x: 108, y: 1020, direction: "north" },
];
