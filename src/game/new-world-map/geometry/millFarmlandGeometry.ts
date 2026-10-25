import type { LogicalRect, SceneCollider } from "../../collision";
import type { Direction } from "../../protagonist/useProtagonistController";

export const millFarmlandColliders: SceneCollider[] = [
  { id: "mill-farmland-1", x: 0, y: 0, width: 588, height: 1036 },
  { id: "mill-farmland-2", x: 588, y: 0, width: 1896, height: 133 },
  { id: "mill-farmland-3", x: 532, y: 553, width: 749, height: 469 },
  { id: "mill-farmland-4", x: 882, y: 70, width: 455, height: 413 },
  { id: "mill-farmland-5", x: 1414, y: 196, width: 112, height: 84 },
  { id: "mill-farmland-6", x: 2029, y: 217, width: 183, height: 140 },
  { id: "mill-farmland-7", x: 2198, y: 406, width: 98, height: 77 },
  { id: "mill-farmland-8", x: 2282, y: 0, width: 202, height: 1120 },
  { id: "mill-farmland-9", x: 1931, y: 728, width: 407, height: 133 },
  { id: "mill-farmland-10", x: 0, y: 1127, width: 1302, height: 115 },
  { id: "mill-farmland-11", x: 1302, y: 1183, width: 1182, height: 59 },
  { id: "mill-farmland-12", x: 2198, y: 1120, width: 286, height: 122 },
  { id: "mill-farmland-13", x: 2215, y: 854, width: 31, height: 255 },
  { id: "mill-farmland-14", x: 1416, y: 1064, width: 806, height: 47 },
  { id: "mill-farmland-15", x: 1400, y: 807, width: 36, height: 278 },
  { id: "mill-farmland-16", x: 1442, y: 842, width: 360, height: 212 },
  { id: "mill-farmland-17", x: 1407, y: 525, width: 423, height: 45 },
  { id: "mill-farmland-18", x: 1870, y: 530, width: 384, height: 35 },
  { id: "mill-farmland-19", x: 2235, y: 542, width: 40, height: 187 },
  { id: "mill-farmland-20", x: 1871, y: 710, width: 397, height: 28 },
  { id: "mill-farmland-21", x: 1410, y: 712, width: 411, height: 24 },
  { id: "mill-farmland-22", x: 1410, y: 532, width: 14, height: 189 },
  { id: "mill-farmland-23", x: 525, y: 301, width: 175, height: 89 },
  { id: "mill-farmland-24", x: 689, y: 248, width: 73, height: 69 },
  { id: "mill-farmland-25", x: 564, y: 119, width: 304, height: 103 },
  { id: "mill-farmland-26", x: 568, y: 215, width: 151, height: 78 },
  { id: "mill-farmland-27", x: 1322, y: 270, width: 61, height: 62 },
  { id: "mill-farmland-28", x: 1325, y: 183, width: 70, height: 54 },
  { id: "mill-farmland-29", x: 2072, y: 419, width: 59, height: 61 },
  { id: "mill-farmland-30", x: 1670, y: 286, width: 42, height: 133 },
  { id: "mill-farmland-31", x: 1663, y: 131, width: 75, height: 103 },
  { id: "mill-farmland-32", x: 1741, y: 244, width: 234, height: 40 },
  { id: "mill-farmland-33", x: 1778, y: 206, width: 184, height: 38 },
  { id: "mill-farmland-34", x: 1837, y: 180, width: 79, height: 24 },
  { id: "mill-farmland-35", x: 1729, y: 225, width: 21, height: 28 },
  { id: "mill-farmland-36", x: 1786, y: 287, width: 75, height: 165 },
  { id: "mill-farmland-37", x: 1710, y: 280, width: 76, height: 92 },
  { id: "mill-farmland-38", x: 1875, y: 286, width: 95, height: 147 },
  { id: "mill-farmland-39", x: 1863, y: 421, width: 53, height: 40 },
  { id: "mill-farmland-40", x: 1793, y: 449, width: 49, height: 27 },
  { id: "mill-farmland-41", x: 2124, y: 357, width: 63, height: 29 },
];

export const millFarmlandTransitions: (LogicalRect & { id: string })[] = [
  { id: "mill-farmland-transition-1", x: 0, y: 1043, width: 35, height: 84 },
  { id: "mill-farmland-transition-2", x: 1712, y: 424, width: 61, height: 14 },
];

export const millFarmlandSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "mill-farmland-spawn-1", x: 154, y: 1085, direction: "east" },
  { id: "mill-farmland-spawn-2", x: 1724, y: 478, direction: "south" },
];
