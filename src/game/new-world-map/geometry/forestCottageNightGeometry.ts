import type { LogicalRect, SceneCollider } from "../../collision";
import type { Direction } from "../../protagonist/useProtagonistController";

// 2026-11-19 (Kilian): the Witch's cottage AT NIGHT has its own geometry (the night painting is laid out differently
// from the day one). Used only on Day 4 (see world/nightScenes.ts). In this export transition-1 is the DOOR of the house
// and transition-2 the path north, to the forest, which Day 4 does not use: once he is at the cottage he cannot go back.

// COLLIDERS (red): floor the feet cannot occupy.
export const forestCottageNightColliders: SceneCollider[] = [
  { id: "forest-cottage-night-1", x: 0, y: 5, width: 640, height: 79 },
  { id: "forest-cottage-night-2", x: 0, y: 101, width: 613, height: 382 },
  { id: "forest-cottage-night-3", x: 397, y: 484, width: 186, height: 59 },
  { id: "forest-cottage-night-4", x: 0, y: 463, width: 293, height: 79 },
  { id: "forest-cottage-night-5", x: 0, y: 525, width: 281, height: 80 },
  { id: "forest-cottage-night-6", x: 645, y: 660, width: 781, height: 443 },
  { id: "forest-cottage-night-7", x: 762, y: 313, width: 664, height: 82 },
  { id: "forest-cottage-night-8", x: 819, y: 0, width: 607, height: 307 },
  { id: "forest-cottage-night-9", x: 755, y: 215, width: 118, height: 50 },
  { id: "forest-cottage-night-10", x: 742, y: 144, width: 80, height: 39 },
  { id: "forest-cottage-night-11", x: 762, y: 0, width: 97, height: 119 },
  { id: "forest-cottage-night-12", x: 753, y: 407, width: 673, height: 114 },
  { id: "forest-cottage-night-13", x: 788, y: 505, width: 270, height: 74 },
  { id: "forest-cottage-night-14", x: 896, y: 568, width: 94, height: 33 },
  { id: "forest-cottage-night-15", x: 1010, y: 580, width: 64, height: 22 },
  { id: "forest-cottage-night-16", x: 1261, y: 446, width: 165, height: 222 },
  { id: "forest-cottage-night-17", x: 1011, y: 597, width: 36, height: 81 },
  { id: "forest-cottage-night-18", x: 0, y: 677, width: 638, height: 426 },
  { id: "forest-cottage-night-19", x: 285, y: 644, width: 46, height: 37 },
  { id: "forest-cottage-night-20", x: 0, y: 560, width: 199, height: 121 },
  { id: "forest-cottage-night-21", x: 575, y: 429, width: 67, height: 73 },
  { id: "forest-cottage-night-22", x: 591, y: 304, width: 53, height: 64 },
  { id: "forest-cottage-night-23", x: 579, y: 82, width: 53, height: 83 },
  { id: "forest-cottage-night-24", x: 822, y: 296, width: 42, height: 279 },
];

// TRANSITIONS (yellow): activation zones.
export const forestCottageNightTransitions: (LogicalRect & { id: string })[] = [
  { id: "forest-cottage-night-transition-1", x: 311, y: 494, width: 75, height: 33 },
  { id: "forest-cottage-night-transition-2", x: 645, y: 1, width: 121, height: 29 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const forestCottageNightSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "forest-cottage-night-spawn-1", x: 690, y: 100, direction: "south" },
];
