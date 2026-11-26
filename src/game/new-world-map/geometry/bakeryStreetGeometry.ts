import type { LogicalRect, PolygonCollider, SceneCollider } from "../../collision";
import type { OcclusionShape } from "../../occlusion";
import type { Direction } from "../../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const bakeryStreetColliders: SceneCollider[] = [
  { id: "bakery-street-1", x: 0, y: 616, width: 49, height: 189 },
  { id: "bakery-street-2", x: 500, y: 0, width: 318, height: 263 },
  { id: "bakery-street-3", x: 553, y: 262, width: 265, height: 375 },
  { id: "bakery-street-4", x: 770, y: 560, width: 48, height: 245 },
  { id: "bakery-street-5", x: 0, y: 0, width: 323, height: 233 },
  { id: "bakery-street-6", x: 282, y: 0, width: 58, height: 62 },
  { id: "bakery-street-7", x: 515, y: 354, width: 33, height: 39 },
  { id: "bakery-street-8", x: 502, y: 352, width: 15, height: 42 },
  { id: "bakery-street-9", x: 322, y: 354, width: 35, height: 39 },
  { id: "bakery-street-10", x: 484, y: 0, width: 14, height: 61 },
  { id: "bakery-street-11", x: 338, y: 7, width: 17, height: 52 },
  { id: "bakery-street-12", x: 267, y: 229, width: 23, height: 32 },
  { id: "bakery-street-13", x: 526, y: 510, width: 25, height: 91 },
  { id: "bakery-street-14", x: 503, y: 456, width: 51, height: 32 },
  { id: "bakery-street-15", x: 520, y: 400, width: 32, height: 56 },
  { id: "bakery-street-16", x: 0, y: 280, width: 318, height: 322 },
  { id: "bakery-street-17", x: 253, y: 260, width: 34, height: 27 },
  { id: "bakery-street-18", x: 319, y: 530, width: 24, height: 27 },
  { id: "bakery-street-19", x: 318, y: 554, width: 30, height: 30 },
  { id: "bakery-street-20", x: 278, y: 596, width: 55, height: 40 },
  { id: "bakery-street-21", x: 130, y: 642, width: 36, height: 29 },
  { id: "bakery-street-22", x: 40, y: 602, width: 116, height: 47 },
  { id: "bakery-street-23", x: 0, y: 819, width: 192, height: 102 },
  { id: "bakery-street-24", x: 197, y: 850, width: 621, height: 82 },
  { id: "bakery-street-25", x: 629, y: 818, width: 189, height: 47 },
  { id: "bakery-street-26", x: 773, y: 803, width: 45, height: 24 },
];

// FREE-HAND COLLIDERS (red shapes): same job as the colliders above,
// drawn point by point. The shape closes itself; it may be concave.
export const bakeryStreetPolygonColliders: PolygonCollider[] = [
  { id: "bakery-street-poly-1", points: [{ x: 697, y: 695 }, { x: 733, y: 694 }, { x: 735, y: 682 }, { x: 744, y: 680 }, { x: 773, y: 682 }, { x: 779, y: 746 }, { x: 778, y: 771 }, { x: 765, y: 777 }, { x: 751, y: 779 }, { x: 695, y: 779 }, { x: 692, y: 773 }, { x: 690, y: 701 }, { x: 694, y: 694 }, { x: 698, y: 693 }] },
  { id: "bakery-street-poly-2", points: [{ x: 101, y: 699 }, { x: 107, y: 698 }, { x: 112, y: 706 }, { x: 135, y: 713 }, { x: 144, y: 719 }, { x: 151, y: 737 }, { x: 179, y: 748 }, { x: 176, y: 750 }, { x: 145, y: 743 }, { x: 139, y: 751 }, { x: 161, y: 766 }, { x: 163, y: 769 }, { x: 160, y: 770 }, { x: 146, y: 768 }, { x: 117, y: 754 }, { x: 112, y: 757 }, { x: 110, y: 766 }, { x: 95, y: 764 }, { x: 88, y: 751 }, { x: 83, y: 720 }, { x: 70, y: 716 }, { x: 66, y: 710 }, { x: 63, y: 689 }, { x: 72, y: 693 }, { x: 80, y: 694 }, { x: 88, y: 694 }, { x: 92, y: 705 }, { x: 104, y: 708 }, { x: 102, y: 699 }] },
  { id: "bakery-street-poly-3", points: [{ x: 506, y: 494 }, { x: 498, y: 500 }, { x: 502, y: 506 }, { x: 501, y: 522 }, { x: 514, y: 525 }, { x: 520, y: 519 }, { x: 518, y: 499 }, { x: 512, y: 496 }, { x: 511, y: 490 }, { x: 508, y: 489 }, { x: 508, y: 496 }] },
];

// DEPTH SHAPES (violet): part of the background that covers the Doctor
// while his feet are above depthY (a treetop, a roof).
export const bakeryStreetOccluders: OcclusionShape[] = [
  { id: "bakery-street-depth-1", depthY: 846, points: [{ x: 199, y: 823 }, { x: 210, y: 824 }, { x: 216, y: 833 }, { x: 222, y: 821 }, { x: 227, y: 831 }, { x: 232, y: 831 }, { x: 240, y: 819 }, { x: 247, y: 831 }, { x: 252, y: 822 }, { x: 258, y: 821 }, { x: 267, y: 828 }, { x: 272, y: 822 }, { x: 285, y: 831 }, { x: 287, y: 822 }, { x: 295, y: 832 }, { x: 311, y: 832 }, { x: 310, y: 820 }, { x: 318, y: 831 }, { x: 327, y: 834 }, { x: 332, y: 822 }, { x: 338, y: 832 }, { x: 340, y: 831 }, { x: 343, y: 822 }, { x: 350, y: 826 }, { x: 350, y: 832 }, { x: 357, y: 833 }, { x: 363, y: 823 }, { x: 369, y: 833 }, { x: 376, y: 833 }, { x: 380, y: 823 }, { x: 386, y: 832 }, { x: 395, y: 831 }, { x: 397, y: 821 }, { x: 410, y: 821 }, { x: 410, y: 810 }, { x: 414, y: 803 }, { x: 424, y: 799 }, { x: 425, y: 796 }, { x: 419, y: 790 }, { x: 424, y: 786 }, { x: 434, y: 783 }, { x: 428, y: 778 }, { x: 431, y: 776 }, { x: 443, y: 776 }, { x: 442, y: 771 }, { x: 444, y: 768 }, { x: 449, y: 768 }, { x: 456, y: 763 }, { x: 461, y: 764 }, { x: 469, y: 758 }, { x: 481, y: 754 }, { x: 480, y: 753 }, { x: 485, y: 758 }, { x: 499, y: 763 }, { x: 518, y: 764 }, { x: 518, y: 768 }, { x: 522, y: 768 }, { x: 525, y: 773 }, { x: 531, y: 775 }, { x: 535, y: 780 }, { x: 533, y: 785 }, { x: 540, y: 785 }, { x: 548, y: 789 }, { x: 556, y: 800 }, { x: 553, y: 805 }, { x: 559, y: 811 }, { x: 560, y: 812 }, { x: 559, y: 819 }, { x: 560, y: 822 }, { x: 568, y: 825 }, { x: 570, y: 823 }, { x: 574, y: 833 }, { x: 582, y: 833 }, { x: 582, y: 824 }, { x: 589, y: 822 }, { x: 595, y: 834 }, { x: 601, y: 834 }, { x: 601, y: 826 }, { x: 609, y: 818 }, { x: 615, y: 834 }, { x: 617, y: 824 }, { x: 623, y: 819 }, { x: 630, y: 822 }, { x: 630, y: 806 }, { x: 659, y: 805 }, { x: 660, y: 818 }, { x: 660, y: 846 }, { x: 169, y: 845 }, { x: 164, y: 807 }, { x: 194, y: 807 }] },
  { id: "bakery-street-depth-2", depthY: 482, points: [{ x: 321, y: 443 }, { x: 372, y: 443 }, { x: 372, y: 452 }, { x: 318, y: 451 }] },
  { id: "bakery-street-depth-3", depthY: 524, points: [{ x: 316, y: 460 }, { x: 360, y: 458 }, { x: 367, y: 463 }, { x: 366, y: 489 }, { x: 359, y: 493 }, { x: 319, y: 494 }, { x: 314, y: 489 }] },
  { id: "bakery-street-depth-4", depthY: 491, points: [{ x: 324, y: 451 }, { x: 321, y: 461 }, { x: 326, y: 460 }] },
  { id: "bakery-street-depth-5", depthY: 488, points: [{ x: 356, y: 451 }, { x: 352, y: 458 }, { x: 358, y: 458 }] },
  { id: "bakery-street-depth-6", depthY: 354, points: [{ x: 515, y: 350 }, { x: 515, y: 337 }, { x: 519, y: 332 }, { x: 544, y: 331 }, { x: 544, y: 354 }] },
  { id: "bakery-street-depth-7", depthY: 355, points: [{ x: 325, y: 352 }, { x: 325, y: 335 }, { x: 330, y: 331 }, { x: 352, y: 333 }, { x: 358, y: 339 }, { x: 356, y: 355 }] },
  { id: "bakery-street-depth-8", depthY: 860, points: [{ x: 814, y: 813 }, { x: 731, y: 819 }, { x: 677, y: 819 }, { x: 653, y: 815 }, { x: 625, y: 830 }, { x: 590, y: 840 }, { x: 482, y: 839 }, { x: 370, y: 844 }, { x: 270, y: 842 }, { x: 195, y: 836 }, { x: 182, y: 832 }, { x: 147, y: 811 }, { x: 18, y: 813 }, { x: 4, y: 817 }, { x: 4, y: 827 }, { x: 8, y: 835 }, { x: 23, y: 841 }, { x: 44, y: 844 }, { x: 104, y: 844 }, { x: 207, y: 858 }, { x: 354, y: 860 }, { x: 377, y: 855 }, { x: 416, y: 852 }, { x: 715, y: 850 }, { x: 771, y: 840 }, { x: 807, y: 823 }, { x: 815, y: 816 }, { x: 814, y: 814 }] },
  { id: "bakery-street-depth-9", depthY: 697, points: [{ x: 77, y: 680 }, { x: 88, y: 684 }, { x: 88, y: 696 }, { x: 85, y: 697 }, { x: 72, y: 697 }, { x: 63, y: 693 }, { x: 64, y: 684 }, { x: 74, y: 680 }] },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const bakeryStreetTransitions: (LogicalRect & { id: string })[] = [
  { id: "bakery-street-transition-1", x: 171, y: 609, width: 99, height: 32 },
  { id: "bakery-street-transition-2", x: 357, y: 0, width: 126, height: 18 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const bakeryStreetSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "bakery-street-spawn-1", x: 420, y: 84, direction: "south" },
  { id: "bakery-street-spawn-2", x: 220, y: 693, direction: "south" },
];
