import type { LogicalRect, SceneCollider } from "../../collision";
import type { Direction } from "../../protagonist/useProtagonistController";

// NEW WORLD MAP. First pass authored on the new background (0.8 unit per asset pixel):
// simple, practical rectangles. Repaint in /dev/collisions (with NEXT_PUBLIC_WORLD=new)
// and save over this file; the export names are the same ones it writes.

// COLLIDERS (red): floor the feet cannot occupy.
export const mountainPathColliders: SceneCollider[] = [
  { id: "mountain-path-1", x: 0, y: 0, width: 264, height: 320 },
  { id: "mountain-path-2", x: 0, y: 320, width: 80, height: 264 },
  { id: "mountain-path-3", x: 76, y: 360, width: 92, height: 80 },
  { id: "mountain-path-4", x: 104, y: 444, width: 104, height: 76 },
  { id: "mountain-path-5", x: 264, y: 0, width: 1068, height: 184 },
  { id: "mountain-path-6", x: 264, y: 184, width: 304, height: 160 },
  { id: "mountain-path-7", x: 560, y: 184, width: 320, height: 120 },
  { id: "mountain-path-8", x: 872, y: 184, width: 460, height: 156 },
  { id: "mountain-path-9", x: 1140, y: 288, width: 192, height: 116 },
  { id: "mountain-path-10", x: 796, y: 316, width: 136, height: 80 },
  { id: "mountain-path-11", x: 332, y: 296, width: 156, height: 96 },
  { id: "mountain-path-12", x: 400, y: 468, width: 160, height: 96 },
  { id: "mountain-path-13", x: 736, y: 516, width: 112, height: 80 },
  { id: "mountain-path-14", x: 0, y: 560, width: 520, height: 196 },
  { id: "mountain-path-15", x: 520, y: 632, width: 812, height: 124 },
  { id: "mountain-path-16", x: 1268, y: 524, width: 64, height: 232 },
];

// TRANSITIONS (yellow): activation zones.
export const mountainPathTransitions: (LogicalRect & { id: string })[] = [
  { id: "mountain-path-transition-1", x: 1312, y: 432, width: 20, height: 88 },
  { id: "mountain-path-transition-2", x: 112, y: 316, width: 152, height: 52 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const mountainPathSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "mountain-path-spawn-1", x: 1248, y: 476, direction: "west" },
  { id: "mountain-path-spawn-2", x: 224, y: 408, direction: "south" },
];
