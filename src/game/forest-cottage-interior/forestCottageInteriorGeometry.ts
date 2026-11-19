import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// 2026-11-19 (Kilian): redrawn. The house is only entered on Day 4 and the game ends in it, so there is NO way back
// out: no transition (the scene has no exits, see newWorldScenes.ts).

// COLLIDERS (red): floor the feet cannot occupy.
export const forestCottageInteriorColliders: SceneCollider[] = [
  { id: "forest-cottage-interior-1", x: 3, y: 0, width: 510, height: 158 },
  { id: "forest-cottage-interior-2", x: 175, y: 155, width: 25, height: 17 },
  { id: "forest-cottage-interior-3", x: 449, y: 147, width: 64, height: 45 },
  { id: "forest-cottage-interior-4", x: 474, y: 191, width: 39, height: 196 },
  { id: "forest-cottage-interior-5", x: 296, y: 330, width: 217, height: 65 },
  { id: "forest-cottage-interior-6", x: 366, y: 253, width: 108, height: 73 },
  { id: "forest-cottage-interior-7", x: 0, y: 334, width: 223, height: 55 },
  { id: "forest-cottage-interior-8", x: 0, y: 131, width: 25, height: 201 },
  { id: "forest-cottage-interior-9", x: 27, y: 155, width: 19, height: 97 },
  { id: "forest-cottage-interior-10", x: 50, y: 155, width: 27, height: 31 },
];

// TRANSITIONS (yellow): none: the game ends here.
export const forestCottageInteriorTransitions: (LogicalRect & { id: string })[] = [];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const forestCottageInteriorSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "forest-cottage-interior-spawn-1", x: 258, y: 320, direction: "south" },
];
