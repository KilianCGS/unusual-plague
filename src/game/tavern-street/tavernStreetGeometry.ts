import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const tavernStreetColliders: SceneCollider[] = [
  { id: "tavern-street-1", x: 8, y: 276, width: 71, height: 19 },
  { id: "tavern-street-2", x: 165, y: 263, width: 45, height: 33 },
  { id: "tavern-street-3", x: 244, y: 267, width: 33, height: 26 },
  { id: "tavern-street-4", x: 402, y: 269, width: 89, height: 30 },
  { id: "tavern-street-5", x: 487, y: 0, width: 82, height: 290 },
  { id: "tavern-street-6", x: 632, y: 0, width: 93, height: 292 },
  { id: "tavern-street-7", x: 725, y: 0, width: 436, height: 276 },
  { id: "tavern-street-8", x: 0, y: 0, width: 488, height: 266 },
  { id: "tavern-street-9", x: 0, y: 435, width: 1161, height: 167 },
  { id: "tavern-street-10", x: 555, y: 0, width: 80, height: 229 },
  { id: "tavern-street-11", x: 726, y: 276, width: 63, height: 25 },
  { id: "tavern-street-12", x: 799, y: 277, width: 106, height: 16 },
  { id: "tavern-street-13", x: 982, y: 275, width: 30, height: 18 },
  { id: "tavern-street-14", x: 1132, y: 270, width: 29, height: 27 },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const tavernStreetTransitions: (LogicalRect & { id: string })[] = [
  { id: "tavern-street-transition-1", x: 0, y: 266, width: 37, height: 168 },
  { id: "tavern-street-transition-2", x: 1132, y: 276, width: 29, height: 158 },
  { id: "tavern-street-transition-3", x: 572, y: 231, width: 58, height: 46 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const tavernStreetSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "tavern-street-spawn-1", x: 1115, y: 358, direction: "west" },
  { id: "tavern-street-spawn-2", x: 58, y: 365, direction: "east" },
  { id: "tavern-street-spawn-3", x: 602, y: 324, direction: "south" },
];
