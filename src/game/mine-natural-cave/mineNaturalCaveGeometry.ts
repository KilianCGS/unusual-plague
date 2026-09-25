import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const mineNaturalCaveColliders: SceneCollider[] = [
  { id: "mine-natural-cave-1", x: 1, y: 465, width: 692, height: 85 },
  { id: "mine-natural-cave-2", x: 0, y: 443, width: 186, height: 24 },
  { id: "mine-natural-cave-3", x: 0, y: 424, width: 118, height: 20 },
  { id: "mine-natural-cave-4", x: 4, y: 2, width: 146, height: 319 },
  { id: "mine-natural-cave-5", x: 152, y: 0, width: 96, height: 305 },
  { id: "mine-natural-cave-6", x: 254, y: 0, width: 439, height: 259 },
  { id: "mine-natural-cave-7", x: 289, y: 260, width: 403, height: 61 },
  { id: "mine-natural-cave-8", x: 337, y: 321, width: 356, height: 17 },
  { id: "mine-natural-cave-9", x: 386, y: 341, width: 307, height: 23 },
  { id: "mine-natural-cave-10", x: 404, y: 366, width: 127, height: 21 },
  { id: "mine-natural-cave-11", x: 592, y: 367, width: 101, height: 96 },
  { id: "mine-natural-cave-12", x: 411, y: 440, width: 176, height: 25 },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const mineNaturalCaveTransitions: (LogicalRect & { id: string })[] = [
  { id: "mine-natural-cave-transition-1", x: 0, y: 325, width: 26, height: 98 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const mineNaturalCaveSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "mine-natural-cave-spawn-1", x: 66, y: 372, direction: "south" },
];
