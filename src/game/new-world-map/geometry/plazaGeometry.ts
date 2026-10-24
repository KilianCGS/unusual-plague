import type { LogicalRect, SceneCollider } from "../../collision";
import type { Direction } from "../../protagonist/useProtagonistController";

// NEW WORLD MAP. First pass authored on the new background (1.0 unit per asset pixel):
// simple, practical rectangles. Repaint in /dev/collisions (with NEXT_PUBLIC_WORLD=new)
// and save over this file; the export names are the same ones it writes.

// COLLIDERS (red): floor the feet cannot occupy.
export const plazaColliders: SceneCollider[] = [
  { id: "plaza-1", x: 0, y: 0, width: 635, height: 215 },
  { id: "plaza-2", x: 0, y: 215, width: 265, height: 250 },
  { id: "plaza-3", x: 400, y: 275, width: 135, height: 125 },
  { id: "plaza-4", x: 890, y: 0, width: 646, height: 215 },
  { id: "plaza-5", x: 925, y: 120, width: 155, height: 135 },
  { id: "plaza-6", x: 1215, y: 185, width: 60, height: 175 },
  { id: "plaza-7", x: 1270, y: 150, width: 266, height: 315 },
  { id: "plaza-8", x: 0, y: 555, width: 275, height: 315 },
  { id: "plaza-9", x: 0, y: 865, width: 610, height: 159 },
  { id: "plaza-10", x: 885, y: 865, width: 651, height: 159 },
  { id: "plaza-11", x: 1300, y: 598, width: 236, height: 270 },
  { id: "plaza-12", x: 685, y: 375, width: 185, height: 230 },
  { id: "plaza-13", x: 555, y: 750, width: 30, height: 115 },
  { id: "plaza-14", x: 1255, y: 750, width: 30, height: 115 },
];

// TRANSITIONS (yellow): activation zones.
export const plazaTransitions: (LogicalRect & { id: string })[] = [
  { id: "plaza-transition-1", x: 650, y: 0, width: 230, height: 25 },
  { id: "plaza-transition-2", x: 0, y: 480, width: 30, height: 110 },
  { id: "plaza-transition-3", x: 1506, y: 480, width: 30, height: 110 },
  { id: "plaza-transition-4", x: 645, y: 999, width: 235, height: 25 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const plazaSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "plaza-spawn-1", x: 1440, y: 540, direction: "west" },
  { id: "plaza-spawn-2", x: 770, y: 110, direction: "south" },
  { id: "plaza-spawn-3", x: 100, y: 540, direction: "east" },
  { id: "plaza-spawn-4", x: 765, y: 930, direction: "north" },
];
