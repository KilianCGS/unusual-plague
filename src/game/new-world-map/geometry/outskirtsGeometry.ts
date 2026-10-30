import type { LogicalRect, SceneCollider } from "../../collision";
import type { Direction } from "../../protagonist/useProtagonistController";

// NEW WORLD MAP, on the new background (0.85 unit per asset pixel). The colliders
// are the ones painted BY HAND in /dev/collisions (source of truth): do not
// regenerate, merge or normalise them. The export names are the ones it writes.

// COLLIDERS (red): floor the feet cannot occupy.
export const outskirtsColliders: SceneCollider[] = [
  { id: "outskirts-1", x: 476, y: 0, width: 251, height: 336 },
  { id: "outskirts-2", x: 259, y: 0, width: 115, height: 128 },
  { id: "outskirts-3", x: 131, y: 629, width: 214, height: 236 },
  { id: "outskirts-4", x: 323, y: 765, width: 111, height: 100 },
  { id: "outskirts-5", x: 994, y: 0, width: 318, height: 347 },
  { id: "outskirts-6", x: 861, y: 0, width: 143, height: 226 },
  { id: "outskirts-7", x: 837, y: 0, width: 62, height: 185 },
  { id: "outskirts-8", x: 723, y: 0, width: 111, height: 55 },
  { id: "outskirts-9", x: 822, y: 291, width: 55, height: 38 },
  { id: "outskirts-10", x: 751, y: 233, width: 89, height: 68 },
  { id: "outskirts-11", x: 990, y: 492, width: 162, height: 189 },
  { id: "outskirts-12", x: 1147, y: 565, width: 167, height: 299 },
  { id: "outskirts-13", x: 1231, y: 510, width: 83, height: 56 },
  { id: "outskirts-14", x: 881, y: 578, width: 90, height: 86 },
  { id: "outskirts-15", x: 839, y: 680, width: 61, height: 43 },
  { id: "outskirts-16", x: 888, y: 662, width: 278, height: 202 },
  { id: "outskirts-17", x: 723, y: 726, width: 228, height: 138 },
  { id: "outskirts-18", x: 680, y: 525, width: 41, height: 138 },
  { id: "outskirts-19", x: 680, y: 724, width: 40, height: 131 },
  { id: "outskirts-20", x: 679, y: 665, width: 26, height: 58 },
  { id: "outskirts-21", x: 437, y: 470, width: 328, height: 67 },
  { id: "outskirts-22", x: 724, y: 455, width: 41, height: 18 },
  { id: "outskirts-23", x: 726, y: 313, width: 42, height: 74 },
  { id: "outskirts-24", x: 479, y: 338, width: 239, height: 31 },
  { id: "outskirts-25", x: 441, y: 316, width: 35, height: 68 },
  { id: "outskirts-26", x: 442, y: 452, width: 35, height: 19 },
  { id: "outskirts-27", x: 430, y: 802, width: 53, height: 45 },
  { id: "outskirts-28", x: 479, y: 719, width: 29, height: 135 },
  { id: "outskirts-29", x: 480, y: 533, width: 32, height: 126 },
  { id: "outskirts-30", x: 116, y: 540, width: 94, height: 90 },
  { id: "outskirts-31", x: 41, y: 587, width: 69, height: 22 },
  { id: "outskirts-32", x: 22, y: 554, width: 44, height: 30 },
  { id: "outskirts-33", x: 0, y: 525, width: 31, height: 28 },
  { id: "outskirts-34", x: 0, y: 629, width: 173, height: 235 },
  { id: "outskirts-35", x: 0, y: 584, width: 113, height: 50 },
  { id: "outskirts-36", x: 0, y: 0, width: 263, height: 319 },
  { id: "outskirts-37", x: 0, y: 309, width: 43, height: 38 },
  { id: "outskirts-38", x: 153, y: 314, width: 69, height: 34 },
  { id: "outskirts-39", x: 252, y: 243, width: 33, height: 63 },
  { id: "outskirts-40", x: 261, y: 192, width: 57, height: 71 },
  { id: "outskirts-41", x: 261, y: 115, width: 51, height: 74 },
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
