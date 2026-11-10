import type { LogicalRect, SceneCollider } from "../../collision";
import type { OcclusionShape } from "../../occlusion";
import type { Direction } from "../../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const bakeryStreetColliders: SceneCollider[] = [
  { id: "bakery-street-1", x: 0, y: 616, width: 49, height: 189 },
  { id: "bakery-street-2", x: 500, y: 0, width: 318, height: 263 },
  { id: "bakery-street-3", x: 553, y: 262, width: 265, height: 375 },
  { id: "bakery-street-4", x: 770, y: 560, width: 48, height: 245 },
  { id: "bakery-street-5", x: 689, y: 675, width: 78, height: 109 },
  { id: "bakery-street-6", x: 0, y: 0, width: 323, height: 233 },
  { id: "bakery-street-7", x: 282, y: 0, width: 58, height: 62 },
  { id: "bakery-street-8", x: 515, y: 354, width: 33, height: 39 },
  { id: "bakery-street-9", x: 502, y: 352, width: 15, height: 42 },
  { id: "bakery-street-10", x: 322, y: 354, width: 35, height: 39 },
  { id: "bakery-street-11", x: 484, y: 0, width: 14, height: 61 },
  { id: "bakery-street-12", x: 338, y: 7, width: 17, height: 52 },
  { id: "bakery-street-13", x: 267, y: 229, width: 23, height: 32 },
  { id: "bakery-street-14", x: 526, y: 510, width: 25, height: 91 },
  { id: "bakery-street-15", x: 503, y: 456, width: 51, height: 32 },
  { id: "bakery-street-16", x: 520, y: 400, width: 32, height: 56 },
  { id: "bakery-street-17", x: 0, y: 280, width: 318, height: 322 },
  { id: "bakery-street-18", x: 253, y: 260, width: 34, height: 27 },
  { id: "bakery-street-19", x: 319, y: 530, width: 24, height: 27 },
  { id: "bakery-street-20", x: 318, y: 554, width: 30, height: 30 },
  { id: "bakery-street-21", x: 278, y: 596, width: 55, height: 40 },
  { id: "bakery-street-22", x: 130, y: 642, width: 36, height: 29 },
  { id: "bakery-street-23", x: 40, y: 602, width: 116, height: 47 },
  { id: "bakery-street-24", x: 63, y: 679, width: 29, height: 38 },
  { id: "bakery-street-25", x: 85, y: 721, width: 62, height: 21 },
  { id: "bakery-street-26", x: 147, y: 740, width: 32, height: 11 },
  { id: "bakery-street-27", x: 132, y: 754, width: 30, height: 13 },
  { id: "bakery-street-28", x: 84, y: 742, width: 28, height: 25 },
  { id: "bakery-street-29", x: 0, y: 819, width: 192, height: 102 },
  { id: "bakery-street-30", x: 197, y: 850, width: 621, height: 82 },
  { id: "bakery-street-31", x: 629, y: 818, width: 189, height: 47 },
  { id: "bakery-street-32", x: 773, y: 803, width: 45, height: 24 },
];

// DEPTH SHAPES (violet): part of the background that covers the Doctor
// while his feet are above depthY (a treetop, a roof).
export const bakeryStreetOccluders: OcclusionShape[] = [
  { id: "bakery-street-depth-1", depthY: 846, points: [{ x: 199, y: 823 }, { x: 210, y: 824 }, { x: 216, y: 833 }, { x: 222, y: 821 }, { x: 227, y: 831 }, { x: 232, y: 831 }, { x: 240, y: 819 }, { x: 247, y: 831 }, { x: 252, y: 822 }, { x: 258, y: 821 }, { x: 267, y: 828 }, { x: 272, y: 822 }, { x: 285, y: 831 }, { x: 287, y: 822 }, { x: 295, y: 832 }, { x: 311, y: 832 }, { x: 310, y: 820 }, { x: 318, y: 831 }, { x: 327, y: 834 }, { x: 332, y: 822 }, { x: 338, y: 832 }, { x: 340, y: 831 }, { x: 343, y: 822 }, { x: 350, y: 826 }, { x: 350, y: 832 }, { x: 357, y: 833 }, { x: 363, y: 823 }, { x: 369, y: 833 }, { x: 376, y: 833 }, { x: 380, y: 823 }, { x: 386, y: 832 }, { x: 395, y: 831 }, { x: 397, y: 821 }, { x: 410, y: 821 }, { x: 410, y: 810 }, { x: 414, y: 803 }, { x: 424, y: 799 }, { x: 425, y: 796 }, { x: 419, y: 790 }, { x: 424, y: 786 }, { x: 434, y: 783 }, { x: 428, y: 778 }, { x: 431, y: 776 }, { x: 443, y: 776 }, { x: 442, y: 771 }, { x: 444, y: 768 }, { x: 449, y: 768 }, { x: 456, y: 763 }, { x: 461, y: 764 }, { x: 469, y: 758 }, { x: 481, y: 754 }, { x: 480, y: 753 }, { x: 485, y: 758 }, { x: 499, y: 763 }, { x: 518, y: 764 }, { x: 518, y: 768 }, { x: 522, y: 768 }, { x: 525, y: 773 }, { x: 531, y: 775 }, { x: 535, y: 780 }, { x: 533, y: 785 }, { x: 540, y: 785 }, { x: 548, y: 789 }, { x: 556, y: 800 }, { x: 553, y: 805 }, { x: 559, y: 811 }, { x: 560, y: 812 }, { x: 559, y: 819 }, { x: 560, y: 822 }, { x: 568, y: 825 }, { x: 570, y: 823 }, { x: 574, y: 833 }, { x: 582, y: 833 }, { x: 582, y: 824 }, { x: 589, y: 822 }, { x: 595, y: 834 }, { x: 601, y: 834 }, { x: 601, y: 826 }, { x: 609, y: 818 }, { x: 615, y: 834 }, { x: 617, y: 824 }, { x: 623, y: 819 }, { x: 630, y: 822 }, { x: 630, y: 806 }, { x: 659, y: 805 }, { x: 660, y: 818 }, { x: 660, y: 846 }, { x: 169, y: 845 }, { x: 164, y: 807 }, { x: 194, y: 807 }] },
  { id: "bakery-street-depth-2", depthY: 524, points: [{ x: 501, y: 502 }, { x: 503, y: 514 }, { x: 499, y: 514 }, { x: 499, y: 521 }, { x: 509, y: 524 }, { x: 516, y: 523 }, { x: 520, y: 520 }, { x: 520, y: 514 }, { x: 515, y: 514 }, { x: 515, y: 506 }, { x: 518, y: 504 }, { x: 519, y: 501 }, { x: 510, y: 493 }] },
  { id: "bakery-street-depth-3", depthY: 452, points: [{ x: 321, y: 443 }, { x: 372, y: 443 }, { x: 372, y: 452 }, { x: 318, y: 451 }] },
  { id: "bakery-street-depth-4", depthY: 494, points: [{ x: 316, y: 460 }, { x: 360, y: 458 }, { x: 367, y: 463 }, { x: 366, y: 489 }, { x: 359, y: 493 }, { x: 319, y: 494 }, { x: 314, y: 489 }] },
  { id: "bakery-street-depth-5", depthY: 461, points: [{ x: 324, y: 451 }, { x: 321, y: 461 }, { x: 326, y: 460 }] },
  { id: "bakery-street-depth-6", depthY: 458, points: [{ x: 356, y: 451 }, { x: 352, y: 458 }, { x: 358, y: 458 }] },
  { id: "bakery-street-depth-7", depthY: 354, points: [{ x: 515, y: 350 }, { x: 515, y: 337 }, { x: 519, y: 332 }, { x: 544, y: 331 }, { x: 544, y: 354 }] },
  { id: "bakery-street-depth-8", depthY: 355, points: [{ x: 325, y: 352 }, { x: 325, y: 335 }, { x: 330, y: 331 }, { x: 352, y: 333 }, { x: 358, y: 339 }, { x: 356, y: 355 }] },
];

// TRANSITIONS (yellow): activation zones.
export const bakeryStreetTransitions: (LogicalRect & { id: string })[] = [
  { id: "bakery-street-transition-1", x: 171, y: 609, width: 99, height: 32 },
  { id: "bakery-street-transition-2", x: 357, y: 0, width: 126, height: 18 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const bakeryStreetSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "bakery-street-spawn-1", x: 420, y: 84, direction: "south" },
  { id: "bakery-street-spawn-2", x: 220, y: 693, direction: "south" },
];
