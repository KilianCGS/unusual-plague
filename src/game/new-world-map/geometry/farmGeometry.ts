import type { LogicalRect, SceneCollider } from "../../collision";
import type { Direction } from "../../protagonist/useProtagonistController";

// NEW WORLD MAP. Kilian's repaint of 2026-11-16 (the west road to the market street added): repaint in
// /dev/collisions and save over this file; the export names are the same ones it writes.

// COLLIDERS (red): floor the feet cannot occupy.
export const farmColliders: SceneCollider[] = [
  { id: "farm-1", x: 30, y: 246, width: 402, height: 54 },
  { id: "farm-2", x: 36, y: 522, width: 426, height: 58 },
  { id: "farm-3", x: 426, y: 96, width: 360, height: 372 },
  { id: "farm-4", x: 360, y: 0, width: 840, height: 204 },
  { id: "farm-5", x: 708, y: 192, width: 456, height: 54 },
  { id: "farm-6", x: 1140, y: 192, width: 30, height: 456 },
  { id: "farm-7", x: 708, y: 594, width: 462, height: 54 },
  { id: "farm-8", x: 708, y: 420, width: 24, height: 228 },
  { id: "farm-9", x: 1014, y: 186, width: 126, height: 162 },
  { id: "farm-10", x: 1200, y: 0, width: 698, height: 684 },
  { id: "farm-11", x: 222, y: 1056, width: 204, height: 78 },
  { id: "farm-12", x: 276, y: 984, width: 276, height: 78 },
  { id: "farm-13", x: 480, y: 828, width: 276, height: 96 },
  { id: "farm-14", x: 834, y: 774, width: 480, height: 138 },
  { id: "farm-15", x: 1308, y: 708, width: 240, height: 198 },
  { id: "farm-16", x: 1524, y: 648, width: 168, height: 150 },
  { id: "farm-17", x: 1656, y: 528, width: 168, height: 168 },
  { id: "farm-18", x: 1776, y: 420, width: 122, height: 180 },
  { id: "farm-19", x: 396, y: 1032, width: 1502, height: 102 },
  { id: "farm-20", x: 1752, y: 720, width: 146, height: 228 },
  { id: "farm-21", x: 0, y: 876, width: 38, height: 258 },
  { id: "farm-22", x: 0, y: 0, width: 33, height: 673 },
  { id: "farm-23", x: 426, y: 462, width: 39, height: 65 },
  { id: "farm-24", x: 539, y: 770, width: 202, height: 45 },
  { id: "farm-25", x: 399, y: 854, width: 83, height: 53 },
  { id: "farm-26", x: 169, y: 1097, width: 51, height: 37 },
  { id: "farm-27", x: 242, y: 1023, width: 46, height: 35 },
  { id: "farm-28", x: 318, y: 942, width: 39, height: 47 },
  { id: "farm-29", x: 345, y: 896, width: 52, height: 55 },
  { id: "farm-30", x: 548, y: 946, width: 44, height: 39 },
  { id: "farm-31", x: 592, y: 924, width: 37, height: 27 },
  { id: "farm-32", x: 1171, y: 624, width: 32, height: 26 },
  { id: "farm-33", x: 1304, y: 676, width: 25, height: 31 },
];

// TRANSITIONS (yellow): activation zones.
export const farmTransitions: (LogicalRect & { id: string })[] = [
  { id: "farm-transition-1", x: 1867, y: 948, width: 30, height: 96 },
  { id: "farm-transition-2", x: 54, y: 1104, width: 108, height: 30 },
  { id: "farm-transition-3", x: 0, y: 676, width: 34, height: 200 },
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
  { id: "farm-spawn-3", x: 98, y: 776, direction: "south" },
];
