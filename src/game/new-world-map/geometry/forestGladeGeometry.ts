import type { LogicalRect, PolygonCollider, SceneCollider } from "../../collision";
import type { OcclusionShape } from "../../occlusion";
import type { Direction } from "../../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const forestGladeColliders: SceneCollider[] = [
  { id: "forest-glade-1", x: 0, y: 0, width: 412, height: 501 },
  { id: "forest-glade-2", x: 412, y: 0, width: 177, height: 457 },
  { id: "forest-glade-3", x: 592, y: 0, width: 166, height: 343 },
  { id: "forest-glade-4", x: 762, y: 0, width: 140, height: 228 },
  { id: "forest-glade-5", x: 899, y: 0, width: 528, height: 179 },
  { id: "forest-glade-6", x: 971, y: 72, width: 456, height: 284 },
  { id: "forest-glade-7", x: 1034, y: 333, width: 393, height: 77 },
  { id: "forest-glade-8", x: 1192, y: 350, width: 235, height: 98 },
  { id: "forest-glade-9", x: 1228, y: 407, width: 199, height: 137 },
  { id: "forest-glade-10", x: 1251, y: 533, width: 176, height: 569 },
  { id: "forest-glade-11", x: 1196, y: 769, width: 116, height: 333 },
  { id: "forest-glade-12", x: 0, y: 970, width: 1178, height: 132 },
  { id: "forest-glade-13", x: 4, y: 735, width: 131, height: 229 },
  { id: "forest-glade-14", x: 129, y: 784, width: 185, height: 178 },
  { id: "forest-glade-15", x: 295, y: 852, width: 190, height: 100 },
  { id: "forest-glade-16", x: 453, y: 863, width: 241, height: 107 },
  { id: "forest-glade-17", x: 707, y: 911, width: 117, height: 62 },
  { id: "forest-glade-18", x: 0, y: 617, width: 18, height: 126 },
  { id: "forest-glade-19", x: 1, y: 502, width: 22, height: 36 },
  { id: "forest-glade-20", x: 37, y: 500, width: 50, height: 25 },
  { id: "forest-glade-21", x: 132, y: 496, width: 47, height: 17 },
  { id: "forest-glade-22", x: 358, y: 495, width: 45, height: 19 },
  { id: "forest-glade-23", x: 412, y: 564, width: 28, height: 7 },
  { id: "forest-glade-24", x: 660, y: 446, width: 55, height: 29 },
  { id: "forest-glade-25", x: 872, y: 352, width: 56, height: 42 },
  { id: "forest-glade-26", x: 947, y: 247, width: 23, height: 103 },
  { id: "forest-glade-27", x: 914, y: 258, width: 28, height: 51 },
  { id: "forest-glade-28", x: 879, y: 309, width: 75, height: 25 },
  { id: "forest-glade-29", x: 941, y: 355, width: 102, height: 47 },
  { id: "forest-glade-30", x: 1075, y: 587, width: 40, height: 11 },
  { id: "forest-glade-31", x: 1209, y: 488, width: 21, height: 44 },
];

// FREE-HAND COLLIDERS (red shapes): same job as the colliders above,
// drawn point by point. The shape closes itself; it may be concave.
export const forestGladePolygonColliders: PolygonCollider[] = [
  { id: "forest-glade-poly-1", points: [{ x: 954, y: 708 }, { x: 1177, y: 636 }, { x: 1191, y: 667 }, { x: 977, y: 733 }] },
];

// DEPTH SHAPES (violet): part of the background that covers the Doctor
// while his feet are above depthY (a treetop, a roof).
export const forestGladeOccluders: OcclusionShape[] = [
  { id: "forest-glade-depth-1", depthY: 708, points: [{ x: 1181, y: 640 }, { x: 1165, y: 624 }, { x: 1153, y: 615 }, { x: 960, y: 676 }, { x: 958, y: 708 }, { x: 992, y: 700 }] },
  { id: "forest-glade-depth-2", depthY: 967, points: [{ x: 3, y: 629 }, { x: 29, y: 646 }, { x: 56, y: 650 }, { x: 62, y: 640 }, { x: 88, y: 641 }, { x: 111, y: 638 }, { x: 111, y: 647 }, { x: 132, y: 660 }, { x: 144, y: 670 }, { x: 149, y: 663 }, { x: 154, y: 674 }, { x: 173, y: 682 }, { x: 169, y: 691 }, { x: 199, y: 701 }, { x: 180, y: 712 }, { x: 202, y: 715 }, { x: 240, y: 695 }, { x: 238, y: 722 }, { x: 263, y: 712 }, { x: 295, y: 724 }, { x: 309, y: 721 }, { x: 311, y: 705 }, { x: 321, y: 713 }, { x: 330, y: 700 }, { x: 356, y: 709 }, { x: 348, y: 700 }, { x: 350, y: 696 }, { x: 367, y: 700 }, { x: 377, y: 689 }, { x: 383, y: 685 }, { x: 386, y: 693 }, { x: 403, y: 689 }, { x: 405, y: 701 }, { x: 414, y: 712 }, { x: 424, y: 717 }, { x: 429, y: 715 }, { x: 432, y: 711 }, { x: 440, y: 710 }, { x: 444, y: 712 }, { x: 453, y: 706 }, { x: 464, y: 708 }, { x: 469, y: 699 }, { x: 476, y: 698 }, { x: 483, y: 702 }, { x: 488, y: 712 }, { x: 493, y: 713 }, { x: 497, y: 709 }, { x: 505, y: 706 }, { x: 510, y: 714 }, { x: 518, y: 715 }, { x: 524, y: 713 }, { x: 530, y: 730 }, { x: 536, y: 725 }, { x: 546, y: 730 }, { x: 548, y: 735 }, { x: 542, y: 739 }, { x: 545, y: 742 }, { x: 541, y: 749 }, { x: 547, y: 752 }, { x: 551, y: 754 }, { x: 551, y: 748 }, { x: 554, y: 755 }, { x: 561, y: 755 }, { x: 568, y: 752 }, { x: 571, y: 756 }, { x: 567, y: 760 }, { x: 579, y: 764 }, { x: 581, y: 771 }, { x: 589, y: 769 }, { x: 593, y: 777 }, { x: 590, y: 781 }, { x: 593, y: 786 }, { x: 586, y: 793 }, { x: 584, y: 798 }, { x: 592, y: 802 }, { x: 606, y: 813 }, { x: 604, y: 821 }, { x: 604, y: 824 }, { x: 613, y: 831 }, { x: 628, y: 838 }, { x: 638, y: 830 }, { x: 646, y: 835 }, { x: 648, y: 837 }, { x: 655, y: 838 }, { x: 660, y: 837 }, { x: 686, y: 846 }, { x: 679, y: 842 }, { x: 675, y: 829 }, { x: 673, y: 823 }, { x: 689, y: 832 }, { x: 684, y: 815 }, { x: 695, y: 825 }, { x: 701, y: 818 }, { x: 709, y: 816 }, { x: 713, y: 825 }, { x: 712, y: 836 }, { x: 723, y: 837 }, { x: 723, y: 851 }, { x: 732, y: 845 }, { x: 733, y: 828 }, { x: 741, y: 819 }, { x: 769, y: 781 }, { x: 778, y: 797 }, { x: 788, y: 811 }, { x: 796, y: 821 }, { x: 801, y: 824 }, { x: 795, y: 832 }, { x: 803, y: 835 }, { x: 811, y: 844 }, { x: 818, y: 849 }, { x: 822, y: 852 }, { x: 810, y: 859 }, { x: 809, y: 865 }, { x: 826, y: 891 }, { x: 842, y: 896 }, { x: 845, y: 905 }, { x: 839, y: 907 }, { x: 849, y: 921 }, { x: 845, y: 933 }, { x: 864, y: 946 }, { x: 859, y: 952 }, { x: 848, y: 967 }, { x: 683, y: 901 }, { x: 469, y: 867 }, { x: 312, y: 852 }, { x: 312, y: 786 }, { x: 127, y: 789 }, { x: 129, y: 737 }, { x: 7, y: 737 }] },
  { id: "forest-glade-depth-3", depthY: 562, points: [{ x: 405, y: 556 }, { x: 397, y: 550 }, { x: 401, y: 544 }, { x: 407, y: 546 }, { x: 418, y: 551 }, { x: 414, y: 536 }, { x: 420, y: 531 }, { x: 426, y: 534 }, { x: 424, y: 539 }, { x: 440, y: 543 }, { x: 448, y: 549 }, { x: 442, y: 553 }, { x: 444, y: 558 }, { x: 439, y: 562 }, { x: 412, y: 562 }] },
  { id: "forest-glade-depth-4", depthY: 398, points: [{ x: 705, y: 387 }, { x: 720, y: 387 }, { x: 712, y: 368 }, { x: 723, y: 380 }, { x: 734, y: 362 }, { x: 743, y: 375 }, { x: 741, y: 383 }, { x: 754, y: 370 }, { x: 750, y: 388 }, { x: 757, y: 388 }, { x: 747, y: 398 }, { x: 721, y: 397 }] },
  { id: "forest-glade-depth-5", depthY: 345, points: [{ x: 814, y: 341 }, { x: 806, y: 343 }, { x: 806, y: 331 }, { x: 810, y: 330 }, { x: 799, y: 327 }, { x: 796, y: 324 }, { x: 802, y: 319 }, { x: 811, y: 318 }, { x: 806, y: 307 }, { x: 822, y: 313 }, { x: 818, y: 299 }, { x: 825, y: 303 }, { x: 837, y: 292 }, { x: 841, y: 311 }, { x: 861, y: 322 }, { x: 858, y: 336 }, { x: 855, y: 345 }] },
  { id: "forest-glade-depth-6", depthY: 585, points: [{ x: 1077, y: 585 }, { x: 1072, y: 581 }, { x: 1079, y: 571 }, { x: 1086, y: 572 }, { x: 1089, y: 573 }, { x: 1096, y: 573 }, { x: 1109, y: 557 }, { x: 1115, y: 559 }, { x: 1122, y: 564 }, { x: 1121, y: 575 }, { x: 1112, y: 578 }, { x: 1111, y: 583 }, { x: 1109, y: 585 }] },
  { id: "forest-glade-depth-7", depthY: 473, points: [{ x: 1114, y: 469 }, { x: 1107, y: 462 }, { x: 1103, y: 458 }, { x: 1105, y: 451 }, { x: 1111, y: 451 }, { x: 1111, y: 445 }, { x: 1128, y: 444 }, { x: 1127, y: 432 }, { x: 1137, y: 433 }, { x: 1142, y: 429 }, { x: 1148, y: 440 }, { x: 1161, y: 441 }, { x: 1163, y: 448 }, { x: 1170, y: 450 }, { x: 1178, y: 456 }, { x: 1164, y: 463 }, { x: 1126, y: 473 }] },
  { id: "forest-glade-depth-8", depthY: 485, points: [{ x: 1004, y: 485 }, { x: 987, y: 473 }, { x: 989, y: 461 }, { x: 1006, y: 456 }, { x: 1012, y: 469 }, { x: 1025, y: 465 }, { x: 1026, y: 476 }, { x: 1020, y: 477 }] },
  { id: "forest-glade-depth-9", depthY: 665, points: [{ x: 987, y: 665 }, { x: 980, y: 663 }, { x: 978, y: 656 }, { x: 980, y: 650 }, { x: 989, y: 644 }, { x: 997, y: 639 }, { x: 1002, y: 639 }, { x: 995, y: 624 }, { x: 1006, y: 622 }, { x: 1012, y: 624 }, { x: 1028, y: 625 }, { x: 1028, y: 610 }, { x: 1060, y: 612 }, { x: 1067, y: 619 }, { x: 1083, y: 623 }, { x: 1098, y: 632 }] },
  { id: "forest-glade-depth-10", depthY: 753, points: [{ x: 682, y: 748 }, { x: 623, y: 750 }, { x: 608, y: 737 }, { x: 620, y: 713 }, { x: 637, y: 721 }, { x: 642, y: 705 }, { x: 653, y: 720 }, { x: 667, y: 706 }, { x: 665, y: 724 }, { x: 684, y: 726 }, { x: 669, y: 738 }] },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const forestGladeTransitions: (LogicalRect & { id: string })[] = [
  { id: "forest-glade-transition-1", x: 0, y: 537, width: 23, height: 83 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const forestGladeSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "forest-glade-spawn-1", x: 64, y: 582, direction: "south" },
];
