import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

export const mountainPathColliders: SceneCollider[] = [
  { id: "mountain-path-1", x: 952, y: 0, width: 334, height: 366 },
  { id: "mountain-path-2", x: 0, y: 0, width: 948, height: 270 },
  { id: "mountain-path-3", x: 229, y: 270, width: 375, height: 45 },
  { id: "mountain-path-4", x: 606, y: 261, width: 49, height: 74 },
  { id: "mountain-path-5", x: 656, y: 258, width: 67, height: 45 },
  { id: "mountain-path-6", x: 810, y: 239, width: 183, height: 89 },
  { id: "mountain-path-7", x: 788, y: 361, width: 118, height: 42 },
  { id: "mountain-path-8", x: 839, y: 327, width: 120, height: 32 },
  { id: "mountain-path-9", x: 908, y: 356, width: 45, height: 29 },
  { id: "mountain-path-10", x: 790, y: 595, width: 500, height: 125 },
  { id: "mountain-path-11", x: 764, y: 599, width: 27, height: 121 },
  { id: "mountain-path-12", x: 727, y: 622, width: 34, height: 92 },
  { id: "mountain-path-13", x: 0, y: 649, width: 717, height: 71 },
  { id: "mountain-path-14", x: 577, y: 635, width: 100, height: 18 },
  { id: "mountain-path-15", x: 0, y: 620, width: 576, height: 62 },
  { id: "mountain-path-16", x: 408, y: 531, width: 168, height: 67 },
  { id: "mountain-path-17", x: 577, y: 561, width: 30, height: 30 },
  { id: "mountain-path-18", x: 764, y: 556, width: 92, height: 39 },
  { id: "mountain-path-19", x: 789, y: 548, width: 51, height: 8 },
  { id: "mountain-path-20", x: 824, y: 514, width: 28, height: 23 },
  { id: "mountain-path-21", x: 945, y: 382, width: 30, height: 19 },
  { id: "mountain-path-22", x: 1170, y: 367, width: 120, height: 29 },
  { id: "mountain-path-23", x: 0, y: 278, width: 123, height: 362 },
  { id: "mountain-path-24", x: 155, y: 470, width: 48, height: 62 },
  { id: "mountain-path-25", x: 119, y: 435, width: 36, height: 53 },
  { id: "mountain-path-26", x: 123, y: 510, width: 41, height: 68 },
  { id: "mountain-path-27", x: 199, y: 539, width: 67, height: 29 },
  { id: "mountain-path-28", x: 339, y: 315, width: 60, height: 57 },
  { id: "mountain-path-29", x: 398, y: 315, width: 177, height: 35 },
  { id: "mountain-path-30", x: 228, y: 313, width: 109, height: 25 },
  { id: "mountain-path-31", x: 497, y: 499, width: 71, height: 31 },
  { id: "mountain-path-32", x: 470, y: 509, width: 27, height: 23 },
  { id: "mountain-path-33", x: 1120, y: 565, width: 170, height: 30 },
  { id: "mountain-path-34", x: 0, y: 253, width: 226, height: 63 },
  { id: "mountain-path-35", x: 103, y: 580, width: 202, height: 45 },
  { id: "mountain-path-36", x: 307, y: 595, width: 42, height: 26 },
  { id: "mountain-path-37", x: 202, y: 567, width: 99, height: 13 },
];

export const mountainPathTransitions: (LogicalRect & { id: string })[] = [
  { id: "mountain-path-transition-1", x: 1261, y: 403, width: 29, height: 159 },
  { id: "mountain-path-transition-2", x: 127, y: 318, width: 102, height: 16 },
];

export const mountainPathSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "mountain-path-spawn-1", x: 1228, y: 494, direction: "south" },
  { id: "mountain-path-spawn-2", x: 226, y: 406, direction: "south" },
];
