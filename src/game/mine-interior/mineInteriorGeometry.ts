import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const mineInteriorColliders: SceneCollider[] = [
  { id: "mine-interior-1", x: 359, y: 347, width: 272, height: 72 },
  { id: "mine-interior-2", x: 551, y: 16, width: 81, height: 336 },
  { id: "mine-interior-3", x: 431, y: 313, width: 115, height: 34 },
  { id: "mine-interior-4", x: 513, y: 276, width: 38, height: 39 },
  { id: "mine-interior-5", x: 0, y: 363, width: 274, height: 57 },
  { id: "mine-interior-6", x: 0, y: 5, width: 114, height: 403 },
  { id: "mine-interior-7", x: 116, y: 0, width: 262, height: 216 },
  { id: "mine-interior-8", x: 381, y: 11, width: 125, height: 183 },
  { id: "mine-interior-9", x: 437, y: 193, width: 67, height: 13 },
  { id: "mine-interior-10", x: 474, y: 207, width: 28, height: 11 },
  { id: "mine-interior-11", x: 508, y: 24, width: 48, height: 160 },
  { id: "mine-interior-12", x: 159, y: 214, width: 46, height: 32 },
  { id: "mine-interior-13", x: 113, y: 319, width: 114, height: 28 },
  { id: "mine-interior-14", x: 275, y: 217, width: 100, height: 25 },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const mineInteriorTransitions: (LogicalRect & { id: string })[] = [
  { id: "mine-interior-transition-1", x: 277, y: 396, width: 78, height: 24 },
  { id: "mine-interior-transition-2", x: 508, y: 186, width: 42, height: 30 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const mineInteriorSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "mine-interior-spawn-1", x: 497, y: 247, direction: "south" },
  { id: "mine-interior-spawn-2", x: 318, y: 357, direction: "south" },
];
