import type { LogicalRect, SceneCollider } from "../../collision";
import type { Direction } from "../../protagonist/useProtagonistController";
import type { InteractionZone } from "../../interactions/interactionZone";

// COLLIDERS (red): floor the feet cannot occupy.
export const forestColliders: SceneCollider[] = [
  { id: "forest-1", x: 400, y: 0, width: 370, height: 60 },
  { id: "forest-2", x: 880, y: 0, width: 546, height: 525 },
  { id: "forest-3", x: 1100, y: 525, width: 326, height: 75 },
  { id: "forest-4", x: 0, y: 600, width: 540, height: 503 },
  { id: "forest-5", x: 1040, y: 600, width: 386, height: 503 },
  { id: "forest-6", x: 830, y: 960, width: 596, height: 143 },
  { id: "forest-7", x: 657, y: 165, width: 75, height: 37 },
  { id: "forest-8", x: 764, y: 148, width: 126, height: 115 },
  { id: "forest-9", x: 775, y: 0, width: 117, height: 147 },
  { id: "forest-10", x: 403, y: 232, width: 61, height: 68 },
  { id: "forest-11", x: 405, y: 298, width: 56, height: 53 },
  { id: "forest-12", x: 474, y: 242, width: 29, height: 56 },
  { id: "forest-13", x: 327, y: 2, width: 74, height: 155 },
  { id: "forest-14", x: 277, y: 206, width: 132, height: 46 },
  { id: "forest-15", x: 0, y: 0, width: 294, height: 463 },
  { id: "forest-16", x: 302, y: 347, width: 108, height: 98 },
  { id: "forest-17", x: 290, y: 233, width: 126, height: 128 },
  { id: "forest-18", x: 275, y: 0, width: 64, height: 204 },
  { id: "forest-19", x: 738, y: 384, width: 104, height: 72 },
  { id: "forest-20", x: 672, y: 347, width: 134, height: 50 },
  { id: "forest-21", x: 691, y: 307, width: 98, height: 33 },
  { id: "forest-22", x: 784, y: 733, width: 112, height: 67 },
  { id: "forest-23", x: 889, y: 783, width: 57, height: 103 },
  { id: "forest-24", x: 913, y: 899, width: 94, height: 51 },
  { id: "forest-25", x: 813, y: 888, width: 55, height: 74 },
  { id: "forest-26", x: 738, y: 806, width: 72, height: 94 },
  { id: "forest-27", x: 730, y: 750, width: 78, height: 46 },
  { id: "forest-28", x: 806, y: 777, width: 90, height: 105 },
  { id: "forest-29", x: 539, y: 762, width: 38, height: 29 },
  { id: "forest-30", x: 539, y: 1064, width: 39, height: 33 },
  { id: "forest-31", x: 474, y: 119, width: 71, height: 39 },
  { id: "forest-32", x: 536, y: 109, width: 81, height: 27 },
  { id: "forest-33", x: 546, y: 130, width: 41, height: 21 },
  { id: "forest-34", x: 570, y: 1063, width: 117, height: 30 },
];

export const forestTransitions: (LogicalRect & { id: string })[] = [
  { id: "forest-transition-1", x: 0, y: 495, width: 25, height: 100 },
  { id: "forest-transition-2", x: 696, y: 1059, width: 135, height: 35 },
];

export const forestSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "forest-spawn-1", x: 110, y: 550, direction: "east" },
  { id: "forest-spawn-2", x: 690, y: 1010, direction: "north" },
];

// Reserved for future use: authored by hand, blank interactionId. It is NOT
// registered in sceneInteractions.ts (an [E] prompt that does nothing).
export const forestInteractions: InteractionZone[] = [
  {
    id: "forest-interaction-1",
    x: 759,
    y: 642,
    width: 43,
    height: 38,
    interactionId: "",
  },
];
