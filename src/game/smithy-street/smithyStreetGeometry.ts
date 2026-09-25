import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const smithyStreetColliders: SceneCollider[] = [
  { id: "smithy-street-1", x: 984, y: 295, width: 69, height: 42 },
  { id: "smithy-street-2", x: 1065, y: 454, width: 40, height: 27 },
  { id: "smithy-street-3", x: 278, y: 496, width: 851, height: 179 },
  { id: "smithy-street-4", x: 283, y: 481, width: 840, height: 19 },
  { id: "smithy-street-5", x: 445, y: 442, width: 34, height: 43 },
  { id: "smithy-street-6", x: 481, y: 456, width: 36, height: 25 },
  { id: "smithy-street-7", x: 632, y: 458, width: 47, height: 24 },
  { id: "smithy-street-8", x: 309, y: 0, width: 820, height: 272 },
  { id: "smithy-street-9", x: 859, y: 233, width: 266, height: 68 },
  { id: "smithy-street-10", x: 863, y: 301, width: 72, height: 35 },
  { id: "smithy-street-11", x: 771, y: 256, width: 89, height: 42 },
  { id: "smithy-street-12", x: 630, y: 253, width: 37, height: 50 },
  { id: "smithy-street-13", x: 504, y: 293, width: 28, height: 35 },
  { id: "smithy-street-14", x: 473, y: 272, width: 81, height: 31 },
  { id: "smithy-street-15", x: 548, y: 272, width: 58, height: 24 },
  { id: "smithy-street-16", x: 309, y: 270, width: 47, height: 45 },
  { id: "smithy-street-17", x: 266, y: 214, width: 44, height: 60 },
  { id: "smithy-street-18", x: 271, y: 274, width: 37, height: 28 },
  { id: "smithy-street-19", x: 75, y: 493, width: 126, height: 21 },
  { id: "smithy-street-20", x: 91, y: 456, width: 29, height: 16 },
  { id: "smithy-street-21", x: 87, y: 471, width: 56, height: 18 },
  { id: "smithy-street-22", x: 145, y: 475, width: 30, height: 16 },
  { id: "smithy-street-23", x: 268, y: 455, width: 31, height: 39 },
  { id: "smithy-street-24", x: 253, y: 609, width: 26, height: 66 },
  { id: "smithy-street-25", x: 0, y: 585, width: 275, height: 6 },
  { id: "smithy-street-26", x: 190, y: 511, width: 15, height: 74 },
  { id: "smithy-street-27", x: 0, y: 454, width: 90, height: 7 },
  { id: "smithy-street-28", x: 3, y: 197, width: 118, height: 98 },
  { id: "smithy-street-29", x: 119, y: 220, width: 37, height: 32 },
  { id: "smithy-street-30", x: 209, y: 0, width: 113, height: 171 },
  { id: "smithy-street-31", x: 298, y: 172, width: 25, height: 57 },
  { id: "smithy-street-32", x: 0, y: 0, width: 209, height: 149 },
  { id: "smithy-street-33", x: 0, y: 169, width: 114, height: 27 },
  { id: "smithy-street-34", x: 0, y: 142, width: 103, height: 36 },
  { id: "smithy-street-35", x: 135, y: 270, width: 19, height: 17 },
  { id: "smithy-street-36", x: 624, y: 271, width: 148, height: 14 },
  { id: "smithy-street-37", x: 295, y: 299, width: 34, height: 21 },
  { id: "smithy-street-38", x: 112, y: 180, width: 24, height: 21 },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const smithyStreetTransitions: (LogicalRect & { id: string })[] = [
  { id: "smithy-street-transition-1", x: 356, y: 272, width: 117, height: 27 },
  { id: "smithy-street-transition-2", x: 1098, y: 305, width: 29, height: 148 },
  { id: "smithy-street-transition-3", x: 1, y: 295, width: 19, height: 138 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const smithyStreetSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "smithy-street-spawn-1", x: 1084, y: 394, direction: "west" },
  { id: "smithy-street-spawn-2", x: 71, y: 395, direction: "south" },
  { id: "smithy-street-spawn-3", x: 418, y: 324, direction: "south" },
];
