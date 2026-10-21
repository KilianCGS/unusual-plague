import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// Authored against the approved 1536x1024 background (576x384 logical units,
// 0.375 unit per asset pixel). Rectangles follow the visible architecture and
// large furniture; practical gameplay collision, not pixel-perfect.

// COLLIDERS (red): floor the feet cannot occupy.
export const tavernInteriorColliders: SceneCollider[] = [
  { id: "tavern-interior-1", x: 0, y: 0, width: 576, height: 113 },
  { id: "tavern-interior-2", x: 0, y: 0, width: 49, height: 349 },
  { id: "tavern-interior-3", x: 540, y: 0, width: 36, height: 349 },
  { id: "tavern-interior-4", x: 91, y: 112, width: 196, height: 57 },
  { id: "tavern-interior-5", x: 110, y: 166, width: 24, height: 14 },
  { id: "tavern-interior-6", x: 155, y: 166, width: 24, height: 14 },
  { id: "tavern-interior-7", x: 196, y: 166, width: 26, height: 14 },
  { id: "tavern-interior-8", x: 238, y: 166, width: 25, height: 14 },
  { id: "tavern-interior-9", x: 286, y: 112, width: 138, height: 38 },
  { id: "tavern-interior-10", x: 423, y: 112, width: 114, height: 42 },
  { id: "tavern-interior-11", x: 498, y: 140, width: 42, height: 40 },
  { id: "tavern-interior-12", x: 48, y: 95, width: 39, height: 59 },
  { id: "tavern-interior-13", x: 438, y: 168, width: 67, height: 61 },
  { id: "tavern-interior-14", x: 410, y: 181, width: 24, height: 31 },
  { id: "tavern-interior-15", x: 121, y: 215, width: 97, height: 85 },
  { id: "tavern-interior-16", x: 360, y: 232, width: 90, height: 91 },
  { id: "tavern-interior-17", x: 35, y: 251, width: 46, height: 96 },
  { id: "tavern-interior-18", x: 496, y: 285, width: 46, height: 64 },
  { id: "tavern-interior-19", x: 0, y: 346, width: 225, height: 38 },
  { id: "tavern-interior-20", x: 225, y: 335, width: 38, height: 49 },
  { id: "tavern-interior-21", x: 350, y: 346, width: 226, height: 38 },
  { id: "tavern-interior-22", x: 322, y: 335, width: 29, height: 49 },
  { id: "tavern-interior-23", x: 262, y: 373, width: 61, height: 11 },
];

// TRANSITIONS (yellow): activation zones. The doorway to the street.
export const tavernInteriorTransitions: (LogicalRect & { id: string })[] = [
  { id: "tavern-interior-transition-1", x: 264, y: 346, width: 57, height: 22 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const tavernInteriorSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [{ id: "tavern-interior-spawn-1", x: 292, y: 319, direction: "north" }];
