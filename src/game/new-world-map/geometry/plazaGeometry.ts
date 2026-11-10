import type {
  LogicalRect,
  PolygonCollider,
  SceneCollider,
} from "../../collision";
import type { OcclusionShape } from "../../occlusion";
import type { Direction } from "../../protagonist/useProtagonistController";

// NEW WORLD MAP, plaza. Redrawn by hand in /dev/collisions (rectangles, free
// shapes and violet depth shapes) and pasted from its export; the export names
// are the same ones the tool writes. The interaction zones live in
// interactions/environmentZones.ts.

// COLLIDERS (red): floor the feet cannot occupy.
export const plazaColliders: SceneCollider[] = [
  { id: "plaza-1", x: 0, y: 0, width: 635, height: 215 },
  { id: "plaza-2", x: 0, y: 215, width: 265, height: 250 },
  { id: "plaza-3", x: 890, y: 0, width: 646, height: 215 },
  { id: "plaza-4", x: 925, y: 120, width: 155, height: 135 },
  { id: "plaza-5", x: 1215, y: 185, width: 60, height: 175 },
  { id: "plaza-6", x: 1270, y: 150, width: 266, height: 315 },
  { id: "plaza-7", x: 0, y: 865, width: 610, height: 159 },
  { id: "plaza-8", x: 885, y: 865, width: 651, height: 159 },
  { id: "plaza-9", x: 1300, y: 598, width: 236, height: 270 },
  { id: "plaza-10", x: 1255, y: 750, width: 30, height: 115 },
  { id: "plaza-11", x: 405, y: 334, width: 83, height: 45 },
  { id: "plaza-12", x: 497, y: 342, width: 32, height: 28 },
  { id: "plaza-13", x: 524, y: 213, width: 11, height: 34 },
  { id: "plaza-14", x: 560, y: 215, width: 35, height: 35 },
  { id: "plaza-15", x: 350, y: 213, width: 25, height: 37 },
  { id: "plaza-16", x: 311, y: 214, width: 20, height: 24 },
  { id: "plaza-17", x: 434, y: 214, width: 12, height: 35 },
  { id: "plaza-18", x: 434, y: 215, width: 100, height: 19 },
  { id: "plaza-19", x: 445, y: 235, width: 81, height: 11 },
  { id: "plaza-20", x: 263, y: 211, width: 39, height: 139 },
  { id: "plaza-21", x: 300, y: 211, width: 8, height: 42 },
  { id: "plaza-22", x: 413, y: 380, width: 66, height: 10 },
  { id: "plaza-23", x: 430, y: 390, width: 39, height: 7 },
  { id: "plaza-24", x: 0, y: 601, width: 216, height: 262 },
  { id: "plaza-25", x: 216, y: 693, width: 57, height: 108 },
  { id: "plaza-26", x: 221, y: 846, width: 334, height: 17 },
  { id: "plaza-27", x: 555, y: 846, width: 24, height: 15 },
  { id: "plaza-28", x: 216, y: 604, width: 21, height: 73 },
  { id: "plaza-29", x: 608, y: 849, width: 29, height: 171 },
  { id: "plaza-30", x: 1001, y: 829, width: 100, height: 38 },
  { id: "plaza-31", x: 943, y: 832, width: 59, height: 35 },
  { id: "plaza-32", x: 1242, y: 813, width: 17, height: 53 },
  { id: "plaza-33", x: 1277, y: 624, width: 34, height: 239 },
  { id: "plaza-34", x: 1163, y: 214, width: 40, height: 44 },
  { id: "plaza-35", x: 1254, y: 692, width: 22, height: 57 },
  { id: "plaza-36", x: 1119, y: 842, width: 112, height: 25 },
  { id: "plaza-37", x: 884, y: 849, width: 30, height: 16 },
];

// FREE-HAND COLLIDERS (red shapes): same job as the colliders above,
// drawn point by point. The shape closes itself; it may be concave.
export const plazaPolygonColliders: PolygonCollider[] = [
  { id: "plaza-poly-1", points: [{ x: 691, y: 478 }, { x: 686, y: 478 }, { x: 683, y: 486 }, { x: 680, y: 492 }, { x: 684, y: 505 }, { x: 680, y: 518 }, { x: 680, y: 543 }, { x: 689, y: 565 }, { x: 710, y: 586 }, { x: 735, y: 596 }, { x: 763, y: 600 }, { x: 795, y: 600 }, { x: 828, y: 590 }, { x: 856, y: 572 }, { x: 871, y: 549 }, { x: 873, y: 515 }, { x: 868, y: 503 }, { x: 870, y: 488 }, { x: 868, y: 482 }, { x: 868, y: 475 }, { x: 857, y: 469 }, { x: 802, y: 445 }, { x: 746, y: 441 }] },
];

// DEPTH SHAPES (violet): part of the background that covers the Doctor
// while his feet are above depthY (a treetop, a roof).
export const plazaOccluders: OcclusionShape[] = [
  { id: "plaza-depth-1", depthY: 442, points: [{ x: 756, y: 440 }, { x: 753, y: 423 }, { x: 751, y: 414 }, { x: 757, y: 397 }, { x: 763, y: 389 }, { x: 768, y: 374 }, { x: 776, y: 370 }, { x: 785, y: 372 }, { x: 788, y: 379 }, { x: 789, y: 387 }, { x: 792, y: 393 }, { x: 798, y: 398 }, { x: 799, y: 406 }, { x: 802, y: 414 }, { x: 802, y: 424 }, { x: 802, y: 442 }] },
  { id: "plaza-depth-2", depthY: 469, points: [{ x: 809, y: 439 }, { x: 817, y: 450 }, { x: 823, y: 451 }, { x: 825, y: 458 }, { x: 830, y: 452 }, { x: 830, y: 447 }, { x: 832, y: 444 }, { x: 832, y: 440 }, { x: 834, y: 438 }, { x: 836, y: 433 }, { x: 838, y: 430 }, { x: 840, y: 424 }, { x: 845, y: 424 }, { x: 849, y: 430 }, { x: 849, y: 431 }, { x: 849, y: 436 }, { x: 852, y: 439 }, { x: 852, y: 441 }, { x: 850, y: 444 }, { x: 852, y: 447 }, { x: 854, y: 449 }, { x: 855, y: 452 }, { x: 856, y: 454 }, { x: 856, y: 457 }, { x: 854, y: 461 }, { x: 857, y: 464 }, { x: 858, y: 469 }, { x: 807, y: 466 }] },
  { id: "plaza-depth-3", depthY: 476, points: [{ x: 692, y: 475 }, { x: 696, y: 469 }, { x: 701, y: 460 }, { x: 701, y: 455 }, { x: 704, y: 448 }, { x: 706, y: 440 }, { x: 712, y: 433 }, { x: 717, y: 437 }, { x: 717, y: 443 }, { x: 719, y: 447 }, { x: 723, y: 450 }, { x: 724, y: 455 }, { x: 727, y: 458 }, { x: 732, y: 455 }, { x: 736, y: 448 }, { x: 741, y: 444 }, { x: 745, y: 440 }, { x: 751, y: 441 }, { x: 754, y: 442 }, { x: 751, y: 476 }] },
  { id: "plaza-depth-4", depthY: 334, points: [{ x: 408, y: 333 }, { x: 407, y: 301 }, { x: 419, y: 301 }, { x: 417, y: 334 }] },
  { id: "plaza-depth-5", depthY: 334, points: [{ x: 448, y: 302 }, { x: 445, y: 313 }, { x: 432, y: 316 }, { x: 423, y: 320 }, { x: 413, y: 334 }, { x: 478, y: 333 }, { x: 477, y: 322 }, { x: 469, y: 318 }, { x: 460, y: 315 }, { x: 452, y: 313 }] },
  { id: "plaza-depth-6", depthY: 341, points: [{ x: 478, y: 302 }, { x: 478, y: 330 }, { x: 478, y: 341 }, { x: 488, y: 340 }, { x: 488, y: 302 }] },
  { id: "plaza-depth-7", depthY: 302, points: [{ x: 492, y: 277 }, { x: 492, y: 302 }, { x: 403, y: 302 }, { x: 402, y: 277 }] },
  { id: "plaza-depth-8", depthY: 341, points: [{ x: 497, y: 341 }, { x: 496, y: 317 }, { x: 500, y: 314 }, { x: 511, y: 311 }, { x: 521, y: 313 }, { x: 529, y: 316 }, { x: 529, y: 341 }] },
  { id: "plaza-depth-9", depthY: 623, points: [{ x: 1293, y: 569 }, { x: 1303, y: 582 }, { x: 1302, y: 595 }, { x: 1300, y: 605 }, { x: 1292, y: 613 }, { x: 1293, y: 623 }, { x: 1286, y: 623 }, { x: 1284, y: 609 }, { x: 1280, y: 607 }, { x: 1281, y: 593 }, { x: 1280, y: 587 }, { x: 1277, y: 584 }, { x: 1286, y: 573 }] },
  { id: "plaza-depth-10", depthY: 596, points: [{ x: 1289, y: 569 }, { x: 1290, y: 561 }, { x: 1294, y: 558 }, { x: 1302, y: 557 }, { x: 1309, y: 561 }, { x: 1311, y: 569 }, { x: 1312, y: 576 }, { x: 1313, y: 585 }, { x: 1314, y: 592 }, { x: 1311, y: 596 }, { x: 1304, y: 596 }, { x: 1305, y: 586 }, { x: 1305, y: 577 }, { x: 1303, y: 569 }, { x: 1302, y: 564 }, { x: 1299, y: 562 }, { x: 1296, y: 565 }] },
  { id: "plaza-depth-11", depthY: 842, points: [{ x: 1230, y: 841 }, { x: 1230, y: 838 }, { x: 1231, y: 838 }, { x: 1231, y: 830 }, { x: 1229, y: 828 }, { x: 1229, y: 824 }, { x: 1222, y: 824 }, { x: 1222, y: 828 }, { x: 1132, y: 828 }, { x: 1132, y: 824 }, { x: 1128, y: 824 }, { x: 1124, y: 827 }, { x: 1123, y: 838 }, { x: 1124, y: 839 }, { x: 1124, y: 842 }] },
  { id: "plaza-depth-12", depthY: 829, points: [{ x: 1000, y: 829 }, { x: 1100, y: 829 }, { x: 1100, y: 808 }, { x: 1104, y: 807 }, { x: 1103, y: 795 }, { x: 1100, y: 795 }, { x: 1100, y: 791 }, { x: 1091, y: 791 }, { x: 1092, y: 795 }, { x: 1009, y: 795 }, { x: 1009, y: 791 }, { x: 1000, y: 791 }, { x: 1000, y: 795 }, { x: 997, y: 797 }, { x: 998, y: 808 }, { x: 1001, y: 809 }] },
  { id: "plaza-depth-13", depthY: 832, points: [{ x: 996, y: 831 }, { x: 992, y: 831 }, { x: 992, y: 827 }, { x: 990, y: 823 }, { x: 987, y: 825 }, { x: 982, y: 826 }, { x: 980, y: 822 }, { x: 979, y: 819 }, { x: 976, y: 824 }, { x: 975, y: 827 }, { x: 971, y: 826 }, { x: 971, y: 829 }, { x: 966, y: 829 }, { x: 965, y: 832 }] },
  { id: "plaza-depth-14", depthY: 832, points: [{ x: 945, y: 832 }, { x: 954, y: 832 }, { x: 954, y: 806 }, { x: 961, y: 799 }, { x: 959, y: 796 }, { x: 964, y: 776 }, { x: 957, y: 770 }, { x: 958, y: 757 }, { x: 951, y: 751 }, { x: 944, y: 759 }, { x: 945, y: 768 }, { x: 934, y: 777 }, { x: 938, y: 781 }, { x: 939, y: 791 }, { x: 940, y: 800 }, { x: 946, y: 806 }] },
  { id: "plaza-depth-15", depthY: 846, points: [{ x: 561, y: 845 }, { x: 563, y: 834 }, { x: 564, y: 806 }, { x: 558, y: 800 }, { x: 558, y: 783 }, { x: 554, y: 776 }, { x: 560, y: 770 }, { x: 561, y: 753 }, { x: 566, y: 750 }, { x: 572, y: 752 }, { x: 575, y: 755 }, { x: 573, y: 765 }, { x: 578, y: 770 }, { x: 584, y: 774 }, { x: 583, y: 780 }, { x: 580, y: 785 }, { x: 578, y: 793 }, { x: 580, y: 798 }, { x: 574, y: 805 }, { x: 573, y: 835 }, { x: 575, y: 841 }, { x: 577, y: 846 }] },
  { id: "plaza-depth-16", depthY: 845, points: [{ x: 555, y: 844 }, { x: 552, y: 839 }, { x: 555, y: 837 }, { x: 555, y: 832 }, { x: 551, y: 828 }, { x: 552, y: 824 }, { x: 548, y: 823 }, { x: 547, y: 820 }, { x: 543, y: 822 }, { x: 540, y: 822 }, { x: 539, y: 818 }, { x: 535, y: 815 }, { x: 534, y: 819 }, { x: 532, y: 821 }, { x: 528, y: 821 }, { x: 525, y: 822 }, { x: 522, y: 821 }, { x: 524, y: 827 }, { x: 520, y: 829 }, { x: 517, y: 829 }, { x: 517, y: 833 }, { x: 520, y: 834 }, { x: 516, y: 837 }, { x: 519, y: 839 }, { x: 520, y: 845 }] },
  { id: "plaza-depth-17", depthY: 844, points: [{ x: 509, y: 844 }, { x: 509, y: 840 }, { x: 508, y: 840 }, { x: 507, y: 831 }, { x: 511, y: 829 }, { x: 510, y: 820 }, { x: 507, y: 820 }, { x: 508, y: 814 }, { x: 500, y: 814 }, { x: 500, y: 819 }, { x: 406, y: 820 }, { x: 406, y: 815 }, { x: 398, y: 813 }, { x: 396, y: 819 }, { x: 394, y: 820 }, { x: 394, y: 829 }, { x: 397, y: 830 }, { x: 396, y: 838 }, { x: 394, y: 841 }, { x: 394, y: 844 }] },
  { id: "plaza-depth-18", depthY: 845, points: [{ x: 353, y: 845 }, { x: 354, y: 839 }, { x: 363, y: 838 }, { x: 365, y: 837 }, { x: 367, y: 830 }, { x: 370, y: 832 }, { x: 371, y: 838 }, { x: 375, y: 838 }, { x: 377, y: 835 }, { x: 381, y: 839 }, { x: 383, y: 840 }, { x: 384, y: 845 }] },
  { id: "plaza-depth-19", depthY: 847, points: [{ x: 311, y: 846 }, { x: 308, y: 841 }, { x: 307, y: 836 }, { x: 306, y: 832 }, { x: 309, y: 831 }, { x: 304, y: 827 }, { x: 300, y: 830 }, { x: 295, y: 832 }, { x: 298, y: 827 }, { x: 298, y: 824 }, { x: 297, y: 823 }, { x: 299, y: 820 }, { x: 295, y: 816 }, { x: 292, y: 818 }, { x: 290, y: 817 }, { x: 290, y: 816 }, { x: 284, y: 817 }, { x: 281, y: 814 }, { x: 280, y: 814 }, { x: 279, y: 820 }, { x: 276, y: 822 }, { x: 274, y: 819 }, { x: 272, y: 825 }, { x: 268, y: 826 }, { x: 264, y: 825 }, { x: 264, y: 830 }, { x: 262, y: 835 }, { x: 255, y: 834 }, { x: 252, y: 832 }, { x: 255, y: 828 }, { x: 255, y: 825 }, { x: 252, y: 827 }, { x: 248, y: 829 }, { x: 247, y: 826 }, { x: 248, y: 824 }, { x: 244, y: 823 }, { x: 243, y: 826 }, { x: 240, y: 824 }, { x: 235, y: 827 }, { x: 236, y: 829 }, { x: 233, y: 831 }, { x: 231, y: 831 }, { x: 232, y: 836 }, { x: 229, y: 838 }, { x: 228, y: 841 }, { x: 227, y: 843 }, { x: 228, y: 847 }] },
  { id: "plaza-depth-20", depthY: 597, points: [{ x: 209, y: 597 }, { x: 207, y: 589 }, { x: 209, y: 580 }, { x: 208, y: 572 }, { x: 210, y: 566 }, { x: 213, y: 561 }, { x: 218, y: 564 }, { x: 219, y: 570 }, { x: 225, y: 569 }, { x: 224, y: 563 }, { x: 219, y: 559 }, { x: 215, y: 557 }, { x: 209, y: 557 }, { x: 206, y: 561 }, { x: 206, y: 565 }, { x: 205, y: 570 }, { x: 203, y: 572 }, { x: 203, y: 578 }, { x: 202, y: 579 }, { x: 203, y: 584 }, { x: 201, y: 588 }, { x: 202, y: 592 }] },
  { id: "plaza-depth-21", depthY: 604, points: [{ x: 218, y: 570 }, { x: 215, y: 577 }, { x: 212, y: 582 }, { x: 211, y: 589 }, { x: 214, y: 596 }, { x: 217, y: 604 }, { x: 234, y: 603 }, { x: 232, y: 600 }, { x: 233, y: 593 }, { x: 234, y: 587 }, { x: 237, y: 583 }, { x: 235, y: 579 }, { x: 230, y: 577 }, { x: 224, y: 570 }] },
];

// TRANSITIONS (yellow): activation zones.
export const plazaTransitions: (LogicalRect & { id: string })[] = [
  { id: "plaza-transition-1", x: 650, y: 0, width: 230, height: 25 },
  { id: "plaza-transition-2", x: 0, y: 480, width: 30, height: 110 },
  { id: "plaza-transition-3", x: 1506, y: 480, width: 30, height: 110 },
  { id: "plaza-transition-4", x: 645, y: 999, width: 235, height: 25 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const plazaSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "plaza-spawn-1", x: 1440, y: 540, direction: "west" },
  { id: "plaza-spawn-2", x: 770, y: 110, direction: "south" },
  { id: "plaza-spawn-3", x: 100, y: 540, direction: "east" },
  { id: "plaza-spawn-4", x: 765, y: 930, direction: "north" },
];
