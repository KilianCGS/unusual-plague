import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const apothecaryStreetColliders: SceneCollider[] = [
  { id: "apothecary-street-1", x: 533, y: 927, width: 307, height: 123 },
  { id: "apothecary-street-2", x: 667, y: 0, width: 173, height: 885 },
  { id: "apothecary-street-3", x: 468, y: 0, width: 187, height: 425 },
  { id: "apothecary-street-4", x: 0, y: 0, width: 380, height: 402 },
  { id: "apothecary-street-5", x: 0, y: 386, width: 199, height: 128 },
  { id: "apothecary-street-6", x: 640, y: 417, width: 37, height: 86 },
  { id: "apothecary-street-7", x: 302, y: 0, width: 170, height: 307 },
  { id: "apothecary-street-8", x: 636, y: 0, width: 55, height: 417 },
  { id: "apothecary-street-9", x: 273, y: 511, width: 35, height: 199 },
  { id: "apothecary-street-10", x: 162, y: 514, width: 110, height: 144 },
  { id: "apothecary-street-11", x: 275, y: 780, width: 33, height: 270 },
  { id: "apothecary-street-12", x: 0, y: 929, width: 275, height: 111 },
  { id: "apothecary-street-13", x: 0, y: 485, width: 145, height: 375 },
  { id: "apothecary-street-14", x: 130, y: 651, width: 69, height: 66 },
  { id: "apothecary-street-15", x: 130, y: 792, width: 63, height: 61 },
  { id: "apothecary-street-16", x: 0, y: 854, width: 110, height: 30 },
  { id: "apothecary-street-17", x: 213, y: 898, width: 52, height: 26 },
  { id: "apothecary-street-18", x: 231, y: 875, width: 54, height: 48 },
  { id: "apothecary-street-19", x: 611, y: 781, width: 52, height: 99 },
  { id: "apothecary-street-20", x: 529, y: 514, width: 40, height: 222 },
  { id: "apothecary-street-21", x: 556, y: 516, width: 114, height: 142 },
  { id: "apothecary-street-22", x: 532, y: 836, width: 40, height: 91 },
  { id: "apothecary-street-23", x: 717, y: 883, width: 123, height: 51 },
  { id: "apothecary-street-24", x: 0, y: 887, width: 5, height: 50 },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const apothecaryStreetTransitions: (LogicalRect & { id: string })[] = [
  { id: "apothecary-street-transition-1", x: 310, y: 1013, width: 222, height: 40 },
  { id: "apothecary-street-transition-2", x: 382, y: 336, width: 83, height: 52 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const apothecaryStreetSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "apothecary-street-spawn-1", x: 425, y: 450, direction: "south" },
  { id: "apothecary-street-spawn-2", x: 421, y: 972, direction: "north" },
];
