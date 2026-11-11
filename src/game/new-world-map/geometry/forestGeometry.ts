import type { LogicalRect, PolygonCollider, SceneCollider } from "../../collision";
import type { OcclusionShape } from "../../occlusion";
import type { Direction } from "../../protagonist/useProtagonistController";
import type { InteractionZone } from "../../interactions/interactionZone";

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
  { id: "forest-9", x: 0, y: 817, width: 495, height: 32 },
  { id: "forest-10", x: 0, y: 751, width: 115, height: 64 },
  { id: "forest-11", x: 20, y: 350, width: 401, height: 171 },
  { id: "forest-12", x: 320, y: 92, width: 80, height: 87 },
  { id: "forest-13", x: 819, y: 94, width: 74, height: 65 },
  { id: "forest-14", x: 712, y: 0, width: 298, height: 92 },
  { id: "forest-15", x: 0, y: 0, width: 707, height: 54 },
  { id: "forest-16", x: 299, y: 60, width: 99, height: 36 },
  { id: "forest-17", x: 399, y: 56, width: 66, height: 32 },
  { id: "forest-18", x: 679, y: 209, width: 80, height: 19 },
  { id: "forest-19", x: 772, y: 458, width: 77, height: 37 },
  { id: "forest-20", x: 712, y: 408, width: 124, height: 44 },
  { id: "forest-21", x: 971, y: 373, width: 313, height: 160 },
  { id: "forest-22", x: 1029, y: 336, width: 241, height: 41 },
  { id: "forest-23", x: 802, y: 209, width: 461, height: 65 },
  { id: "forest-24", x: 965, y: 276, width: 134, height: 93 },
  { id: "forest-25", x: 814, y: 274, width: 163, height: 38 },
  { id: "forest-26", x: 896, y: 309, width: 75, height: 33 },
  { id: "forest-27", x: 950, y: 411, width: 25, height: 17 },
  { id: "forest-28", x: 931, y: 459, width: 38, height: 60 },
  { id: "forest-29", x: 847, y: 459, width: 45, height: 17 },
  { id: "forest-30", x: 1166, y: 585, width: 53, height: 36 },
  { id: "forest-31", x: 1118, y: 562, width: 44, height: 50 },
  { id: "forest-32", x: 1069, y: 556, width: 51, height: 40 },
  { id: "forest-33", x: 1003, y: 533, width: 68, height: 37 },
  { id: "forest-34", x: 1072, y: 528, width: 214, height: 28 },
  { id: "forest-35", x: 1164, y: 551, width: 111, height: 32 },
  { id: "forest-36", x: 1282, y: 411, width: 144, height: 167 },
  { id: "forest-37", x: 1395, y: 710, width: 31, height: 183 },
  { id: "forest-38", x: 994, y: 1008, width: 353, height: 30 },
  { id: "forest-39", x: 1076, y: 977, width: 150, height: 27 },
  { id: "forest-40", x: 517, y: 1051, width: 70, height: 52 },
  { id: "forest-41", x: 787, y: 1050, width: 58, height: 51 },
  { id: "forest-42", x: 0, y: 638, width: 13, height: 114 },
  { id: "forest-43", x: 467, y: 525, width: 28, height: 16 },
  { id: "forest-44", x: 316, y: 176, width: 11, height: 176 },
  { id: "forest-45", x: 863, y: 161, width: 31, height: 48 },
];

// FREE-HAND COLLIDERS (red shapes): same job as the colliders above,
// drawn point by point. The shape closes itself; it may be concave.
export const forestPolygonColliders: PolygonCollider[] = [
  { id: "forest-poly-1", points: [{ x: 482, y: 176 }, { x: 493, y: 201 }, { x: 510, y: 201 }, { x: 646, y: 155 }, { x: 652, y: 143 }, { x: 646, y: 132 }] },
];

// DEPTH SHAPES (violet): part of the background that covers the Doctor
// while his feet are above depthY (a treetop, a roof).
export const forestOccluders: OcclusionShape[] = [
  { id: "forest-depth-1", depthY: 874, points: [{ x: 1259, y: 874 }, { x: 1265, y: 864 }, { x: 1255, y: 864 }, { x: 1264, y: 852 }, { x: 1265, y: 838 }, { x: 1261, y: 828 }, { x: 1297, y: 814 }, { x: 1286, y: 799 }, { x: 1291, y: 792 }, { x: 1315, y: 775 }, { x: 1326, y: 761 }, { x: 1355, y: 764 }, { x: 1361, y: 747 }, { x: 1385, y: 753 }, { x: 1388, y: 732 }, { x: 1397, y: 732 }, { x: 1421, y: 864 }, { x: 1391, y: 874 }] },
  { id: "forest-depth-2", depthY: 918, points: [{ x: 1093, y: 908 }, { x: 1086, y: 896 }, { x: 1078, y: 892 }, { x: 1095, y: 885 }, { x: 1095, y: 864 }, { x: 1095, y: 846 }, { x: 1111, y: 865 }, { x: 1129, y: 851 }, { x: 1127, y: 863 }, { x: 1122, y: 870 }, { x: 1126, y: 879 }, { x: 1139, y: 881 }, { x: 1145, y: 875 }, { x: 1148, y: 885 }, { x: 1164, y: 883 }, { x: 1160, y: 896 }, { x: 1162, y: 902 }, { x: 1171, y: 918 }] },
  { id: "forest-depth-3", depthY: 1014, points: [{ x: 946, y: 1006 }, { x: 973, y: 984 }, { x: 988, y: 984 }, { x: 994, y: 965 }, { x: 1008, y: 954 }, { x: 998, y: 942 }, { x: 992, y: 936 }, { x: 992, y: 930 }, { x: 997, y: 912 }, { x: 992, y: 899 }, { x: 978, y: 887 }, { x: 979, y: 860 }, { x: 958, y: 850 }, { x: 942, y: 843 }, { x: 936, y: 839 }, { x: 929, y: 820 }, { x: 920, y: 824 }, { x: 915, y: 812 }, { x: 907, y: 816 }, { x: 900, y: 809 }, { x: 896, y: 805 }, { x: 887, y: 805 }, { x: 867, y: 803 }, { x: 858, y: 807 }, { x: 839, y: 812 }, { x: 830, y: 815 }, { x: 828, y: 826 }, { x: 805, y: 838 }, { x: 805, y: 837 }, { x: 812, y: 845 }, { x: 809, y: 854 }, { x: 802, y: 869 }, { x: 785, y: 869 }, { x: 788, y: 882 }, { x: 762, y: 885 }, { x: 770, y: 898 }, { x: 774, y: 909 }, { x: 756, y: 922 }, { x: 759, y: 959 }, { x: 763, y: 977 }, { x: 774, y: 994 }, { x: 789, y: 1001 }, { x: 795, y: 995 }, { x: 801, y: 1014 }, { x: 820, y: 1011 }, { x: 833, y: 1011 }, { x: 843, y: 1014 }] },
  { id: "forest-depth-4", depthY: 854, points: [{ x: 582, y: 854 }, { x: 598, y: 835 }, { x: 562, y: 820 }, { x: 545, y: 814 }, { x: 526, y: 833 }, { x: 541, y: 837 }, { x: 540, y: 847 }, { x: 545, y: 854 }] },
  { id: "forest-depth-5", depthY: 921, points: [{ x: 543, y: 921 }, { x: 537, y: 905 }, { x: 554, y: 899 }, { x: 539, y: 887 }, { x: 515, y: 858 }, { x: 528, y: 848 }, { x: 524, y: 821 }, { x: 508, y: 811 }, { x: 514, y: 805 }, { x: 490, y: 774 }, { x: 496, y: 767 }, { x: 471, y: 738 }, { x: 484, y: 734 }, { x: 461, y: 691 }, { x: 451, y: 681 }, { x: 428, y: 717 }, { x: 401, y: 715 }, { x: 392, y: 710 }, { x: 403, y: 700 }, { x: 398, y: 690 }, { x: 392, y: 688 }, { x: 383, y: 691 }, { x: 377, y: 684 }, { x: 376, y: 671 }, { x: 356, y: 669 }, { x: 342, y: 685 }, { x: 336, y: 674 }, { x: 327, y: 667 }, { x: 295, y: 671 }, { x: 251, y: 709 }, { x: 246, y: 709 }, { x: 257, y: 717 }, { x: 260, y: 719 }, { x: 237, y: 706 }, { x: 252, y: 672 }, { x: 230, y: 705 }, { x: 214, y: 689 }, { x: 213, y: 713 }, { x: 192, y: 713 }, { x: 181, y: 728 }, { x: 203, y: 740 }, { x: 206, y: 755 }, { x: 200, y: 765 }, { x: 207, y: 779 }, { x: 209, y: 787 }, { x: 205, y: 817 }, { x: 210, y: 839 }] },
  { id: "forest-depth-6", depthY: 814, points: [{ x: 175, y: 810 }, { x: 187, y: 786 }, { x: 187, y: 783 }, { x: 174, y: 786 }, { x: 187, y: 755 }, { x: 165, y: 755 }, { x: 160, y: 746 }, { x: 136, y: 759 }, { x: 131, y: 755 }, { x: 140, y: 788 }, { x: 143, y: 795 }, { x: 126, y: 775 }, { x: 134, y: 814 }, { x: 113, y: 784 }, { x: 123, y: 780 }, { x: 115, y: 765 }, { x: 118, y: 765 }, { x: 121, y: 754 }, { x: 107, y: 741 }, { x: 109, y: 725 }, { x: 97, y: 704 }, { x: 89, y: 700 }, { x: 92, y: 692 }, { x: 96, y: 686 }, { x: 79, y: 676 }, { x: 84, y: 669 }, { x: 81, y: 661 }, { x: 64, y: 668 }, { x: 58, y: 666 }, { x: 60, y: 654 }, { x: 57, y: 646 }, { x: 44, y: 651 }, { x: 39, y: 645 }, { x: 24, y: 638 }, { x: 10, y: 643 }, { x: 6, y: 634 }, { x: 8, y: 807 }] },
  { id: "forest-depth-7", depthY: 424, points: [{ x: 429, y: 424 }, { x: 440, y: 421 }, { x: 459, y: 405 }, { x: 462, y: 411 }, { x: 465, y: 405 }, { x: 486, y: 400 }, { x: 489, y: 390 }, { x: 484, y: 371 }, { x: 500, y: 360 }, { x: 489, y: 342 }, { x: 490, y: 336 }, { x: 492, y: 328 }, { x: 487, y: 314 }, { x: 483, y: 312 }, { x: 483, y: 305 }, { x: 512, y: 300 }, { x: 519, y: 302 }, { x: 530, y: 304 }, { x: 538, y: 302 }, { x: 545, y: 297 }, { x: 529, y: 291 }, { x: 529, y: 284 }, { x: 538, y: 275 }, { x: 528, y: 272 }, { x: 520, y: 273 }, { x: 526, y: 256 }, { x: 489, y: 243 }, { x: 477, y: 256 }, { x: 475, y: 263 }, { x: 438, y: 262 }, { x: 427, y: 233 }, { x: 410, y: 230 }, { x: 365, y: 220 }, { x: 352, y: 232 }, { x: 345, y: 244 }, { x: 334, y: 259 }, { x: 323, y: 272 }, { x: 291, y: 310 }, { x: 282, y: 319 }, { x: 281, y: 342 }, { x: 281, y: 352 }, { x: 285, y: 373 }, { x: 284, y: 390 }, { x: 288, y: 402 }, { x: 291, y: 403 }, { x: 300, y: 405 }] },
  { id: "forest-depth-8", depthY: 211, points: [{ x: 687, y: 202 }, { x: 703, y: 199 }, { x: 710, y: 199 }, { x: 719, y: 193 }, { x: 726, y: 188 }, { x: 735, y: 186 }, { x: 758, y: 191 }, { x: 764, y: 211 }] },
  { id: "forest-depth-9", depthY: 172, points: [{ x: 484, y: 172 }, { x: 482, y: 161 }, { x: 497, y: 151 }, { x: 552, y: 134 }, { x: 569, y: 129 }, { x: 581, y: 123 }, { x: 596, y: 101 }, { x: 596, y: 116 }, { x: 626, y: 111 }, { x: 642, y: 121 }, { x: 644, y: 129 }] },
  { id: "forest-depth-10", depthY: 457, points: [{ x: 698, y: 427 }, { x: 705, y: 417 }, { x: 692, y: 408 }, { x: 718, y: 385 }, { x: 721, y: 379 }, { x: 722, y: 369 }, { x: 718, y: 361 }, { x: 751, y: 358 }, { x: 749, y: 346 }, { x: 777, y: 338 }, { x: 791, y: 347 }, { x: 809, y: 348 }, { x: 828, y: 372 }, { x: 847, y: 392 }, { x: 863, y: 400 }, { x: 877, y: 415 }, { x: 894, y: 446 }, { x: 892, y: 457 }] },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const forestTransitions: (LogicalRect & { id: string })[] = [
  { id: "forest-transition-1", x: 1391, y: 588, width: 35, height: 115 },
  { id: "forest-transition-2", x: 583, y: 1047, width: 201, height: 45 },
  { id: "forest-transition-3", x: 0, y: 523, width: 57, height: 108 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const forestSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "forest-spawn-1", x: 132, y: 609, direction: "south" },
  { id: "forest-spawn-2", x: 1346, y: 649, direction: "south" },
  { id: "forest-spawn-3", x: 658, y: 993, direction: "south" },
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
