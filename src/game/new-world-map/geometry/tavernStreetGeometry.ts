import type { LogicalRect, SceneCollider } from "../../collision";
import type { Direction } from "../../protagonist/useProtagonistController";

// NEW WORLD MAP. First pass authored on the new background (0.9 unit per asset pixel):
// simple, practical rectangles. Repaint in /dev/collisions (with NEXT_PUBLIC_WORLD=new)
// and save over this file; the export names are the same ones it writes.

// COLLIDERS (red): floor the feet cannot occupy.
export const tavernStreetColliders: SceneCollider[] = [
  { id: "tavern-street-1", x: 0, y: 0, width: 1557, height: 396 },
  { id: "tavern-street-2", x: 0, y: 562, width: 1557, height: 257 },
];

// TRANSITIONS (yellow): activation zones.
export const tavernStreetTransitions: (LogicalRect & { id: string })[] = [
  { id: "tavern-street-transition-1", x: 0, y: 405, width: 23, height: 144 },
  { id: "tavern-street-transition-2", x: 1534, y: 405, width: 23, height: 144 },
  { id: "tavern-street-transition-3", x: 810, y: 373, width: 99, height: 37 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const tavernStreetSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "tavern-street-spawn-1", x: 1440, y: 486, direction: "west" },
  { id: "tavern-street-spawn-2", x: 117, y: 486, direction: "east" },
  { id: "tavern-street-spawn-3", x: 860, y: 454, direction: "south" },
];
