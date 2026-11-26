import type { LogicalRect, SceneCollider } from "../../collision";
import type { OcclusionShape } from "../../occlusion";
import type { Direction } from "../../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const tavernStreetColliders: SceneCollider[] = [
  { id: "tavern-street-1", x: 0, y: 602, width: 529, height: 194 },
  { id: "tavern-street-2", x: 528, y: 602, width: 555, height: 191 },
  { id: "tavern-street-3", x: 1080, y: 603, width: 477, height: 201 },
  { id: "tavern-street-4", x: 5, y: 0, width: 1552, height: 362 },
  { id: "tavern-street-5", x: 1335, y: 365, width: 194, height: 37 },
  { id: "tavern-street-6", x: 1126, y: 369, width: 87, height: 22 },
  { id: "tavern-street-7", x: 911, y: 363, width: 163, height: 40 },
  { id: "tavern-street-8", x: 705, y: 363, width: 100, height: 41 },
  { id: "tavern-street-9", x: 653, y: 359, width: 35, height: 46 },
  { id: "tavern-street-10", x: 503, y: 362, width: 140, height: 22 },
  { id: "tavern-street-11", x: 504, y: 382, width: 73, height: 15 },
  { id: "tavern-street-12", x: 221, y: 335, width: 162, height: 59 },
  { id: "tavern-street-13", x: 6, y: 369, width: 49, height: 31 },
  { id: "tavern-street-14", x: 52, y: 362, width: 69, height: 23 },
];

// DEPTH SHAPES (violet): part of the background that covers the Doctor
// while his feet are above depthY (a treetop, a roof).
export const tavernStreetOccluders: OcclusionShape[] = [
  { id: "tavern-street-depth-1", depthY: 597, points: [{ x: 4, y: 540 }, { x: 14, y: 533 }, { x: 16, y: 540 }, { x: 26, y: 537 }, { x: 26, y: 547 }, { x: 35, y: 545 }, { x: 38, y: 555 }, { x: 47, y: 555 }, { x: 48, y: 562 }, { x: 44, y: 566 }, { x: 47, y: 568 }, { x: 47, y: 584 }, { x: 54, y: 589 }, { x: 61, y: 587 }, { x: 58, y: 572 }, { x: 70, y: 563 }, { x: 103, y: 564 }, { x: 107, y: 572 }, { x: 115, y: 565 }, { x: 124, y: 564 }, { x: 128, y: 569 }, { x: 137, y: 569 }, { x: 140, y: 575 }, { x: 149, y: 576 }, { x: 155, y: 572 }, { x: 154, y: 566 }, { x: 164, y: 563 }, { x: 160, y: 558 }, { x: 175, y: 558 }, { x: 174, y: 548 }, { x: 186, y: 550 }, { x: 187, y: 547 }, { x: 198, y: 544 }, { x: 201, y: 547 }, { x: 206, y: 542 }, { x: 212, y: 548 }, { x: 216, y: 545 }, { x: 223, y: 552 }, { x: 230, y: 552 }, { x: 230, y: 546 }, { x: 233, y: 544 }, { x: 238, y: 549 }, { x: 244, y: 543 }, { x: 251, y: 551 }, { x: 257, y: 550 }, { x: 258, y: 553 }, { x: 268, y: 556 }, { x: 270, y: 562 }, { x: 282, y: 563 }, { x: 300, y: 560 }, { x: 305, y: 555 }, { x: 316, y: 556 }, { x: 319, y: 547 }, { x: 322, y: 546 }, { x: 329, y: 550 }, { x: 335, y: 546 }, { x: 339, y: 552 }, { x: 359, y: 551 }, { x: 362, y: 555 }, { x: 359, y: 558 }, { x: 368, y: 568 }, { x: 364, y: 574 }, { x: 369, y: 578 }, { x: 368, y: 588 }, { x: 371, y: 590 }, { x: 385, y: 589 }, { x: 382, y: 578 }, { x: 388, y: 570 }, { x: 380, y: 566 }, { x: 382, y: 563 }, { x: 392, y: 564 }, { x: 392, y: 558 }, { x: 395, y: 557 }, { x: 402, y: 565 }, { x: 405, y: 563 }, { x: 403, y: 553 }, { x: 412, y: 558 }, { x: 416, y: 553 }, { x: 425, y: 555 }, { x: 431, y: 551 }, { x: 431, y: 558 }, { x: 436, y: 563 }, { x: 441, y: 555 }, { x: 447, y: 559 }, { x: 453, y: 555 }, { x: 463, y: 558 }, { x: 463, y: 561 }, { x: 472, y: 559 }, { x: 473, y: 565 }, { x: 483, y: 566 }, { x: 484, y: 569 }, { x: 480, y: 571 }, { x: 487, y: 574 }, { x: 491, y: 587 }, { x: 498, y: 587 }, { x: 509, y: 577 }, { x: 515, y: 577 }, { x: 528, y: 592 }, { x: 522, y: 596 }, { x: 15, y: 597 }, { x: 5, y: 588 }, { x: 11, y: 560 }, { x: 3, y: 539 }, { x: 5, y: 538 }] },
  { id: "tavern-street-depth-2", depthY: 632, points: [{ x: 527, y: 590 }, { x: 540, y: 591 }, { x: 538, y: 584 }, { x: 547, y: 580 }, { x: 543, y: 575 }, { x: 546, y: 575 }, { x: 549, y: 569 }, { x: 559, y: 568 }, { x: 560, y: 565 }, { x: 554, y: 557 }, { x: 562, y: 559 }, { x: 563, y: 562 }, { x: 576, y: 555 }, { x: 581, y: 560 }, { x: 590, y: 550 }, { x: 597, y: 557 }, { x: 603, y: 555 }, { x: 621, y: 565 }, { x: 641, y: 568 }, { x: 642, y: 574 }, { x: 661, y: 568 }, { x: 662, y: 574 }, { x: 673, y: 577 }, { x: 678, y: 572 }, { x: 689, y: 570 }, { x: 691, y: 577 }, { x: 701, y: 580 }, { x: 703, y: 587 }, { x: 709, y: 590 }, { x: 720, y: 590 }, { x: 721, y: 581 }, { x: 728, y: 575 }, { x: 731, y: 566 }, { x: 737, y: 565 }, { x: 739, y: 559 }, { x: 754, y: 561 }, { x: 753, y: 558 }, { x: 760, y: 558 }, { x: 767, y: 550 }, { x: 772, y: 549 }, { x: 776, y: 549 }, { x: 776, y: 555 }, { x: 786, y: 558 }, { x: 788, y: 564 }, { x: 794, y: 563 }, { x: 794, y: 557 }, { x: 803, y: 562 }, { x: 810, y: 558 }, { x: 822, y: 570 }, { x: 825, y: 568 }, { x: 824, y: 559 }, { x: 836, y: 553 }, { x: 854, y: 558 }, { x: 859, y: 563 }, { x: 884, y: 566 }, { x: 888, y: 570 }, { x: 888, y: 587 }, { x: 891, y: 588 }, { x: 900, y: 560 }, { x: 903, y: 559 }, { x: 907, y: 571 }, { x: 914, y: 572 }, { x: 917, y: 569 }, { x: 928, y: 577 }, { x: 943, y: 564 }, { x: 949, y: 566 }, { x: 948, y: 559 }, { x: 951, y: 557 }, { x: 960, y: 556 }, { x: 964, y: 559 }, { x: 970, y: 555 }, { x: 973, y: 556 }, { x: 973, y: 562 }, { x: 983, y: 558 }, { x: 985, y: 567 }, { x: 1000, y: 573 }, { x: 1004, y: 586 }, { x: 1021, y: 590 }, { x: 1026, y: 584 }, { x: 1035, y: 582 }, { x: 1059, y: 600 }, { x: 1054, y: 602 }, { x: 1006, y: 603 }, { x: 964, y: 611 }, { x: 916, y: 614 }, { x: 725, y: 614 }, { x: 677, y: 624 }, { x: 616, y: 632 }, { x: 589, y: 632 }, { x: 562, y: 625 }, { x: 554, y: 614 }, { x: 526, y: 599 }, { x: 524, y: 593 }, { x: 528, y: 590 }] },
  { id: "tavern-street-depth-3", depthY: 623, points: [{ x: 1049, y: 590 }, { x: 1064, y: 589 }, { x: 1067, y: 587 }, { x: 1067, y: 578 }, { x: 1077, y: 572 }, { x: 1085, y: 574 }, { x: 1080, y: 567 }, { x: 1100, y: 563 }, { x: 1130, y: 568 }, { x: 1133, y: 574 }, { x: 1140, y: 576 }, { x: 1142, y: 582 }, { x: 1153, y: 588 }, { x: 1177, y: 590 }, { x: 1192, y: 587 }, { x: 1179, y: 585 }, { x: 1177, y: 582 }, { x: 1178, y: 578 }, { x: 1189, y: 571 }, { x: 1188, y: 565 }, { x: 1194, y: 562 }, { x: 1200, y: 566 }, { x: 1206, y: 559 }, { x: 1227, y: 551 }, { x: 1230, y: 551 }, { x: 1230, y: 555 }, { x: 1242, y: 557 }, { x: 1245, y: 563 }, { x: 1254, y: 566 }, { x: 1275, y: 565 }, { x: 1277, y: 569 }, { x: 1274, y: 576 }, { x: 1279, y: 580 }, { x: 1287, y: 565 }, { x: 1296, y: 562 }, { x: 1297, y: 559 }, { x: 1294, y: 559 }, { x: 1300, y: 556 }, { x: 1299, y: 553 }, { x: 1308, y: 557 }, { x: 1311, y: 556 }, { x: 1310, y: 550 }, { x: 1316, y: 548 }, { x: 1317, y: 551 }, { x: 1325, y: 552 }, { x: 1330, y: 547 }, { x: 1339, y: 552 }, { x: 1347, y: 551 }, { x: 1352, y: 558 }, { x: 1360, y: 550 }, { x: 1369, y: 548 }, { x: 1370, y: 554 }, { x: 1379, y: 560 }, { x: 1379, y: 563 }, { x: 1393, y: 569 }, { x: 1397, y: 587 }, { x: 1405, y: 589 }, { x: 1413, y: 576 }, { x: 1422, y: 570 }, { x: 1432, y: 570 }, { x: 1437, y: 557 }, { x: 1441, y: 556 }, { x: 1443, y: 562 }, { x: 1446, y: 562 }, { x: 1455, y: 552 }, { x: 1462, y: 556 }, { x: 1463, y: 563 }, { x: 1466, y: 564 }, { x: 1507, y: 563 }, { x: 1511, y: 556 }, { x: 1526, y: 555 }, { x: 1528, y: 548 }, { x: 1532, y: 546 }, { x: 1540, y: 551 }, { x: 1550, y: 544 }, { x: 1554, y: 548 }, { x: 1554, y: 582 }, { x: 1550, y: 598 }, { x: 1485, y: 597 }, { x: 1369, y: 613 }, { x: 1231, y: 615 }, { x: 1175, y: 623 }, { x: 1139, y: 618 }, { x: 1068, y: 616 }, { x: 1051, y: 589 }] },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const tavernStreetTransitions: (LogicalRect & { id: string })[] = [
  { id: "tavern-street-transition-1", x: 0, y: 405, width: 23, height: 144 },
  { id: "tavern-street-transition-2", x: 1534, y: 405, width: 23, height: 144 },
  { id: "tavern-street-transition-3", x: 810, y: 373, width: 99, height: 37 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const tavernStreetSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "tavern-street-spawn-1", x: 1440, y: 486, direction: "west" },
  { id: "tavern-street-spawn-2", x: 117, y: 486, direction: "east" },
  { id: "tavern-street-spawn-3", x: 860, y: 454, direction: "south" },
];
