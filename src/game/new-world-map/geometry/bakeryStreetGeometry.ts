import type { LogicalRect, SceneCollider } from "../../collision";
import type { Direction } from "../../protagonist/useProtagonistController";

// NEW WORLD MAP. First pass authored on the new background (0.7 unit per asset pixel):
// simple, practical rectangles. Repaint in /dev/collisions (with NEXT_PUBLIC_WORLD=new)
// and save over this file; the export names are the same ones it writes.

// COLLIDERS (red): floor the feet cannot occupy.
export const bakeryStreetColliders: SceneCollider[] = [
  { id: "bakery-street-1", x: 0, y: 0, width: 354, height: 263 },
  { id: "bakery-street-2", x: 0, y: 262, width: 322, height: 354 },
  { id: "bakery-street-3", x: 56, y: 616, width: 123, height: 42 },
  { id: "bakery-street-4", x: 0, y: 616, width: 49, height: 189 },
  { id: "bakery-street-5", x: 62, y: 682, width: 113, height: 92 },
  { id: "bakery-street-6", x: 500, y: 0, width: 318, height: 263 },
  { id: "bakery-street-7", x: 553, y: 262, width: 265, height: 375 },
  { id: "bakery-street-8", x: 770, y: 560, width: 48, height: 245 },
  { id: "bakery-street-9", x: 689, y: 675, width: 78, height: 109 },
  { id: "bakery-street-10", x: 324, y: 332, width: 32, height: 64 },
  { id: "bakery-street-11", x: 514, y: 332, width: 32, height: 64 },
  { id: "bakery-street-12", x: 0, y: 805, width: 818, height: 138 },
];

// TRANSITIONS (yellow): activation zones.
export const bakeryStreetTransitions: (LogicalRect & { id: string })[] = [
  { id: "bakery-street-transition-1", x: 171, y: 609, width: 99, height: 32 },
  { id: "bakery-street-transition-2", x: 357, y: 0, width: 126, height: 18 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const bakeryStreetSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "bakery-street-spawn-1", x: 420, y: 84, direction: "south" },
  { id: "bakery-street-spawn-2", x: 220, y: 693, direction: "south" },
];
