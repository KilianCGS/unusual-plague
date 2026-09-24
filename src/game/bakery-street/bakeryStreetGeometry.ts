import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const bakeryStreetColliders: SceneCollider[] = [
  { id: "bakery-street-1", x: 17, y: 777, width: 166, height: 86 },
  { id: "bakery-street-2", x: 0, y: 898, width: 833, height: 200 },
  { id: "bakery-street-3", x: 701, y: 775, width: 91, height: 99 },
  { id: "bakery-street-4", x: 503, y: 4, width: 337, height: 127 },
  { id: "bakery-street-5", x: 529, y: 129, width: 311, height: 196 },
  { id: "bakery-street-6", x: 559, y: 330, width: 281, height: 359 },
  { id: "bakery-street-7", x: 783, y: 689, width: 57, height: 206 },
  { id: "bakery-street-8", x: 0, y: 0, width: 68, height: 772 },
  { id: "bakery-street-9", x: 13, y: 0, width: 350, height: 133 },
  { id: "bakery-street-10", x: 60, y: 133, width: 270, height: 162 },
  { id: "bakery-street-11", x: 59, y: 297, width: 269, height: 302 },
  { id: "bakery-street-12", x: 43, y: 602, width: 129, height: 129 },
  { id: "bakery-street-13", x: 159, y: 696, width: 35, height: 36 },
  { id: "bakery-street-14", x: 130, y: 727, width: 40, height: 41 },
  { id: "bakery-street-15", x: 289, y: 672, width: 57, height: 51 },
  { id: "bakery-street-16", x: 280, y: 601, width: 83, height: 72 },
  { id: "bakery-street-17", x: 281, y: 669, width: 15, height: 34 },
  { id: "bakery-street-18", x: 332, y: 416, width: 37, height: 50 },
  { id: "bakery-street-19", x: 503, y: 413, width: 54, height: 51 },
  { id: "bakery-street-20", x: 515, y: 524, width: 58, height: 42 },
  { id: "bakery-street-21", x: 546, y: 587, width: 21, height: 103 },
  { id: "bakery-street-22", x: 534, y: 470, width: 28, height: 50 },
  { id: "bakery-street-23", x: 746, y: 684, width: 37, height: 35 },
  { id: "bakery-street-24", x: 569, y: 688, width: 107, height: 27 },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const bakeryStreetTransitions: (LogicalRect & { id: string })[] = [
  { id: "bakery-street-transition-1", x: 170, y: 657, width: 106, height: 43 },
  { id: "bakery-street-transition-2", x: 369, y: 6, width: 129, height: 54 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const bakeryStreetSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "bakery-street-spawn-1", x: 428, y: 97, direction: "south" },
  { id: "bakery-street-spawn-2", x: 226, y: 760, direction: "south" },
];
