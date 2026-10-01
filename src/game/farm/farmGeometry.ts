import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const farmColliders: SceneCollider[] = [
  { id: "farm-1", x: 46, y: 445, width: 10, height: 273 },
  { id: "farm-2", x: 0, y: 0, width: 83, height: 446 },
  { id: "farm-3", x: 78, y: 0, width: 77, height: 114 },
  { id: "farm-4", x: 157, y: 0, width: 1114, height: 51 },
  { id: "farm-5", x: 826, y: 23, width: 445, height: 429 },
  { id: "farm-6", x: 427, y: 49, width: 398, height: 79 },
  { id: "farm-7", x: 354, y: 133, width: 467, height: 186 },
  { id: "farm-8", x: 519, y: 322, width: 302, height: 131 },
  { id: "farm-9", x: 597, y: 520, width: 293, height: 91 },
  { id: "farm-10", x: 894, y: 512, width: 28, height: 84 },
  { id: "farm-11", x: 923, y: 495, width: 32, height: 93 },
  { id: "farm-12", x: 905, y: 451, width: 22, height: 65 },
  { id: "farm-13", x: 958, y: 468, width: 47, height: 104 },
  { id: "farm-14", x: 1005, y: 450, width: 31, height: 104 },
  { id: "farm-15", x: 1041, y: 446, width: 27, height: 87 },
  { id: "farm-16", x: 1072, y: 442, width: 26, height: 71 },
  { id: "farm-17", x: 1102, y: 445, width: 169, height: 65 },
  { id: "farm-18", x: 1132, y: 518, width: 138, height: 66 },
  { id: "farm-19", x: 1243, y: 586, width: 28, height: 36 },
  { id: "farm-20", x: 370, y: 696, width: 896, height: 24 },
  { id: "farm-21", x: 515, y: 609, width: 42, height: 15 },
  { id: "farm-22", x: 494, y: 616, width: 22, height: 16 },
  { id: "farm-23", x: 468, y: 628, width: 25, height: 16 },
  { id: "farm-24", x: 440, y: 642, width: 26, height: 16 },
  { id: "farm-25", x: 419, y: 659, width: 21, height: 15 },
  { id: "farm-26", x: 393, y: 674, width: 26, height: 22 },
  { id: "farm-27", x: 189, y: 624, width: 53, height: 50 },
  { id: "farm-28", x: 250, y: 584, width: 47, height: 33 },
  { id: "farm-29", x: 235, y: 701, width: 17, height: 19 },
  { id: "farm-30", x: 249, y: 677, width: 30, height: 26 },
  { id: "farm-31", x: 276, y: 652, width: 25, height: 24 },
  { id: "farm-32", x: 302, y: 629, width: 23, height: 22 },
  { id: "farm-33", x: 326, y: 599, width: 20, height: 30 },
  { id: "farm-34", x: 346, y: 579, width: 33, height: 20 },
  { id: "farm-35", x: 383, y: 564, width: 26, height: 16 },
  { id: "farm-36", x: 409, y: 541, width: 39, height: 21 },
  { id: "farm-37", x: 452, y: 532, width: 29, height: 9 },
  { id: "farm-38", x: 483, y: 526, width: 32, height: 12 },
  { id: "farm-39", x: 516, y: 522, width: 42, height: 12 },
  { id: "farm-40", x: 317, y: 279, width: 25, height: 16 },
  { id: "farm-41", x: 314, y: 213, width: 29, height: 34 },
  { id: "farm-42", x: 142, y: 706, width: 95, height: 14 },
  { id: "farm-43", x: 0, y: 706, width: 47, height: 14 },
];

// TRANSITIONS (yellow): activation zones.
export const farmTransitions: (LogicalRect & { id: string })[] = [
  { id: "farm-transition-1", x: 1242, y: 623, width: 29, height: 71 },
  { id: "farm-transition-2", x: 57, y: 682, width: 86, height: 36 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const farmSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "farm-spawn-1", x: 1206, y: 675, direction: "west" },
  { id: "farm-spawn-2", x: 98, y: 657, direction: "north" },
];
