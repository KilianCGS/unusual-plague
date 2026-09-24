import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

export const forestColliders: SceneCollider[] = [
  { id: "forest-1", x: 0, y: 0, width: 249, height: 420 },
  { id: "forest-2", x: 256, y: 0, width: 704, height: 150 },
  { id: "forest-3", x: 464, y: 257, width: 496, height: 140 },
  { id: "forest-4", x: 521, y: 148, width: 439, height: 126 },
  { id: "forest-5", x: 478, y: 641, width: 136, height: 104 },
  { id: "forest-6", x: 503, y: 621, width: 101, height: 22 },
  { id: "forest-7", x: 615, y: 660, width: 18, height: 82 },
  { id: "forest-8", x: 692, y: 514, width: 268, height: 89 },
  { id: "forest-9", x: 819, y: 370, width: 141, height: 138 },
  { id: "forest-10", x: 606, y: 400, width: 216, height: 41 },
  { id: "forest-11", x: 631, y: 446, width: 148, height: 22 },
  { id: "forest-12", x: 672, y: 473, width: 64, height: 11 },
  { id: "forest-13", x: 449, y: 350, width: 20, height: 43 },
  { id: "forest-14", x: 309, y: 181, width: 96, height: 41 },
  { id: "forest-15", x: 138, y: 421, width: 60, height: 17 },
  { id: "forest-16", x: 253, y: 249, width: 41, height: 117 },
  { id: "forest-17", x: 158, y: 531, width: 196, height: 132 },
  { id: "forest-18", x: 0, y: 572, width: 160, height: 388 },
  { id: "forest-19", x: 98, y: 666, width: 221, height: 294 },
  { id: "forest-20", x: 310, y: 865, width: 127, height: 84 },
  { id: "forest-21", x: 326, y: 822, width: 27, height: 43 },
  { id: "forest-22", x: 332, y: 843, width: 72, height: 31 },
  { id: "forest-23", x: 440, y: 868, width: 520, height: 92 },
  { id: "forest-24", x: 663, y: 729, width: 297, height: 176 },
  { id: "forest-25", x: 741, y: 602, width: 219, height: 157 },
  { id: "forest-26", x: 695, y: 599, width: 47, height: 37 },
  { id: "forest-27", x: 521, y: 745, width: 70, height: 51 },
  { id: "forest-28", x: 599, y: 770, width: 77, height: 116 },
  { id: "forest-29", x: 486, y: 827, width: 146, height: 38 },
  { id: "forest-30", x: 522, y: 791, width: 87, height: 42 },
  { id: "forest-31", x: 585, y: 770, width: 33, height: 20 },
  { id: "forest-32", x: 449, y: 833, width: 68, height: 49 },
  { id: "forest-33", x: 17, y: 420, width: 52, height: 18 },
  { id: "forest-34", x: 458, y: 141, width: 53, height: 27 },
  { id: "forest-35", x: 799, y: 477, width: 20, height: 53 },
  { id: "forest-36", x: 0, y: 540, width: 63, height: 30 },
  { id: "forest-37", x: 0, y: 518, width: 53, height: 30 },
];

export const forestTransitions: (LogicalRect & { id: string })[] = [
  { id: "forest-transition-1", x: 0, y: 438, width: 36, height: 81 },
];

export const forestSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "forest-spawn-1", x: 74, y: 491, direction: "east" },
];
