import type { LogicalRect, SceneCollider } from "../../collision";
import type { Direction } from "../../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const apothecaryStreetColliders: SceneCollider[] = [
  { id: "apothecary-street-1", x: 0, y: 370, width: 156, height: 475 },
  { id: "apothecary-street-2", x: 562, y: 370, width: 166, height: 482 },
  { id: "apothecary-street-3", x: 0, y: 845, width: 267, height: 69 },
  { id: "apothecary-street-4", x: 464, y: 845, width: 264, height: 69 },
  { id: "apothecary-street-5", x: 405, y: 0, width: 323, height: 359 },
  { id: "apothecary-street-6", x: 477, y: 440, width: 251, height: 129 },
  { id: "apothecary-street-7", x: 547, y: 353, width: 181, height: 166 },
  { id: "apothecary-street-8", x: 473, y: 564, width: 104, height: 56 },
  { id: "apothecary-street-9", x: 536, y: 678, width: 48, height: 67 },
  { id: "apothecary-street-10", x: 472, y: 792, width: 90, height: 57 },
  { id: "apothecary-street-11", x: 462, y: 711, width: 35, height: 93 },
  { id: "apothecary-street-12", x: 237, y: 661, width: 30, height: 186 },
  { id: "apothecary-street-13", x: 130, y: 723, width: 97, height: 87 },
  { id: "apothecary-street-14", x: 153, y: 438, width: 109, height: 121 },
  { id: "apothecary-street-15", x: 0, y: 0, width: 183, height: 432 },
  { id: "apothecary-street-16", x: 193, y: 0, width: 141, height: 339 },
  { id: "apothecary-street-17", x: 249, y: 0, width: 154, height: 310 },
  { id: "apothecary-street-18", x: 235, y: 328, width: 77, height: 47 },
  { id: "apothecary-street-19", x: 242, y: 559, width: 20, height: 52 },
  { id: "apothecary-street-20", x: 142, y: 551, width: 37, height: 64 },
];

export const apothecaryStreetTransitions: (LogicalRect & { id: string })[] = [
  {
    id: "apothecary-street-transition-1",
    x: 269,
    y: 890,
    width: 186,
    height: 20,
  },
  {
    id: "apothecary-street-transition-2",
    x: 336,
    y: 317,
    width: 54,
    height: 24,
  },
];

export const apothecaryStreetSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "apothecary-street-spawn-1", x: 364, y: 422, direction: "south" },
  { id: "apothecary-street-spawn-2", x: 364, y: 844, direction: "south" },
];
