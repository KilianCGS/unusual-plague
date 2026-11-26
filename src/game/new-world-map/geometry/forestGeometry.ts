import type { LogicalRect, PolygonCollider, SceneCollider } from "../../collision";
import type { OcclusionShape } from "../../occlusion";
import type { Direction } from "../../protagonist/useProtagonistController";
import type { InteractionZone } from "../../interactions/interactionZone";

// 2026-11-18 (Kilian): the whole forest geometry redrawn for the repainted 1362x1103 background, exported from
// /dev/collisions as he authored it. 2026-11-26 re-export: transition-1 is the SOUTH exit (cottage), transition-2 the
// EAST one (glade), transition-3 the WEST one (outskirts); spawn-1 is the east arrival, spawn-2 the west one, spawn-3
// the south one (see newWorldScenes.ts).

// COLLIDERS (red): floor the feet cannot occupy.
export const forestColliders: SceneCollider[] = [
  { id: "forest-1", x: 840, y: 1000, width: 77, height: 81 },
  { id: "forest-2", x: 922, y: 1042, width: 504, height: 59 },
  { id: "forest-3", x: 1325, y: 968, width: 80, height: 73 },
  { id: "forest-4", x: 1220, y: 930, width: 97, height: 95 },
  { id: "forest-5", x: 1251, y: 877, width: 175, height: 98 },
  { id: "forest-6", x: 1091, y: 910, width: 83, height: 29 },
  { id: "forest-7", x: 0, y: 847, width: 514, height: 254 },
  { id: "forest-8", x: 568, y: 859, width: 36, height: 22 },
  { id: "forest-9", x: 0, y: 774, width: 495, height: 32 },
  { id: "forest-10", x: 376, y: 803, width: 115, height: 64 },
  { id: "forest-11", x: 320, y: 92, width: 80, height: 87 },
  { id: "forest-12", x: 819, y: 94, width: 74, height: 65 },
  { id: "forest-13", x: 712, y: 0, width: 298, height: 92 },
  { id: "forest-14", x: 0, y: 0, width: 707, height: 54 },
  { id: "forest-15", x: 299, y: 60, width: 99, height: 36 },
  { id: "forest-16", x: 399, y: 56, width: 66, height: 32 },
  { id: "forest-17", x: 645, y: 184, width: 80, height: 19 },
  { id: "forest-18", x: 971, y: 373, width: 313, height: 160 },
  { id: "forest-19", x: 1029, y: 336, width: 241, height: 41 },
  { id: "forest-20", x: 965, y: 276, width: 134, height: 93 },
  { id: "forest-21", x: 814, y: 274, width: 163, height: 38 },
  { id: "forest-22", x: 896, y: 309, width: 75, height: 33 },
  { id: "forest-23", x: 950, y: 411, width: 25, height: 17 },
  { id: "forest-24", x: 931, y: 459, width: 38, height: 60 },
  { id: "forest-25", x: 906, y: 370, width: 45, height: 17 },
  { id: "forest-26", x: 1276, y: 340, width: 144, height: 167 },
  { id: "forest-27", x: 994, y: 1008, width: 353, height: 30 },
  { id: "forest-28", x: 1076, y: 977, width: 150, height: 27 },
  { id: "forest-29", x: 517, y: 1051, width: 70, height: 52 },
  { id: "forest-30", x: 858, y: 1049, width: 58, height: 51 },
  { id: "forest-31", x: 0, y: 638, width: 13, height: 114 },
  { id: "forest-32", x: 316, y: 176, width: 11, height: 176 },
  { id: "forest-33", x: 863, y: 161, width: 31, height: 48 },
  { id: "forest-34", x: 891, y: 390, width: 45, height: 80 },
  { id: "forest-35", x: 934, y: 340, width: 11, height: 25 },
  { id: "forest-36", x: 816, y: 269, width: 19, height: 5 },
  { id: "forest-37", x: 587, y: 1061, width: 63, height: 37 },
  { id: "forest-38", x: 814, y: 928, width: 57, height: 70 },
  { id: "forest-39", x: 1208, y: 784, width: 154, height: 95 },
  { id: "forest-40", x: 1162, y: 879, width: 92, height: 26 },
  { id: "forest-41", x: 975, y: 900, width: 117, height: 14 },
  { id: "forest-42", x: 878, y: 921, width: 91, height: 27 },
  { id: "forest-43", x: 963, y: 913, width: 21, height: 8 },
  { id: "forest-44", x: 896, y: 0, width: 466, height: 275 },
];

// FREE-HAND COLLIDERS (red shapes): same job as the colliders above,
// drawn point by point. The shape closes itself; it may be concave.
export const forestPolygonColliders: PolygonCollider[] = [
  { id: "forest-poly-1", points: [{ x: 455, y: 161 }, { x: 466, y: 186 }, { x: 483, y: 186 }, { x: 619, y: 140 }, { x: 625, y: 128 }, { x: 619, y: 117 }] },
  { id: "forest-poly-2", points: [{ x: 810, y: 389 }, { x: 839, y: 388 }, { x: 856, y: 400 }, { x: 857, y: 416 }, { x: 837, y: 428 }, { x: 799, y: 434 }, { x: 781, y: 449 }, { x: 744, y: 450 }, { x: 738, y: 439 }, { x: 749, y: 418 }, { x: 732, y: 413 }, { x: 703, y: 413 }, { x: 678, y: 396 }, { x: 676, y: 376 }, { x: 717, y: 375 }, { x: 748, y: 382 }, { x: 810, y: 384 }, { x: 818, y: 388 }] },
  { id: "forest-poly-3", points: [{ x: 805, y: 97 }, { x: 794, y: 110 }, { x: 770, y: 115 }, { x: 770, y: 126 }, { x: 776, y: 133 }, { x: 781, y: 133 }, { x: 794, y: 124 }, { x: 794, y: 140 }, { x: 786, y: 148 }, { x: 803, y: 147 }, { x: 816, y: 137 }, { x: 823, y: 136 }, { x: 826, y: 139 }, { x: 826, y: 161 }, { x: 831, y: 172 }, { x: 812, y: 170 }, { x: 807, y: 189 }, { x: 790, y: 182 }, { x: 789, y: 179 }, { x: 777, y: 193 }, { x: 777, y: 198 }, { x: 761, y: 199 }, { x: 759, y: 214 }, { x: 749, y: 217 }, { x: 755, y: 227 }, { x: 759, y: 227 }, { x: 756, y: 244 }, { x: 770, y: 252 }, { x: 772, y: 269 }, { x: 789, y: 270 }, { x: 789, y: 286 }, { x: 798, y: 299 }, { x: 803, y: 304 }, { x: 822, y: 309 }, { x: 840, y: 309 }, { x: 873, y: 303 }, { x: 885, y: 291 }, { x: 899, y: 248 }, { x: 898, y: 199 }, { x: 886, y: 161 }, { x: 868, y: 128 }, { x: 845, y: 103 }, { x: 826, y: 95 }, { x: 802, y: 94 }] },
  { id: "forest-poly-4", points: [{ x: 382, y: 407 }, { x: 384, y: 421 }, { x: 407, y: 426 }, { x: 408, y: 433 }, { x: 391, y: 442 }, { x: 384, y: 437 }, { x: 380, y: 442 }, { x: 379, y: 456 }, { x: 366, y: 458 }, { x: 361, y: 443 }, { x: 353, y: 445 }, { x: 341, y: 454 }, { x: 300, y: 450 }, { x: 299, y: 470 }, { x: 293, y: 476 }, { x: 245, y: 476 }, { x: 229, y: 467 }, { x: 203, y: 467 }, { x: 190, y: 460 }, { x: 166, y: 467 }, { x: 136, y: 466 }, { x: 135, y: 460 }, { x: 128, y: 456 }, { x: 126, y: 442 }, { x: 110, y: 442 }, { x: 103, y: 438 }, { x: 98, y: 434 }, { x: 97, y: 424 }, { x: 94, y: 433 }, { x: 86, y: 439 }, { x: 73, y: 437 }, { x: 73, y: 431 }, { x: 63, y: 429 }, { x: 35, y: 449 }, { x: 2, y: 451 }, { x: 0, y: 447 }, { x: 0, y: 389 }, { x: 16, y: 359 }, { x: 17, y: 323 }, { x: 16, y: 305 }, { x: 1, y: 284 }, { x: 1, y: 273 }, { x: 27, y: 259 }, { x: 79, y: 246 }, { x: 140, y: 242 }, { x: 172, y: 227 }, { x: 177, y: 221 }, { x: 202, y: 219 }, { x: 229, y: 200 }, { x: 294, y: 200 }, { x: 299, y: 214 }, { x: 299, y: 269 }, { x: 319, y: 300 }, { x: 335, y: 315 }, { x: 352, y: 347 }, { x: 356, y: 359 }, { x: 356, y: 374 }, { x: 369, y: 403 }, { x: 382, y: 412 }] },
  { id: "forest-poly-5", points: [{ x: 496, y: 768 }, { x: 505, y: 768 }, { x: 517, y: 757 }, { x: 485, y: 739 }, { x: 474, y: 736 }, { x: 421, y: 737 }, { x: 374, y: 743 }, { x: 325, y: 743 }, { x: 278, y: 741 }, { x: 245, y: 731 }, { x: 195, y: 733 }, { x: 178, y: 726 }, { x: 147, y: 729 }, { x: 82, y: 729 }, { x: 35, y: 741 }, { x: 6, y: 743 }, { x: 0, y: 748 }, { x: 0, y: 785 }, { x: 182, y: 798 }, { x: 388, y: 798 }, { x: 407, y: 792 }, { x: 441, y: 790 }, { x: 482, y: 781 }, { x: 495, y: 777 }, { x: 496, y: 768 }, { x: 503, y: 766 }] },
  { id: "forest-poly-6", points: [{ x: 560, y: 768 }, { x: 552, y: 770 }, { x: 547, y: 778 }, { x: 549, y: 785 }, { x: 558, y: 789 }, { x: 570, y: 789 }, { x: 575, y: 783 }, { x: 571, y: 775 }, { x: 556, y: 770 }, { x: 559, y: 768 }] },
  { id: "forest-poly-7", points: [{ x: 453, y: 468 }, { x: 447, y: 468 }, { x: 443, y: 472 }, { x: 445, y: 483 }, { x: 457, y: 488 }, { x: 466, y: 488 }, { x: 467, y: 485 }, { x: 467, y: 473 }, { x: 453, y: 467 }] },
];

// DEPTH SHAPES (violet): part of the background that covers the Doctor
// while his feet are above depthY (a treetop, a roof).
export const forestOccluders: OcclusionShape[] = [
  { id: "forest-depth-1", depthY: 777, points: [{ x: 1214, y: 777 }, { x: 1220, y: 767 }, { x: 1210, y: 767 }, { x: 1219, y: 755 }, { x: 1220, y: 741 }, { x: 1216, y: 731 }, { x: 1252, y: 717 }, { x: 1241, y: 702 }, { x: 1246, y: 695 }, { x: 1270, y: 678 }, { x: 1281, y: 664 }, { x: 1310, y: 667 }, { x: 1316, y: 650 }, { x: 1340, y: 656 }, { x: 1343, y: 635 }, { x: 1352, y: 635 }, { x: 1376, y: 767 }, { x: 1346, y: 777 }] },
  { id: "forest-depth-2", depthY: 918, points: [{ x: 1093, y: 908 }, { x: 1086, y: 896 }, { x: 1078, y: 892 }, { x: 1095, y: 885 }, { x: 1095, y: 864 }, { x: 1095, y: 846 }, { x: 1111, y: 865 }, { x: 1129, y: 851 }, { x: 1127, y: 863 }, { x: 1122, y: 870 }, { x: 1126, y: 879 }, { x: 1139, y: 881 }, { x: 1145, y: 875 }, { x: 1148, y: 885 }, { x: 1164, y: 883 }, { x: 1160, y: 896 }, { x: 1162, y: 902 }, { x: 1171, y: 918 }] },
  { id: "forest-depth-3", depthY: 927, points: [{ x: 857, y: 920 }, { x: 915, y: 899 }, { x: 921, y: 885 }, { x: 942, y: 877 }, { x: 965, y: 867 }, { x: 955, y: 855 }, { x: 949, y: 849 }, { x: 949, y: 843 }, { x: 954, y: 825 }, { x: 949, y: 812 }, { x: 935, y: 800 }, { x: 936, y: 773 }, { x: 915, y: 763 }, { x: 899, y: 756 }, { x: 893, y: 752 }, { x: 886, y: 733 }, { x: 877, y: 737 }, { x: 872, y: 725 }, { x: 864, y: 729 }, { x: 857, y: 722 }, { x: 853, y: 718 }, { x: 844, y: 718 }, { x: 824, y: 716 }, { x: 815, y: 720 }, { x: 796, y: 725 }, { x: 787, y: 728 }, { x: 785, y: 739 }, { x: 762, y: 751 }, { x: 762, y: 750 }, { x: 769, y: 758 }, { x: 766, y: 767 }, { x: 754, y: 773 }, { x: 742, y: 782 }, { x: 745, y: 795 }, { x: 719, y: 798 }, { x: 727, y: 811 }, { x: 731, y: 822 }, { x: 713, y: 835 }, { x: 716, y: 872 }, { x: 736, y: 877 }, { x: 747, y: 896 }, { x: 767, y: 906 }, { x: 758, y: 892 }, { x: 781, y: 912 }, { x: 790, y: 910 }, { x: 802, y: 907 }, { x: 817, y: 925 }] },
  { id: "forest-depth-4", depthY: 854, points: [{ x: 582, y: 854 }, { x: 598, y: 835 }, { x: 562, y: 820 }, { x: 545, y: 814 }, { x: 526, y: 833 }, { x: 541, y: 837 }, { x: 540, y: 847 }, { x: 545, y: 854 }] },
  { id: "forest-depth-5", depthY: 849, points: [{ x: 520, y: 849 }, { x: 514, y: 833 }, { x: 531, y: 827 }, { x: 516, y: 815 }, { x: 492, y: 786 }, { x: 505, y: 776 }, { x: 501, y: 749 }, { x: 485, y: 739 }, { x: 491, y: 733 }, { x: 467, y: 702 }, { x: 473, y: 695 }, { x: 448, y: 666 }, { x: 461, y: 662 }, { x: 438, y: 619 }, { x: 428, y: 609 }, { x: 405, y: 645 }, { x: 378, y: 643 }, { x: 369, y: 638 }, { x: 380, y: 628 }, { x: 375, y: 618 }, { x: 369, y: 616 }, { x: 360, y: 619 }, { x: 354, y: 612 }, { x: 353, y: 599 }, { x: 333, y: 597 }, { x: 319, y: 613 }, { x: 313, y: 602 }, { x: 304, y: 595 }, { x: 272, y: 599 }, { x: 228, y: 637 }, { x: 223, y: 637 }, { x: 234, y: 645 }, { x: 237, y: 647 }, { x: 214, y: 634 }, { x: 229, y: 600 }, { x: 207, y: 633 }, { x: 191, y: 617 }, { x: 190, y: 641 }, { x: 169, y: 641 }, { x: 158, y: 656 }, { x: 180, y: 668 }, { x: 183, y: 683 }, { x: 177, y: 693 }, { x: 184, y: 707 }, { x: 186, y: 715 }, { x: 182, y: 745 }, { x: 187, y: 767 }] },
  { id: "forest-depth-6", depthY: 756, points: [{ x: 174, y: 752 }, { x: 186, y: 728 }, { x: 186, y: 725 }, { x: 173, y: 728 }, { x: 186, y: 697 }, { x: 164, y: 697 }, { x: 159, y: 688 }, { x: 135, y: 701 }, { x: 130, y: 697 }, { x: 139, y: 730 }, { x: 142, y: 737 }, { x: 125, y: 717 }, { x: 133, y: 756 }, { x: 112, y: 726 }, { x: 122, y: 722 }, { x: 114, y: 707 }, { x: 117, y: 707 }, { x: 120, y: 696 }, { x: 106, y: 683 }, { x: 108, y: 667 }, { x: 96, y: 646 }, { x: 88, y: 642 }, { x: 91, y: 634 }, { x: 95, y: 628 }, { x: 78, y: 618 }, { x: 83, y: 611 }, { x: 80, y: 603 }, { x: 63, y: 610 }, { x: 57, y: 608 }, { x: 59, y: 596 }, { x: 56, y: 588 }, { x: 43, y: 593 }, { x: 38, y: 587 }, { x: 23, y: 580 }, { x: 9, y: 585 }, { x: 5, y: 576 }, { x: 7, y: 749 }] },
  { id: "forest-depth-7", depthY: 407, points: [{ x: 407, y: 407 }, { x: 418, y: 404 }, { x: 437, y: 388 }, { x: 440, y: 394 }, { x: 443, y: 388 }, { x: 464, y: 383 }, { x: 467, y: 373 }, { x: 462, y: 354 }, { x: 478, y: 343 }, { x: 467, y: 325 }, { x: 468, y: 319 }, { x: 470, y: 311 }, { x: 465, y: 297 }, { x: 461, y: 295 }, { x: 461, y: 288 }, { x: 490, y: 283 }, { x: 497, y: 285 }, { x: 508, y: 287 }, { x: 516, y: 285 }, { x: 523, y: 280 }, { x: 507, y: 274 }, { x: 507, y: 267 }, { x: 516, y: 258 }, { x: 506, y: 255 }, { x: 498, y: 256 }, { x: 504, y: 239 }, { x: 467, y: 226 }, { x: 455, y: 239 }, { x: 453, y: 246 }, { x: 416, y: 245 }, { x: 405, y: 216 }, { x: 388, y: 213 }, { x: 343, y: 203 }, { x: 330, y: 215 }, { x: 323, y: 227 }, { x: 312, y: 242 }, { x: 301, y: 255 }, { x: 269, y: 293 }, { x: 260, y: 302 }, { x: 259, y: 325 }, { x: 259, y: 335 }, { x: 263, y: 356 }, { x: 262, y: 373 }, { x: 266, y: 385 }, { x: 269, y: 386 }, { x: 278, y: 388 }] },
  { id: "forest-depth-8", depthY: 190, points: [{ x: 648, y: 181 }, { x: 664, y: 178 }, { x: 671, y: 178 }, { x: 680, y: 172 }, { x: 687, y: 167 }, { x: 696, y: 165 }, { x: 719, y: 170 }, { x: 725, y: 190 }] },
  { id: "forest-depth-9", depthY: 159, points: [{ x: 458, y: 159 }, { x: 456, y: 148 }, { x: 471, y: 138 }, { x: 526, y: 121 }, { x: 543, y: 116 }, { x: 555, y: 110 }, { x: 570, y: 88 }, { x: 570, y: 103 }, { x: 600, y: 98 }, { x: 616, y: 108 }, { x: 618, y: 116 }] },
  { id: "forest-depth-10", depthY: 422, points: [{ x: 666, y: 392 }, { x: 673, y: 382 }, { x: 660, y: 373 }, { x: 686, y: 350 }, { x: 689, y: 344 }, { x: 690, y: 334 }, { x: 686, y: 326 }, { x: 719, y: 323 }, { x: 717, y: 311 }, { x: 745, y: 303 }, { x: 759, y: 312 }, { x: 777, y: 313 }, { x: 796, y: 337 }, { x: 815, y: 357 }, { x: 831, y: 365 }, { x: 845, y: 380 }, { x: 862, y: 411 }, { x: 860, y: 422 }] },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const forestTransitions: (LogicalRect & { id: string })[] = [
  { id: "forest-transition-1", x: 648, y: 1058, width: 201, height: 45 },
  { id: "forest-transition-2", x: 1314, y: 512, width: 48, height: 141 },
  { id: "forest-transition-3", x: 0, y: 465, width: 48, height: 111 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const forestSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "forest-spawn-1", x: 1258, y: 591, direction: "south" },
  { id: "forest-spawn-2", x: 107, y: 548, direction: "south" },
  { id: "forest-spawn-3", x: 630, y: 946, direction: "south" },
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
