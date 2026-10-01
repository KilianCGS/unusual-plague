import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const millFarmlandColliders: SceneCollider[] = [
  { id: "mill-farmland-1", x: 989, y: 178, width: 20, height: 73 },
  { id: "mill-farmland-2", x: 1010, y: 158, width: 151, height: 28 },
  { id: "mill-farmland-3", x: 1036, y: 135, width: 114, height: 20 },
  { id: "mill-farmland-4", x: 1056, y: 3, width: 70, height: 126 },
  { id: "mill-farmland-5", x: 1132, y: 0, width: 325, height: 125 },
  { id: "mill-farmland-6", x: 1201, y: 84, width: 256, height: 100 },
  { id: "mill-farmland-7", x: 1261, y: 174, width: 196, height: 56 },
  { id: "mill-farmland-8", x: 1281, y: 204, width: 176, height: 76 },
  { id: "mill-farmland-9", x: 1361, y: 281, width: 96, height: 24 },
  { id: "mill-farmland-10", x: 1388, y: 276, width: 69, height: 439 },
  { id: "mill-farmland-11", x: 0, y: 678, width: 1313, height: 42 },
  { id: "mill-farmland-12", x: 7, y: 352, width: 767, height: 275 },
  { id: "mill-farmland-13", x: 13, y: 0, width: 326, height: 345 },
  { id: "mill-farmland-14", x: 348, y: 0, width: 84, height: 221 },
  { id: "mill-farmland-15", x: 337, y: 0, width: 149, height: 152 },
  { id: "mill-farmland-16", x: 649, y: 0, width: 113, height: 283 },
  { id: "mill-farmland-17", x: 543, y: 5, width: 107, height: 266 },
  { id: "mill-farmland-18", x: 485, y: 0, width: 46, height: 134 },
  { id: "mill-farmland-19", x: 879, y: 0, width: 68, height: 148 },
  { id: "mill-farmland-20", x: 839, y: 0, width: 216, height: 124 },
  { id: "mill-farmland-21", x: 760, y: 0, width: 80, height: 89 },
  { id: "mill-farmland-22", x: 849, y: 328, width: 231, height: 130 },
  { id: "mill-farmland-23", x: 1115, y: 334, width: 204, height: 117 },
  { id: "mill-farmland-24", x: 861, y: 502, width: 220, height: 177 },
  { id: "mill-farmland-25", x: 1149, y: 460, width: 179, height: 59 },
  { id: "mill-farmland-26", x: 1312, y: 491, width: 45, height: 39 },
  { id: "mill-farmland-27", x: 1317, y: 678, width: 91, height: 42 },
  { id: "mill-farmland-28", x: 1335, y: 665, width: 60, height: 12 },
  { id: "mill-farmland-29", x: 1057, y: 186, width: 48, height: 84 },
  { id: "mill-farmland-30", x: 1105, y: 181, width: 28, height: 61 },
  { id: "mill-farmland-31", x: 1132, y: 186, width: 26, height: 40 },
  { id: "mill-farmland-32", x: 1009, y: 184, width: 46, height: 36 },
  { id: "mill-farmland-33", x: 1366, y: 602, width: 29, height: 69 },
  { id: "mill-farmland-34", x: 2, y: 625, width: 146, height: 18 },
];

// TRANSITIONS (yellow): activation zones.
export const millFarmlandTransitions: (LogicalRect & { id: string })[] = [
  { id: "mill-farmland-transition-1", x: 1013, y: 224, width: 41, height: 36 },
  { id: "mill-farmland-transition-2", x: 0, y: 645, width: 15, height: 47 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const millFarmlandSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "mill-farmland-spawn-1", x: 38, y: 666, direction: "east" },
  { id: "mill-farmland-spawn-2", x: 1034, y: 285, direction: "south" },
];
