import type { LogicalRect, SceneCollider } from "../../collision";
import type { OcclusionShape } from "../../occlusion";
import type { Direction } from "../../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const outskirtsColliders: SceneCollider[] = [
  { id: "outskirts-1", x: 476, y: 0, width: 251, height: 336 },
  { id: "outskirts-2", x: 323, y: 765, width: 111, height: 100 },
  { id: "outskirts-3", x: 994, y: 0, width: 318, height: 347 },
  { id: "outskirts-4", x: 723, y: 0, width: 111, height: 55 },
  { id: "outskirts-5", x: 1147, y: 565, width: 167, height: 299 },
  { id: "outskirts-6", x: 839, y: 680, width: 61, height: 43 },
  { id: "outskirts-7", x: 888, y: 662, width: 278, height: 202 },
  { id: "outskirts-8", x: 680, y: 525, width: 41, height: 138 },
  { id: "outskirts-9", x: 680, y: 724, width: 40, height: 131 },
  { id: "outskirts-10", x: 679, y: 665, width: 26, height: 58 },
  { id: "outskirts-11", x: 726, y: 313, width: 42, height: 74 },
  { id: "outskirts-12", x: 479, y: 338, width: 239, height: 31 },
  { id: "outskirts-13", x: 441, y: 316, width: 35, height: 68 },
  { id: "outskirts-14", x: 430, y: 802, width: 53, height: 45 },
  { id: "outskirts-15", x: 479, y: 719, width: 29, height: 135 },
  { id: "outskirts-16", x: 480, y: 533, width: 32, height: 126 },
  { id: "outskirts-17", x: 41, y: 587, width: 69, height: 22 },
  { id: "outskirts-18", x: 22, y: 554, width: 44, height: 30 },
  { id: "outskirts-19", x: 0, y: 525, width: 31, height: 28 },
  { id: "outskirts-20", x: 0, y: 584, width: 113, height: 50 },
  { id: "outskirts-21", x: 0, y: 0, width: 263, height: 319 },
  { id: "outskirts-22", x: 0, y: 309, width: 43, height: 38 },
  { id: "outskirts-23", x: 153, y: 314, width: 69, height: 34 },
  { id: "outskirts-24", x: 252, y: 243, width: 33, height: 63 },
  { id: "outskirts-25", x: 261, y: 192, width: 57, height: 71 },
  { id: "outskirts-26", x: 261, y: 115, width: 51, height: 74 },
  { id: "outskirts-27", x: 438, y: 487, width: 327, height: 54 },
  { id: "outskirts-28", x: 823, y: 316, width: 60, height: 14 },
  { id: "outskirts-29", x: 754, y: 279, width: 86, height: 21 },
  { id: "outskirts-30", x: 827, y: 301, width: 12, height: 15 },
  { id: "outskirts-31", x: 929, y: 208, width: 60, height: 33 },
  { id: "outskirts-32", x: 885, y: 0, width: 127, height: 129 },
  { id: "outskirts-33", x: 836, y: 175, width: 83, height: 21 },
  { id: "outskirts-34", x: 1036, y: 634, width: 72, height: 65 },
  { id: "outskirts-35", x: 719, y: 813, width: 177, height: 50 },
  { id: "outskirts-36", x: 512, y: 661, width: 17, height: 60 },
  { id: "outskirts-37", x: 134, y: 641, width: 48, height: 59 },
  { id: "outskirts-38", x: 0, y: 798, width: 324, height: 66 },
  { id: "outskirts-39", x: 0, y: 624, width: 125, height: 208 },
  { id: "outskirts-40", x: 113, y: 589, width: 90, height: 50 },
  { id: "outskirts-41", x: 210, y: 0, width: 164, height: 18 },
  { id: "outskirts-42", x: 284, y: 95, width: 56, height: 36 },
  { id: "outskirts-43", x: 827, y: 0, width: 58, height: 27 },
  { id: "outskirts-44", x: 1306, y: 490, width: 8, height: 71 },
];

// DEPTH SHAPES (violet): part of the background that covers the Doctor
// while his feet are above depthY (a treetop, a roof).
export const outskirtsOccluders: OcclusionShape[] = [
  { id: "outskirts-depth-1", depthY: 486, points: [{ x: 441, y: 486 }, { x: 441, y: 454 }, { x: 483, y: 453 }, { x: 481, y: 470 }, { x: 724, y: 469 }, { x: 724, y: 455 }, { x: 764, y: 455 }, { x: 765, y: 485 }] },
  { id: "outskirts-depth-2", depthY: 278, points: [{ x: 759, y: 274 }, { x: 754, y: 271 }, { x: 760, y: 267 }, { x: 751, y: 262 }, { x: 758, y: 254 }, { x: 774, y: 252 }, { x: 763, y: 245 }, { x: 764, y: 239 }, { x: 777, y: 243 }, { x: 787, y: 244 }, { x: 779, y: 237 }, { x: 776, y: 230 }, { x: 795, y: 237 }, { x: 799, y: 224 }, { x: 808, y: 234 }, { x: 826, y: 225 }, { x: 819, y: 240 }, { x: 831, y: 236 }, { x: 828, y: 249 }, { x: 840, y: 248 }, { x: 846, y: 252 }, { x: 837, y: 259 }, { x: 844, y: 263 }, { x: 837, y: 270 }, { x: 844, y: 274 }, { x: 839, y: 278 }] },
  { id: "outskirts-depth-3", depthY: 313, points: [{ x: 856, y: 289 }, { x: 872, y: 292 }, { x: 878, y: 301 }, { x: 884, y: 312 }, { x: 840, y: 313 }, { x: 831, y: 299 }] },
  { id: "outskirts-depth-4", depthY: 205, points: [{ x: 940, y: 204 }, { x: 943, y: 186 }, { x: 942, y: 175 }, { x: 924, y: 156 }, { x: 945, y: 162 }, { x: 945, y: 155 }, { x: 957, y: 156 }, { x: 973, y: 152 }, { x: 977, y: 165 }, { x: 989, y: 158 }, { x: 983, y: 171 }, { x: 973, y: 190 }, { x: 974, y: 205 }] },
  { id: "outskirts-depth-5", depthY: 174, points: [{ x: 839, y: 174 }, { x: 832, y: 171 }, { x: 836, y: 160 }, { x: 842, y: 158 }, { x: 834, y: 150 }, { x: 848, y: 141 }, { x: 857, y: 139 }, { x: 862, y: 129 }, { x: 866, y: 139 }, { x: 880, y: 127 }, { x: 884, y: 139 }, { x: 902, y: 144 }, { x: 902, y: 148 }, { x: 910, y: 151 }, { x: 915, y: 163 }, { x: 918, y: 173 }] },
  { id: "outskirts-depth-6", depthY: 626, points: [{ x: 866, y: 626 }, { x: 883, y: 618 }, { x: 897, y: 622 }, { x: 885, y: 607 }, { x: 879, y: 603 }, { x: 891, y: 599 }, { x: 901, y: 603 }, { x: 903, y: 604 }, { x: 891, y: 591 }, { x: 905, y: 596 }, { x: 913, y: 592 }, { x: 907, y: 578 }, { x: 923, y: 588 }, { x: 924, y: 594 }, { x: 932, y: 593 }, { x: 937, y: 577 }, { x: 947, y: 570 }, { x: 943, y: 587 }, { x: 944, y: 593 }, { x: 966, y: 586 }, { x: 961, y: 595 }, { x: 957, y: 602 }, { x: 968, y: 603 }, { x: 961, y: 614 }, { x: 966, y: 617 }, { x: 970, y: 621 }] },
  { id: "outskirts-depth-7", depthY: 650, points: [{ x: 1019, y: 645 }, { x: 1003, y: 634 }, { x: 978, y: 605 }, { x: 977, y: 572 }, { x: 986, y: 554 }, { x: 990, y: 546 }, { x: 996, y: 531 }, { x: 1013, y: 511 }, { x: 1033, y: 491 }, { x: 1047, y: 491 }, { x: 1055, y: 483 }, { x: 1073, y: 478 }, { x: 1097, y: 482 }, { x: 1130, y: 502 }, { x: 1139, y: 523 }, { x: 1155, y: 532 }, { x: 1154, y: 552 }, { x: 1165, y: 561 }, { x: 1166, y: 578 }, { x: 1161, y: 594 }, { x: 1166, y: 601 }, { x: 1152, y: 615 }, { x: 1134, y: 634 }, { x: 1117, y: 650 }] },
  { id: "outskirts-depth-8", depthY: 829, points: [{ x: 741, y: 812 }, { x: 757, y: 795 }, { x: 749, y: 791 }, { x: 748, y: 785 }, { x: 766, y: 774 }, { x: 763, y: 773 }, { x: 760, y: 769 }, { x: 780, y: 755 }, { x: 775, y: 751 }, { x: 778, y: 743 }, { x: 787, y: 741 }, { x: 801, y: 723 }, { x: 825, y: 743 }, { x: 821, y: 752 }, { x: 834, y: 758 }, { x: 827, y: 764 }, { x: 837, y: 771 }, { x: 834, y: 774 }, { x: 843, y: 781 }, { x: 837, y: 786 }, { x: 844, y: 790 }, { x: 837, y: 794 }, { x: 856, y: 801 }, { x: 848, y: 810 }, { x: 862, y: 829 }] },
  { id: "outskirts-depth-9", depthY: 798, points: [{ x: 332, y: 763 }, { x: 322, y: 753 }, { x: 331, y: 746 }, { x: 334, y: 736 }, { x: 321, y: 726 }, { x: 327, y: 716 }, { x: 310, y: 707 }, { x: 320, y: 700 }, { x: 306, y: 685 }, { x: 311, y: 682 }, { x: 294, y: 674 }, { x: 297, y: 664 }, { x: 269, y: 642 }, { x: 259, y: 648 }, { x: 258, y: 641 }, { x: 239, y: 643 }, { x: 237, y: 636 }, { x: 218, y: 642 }, { x: 206, y: 653 }, { x: 200, y: 651 }, { x: 195, y: 660 }, { x: 174, y: 667 }, { x: 165, y: 678 }, { x: 153, y: 688 }, { x: 154, y: 704 }, { x: 145, y: 716 }, { x: 146, y: 720 }, { x: 136, y: 730 }, { x: 146, y: 743 }, { x: 140, y: 752 }, { x: 146, y: 767 }, { x: 149, y: 779 }, { x: 157, y: 783 }, { x: 161, y: 793 }, { x: 163, y: 797 }, { x: 306, y: 798 }, { x: 315, y: 789 }, { x: 319, y: 780 }, { x: 313, y: 774 }] },
  { id: "outskirts-depth-10", depthY: 592, points: [{ x: 115, y: 583 }, { x: 104, y: 579 }, { x: 113, y: 558 }, { x: 135, y: 558 }, { x: 139, y: 551 }, { x: 146, y: 547 }, { x: 160, y: 546 }, { x: 174, y: 546 }, { x: 182, y: 544 }, { x: 186, y: 547 }, { x: 193, y: 550 }, { x: 196, y: 556 }, { x: 192, y: 560 }, { x: 209, y: 558 }, { x: 202, y: 570 }, { x: 210, y: 576 }, { x: 218, y: 580 }, { x: 206, y: 587 }, { x: 218, y: 592 }] },
  { id: "outskirts-depth-11", depthY: 95, points: [{ x: 273, y: 84 }, { x: 264, y: 75 }, { x: 264, y: 17 }, { x: 371, y: 17 }, { x: 372, y: 27 }, { x: 373, y: 38 }, { x: 375, y: 45 }, { x: 371, y: 46 }, { x: 372, y: 56 }, { x: 365, y: 55 }, { x: 368, y: 62 }, { x: 357, y: 64 }, { x: 359, y: 73 }, { x: 346, y: 72 }, { x: 345, y: 84 }, { x: 334, y: 81 }, { x: 334, y: 88 }, { x: 320, y: 84 }, { x: 326, y: 94 }, { x: 308, y: 89 }, { x: 304, y: 95 }, { x: 299, y: 89 }, { x: 286, y: 92 }, { x: 281, y: 86 }] },
  { id: "outskirts-depth-12", depthY: 76, points: [{ x: 840, y: 76 }, { x: 835, y: 65 }, { x: 830, y: 56 }, { x: 836, y: 3 }, { x: 884, y: 4 }, { x: 886, y: 62 }, { x: 874, y: 74 }] },
  { id: "outskirts-depth-13", depthY: 570, points: [{ x: 1174, y: 565 }, { x: 1172, y: 560 }, { x: 1181, y: 565 }, { x: 1190, y: 565 }, { x: 1183, y: 551 }, { x: 1192, y: 561 }, { x: 1202, y: 563 }, { x: 1207, y: 547 }, { x: 1211, y: 547 }, { x: 1207, y: 561 }, { x: 1217, y: 561 }, { x: 1224, y: 570 }] },
  { id: "outskirts-depth-14", depthY: 563, points: [{ x: 1234, y: 561 }, { x: 1233, y: 556 }, { x: 1242, y: 553 }, { x: 1245, y: 548 }, { x: 1244, y: 542 }, { x: 1255, y: 537 }, { x: 1259, y: 532 }, { x: 1270, y: 525 }, { x: 1274, y: 520 }, { x: 1283, y: 522 }, { x: 1288, y: 512 }, { x: 1293, y: 514 }, { x: 1302, y: 514 }, { x: 1307, y: 508 }, { x: 1314, y: 517 }, { x: 1312, y: 563 }] },
];

// TRANSITIONS (yellow): activation zones.
export const outskirtsTransitions: (LogicalRect & { id: string })[] = [
  { id: "outskirts-transition-1", x: 1292, y: 382, width: 22, height: 107 },
  { id: "outskirts-transition-2", x: 374, y: 0, width: 68, height: 22 },
  { id: "outskirts-transition-3", x: 0, y: 382, width: 22, height: 107 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const outskirtsSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "outskirts-spawn-1", x: 404, y: 94, direction: "south" },
  { id: "outskirts-spawn-2", x: 85, y: 438, direction: "east" },
  { id: "outskirts-spawn-3", x: 1224, y: 438, direction: "west" },
];
