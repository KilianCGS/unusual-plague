import type { LogicalRect, SceneCollider } from "../../collision";
import type { Direction } from "../../protagonist/useProtagonistController";

// NEW WORLD MAP. First pass authored on the new background (0.65 unit per asset pixel):
// simple, practical rectangles. Repaint in /dev/collisions (with NEXT_PUBLIC_WORLD=new)
// and save over this file; the export names are the same ones it writes.

// COLLIDERS (red): floor the feet cannot occupy.
export const apothecaryStreetColliders: SceneCollider[] = [
  { id: "apothecary-street-1", x: 0, y: 0, width: 728, height: 371 },
  { id: "apothecary-street-2", x: 0, y: 370, width: 156, height: 475 },
  { id: "apothecary-street-3", x: 156, y: 425, width: 111, height: 427 },
  { id: "apothecary-street-4", x: 562, y: 370, width: 166, height: 482 },
  { id: "apothecary-street-5", x: 464, y: 425, width: 99, height: 427 },
  { id: "apothecary-street-6", x: 0, y: 845, width: 267, height: 69 },
  { id: "apothecary-street-7", x: 464, y: 845, width: 264, height: 69 },
];

// TRANSITIONS (yellow): activation zones.
export const apothecaryStreetTransitions: (LogicalRect & { id: string })[] = [
  {
    id: "apothecary-street-transition-1",
    x: 269,
    y: 890,
    width: 186,
    height: 20,
  },
  {
    id: "apothecary-street-transition-2",
    x: 325,
    y: 360,
    width: 78,
    height: 30,
  },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const apothecaryStreetSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "apothecary-street-spawn-1", x: 364, y: 422, direction: "south" },
  { id: "apothecary-street-spawn-2", x: 361, y: 819, direction: "north" },
];
