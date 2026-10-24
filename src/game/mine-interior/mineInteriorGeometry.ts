import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const mineInteriorColliders: SceneCollider[] = [
  { id: "mine-interior-1", x: 465, y: 4, width: 110, height: 46 },
  { id: "mine-interior-2", x: 515, y: 50, width: 62, height: 46 },
  { id: "mine-interior-3", x: 506, y: 92, width: 71, height: 40 },
  { id: "mine-interior-4", x: 500, y: 196, width: 77, height: 81 },
  { id: "mine-interior-5", x: 336, y: 286, width: 226, height: 57 },
  { id: "mine-interior-6", x: 399, y: 250, width: 29, height: 32 },
  { id: "mine-interior-7", x: 454, y: 216, width: 64, height: 28 },
  { id: "mine-interior-8", x: 498, y: 273, width: 24, height: 13 },
  { id: "mine-interior-9", x: 537, y: 122, width: 40, height: 72 },
  { id: "mine-interior-10", x: 291, y: 140, width: 81, height: 35 },
  { id: "mine-interior-11", x: 299, y: 113, width: 49, height: 27 },
  { id: "mine-interior-12", x: 0, y: 0, width: 346, height: 74 },
  { id: "mine-interior-13", x: 348, y: 0, width: 120, height: 65 },
  { id: "mine-interior-14", x: 411, y: 61, width: 59, height: 43 },
  { id: "mine-interior-15", x: 197, y: 75, width: 98, height: 43 },
  { id: "mine-interior-16", x: 0, y: 67, width: 192, height: 29 },
  { id: "mine-interior-17", x: 3, y: 98, width: 96, height: 40 },
  { id: "mine-interior-18", x: 119, y: 94, width: 28, height: 31 },
  { id: "mine-interior-19", x: 109, y: 180, width: 66, height: 37 },
  { id: "mine-interior-20", x: 8, y: 186, width: 99, height: 24 },
  { id: "mine-interior-21", x: 0, y: 131, width: 53, height: 52 },
  { id: "mine-interior-22", x: 46, y: 141, width: 31, height: 17 },
  { id: "mine-interior-23", x: 0, y: 292, width: 245, height: 62 },
  { id: "mine-interior-24", x: 187, y: 276, width: 47, height: 16 },
  { id: "mine-interior-25", x: 188, y: 258, width: 14, height: 18 },
  { id: "mine-interior-26", x: 0, y: 277, width: 179, height: 12 },
  { id: "mine-interior-27", x: 63, y: 246, width: 28, height: 27 },
  { id: "mine-interior-28", x: 0, y: 211, width: 63, height: 64 },
  { id: "mine-interior-29", x: 337, y: 269, width: 65, height: 17 },
  { id: "mine-interior-30", x: 319, y: 294, width: 15, height: 54 },
  { id: "mine-interior-31", x: 246, y: 294, width: 16, height: 51 },
  { id: "mine-interior-32", x: 225, y: 115, width: 72, height: 17 },
  { id: "mine-interior-33", x: 166, y: 93, width: 29, height: 18 },
  { id: "mine-interior-34", x: 81, y: 136, width: 22, height: 12 },
];

export const mineInteriorTransitions: (LogicalRect & { id: string })[] = [
  { id: "mine-interior-transition-1", x: 473, y: 68, width: 33, height: 39 },
  { id: "mine-interior-transition-2", x: 266, y: 320, width: 52, height: 28 },
];

export const mineInteriorSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "mine-interior-spawn-1", x: 469, y: 133, direction: "south" },
  { id: "mine-interior-spawn-2", x: 291, y: 276, direction: "south" },
];
