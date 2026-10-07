import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// PROVISIONAL geometry, measured by hand on the approved background
// (480x270, 1 logical unit per asset pixel): structural walls plus the large
// furniture, so the room is playable and its single exit (the south doorway,
// x 202-274) works. It has the same shape and export names as the files
// /dev/collisions writes, so repainting this scene there and saving over this
// file replaces it with no other change.

// COLLIDERS (red): floor the feet cannot occupy.
export const tavernInteriorColliders: SceneCollider[] = [
  // Walls: back wall, side walls, front wall left and right of the doorway.
  { id: "tavern-interior-1", x: 0, y: 0, width: 480, height: 83 },
  { id: "tavern-interior-2", x: 0, y: 0, width: 5, height: 270 },
  { id: "tavern-interior-3", x: 474, y: 0, width: 6, height: 270 },
  { id: "tavern-interior-4", x: 0, y: 236, width: 201, height: 34 },
  { id: "tavern-interior-5", x: 275, y: 236, width: 205, height: 34 },
  // Fireplace hearth, bar counter and its stools.
  { id: "tavern-interior-6", x: 52, y: 76, width: 72, height: 30 },
  { id: "tavern-interior-7", x: 264, y: 59, width: 133, height: 75 },
  { id: "tavern-interior-8", x: 244, y: 74, width: 18, height: 50 },
  { id: "tavern-interior-9", x: 284, y: 126, width: 18, height: 24 },
  { id: "tavern-interior-10", x: 363, y: 126, width: 18, height: 24 },
  // Round tables with their stools.
  { id: "tavern-interior-11", x: 20, y: 128, width: 82, height: 52 },
  { id: "tavern-interior-12", x: 138, y: 108, width: 86, height: 58 },
  { id: "tavern-interior-13", x: 56, y: 188, width: 88, height: 46 },
  { id: "tavern-interior-14", x: 314, y: 176, width: 90, height: 58 },
  // Barrels.
  { id: "tavern-interior-15", x: 397, y: 96, width: 27, height: 40 },
  { id: "tavern-interior-16", x: 418, y: 40, width: 56, height: 62 },
  { id: "tavern-interior-17", x: 446, y: 130, width: 28, height: 106 },
];

// TRANSITIONS (yellow): activation zones. The doorway to the street.
export const tavernInteriorTransitions: (LogicalRect & { id: string })[] = [
  { id: "tavern-interior-transition-1", x: 205, y: 250, width: 66, height: 20 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const tavernInteriorSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [{ id: "tavern-interior-spawn-1", x: 238, y: 214, direction: "north" }];
