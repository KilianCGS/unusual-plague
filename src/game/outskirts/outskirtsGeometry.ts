import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const outskirtsColliders: SceneCollider[] = [
  { id: "outskirts-1", x: 0, y: 0, width: 216, height: 312 },
  { id: "outskirts-2", x: 212, y: 0, width: 64, height: 288 },
  { id: "outskirts-3", x: 280, y: 0, width: 39, height: 79 },
  { id: "outskirts-4", x: 398, y: 0, width: 31, height: 324 },
  { id: "outskirts-5", x: 547, y: 0, width: 36, height: 322 },
  { id: "outskirts-6", x: 404, y: 430, width: 178, height: 34 },
  { id: "outskirts-7", x: 396, y: 464, width: 30, height: 56 },
  { id: "outskirts-8", x: 429, y: 522, width: 30, height: 198 },
  { id: "outskirts-9", x: 398, y: 589, width: 36, height: 127 },
  { id: "outskirts-10", x: 551, y: 464, width: 31, height: 254 },
  { id: "outskirts-11", x: 581, y: 636, width: 519, height: 80 },
  { id: "outskirts-12", x: 0, y: 690, width: 400, height: 30 },
  { id: "outskirts-13", x: 0, y: 619, width: 288, height: 66 },
  { id: "outskirts-14", x: 0, y: 576, width: 262, height: 42 },
  { id: "outskirts-15", x: 0, y: 538, width: 119, height: 33 },
  { id: "outskirts-16", x: 0, y: 498, width: 74, height: 36 },
  { id: "outskirts-17", x: 0, y: 459, width: 37, height: 40 },
  { id: "outskirts-18", x: 0, y: 427, width: 9, height: 20 },
  { id: "outskirts-19", x: 402, y: 325, width: 176, height: 3 },
  { id: "outskirts-20", x: 798, y: 0, width: 302, height: 291 },
  { id: "outskirts-21", x: 728, y: 0, width: 66, height: 187 },
  { id: "outskirts-22", x: 671, y: 0, width: 55, height: 164 },
  { id: "outskirts-23", x: 582, y: 1, width: 86, height: 45 },
  { id: "outskirts-24", x: 808, y: 443, width: 295, height: 62 },
  { id: "outskirts-25", x: 852, y: 511, width: 251, height: 123 },
  { id: "outskirts-26", x: 807, y: 418, width: 296, height: 23 },
  { id: "outskirts-27", x: 1012, y: 287, width: 49, height: 26 },
  { id: "outskirts-28", x: 895, y: 291, width: 30, height: 22 },
];

// TRANSITIONS (yellow): activation zones.
export const outskirtsTransitions: (LogicalRect & { id: string })[] = [
  { id: "outskirts-transition-1", x: 1077, y: 294, width: 26, height: 116 },
  { id: "outskirts-transition-2", x: 319, y: 0, width: 80, height: 25 },
  { id: "outskirts-transition-3", x: 0, y: 317, width: 18, height: 108 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const outskirtsSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "outskirts-spawn-1", x: 340, y: 87, direction: "south" },
  { id: "outskirts-spawn-2", x: 77, y: 374, direction: "south" },
  { id: "outskirts-spawn-3", x: 1035, y: 369, direction: "south" },
];
