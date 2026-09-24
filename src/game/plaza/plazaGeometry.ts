import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const plazaColliders: SceneCollider[] = [
  { id: "plaza-1", x: 0, y: 0, width: 149, height: 411 },
  { id: "plaza-2", x: 135, y: 0, width: 263, height: 182 },
  { id: "plaza-3", x: 157, y: 182, width: 211, height: 26 },
  { id: "plaza-4", x: 150, y: 206, width: 38, height: 109 },
  { id: "plaza-5", x: 546, y: 352, width: 72, height: 82 },
  { id: "plaza-6", x: 561, y: 2, width: 399, height: 182 },
  { id: "plaza-7", x: 814, y: 185, width: 146, height: 220 },
  { id: "plaza-8", x: 824, y: 538, width: 136, height: 420 },
  { id: "plaza-9", x: 815, y: 538, width: 8, height: 416 },
  { id: "plaza-10", x: 562, y: 781, width: 275, height: 177 },
  { id: "plaza-11", x: 0, y: 786, width: 394, height: 174 },
  { id: "plaza-12", x: 0, y: 531, width: 148, height: 262 },
  { id: "plaza-13", x: 124, y: 595, width: 66, height: 186 },
  { id: "plaza-14", x: 191, y: 740, width: 175, height: 45 },
  { id: "plaza-15", x: 607, y: 747, width: 203, height: 33 },
  { id: "plaza-16", x: 639, y: 721, width: 83, height: 21 },
  { id: "plaza-17", x: 770, y: 579, width: 44, height: 164 },
  { id: "plaza-18", x: 565, y: 181, width: 97, height: 32 },
  { id: "plaza-19", x: 717, y: 179, width: 106, height: 34 },
  { id: "plaza-20", x: 781, y: 208, width: 40, height: 114 },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const plazaTransitions: (LogicalRect & { id: string })[] = [
  { id: "plaza-transition-1", x: 400, y: 2, width: 159, height: 43 },
  { id: "plaza-transition-2", x: 0, y: 406, width: 65, height: 129 },
  { id: "plaza-transition-3", x: 910, y: 405, width: 50, height: 132 },
  { id: "plaza-transition-4", x: 399, y: 918, width: 168, height: 40 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const plazaSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "plaza-spawn-1", x: 888, y: 476, direction: "west" },
  { id: "plaza-spawn-2", x: 480, y: 72, direction: "south" },
  { id: "plaza-spawn-3", x: 90, y: 475, direction: "east" },
  { id: "plaza-spawn-4", x: 486, y: 895, direction: "north" },
];
