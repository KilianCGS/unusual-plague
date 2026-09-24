import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

export const outskirtsColliders: SceneCollider[] = [
  { id: "outskirts-1", x: 0, y: 0, width: 216, height: 300 },
  { id: "outskirts-2", x: 224, y: 0, width: 146, height: 121 },
  { id: "outskirts-3", x: 196, y: 125, width: 75, height: 160 },
  { id: "outskirts-4", x: 411, y: 0, width: 167, height: 323 },
  { id: "outskirts-5", x: 631, y: 0, width: 109, height: 55 },
  { id: "outskirts-6", x: 710, y: 0, width: 391, height: 123 },
  { id: "outskirts-7", x: 755, y: 119, width: 348, height: 71 },
  { id: "outskirts-8", x: 808, y: 181, width: 295, height: 94 },
  { id: "outskirts-9", x: 887, y: 274, width: 42, height: 39 },
  { id: "outskirts-10", x: 1005, y: 275, width: 50, height: 36 },
  { id: "outskirts-11", x: 1071, y: 274, width: 32, height: 19 },
  { id: "outskirts-12", x: 727, y: 504, width: 84, height: 49 },
  { id: "outskirts-13", x: 409, y: 444, width: 162, height: 276 },
  { id: "outskirts-14", x: 4, y: 697, width: 403, height: 22 },
  { id: "outskirts-15", x: 0, y: 615, width: 286, height: 81 },
  { id: "outskirts-16", x: 0, y: 576, width: 260, height: 38 },
  { id: "outskirts-17", x: 0, y: 540, width: 116, height: 34 },
  { id: "outskirts-18", x: 7, y: 515, width: 78, height: 23 },
  { id: "outskirts-19", x: 0, y: 492, width: 59, height: 21 },
  { id: "outskirts-20", x: 0, y: 448, width: 32, height: 40 },
  { id: "outskirts-21", x: 141, y: 293, width: 62, height: 29 },
  { id: "outskirts-22", x: 0, y: 294, width: 41, height: 27 },
  { id: "outskirts-23", x: 798, y: 416, width: 135, height: 83 },
  { id: "outskirts-24", x: 822, y: 386, width: 96, height: 28 },
  { id: "outskirts-25", x: 1041, y: 405, width: 62, height: 19 },
  { id: "outskirts-26", x: 952, y: 456, width: 151, height: 81 },
  { id: "outskirts-27", x: 1015, y: 422, width: 88, height: 35 },
  { id: "outskirts-28", x: 701, y: 592, width: 402, height: 126 },
  { id: "outskirts-29", x: 810, y: 457, width: 290, height: 138 },
  { id: "outskirts-30", x: 681, y: 119, width: 66, height: 46 },
  { id: "outskirts-31", x: 674, y: 55, width: 40, height: 35 },
];

export const outskirtsTransitions: (LogicalRect & { id: string })[] = [
  { id: "outskirts-transition-1", x: 1056, y: 308, width: 47, height: 96 },
  { id: "outskirts-transition-2", x: 0, y: 322, width: 43, height: 121 },
];

export const outskirtsSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "outskirts-spawn-1", x: 83, y: 379, direction: "east" },
  { id: "outskirts-spawn-2", x: 1025, y: 368, direction: "west" },
];
