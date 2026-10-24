import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

export const mineNaturalCaveColliders: SceneCollider[] = [
  { id: "mine-natural-cave-7", x: 344, y: 2, width: 238, height: 136 },
  { id: "mine-natural-cave-8", x: 349, y: 141, width: 226, height: 96 },
  { id: "mine-natural-cave-9", x: 373, y: 238, width: 203, height: 18 },
  { id: "mine-natural-cave-10", x: 511, y: 261, width: 71, height: 88 },
  { id: "mine-natural-cave-11", x: 32, y: 303, width: 459, height: 46 },
  { id: "mine-natural-cave-12", x: 129, y: 3, width: 78, height: 131 },
  { id: "mine-natural-cave-13", x: 212, y: 2, width: 169, height: 119 },
  { id: "mine-natural-cave-14", x: 290, y: 141, width: 61, height: 38 },
  { id: "mine-natural-cave-15", x: 301, y: 180, width: 42, height: 14 },
  { id: "mine-natural-cave-16", x: 311, y: 197, width: 35, height: 11 },
  { id: "mine-natural-cave-17", x: 326, y: 213, width: 22, height: 11 },
  { id: "mine-natural-cave-18", x: 328, y: 206, width: 25, height: 20 },
  { id: "mine-natural-cave-19", x: 332, y: 116, width: 19, height: 23 },
  { id: "mine-natural-cave-20", x: 0, y: 0, width: 67, height: 157 },
  { id: "mine-natural-cave-21", x: 120, y: 0, width: 10, height: 131 },
  { id: "mine-natural-cave-22", x: 47, y: 0, width: 67, height: 102 },
  { id: "mine-natural-cave-23", x: 111, y: 0, width: 27, height: 103 },
  { id: "mine-natural-cave-24", x: 0, y: 138, width: 47, height: 94 },
  { id: "mine-natural-cave-25", x: 46, y: 228, width: 33, height: 34 },
  { id: "mine-natural-cave-26", x: 81, y: 251, width: 37, height: 23 },
  { id: "mine-natural-cave-27", x: 123, y: 279, width: 30, height: 10 },
  { id: "mine-natural-cave-28", x: 125, y: 267, width: 41, height: 26 },
  { id: "mine-natural-cave-29", x: 164, y: 284, width: 39, height: 20 },
  { id: "mine-natural-cave-30", x: 106, y: 267, width: 20, height: 9 },
  { id: "mine-natural-cave-31", x: 296, y: 294, width: 34, height: 8 },
  { id: "mine-natural-cave-32", x: 483, y: 286, width: 39, height: 64 },
];

export const mineNaturalCaveTransitions: (LogicalRect & { id: string })[] = [
  {
    id: "mine-natural-cave-transition-1",
    x: 67,
    y: 115,
    width: 49,
    height: 29,
  },
];

export const mineNaturalCaveSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [{ id: "mine-natural-cave-spawn-2", x: 119, y: 177, direction: "south" }];
