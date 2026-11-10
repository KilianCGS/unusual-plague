import type { LogicalRect, SceneCollider } from "../../collision";
import type { OcclusionShape } from "../../occlusion";
import type { Direction } from "../../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const millFarmlandColliders: SceneCollider[] = [
  { id: "mill-farmland-1", x: 0, y: 0, width: 588, height: 1036 },
  { id: "mill-farmland-2", x: 588, y: 0, width: 1896, height: 133 },
  { id: "mill-farmland-3", x: 532, y: 553, width: 749, height: 469 },
  { id: "mill-farmland-4", x: 882, y: 70, width: 455, height: 413 },
  { id: "mill-farmland-5", x: 1414, y: 196, width: 112, height: 84 },
  { id: "mill-farmland-6", x: 2029, y: 217, width: 183, height: 140 },
  { id: "mill-farmland-7", x: 2198, y: 406, width: 98, height: 77 },
  { id: "mill-farmland-8", x: 2282, y: 0, width: 202, height: 1120 },
  { id: "mill-farmland-9", x: 0, y: 1127, width: 1302, height: 115 },
  { id: "mill-farmland-10", x: 1302, y: 1183, width: 1182, height: 59 },
  { id: "mill-farmland-11", x: 2198, y: 1120, width: 286, height: 122 },
  { id: "mill-farmland-12", x: 2215, y: 854, width: 31, height: 255 },
  { id: "mill-farmland-13", x: 1416, y: 1064, width: 806, height: 47 },
  { id: "mill-farmland-14", x: 1400, y: 807, width: 36, height: 278 },
  { id: "mill-farmland-15", x: 1407, y: 525, width: 423, height: 45 },
  { id: "mill-farmland-16", x: 1870, y: 530, width: 384, height: 35 },
  { id: "mill-farmland-17", x: 2235, y: 542, width: 40, height: 187 },
  { id: "mill-farmland-18", x: 1871, y: 710, width: 397, height: 28 },
  { id: "mill-farmland-19", x: 1410, y: 712, width: 411, height: 24 },
  { id: "mill-farmland-20", x: 1410, y: 532, width: 14, height: 189 },
  { id: "mill-farmland-21", x: 525, y: 301, width: 175, height: 89 },
  { id: "mill-farmland-22", x: 689, y: 248, width: 73, height: 69 },
  { id: "mill-farmland-23", x: 564, y: 119, width: 304, height: 103 },
  { id: "mill-farmland-24", x: 568, y: 215, width: 151, height: 78 },
  { id: "mill-farmland-25", x: 1322, y: 270, width: 61, height: 62 },
  { id: "mill-farmland-26", x: 1325, y: 183, width: 70, height: 54 },
  { id: "mill-farmland-27", x: 2072, y: 419, width: 59, height: 61 },
  { id: "mill-farmland-28", x: 1670, y: 286, width: 42, height: 133 },
  { id: "mill-farmland-29", x: 1663, y: 131, width: 75, height: 103 },
  { id: "mill-farmland-30", x: 1741, y: 244, width: 234, height: 40 },
  { id: "mill-farmland-31", x: 1778, y: 206, width: 184, height: 38 },
  { id: "mill-farmland-32", x: 1837, y: 180, width: 79, height: 24 },
  { id: "mill-farmland-33", x: 1729, y: 225, width: 21, height: 28 },
  { id: "mill-farmland-34", x: 1786, y: 287, width: 75, height: 165 },
  { id: "mill-farmland-35", x: 1710, y: 280, width: 76, height: 92 },
  { id: "mill-farmland-36", x: 1875, y: 286, width: 95, height: 147 },
  { id: "mill-farmland-37", x: 1863, y: 421, width: 53, height: 40 },
  { id: "mill-farmland-38", x: 1793, y: 449, width: 49, height: 27 },
  { id: "mill-farmland-39", x: 2124, y: 357, width: 63, height: 29 },
  { id: "mill-farmland-40", x: 1741, y: 920, width: 33, height: 41 },
  { id: "mill-farmland-41", x: 1747, y: 1038, width: 19, height: 34 },
  { id: "mill-farmland-42", x: 1612, y: 1036, width: 25, height: 33 },
  { id: "mill-farmland-43", x: 1482, y: 1031, width: 28, height: 37 },
  { id: "mill-farmland-44", x: 1482, y: 927, width: 25, height: 36 },
  { id: "mill-farmland-45", x: 1614, y: 926, width: 22, height: 36 },
  { id: "mill-farmland-46", x: 1943, y: 807, width: 41, height: 31 },
  { id: "mill-farmland-47", x: 2019, y: 808, width: 34, height: 30 },
  { id: "mill-farmland-48", x: 2036, y: 735, width: 66, height: 52 },
  { id: "mill-farmland-49", x: 2093, y: 811, width: 37, height: 24 },
  { id: "mill-farmland-50", x: 2171, y: 812, width: 34, height: 26 },
  { id: "mill-farmland-51", x: 2120, y: 744, width: 112, height: 42 },
  { id: "mill-farmland-52", x: 2213, y: 784, width: 30, height: 23 },
  { id: "mill-farmland-53", x: 2139, y: 788, width: 20, height: 13 },
  { id: "mill-farmland-54", x: 2228, y: 743, width: 19, height: 82 },
  { id: "mill-farmland-55", x: 2249, y: 755, width: 29, height: 101 },
];

// DEPTH SHAPES (violet): part of the background that covers the Doctor
// while his feet are above depthY (a treetop, a roof).
export const millFarmlandOccluders: OcclusionShape[] = [
  { id: "mill-farmland-depth-1", depthY: 931, points: [{ x: 1742, y: 931 }, { x: 1727, y: 927 }, { x: 1713, y: 919 }, { x: 1703, y: 902 }, { x: 1710, y: 877 }, { x: 1709, y: 871 }, { x: 1730, y: 844 }, { x: 1735, y: 844 }, { x: 1742, y: 843 }, { x: 1755, y: 834 }, { x: 1765, y: 835 }, { x: 1768, y: 841 }, { x: 1794, y: 850 }, { x: 1798, y: 860 }, { x: 1805, y: 864 }, { x: 1808, y: 873 }, { x: 1807, y: 889 }, { x: 1813, y: 893 }, { x: 1812, y: 903 }, { x: 1806, y: 913 }, { x: 1797, y: 921 }, { x: 1789, y: 928 }, { x: 1787, y: 931 }] },
  { id: "mill-farmland-depth-2", depthY: 1052, points: [{ x: 1729, y: 1042 }, { x: 1711, y: 1023 }, { x: 1709, y: 996 }, { x: 1728, y: 969 }, { x: 1747, y: 965 }, { x: 1767, y: 965 }, { x: 1790, y: 969 }, { x: 1807, y: 988 }, { x: 1803, y: 1000 }, { x: 1806, y: 1012 }, { x: 1800, y: 1031 }, { x: 1785, y: 1043 }, { x: 1777, y: 1046 }, { x: 1748, y: 1049 }] },
  { id: "mill-farmland-depth-3", depthY: 1050, points: [{ x: 1613, y: 1048 }, { x: 1607, y: 1043 }, { x: 1604, y: 1046 }, { x: 1587, y: 1036 }, { x: 1586, y: 1029 }, { x: 1574, y: 1022 }, { x: 1576, y: 1007 }, { x: 1582, y: 1003 }, { x: 1580, y: 997 }, { x: 1580, y: 988 }, { x: 1584, y: 979 }, { x: 1591, y: 976 }, { x: 1594, y: 972 }, { x: 1597, y: 968 }, { x: 1603, y: 968 }, { x: 1609, y: 965 }, { x: 1616, y: 965 }, { x: 1624, y: 963 }, { x: 1635, y: 963 }, { x: 1642, y: 965 }, { x: 1653, y: 968 }, { x: 1660, y: 969 }, { x: 1666, y: 977 }, { x: 1675, y: 985 }, { x: 1677, y: 988 }, { x: 1674, y: 995 }, { x: 1669, y: 1005 }, { x: 1672, y: 1007 }, { x: 1677, y: 1015 }, { x: 1673, y: 1024 }, { x: 1674, y: 1030 }, { x: 1662, y: 1033 }, { x: 1659, y: 1040 }, { x: 1654, y: 1043 }, { x: 1651, y: 1047 }, { x: 1643, y: 1045 }, { x: 1640, y: 1050 }] },
  { id: "mill-farmland-depth-4", depthY: 1049, points: [{ x: 1512, y: 1046 }, { x: 1519, y: 1043 }, { x: 1523, y: 1045 }, { x: 1528, y: 1039 }, { x: 1534, y: 1035 }, { x: 1540, y: 1036 }, { x: 1542, y: 1030 }, { x: 1548, y: 1027 }, { x: 1548, y: 1017 }, { x: 1549, y: 1012 }, { x: 1546, y: 1007 }, { x: 1542, y: 1000 }, { x: 1542, y: 994 }, { x: 1543, y: 991 }, { x: 1544, y: 985 }, { x: 1530, y: 975 }, { x: 1530, y: 969 }, { x: 1524, y: 968 }, { x: 1519, y: 968 }, { x: 1512, y: 965 }, { x: 1510, y: 963 }, { x: 1502, y: 963 }, { x: 1496, y: 963 }, { x: 1490, y: 964 }, { x: 1485, y: 967 }, { x: 1481, y: 968 }, { x: 1473, y: 968 }, { x: 1469, y: 968 }, { x: 1455, y: 984 }, { x: 1449, y: 985 }, { x: 1452, y: 993 }, { x: 1449, y: 995 }, { x: 1449, y: 1001 }, { x: 1446, y: 1013 }, { x: 1447, y: 1019 }, { x: 1454, y: 1030 }, { x: 1455, y: 1036 }, { x: 1462, y: 1043 }, { x: 1473, y: 1049 }, { x: 1483, y: 1046 }] },
  { id: "mill-farmland-depth-5", depthY: 932, points: [{ x: 1480, y: 930 }, { x: 1468, y: 931 }, { x: 1465, y: 929 }, { x: 1464, y: 923 }, { x: 1459, y: 921 }, { x: 1456, y: 922 }, { x: 1454, y: 917 }, { x: 1452, y: 913 }, { x: 1447, y: 911 }, { x: 1445, y: 906 }, { x: 1443, y: 900 }, { x: 1442, y: 894 }, { x: 1443, y: 888 }, { x: 1445, y: 881 }, { x: 1446, y: 873 }, { x: 1446, y: 870 }, { x: 1449, y: 865 }, { x: 1458, y: 860 }, { x: 1461, y: 853 }, { x: 1462, y: 849 }, { x: 1469, y: 849 }, { x: 1479, y: 845 }, { x: 1489, y: 842 }, { x: 1492, y: 840 }, { x: 1497, y: 837 }, { x: 1504, y: 835 }, { x: 1511, y: 845 }, { x: 1517, y: 844 }, { x: 1522, y: 847 }, { x: 1527, y: 847 }, { x: 1533, y: 849 }, { x: 1536, y: 857 }, { x: 1546, y: 866 }, { x: 1538, y: 874 }, { x: 1545, y: 883 }, { x: 1542, y: 889 }, { x: 1549, y: 895 }, { x: 1550, y: 903 }, { x: 1547, y: 907 }, { x: 1546, y: 917 }, { x: 1536, y: 921 }, { x: 1530, y: 922 }, { x: 1523, y: 931 }, { x: 1519, y: 932 }] },
  { id: "mill-farmland-depth-6", depthY: 934, points: [{ x: 1614, y: 933 }, { x: 1612, y: 934 }, { x: 1599, y: 927 }, { x: 1598, y: 933 }, { x: 1591, y: 927 }, { x: 1589, y: 922 }, { x: 1586, y: 917 }, { x: 1583, y: 910 }, { x: 1577, y: 907 }, { x: 1574, y: 901 }, { x: 1575, y: 890 }, { x: 1578, y: 885 }, { x: 1580, y: 881 }, { x: 1579, y: 875 }, { x: 1576, y: 867 }, { x: 1580, y: 862 }, { x: 1590, y: 854 }, { x: 1591, y: 850 }, { x: 1597, y: 844 }, { x: 1605, y: 843 }, { x: 1611, y: 843 }, { x: 1618, y: 838 }, { x: 1621, y: 833 }, { x: 1627, y: 835 }, { x: 1632, y: 836 }, { x: 1638, y: 842 }, { x: 1644, y: 844 }, { x: 1651, y: 847 }, { x: 1658, y: 848 }, { x: 1665, y: 850 }, { x: 1667, y: 856 }, { x: 1673, y: 864 }, { x: 1678, y: 868 }, { x: 1677, y: 875 }, { x: 1674, y: 885 }, { x: 1680, y: 892 }, { x: 1684, y: 900 }, { x: 1683, y: 904 }, { x: 1676, y: 911 }, { x: 1670, y: 920 }, { x: 1667, y: 924 }, { x: 1660, y: 925 }, { x: 1648, y: 934 }] },
  { id: "mill-farmland-depth-7", depthY: 807, points: [{ x: 1937, y: 807 }, { x: 1937, y: 788 }, { x: 1958, y: 771 }, { x: 1989, y: 789 }, { x: 1985, y: 805 }] },
  { id: "mill-farmland-depth-8", depthY: 809, points: [{ x: 2014, y: 804 }, { x: 2013, y: 789 }, { x: 2035, y: 775 }, { x: 2060, y: 791 }, { x: 2056, y: 809 }] },
  { id: "mill-farmland-depth-9", depthY: 809, points: [{ x: 2091, y: 809 }, { x: 2092, y: 786 }, { x: 2133, y: 788 }, { x: 2131, y: 808 }] },
  { id: "mill-farmland-depth-10", depthY: 810, points: [{ x: 2165, y: 810 }, { x: 2163, y: 792 }, { x: 2188, y: 771 }, { x: 2210, y: 788 }, { x: 2208, y: 809 }] },
];

// TRANSITIONS (yellow): activation zones.
export const millFarmlandTransitions: (LogicalRect & { id: string })[] = [
  { id: "mill-farmland-transition-1", x: 0, y: 1043, width: 35, height: 84 },
  { id: "mill-farmland-transition-2", x: 1712, y: 424, width: 61, height: 14 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const millFarmlandSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "mill-farmland-spawn-1", x: 154, y: 1085, direction: "east" },
  { id: "mill-farmland-spawn-2", x: 1724, y: 478, direction: "south" },
];
