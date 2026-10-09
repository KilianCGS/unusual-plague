import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";
import type { InteractionZone } from "../interactions/interactionZone";

// COLLIDERS (red): floor the feet cannot occupy.
export const apothecaryInteriorColliders: SceneCollider[] = [
  { id: "apothecary-interior-1", x: 392, y: 0, width: 17, height: 134 },
  { id: "apothecary-interior-2", x: 315, y: 6, width: 74, height: 90 },
  { id: "apothecary-interior-3", x: 14, y: 0, width: 298, height: 87 },
  { id: "apothecary-interior-4", x: 19, y: 107, width: 79, height: 103 },
  { id: "apothecary-interior-5", x: 10, y: 224, width: 96, height: 46 },
  { id: "apothecary-interior-6", x: 15, y: 211, width: 35, height: 17 },
  { id: "apothecary-interior-7", x: 101, y: 151, width: 20, height: 22 },
  { id: "apothecary-interior-8", x: 132, y: 86, width: 23, height: 11 },
  { id: "apothecary-interior-9", x: 246, y: 86, width: 16, height: 8 },
  { id: "apothecary-interior-10", x: 161, y: 87, width: 86, height: 4 },
  { id: "apothecary-interior-11", x: 48, y: 87, width: 31, height: 7 },
  { id: "apothecary-interior-12", x: 34, y: 93, width: 33, height: 12 },
  { id: "apothecary-interior-13", x: 105, y: 241, width: 95, height: 28 },
  { id: "apothecary-interior-14", x: 121, y: 230, width: 24, height: 11 },
  { id: "apothecary-interior-15", x: 324, y: 226, width: 31, height: 15 },
  { id: "apothecary-interior-16", x: 376, y: 212, width: 89, height: 30 },
  { id: "apothecary-interior-17", x: 390, y: 178, width: 44, height: 34 },
  { id: "apothecary-interior-18", x: 433, y: 201, width: 37, height: 12 },
  { id: "apothecary-interior-19", x: 403, y: 132, width: 8, height: 12 },
  { id: "apothecary-interior-20", x: 409, y: 120, width: 17, height: 13 },
  { id: "apothecary-interior-21", x: 459, y: 93, width: 21, height: 26 },
  { id: "apothecary-interior-22", x: 463, y: 120, width: 15, height: 138 },
  { id: "apothecary-interior-23", x: 272, y: 243, width: 156, height: 25 },
];

// TRANSITIONS (yellow): activation zones.
export const apothecaryInteriorTransitions: (LogicalRect & { id: string })[] = [
  { id: "apothecary-interior-transition-1", x: 426, y: 81, width: 34, height: 39 },
  { id: "apothecary-interior-transition-2", x: 200, y: 246, width: 72, height: 23 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const apothecaryInteriorSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  {
    id: "apothecary-interior-spawn-1",
    x: 444,
    y: 147,
    direction: "north",
  },
  {
    id: "apothecary-interior-spawn-2",
    x: 235,
    y: 219,
    direction: "south",
  },
];

// INTERACTIONS (green)
export const apothecaryInteriorInteractions: InteractionZone[] = [
  {
    id: "apothecary-interior-interaction-1",
    x: 99,
    y: 173,
    width: 22,
    height: 36,
    interactionId: "craft.manual",
  },
  {
    id: "apothecary-interior-interaction-2",
    x: 98,
    y: 107,
    width: 21,
    height: 43,
    interactionId: "craft.manual",
  },
  {
    id: "apothecary-interior-interaction-3",
    x: 315,
    y: 95,
    width: 74,
    height: 7,
    interactionId: "craft.fire",
  },
];
