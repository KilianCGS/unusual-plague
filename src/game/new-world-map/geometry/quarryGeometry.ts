import type { LogicalRect, SceneCollider } from "../../collision";
import type { OcclusionShape } from "../../occlusion";
import type { Direction } from "../../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const quarryColliders: SceneCollider[] = [
  { id: "quarry-1", x: 0, y: 0, width: 594, height: 109 },
  { id: "quarry-2", x: 0, y: 0, width: 463, height: 167 },
  { id: "quarry-3", x: 0, y: 107, width: 481, height: 100 },
  { id: "quarry-4", x: 327, y: 192, width: 120, height: 48 },
  { id: "quarry-5", x: 0, y: 144, width: 350, height: 111 },
  { id: "quarry-6", x: 0, y: 344, width: 304, height: 54 },
  { id: "quarry-7", x: 0, y: 175, width: 67, height: 167 },
  { id: "quarry-8", x: 47, y: 216, width: 72, height: 82 },
  { id: "quarry-9", x: 123, y: 395, width: 76, height: 52 },
  { id: "quarry-10", x: 179, y: 425, width: 62, height: 48 },
  { id: "quarry-11", x: 0, y: 497, width: 209, height: 49 },
  { id: "quarry-12", x: 0, y: 469, width: 161, height: 30 },
  { id: "quarry-13", x: 25, y: 396, width: 47, height: 79 },
  { id: "quarry-14", x: 0, y: 634, width: 1323, height: 121 },
  { id: "quarry-15", x: 333, y: 571, width: 169, height: 23 },
  { id: "quarry-16", x: 447, y: 560, width: 70, height: 40 },
  { id: "quarry-17", x: 412, y: 538, width: 175, height: 30 },
  { id: "quarry-18", x: 510, y: 566, width: 38, height: 18 },
  { id: "quarry-19", x: 642, y: 511, width: 74, height: 31 },
  { id: "quarry-20", x: 763, y: 551, width: 55, height: 8 },
  { id: "quarry-21", x: 801, y: 537, width: 41, height: 10 },
  { id: "quarry-22", x: 931, y: 559, width: 63, height: 16 },
  { id: "quarry-23", x: 977, y: 543, width: 53, height: 17 },
  { id: "quarry-24", x: 1109, y: 383, width: 223, height: 97 },
  { id: "quarry-25", x: 1011, y: 567, width: 321, height: 63 },
  { id: "quarry-26", x: 1070, y: 521, width: 78, height: 45 },
  { id: "quarry-27", x: 1186, y: 431, width: 146, height: 127 },
  { id: "quarry-28", x: 840, y: 0, width: 492, height: 251 },
  { id: "quarry-29", x: 1044, y: 136, width: 288, height: 132 },
  { id: "quarry-30", x: 1201, y: 205, width: 131, height: 97 },
  { id: "quarry-31", x: 1233, y: 280, width: 99, height: 96 },
  { id: "quarry-32", x: 747, y: 0, width: 212, height: 117 },
  { id: "quarry-33", x: 767, y: 192, width: 20, height: 18 },
  { id: "quarry-34", x: 514, y: 168, width: 31, height: 19 },
  { id: "quarry-35", x: 151, y: 544, width: 86, height: 88 },
  { id: "quarry-36", x: 594, y: 595, width: 26, height: 17 },
  { id: "quarry-37", x: 816, y: 588, width: 79, height: 39 },
  { id: "quarry-38", x: 727, y: 621, width: 37, height: 11 },
  { id: "quarry-39", x: 899, y: 610, width: 102, height: 24 },
  { id: "quarry-40", x: 225, y: 602, width: 72, height: 34 },
];

// DEPTH SHAPES (violet): part of the background that covers the Doctor
// while his feet are above depthY (a treetop, a roof).
export const quarryOccluders: OcclusionShape[] = [
  { id: "quarry-depth-1", depthY: 557, points: [{ x: 933, y: 557 }, { x: 944, y: 546 }, { x: 993, y: 520 }, { x: 1004, y: 517 }, { x: 1007, y: 525 }, { x: 1022, y: 533 }] },
  { id: "quarry-depth-2", depthY: 397, points: [{ x: 1003, y: 397 }, { x: 1047, y: 341 }, { x: 1155, y: 304 }, { x: 1198, y: 364 }] },
  { id: "quarry-depth-3", depthY: 570, points: [{ x: 502, y: 460 }, { x: 576, y: 534 }, { x: 354, y: 570 }, { x: 418, y: 504 }] },
  { id: "quarry-depth-4", depthY: 631, points: [{ x: 633, y: 628 }, { x: 627, y: 623 }, { x: 632, y: 619 }, { x: 638, y: 616 }, { x: 639, y: 607 }, { x: 647, y: 607 }, { x: 652, y: 609 }, { x: 658, y: 599 }, { x: 665, y: 598 }, { x: 670, y: 605 }, { x: 675, y: 596 }, { x: 683, y: 602 }, { x: 701, y: 609 }, { x: 705, y: 618 }, { x: 705, y: 620 }, { x: 713, y: 631 }] },
  { id: "quarry-depth-5", depthY: 551, points: [{ x: 766, y: 551 }, { x: 757, y: 546 }, { x: 757, y: 539 }, { x: 832, y: 522 }, { x: 847, y: 530 }, { x: 847, y: 535 }] },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const quarryTransitions: (LogicalRect & { id: string })[] = [
  { id: "quarry-transition-1", x: 594, y: 3, width: 149, height: 51 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const quarrySpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "quarry-spawn-1", x: 669, y: 131, direction: "south" },
];
