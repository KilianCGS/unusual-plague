import type { LogicalRect, PolygonCollider, SceneCollider } from "../../collision";
import type { OcclusionShape } from "../../occlusion";
import type { Direction } from "../../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const forestCottageColliders: SceneCollider[] = [
  { id: "forest-cottage-1", x: 0, y: 5, width: 640, height: 79 },
  { id: "forest-cottage-2", x: 0, y: 101, width: 613, height: 382 },
  { id: "forest-cottage-3", x: 397, y: 484, width: 186, height: 59 },
  { id: "forest-cottage-4", x: 0, y: 463, width: 293, height: 79 },
  { id: "forest-cottage-5", x: 0, y: 525, width: 281, height: 80 },
  { id: "forest-cottage-6", x: 762, y: 313, width: 664, height: 82 },
  { id: "forest-cottage-7", x: 819, y: 0, width: 607, height: 307 },
  { id: "forest-cottage-8", x: 755, y: 215, width: 118, height: 50 },
  { id: "forest-cottage-9", x: 742, y: 144, width: 80, height: 39 },
  { id: "forest-cottage-10", x: 762, y: 0, width: 97, height: 119 },
  { id: "forest-cottage-11", x: 753, y: 407, width: 673, height: 114 },
  { id: "forest-cottage-12", x: 788, y: 505, width: 270, height: 74 },
  { id: "forest-cottage-13", x: 896, y: 568, width: 94, height: 33 },
  { id: "forest-cottage-14", x: 1010, y: 580, width: 64, height: 22 },
  { id: "forest-cottage-15", x: 1261, y: 446, width: 165, height: 222 },
  { id: "forest-cottage-16", x: 1011, y: 597, width: 36, height: 81 },
  { id: "forest-cottage-17", x: 285, y: 644, width: 46, height: 37 },
  { id: "forest-cottage-18", x: 0, y: 560, width: 199, height: 121 },
  { id: "forest-cottage-19", x: 602, y: 622, width: 84, height: 43 },
  { id: "forest-cottage-20", x: 575, y: 429, width: 67, height: 73 },
  { id: "forest-cottage-21", x: 591, y: 304, width: 53, height: 64 },
  { id: "forest-cottage-22", x: 579, y: 82, width: 53, height: 83 },
  { id: "forest-cottage-23", x: 822, y: 296, width: 42, height: 279 },
];

// FREE-HAND COLLIDERS (red shapes): same job as the colliders above,
// drawn point by point. The shape closes itself; it may be concave.
export const forestCottagePolygonColliders: PolygonCollider[] = [
  { id: "forest-cottage-poly-1", points: [{ x: 1018, y: 684 }, { x: 998, y: 687 }, { x: 990, y: 694 }, { x: 987, y: 702 }, { x: 989, y: 724 }, { x: 984, y: 735 }, { x: 990, y: 747 }, { x: 1018, y: 753 }, { x: 1030, y: 764 }, { x: 1028, y: 795 }, { x: 1035, y: 810 }, { x: 1035, y: 820 }, { x: 1028, y: 831 }, { x: 1024, y: 919 }, { x: 989, y: 949 }, { x: 934, y: 984 }, { x: 906, y: 991 }, { x: 872, y: 991 }, { x: 843, y: 995 }, { x: 789, y: 1013 }, { x: 755, y: 1020 }, { x: 645, y: 1034 }, { x: 615, y: 1031 }, { x: 529, y: 1004 }, { x: 469, y: 1004 }, { x: 431, y: 1000 }, { x: 410, y: 987 }, { x: 393, y: 943 }, { x: 388, y: 937 }, { x: 388, y: 930 }, { x: 378, y: 913 }, { x: 372, y: 891 }, { x: 361, y: 874 }, { x: 352, y: 846 }, { x: 343, y: 829 }, { x: 339, y: 811 }, { x: 338, y: 766 }, { x: 335, y: 753 }, { x: 328, y: 736 }, { x: 319, y: 724 }, { x: 318, y: 716 }, { x: 311, y: 707 }, { x: 309, y: 694 }, { x: 301, y: 684 }, { x: 269, y: 685 }, { x: 252, y: 698 }, { x: 246, y: 722 }, { x: 234, y: 727 }, { x: 223, y: 715 }, { x: 226, y: 703 }, { x: 198, y: 697 }, { x: 196, y: 694 }, { x: 196, y: 691 }, { x: 210, y: 681 }, { x: 197, y: 666 }, { x: 122, y: 665 }, { x: 90, y: 670 }, { x: 70, y: 676 }, { x: 38, y: 701 }, { x: 32, y: 718 }, { x: 13, y: 744 }, { x: 0, y: 769 }, { x: 0, y: 899 }, { x: 13, y: 936 }, { x: 42, y: 1001 }, { x: 70, y: 1043 }, { x: 79, y: 1050 }, { x: 109, y: 1060 }, { x: 229, y: 1067 }, { x: 281, y: 1077 }, { x: 328, y: 1077 }, { x: 437, y: 1096 }, { x: 613, y: 1100 }, { x: 712, y: 1084 }, { x: 776, y: 1077 }, { x: 796, y: 1070 }, { x: 854, y: 1064 }, { x: 915, y: 1064 }, { x: 961, y: 1056 }, { x: 1183, y: 1055 }, { x: 1241, y: 1043 }, { x: 1301, y: 1020 }, { x: 1316, y: 1005 }, { x: 1347, y: 961 }, { x: 1389, y: 832 }, { x: 1396, y: 802 }, { x: 1398, y: 741 }, { x: 1379, y: 727 }, { x: 1364, y: 727 }, { x: 1362, y: 598 }, { x: 1345, y: 543 }, { x: 1329, y: 517 }, { x: 1300, y: 489 }, { x: 1287, y: 470 }, { x: 1229, y: 451 }, { x: 1188, y: 449 }, { x: 1095, y: 452 }, { x: 1061, y: 460 }, { x: 1035, y: 485 }, { x: 1027, y: 506 }, { x: 1023, y: 589 }, { x: 1019, y: 609 }, { x: 1019, y: 663 }, { x: 1016, y: 676 }, { x: 1018, y: 691 }] },
];

// DEPTH SHAPES (violet): part of the background that covers the Doctor
// while his feet are above depthY (a treetop, a roof).
export const forestCottageOccluders: OcclusionShape[] = [
  { id: "forest-cottage-depth-1", depthY: 1054, points: [{ x: 1014, y: 789 }, { x: 1011, y: 786 }, { x: 991, y: 785 }, { x: 987, y: 786 }, { x: 985, y: 792 }, { x: 970, y: 787 }, { x: 973, y: 799 }, { x: 953, y: 803 }, { x: 947, y: 819 }, { x: 932, y: 819 }, { x: 936, y: 827 }, { x: 934, y: 832 }, { x: 926, y: 836 }, { x: 934, y: 842 }, { x: 935, y: 848 }, { x: 923, y: 861 }, { x: 966, y: 867 }, { x: 980, y: 878 }, { x: 980, y: 882 }, { x: 978, y: 886 }, { x: 961, y: 887 }, { x: 953, y: 898 }, { x: 931, y: 901 }, { x: 930, y: 915 }, { x: 911, y: 920 }, { x: 909, y: 928 }, { x: 898, y: 932 }, { x: 897, y: 940 }, { x: 905, y: 943 }, { x: 905, y: 950 }, { x: 886, y: 957 }, { x: 885, y: 970 }, { x: 881, y: 975 }, { x: 873, y: 974 }, { x: 865, y: 968 }, { x: 865, y: 957 }, { x: 840, y: 947 }, { x: 838, y: 943 }, { x: 822, y: 936 }, { x: 814, y: 929 }, { x: 793, y: 929 }, { x: 784, y: 936 }, { x: 770, y: 938 }, { x: 759, y: 950 }, { x: 743, y: 950 }, { x: 743, y: 943 }, { x: 735, y: 942 }, { x: 733, y: 938 }, { x: 735, y: 930 }, { x: 725, y: 929 }, { x: 721, y: 924 }, { x: 721, y: 917 }, { x: 717, y: 920 }, { x: 710, y: 919 }, { x: 707, y: 905 }, { x: 707, y: 915 }, { x: 686, y: 917 }, { x: 683, y: 922 }, { x: 689, y: 925 }, { x: 676, y: 929 }, { x: 675, y: 932 }, { x: 682, y: 937 }, { x: 667, y: 955 }, { x: 667, y: 970 }, { x: 659, y: 971 }, { x: 657, y: 974 }, { x: 634, y: 975 }, { x: 630, y: 982 }, { x: 619, y: 983 }, { x: 612, y: 976 }, { x: 617, y: 968 }, { x: 608, y: 967 }, { x: 607, y: 964 }, { x: 620, y: 955 }, { x: 599, y: 949 }, { x: 598, y: 943 }, { x: 602, y: 938 }, { x: 600, y: 934 }, { x: 592, y: 934 }, { x: 591, y: 922 }, { x: 571, y: 924 }, { x: 570, y: 916 }, { x: 557, y: 913 }, { x: 558, y: 905 }, { x: 542, y: 908 }, { x: 529, y: 903 }, { x: 521, y: 907 }, { x: 504, y: 909 }, { x: 504, y: 919 }, { x: 481, y: 922 }, { x: 470, y: 936 }, { x: 461, y: 940 }, { x: 460, y: 943 }, { x: 469, y: 946 }, { x: 469, y: 949 }, { x: 462, y: 955 }, { x: 458, y: 964 }, { x: 437, y: 966 }, { x: 437, y: 959 }, { x: 430, y: 951 }, { x: 412, y: 946 }, { x: 407, y: 934 }, { x: 403, y: 932 }, { x: 399, y: 915 }, { x: 403, y: 905 }, { x: 414, y: 892 }, { x: 418, y: 880 }, { x: 418, y: 863 }, { x: 411, y: 857 }, { x: 405, y: 835 }, { x: 399, y: 829 }, { x: 395, y: 817 }, { x: 385, y: 807 }, { x: 384, y: 800 }, { x: 368, y: 792 }, { x: 357, y: 791 }, { x: 356, y: 783 }, { x: 318, y: 779 }, { x: 276, y: 825 }, { x: 256, y: 853 }, { x: 250, y: 867 }, { x: 251, y: 904 }, { x: 269, y: 937 }, { x: 298, y: 975 }, { x: 373, y: 1021 }, { x: 415, y: 1035 }, { x: 499, y: 1051 }, { x: 531, y: 1054 }, { x: 787, y: 1054 }, { x: 796, y: 1051 }, { x: 877, y: 1045 }, { x: 1022, y: 1020 }, { x: 1104, y: 997 }, { x: 1124, y: 985 }, { x: 1135, y: 983 }, { x: 1161, y: 967 }, { x: 1186, y: 943 }, { x: 1203, y: 917 }, { x: 1208, y: 873 }, { x: 1208, y: 836 }, { x: 1203, y: 816 }, { x: 1187, y: 782 }, { x: 1171, y: 762 }, { x: 1124, y: 724 }, { x: 1106, y: 716 }, { x: 1058, y: 708 }, { x: 1052, y: 719 }, { x: 1051, y: 768 }, { x: 1041, y: 785 }, { x: 1030, y: 790 }, { x: 1003, y: 785 }] },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const forestCottageTransitions: (LogicalRect & { id: string })[] = [
  { id: "forest-cottage-transition-1", x: 650, y: 0, width: 80, height: 25 },
  { id: "forest-cottage-transition-2", x: 290, y: 517, width: 105, height: 29 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const forestCottageSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "forest-cottage-spawn-1", x: 690, y: 100, direction: "south" },
  { id: "forest-cottage-spawn-2", x: 353, y: 597, direction: "south" },
];
