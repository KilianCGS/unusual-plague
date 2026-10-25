import type { LogicalRect, SceneCollider } from "../../collision";
import type { Direction } from "../../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const smithyStreetColliders: SceneCollider[] = [
  { id: "smithy-street-1", x: 1250, y: 420, width: 110, height: 70 },
  { id: "smithy-street-2", x: 1425, y: 410, width: 90, height: 70 },
  { id: "smithy-street-3", x: 0, y: 610, width: 75, height: 50 },
  { id: "smithy-street-4", x: 0, y: 655, width: 1619, height: 316 },
  { id: "smithy-street-5", x: 16, y: 0, width: 1603, height: 201 },
  { id: "smithy-street-6", x: 373, y: 307, width: 1246, height: 94 },
  { id: "smithy-street-7", x: 708, y: 402, width: 180, height: 38 },
  { id: "smithy-street-8", x: 902, y: 398, width: 58, height: 25 },
  { id: "smithy-street-9", x: 176, y: 328, width: 55, height: 34 },
  { id: "smithy-street-10", x: 179, y: 412, width: 34, height: 31 },
  { id: "smithy-street-11", x: 0, y: 302, width: 179, height: 78 },
  { id: "smithy-street-12", x: 0, y: 247, width: 181, height: 54 },
  { id: "smithy-street-13", x: 0, y: 194, width: 132, height: 56 },
  { id: "smithy-street-14", x: 290, y: 198, width: 79, height: 44 },
  { id: "smithy-street-15", x: 103, y: 197, width: 155, height: 27 },
  { id: "smithy-street-16", x: 434, y: 54, width: 1185, height: 241 },
  { id: "smithy-street-17", x: 1104, y: 367, width: 142, height: 66 },
  { id: "smithy-street-18", x: 1363, y: 398, width: 61, height: 43 },
  { id: "smithy-street-19", x: 1513, y: 405, width: 106, height: 30 },
  { id: "smithy-street-20", x: 431, y: 390, width: 39, height: 53 },
  { id: "smithy-street-21", x: 50, y: 375, width: 81, height: 28 },
  { id: "smithy-street-22", x: 0, y: 368, width: 70, height: 53 },
  { id: "smithy-street-23", x: 0, y: 414, width: 38, height: 31 },
  { id: "smithy-street-24", x: 0, y: 592, width: 32, height: 18 },
];

export const smithyStreetTransitions: (LogicalRect & { id: string })[] = [
  { id: "smithy-street-transition-1", x: 470, y: 405, width: 215, height: 40 },
  { id: "smithy-street-transition-2", x: 1594, y: 445, width: 25, height: 200 },
  { id: "smithy-street-transition-3", x: 0, y: 445, width: 25, height: 160 },
];

export const smithyStreetSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "smithy-street-spawn-1", x: 1520, y: 545, direction: "west" },
  { id: "smithy-street-spawn-2", x: 90, y: 525, direction: "east" },
  { id: "smithy-street-spawn-3", x: 570, y: 495, direction: "south" },
];
