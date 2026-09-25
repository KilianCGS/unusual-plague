import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// Interior of the Apothecary. World is 480x270 logical units (see
// ApothecaryScene). Replaces the previous split apothecaryColliders.ts /
// apothecaryInteriorGeometry.ts pair with a single geometry file, matching
// the convention used by every other scene.

// COLLIDERS (red): floor the feet cannot occupy.
export const apothecaryInteriorColliders: SceneCollider[] = [
  { id: "apothecary-interior-1", x: 0, y: 18, width: 100, height: 230 },
  { id: "apothecary-interior-2", x: 384, y: 198, width: 20, height: 32 },
  { id: "apothecary-interior-3", x: 277, y: 236, width: 137, height: 33 },
  { id: "apothecary-interior-4", x: 331, y: 222, width: 29, height: 13 },
  { id: "apothecary-interior-5", x: 414, y: 131, width: 9, height: 13 },
  { id: "apothecary-interior-6", x: 415, y: 172, width: 32, height: 98 },
  { id: "apothecary-interior-7", x: 447, y: 198, width: 33, height: 72 },
  { id: "apothecary-interior-8", x: 390, y: 6, width: 32, height: 128 },
  { id: "apothecary-interior-9", x: 423, y: 1, width: 18, height: 131 },
  { id: "apothecary-interior-10", x: 442, y: 0, width: 38, height: 81 },
  { id: "apothecary-interior-11", x: 474, y: 82, width: 6, height: 52 },
  { id: "apothecary-interior-12", x: 100, y: 0, width: 297, height: 80 },
  { id: "apothecary-interior-13", x: 319, y: 77, width: 17, height: 22 },
  { id: "apothecary-interior-14", x: 348, y: 79, width: 42, height: 12 },
  { id: "apothecary-interior-15", x: 358, y: 93, width: 34, height: 10 },
  { id: "apothecary-interior-16", x: 371, y: 103, width: 18, height: 7 },
  { id: "apothecary-interior-17", x: 128, y: 80, width: 24, height: 10 },
  { id: "apothecary-interior-18", x: 95, y: 145, width: 21, height: 22 },
  { id: "apothecary-interior-19", x: 68, y: 235, width: 128, height: 23 },
  { id: "apothecary-interior-20", x: 268, y: 240, width: 9, height: 28 },
  { id: "apothecary-interior-21", x: 195, y: 238, width: 11, height: 27 },
  { id: "apothecary-interior-22", x: 158, y: 80, width: 158, height: 7 },
];

// TRANSITIONS (yellow): activation zones.
// transition-1: the door/gap on the right side, to the Doctor's Room.
// transition-2: the bottom exit, to Calle Botica.
export const apothecaryInteriorTransitions: (LogicalRect & { id: string })[] = [
  { id: "apothecary-interior-transition-1", x: 441, y: 102, width: 33, height: 16 },
  { id: "apothecary-interior-transition-2", x: 207, y: 249, width: 61, height: 15 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const apothecaryInteriorSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "apothecary-interior-spawn-1", x: 457, y: 141, direction: "south" },
  { id: "apothecary-interior-spawn-2", x: 237, y: 215, direction: "south" },
];
