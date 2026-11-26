import type { LogicalRect, PolygonCollider, SceneCollider } from "../../collision";
import type { OcclusionShape } from "../../occlusion";
import type { Direction } from "../../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const smithyStreetColliders: SceneCollider[] = [
  { id: "smithy-street-1", x: 1425, y: 410, width: 90, height: 70 },
  { id: "smithy-street-2", x: 0, y: 610, width: 75, height: 50 },
  { id: "smithy-street-3", x: 16, y: 0, width: 1603, height: 201 },
  { id: "smithy-street-4", x: 373, y: 307, width: 1246, height: 94 },
  { id: "smithy-street-5", x: 902, y: 398, width: 58, height: 25 },
  { id: "smithy-street-6", x: 0, y: 194, width: 132, height: 56 },
  { id: "smithy-street-7", x: 290, y: 198, width: 79, height: 44 },
  { id: "smithy-street-8", x: 103, y: 197, width: 155, height: 27 },
  { id: "smithy-street-9", x: 434, y: 54, width: 1185, height: 241 },
  { id: "smithy-street-10", x: 1104, y: 367, width: 142, height: 66 },
  { id: "smithy-street-11", x: 1363, y: 398, width: 61, height: 43 },
  { id: "smithy-street-12", x: 1513, y: 405, width: 106, height: 30 },
  { id: "smithy-street-13", x: 431, y: 390, width: 39, height: 53 },
  { id: "smithy-street-14", x: 0, y: 368, width: 70, height: 53 },
  { id: "smithy-street-15", x: 0, y: 414, width: 38, height: 31 },
  { id: "smithy-street-16", x: 0, y: 592, width: 32, height: 18 },
  { id: "smithy-street-17", x: 1597, y: 648, width: 21, height: 27 },
  { id: "smithy-street-18", x: 801, y: 689, width: 816, height: 282 },
  { id: "smithy-street-19", x: 201, y: 689, width: 603, height: 282 },
  { id: "smithy-street-20", x: 0, y: 689, width: 202, height: 282 },
  { id: "smithy-street-21", x: 65, y: 661, width: 15, height: 28 },
];

// FREE-HAND COLLIDERS (red shapes): same job as the colliders above,
// drawn point by point. The shape closes itself; it may be concave.
export const smithyStreetPolygonColliders: PolygonCollider[] = [
  { id: "smithy-street-poly-1", points: [{ x: 55, y: 427 }, { x: 100, y: 408 }, { x: 155, y: 395 }, { x: 214, y: 368 }, { x: 225, y: 367 }, { x: 232, y: 363 }, { x: 235, y: 357 }, { x: 235, y: 350 }, { x: 223, y: 341 }, { x: 223, y: 335 }, { x: 216, y: 330 }, { x: 201, y: 327 }, { x: 189, y: 337 }, { x: 174, y: 342 }, { x: 160, y: 343 }, { x: 151, y: 339 }, { x: 147, y: 331 }, { x: 149, y: 301 }, { x: 144, y: 282 }, { x: 144, y: 249 }, { x: 104, y: 225 }, { x: 52, y: 265 }, { x: 34, y: 288 }, { x: 19, y: 323 }, { x: 11, y: 378 }, { x: 32, y: 403 }, { x: 45, y: 410 }, { x: 55, y: 423 }, { x: 55, y: 427 }] },
  { id: "smithy-street-poly-2", points: [{ x: 169, y: 438 }, { x: 185, y: 446 }, { x: 208, y: 448 }, { x: 221, y: 440 }, { x: 224, y: 434 }, { x: 213, y: 427 }, { x: 176, y: 427 }, { x: 170, y: 431 }, { x: 169, y: 437 }] },
  { id: "smithy-street-poly-3", points: [{ x: 687, y: 404 }, { x: 690, y: 422 }, { x: 699, y: 426 }, { x: 703, y: 434 }, { x: 710, y: 435 }, { x: 712, y: 444 }, { x: 725, y: 453 }, { x: 749, y: 451 }, { x: 761, y: 441 }, { x: 774, y: 444 }, { x: 831, y: 443 }, { x: 869, y: 447 }, { x: 875, y: 444 }, { x: 881, y: 416 }, { x: 887, y: 412 }, { x: 902, y: 411 }] },
  { id: "smithy-street-poly-4", points: [{ x: 960, y: 412 }, { x: 1102, y: 413 }, { x: 1103, y: 402 }, { x: 959, y: 401 }] },
  { id: "smithy-street-poly-5", points: [{ x: 1255, y: 479 }, { x: 1279, y: 470 }, { x: 1272, y: 454 }, { x: 1250, y: 460 }, { x: 1249, y: 457 }, { x: 1257, y: 449 }, { x: 1272, y: 444 }, { x: 1273, y: 435 }, { x: 1289, y: 436 }, { x: 1299, y: 431 }, { x: 1334, y: 425 }, { x: 1338, y: 425 }, { x: 1350, y: 441 }, { x: 1350, y: 447 }, { x: 1355, y: 454 }, { x: 1347, y: 466 }, { x: 1347, y: 479 }, { x: 1337, y: 485 }, { x: 1324, y: 486 }, { x: 1306, y: 474 }, { x: 1281, y: 481 }, { x: 1256, y: 482 }, { x: 1256, y: 478 }] },
  { id: "smithy-street-poly-6", points: [{ x: 1250, y: 433 }, { x: 1312, y: 433 }, { x: 1370, y: 426 }, { x: 1368, y: 414 }, { x: 1354, y: 400 }, { x: 1329, y: 393 }, { x: 1298, y: 393 }, { x: 1268, y: 398 }, { x: 1257, y: 413 }, { x: 1239, y: 421 }, { x: 1240, y: 425 }, { x: 1257, y: 433 }] },
];

// DEPTH SHAPES (violet): part of the background that covers the Doctor
// while his feet are above depthY (a treetop, a roof).
export const smithyStreetOccluders: OcclusionShape[] = [
  { id: "smithy-street-depth-1", depthY: 689, points: [{ x: 1616, y: 666 }, { x: 1581, y: 667 }, { x: 1579, y: 652 }, { x: 1544, y: 651 }, { x: 1544, y: 668 }, { x: 1310, y: 667 }, { x: 1309, y: 652 }, { x: 1272, y: 650 }, { x: 1273, y: 667 }, { x: 988, y: 666 }, { x: 987, y: 650 }, { x: 949, y: 651 }, { x: 949, y: 689 }, { x: 1617, y: 687 }] },
  { id: "smithy-street-depth-2", depthY: 688, points: [{ x: 948, y: 664 }, { x: 735, y: 667 }, { x: 736, y: 650 }, { x: 699, y: 652 }, { x: 700, y: 666 }, { x: 389, y: 666 }, { x: 390, y: 650 }, { x: 352, y: 650 }, { x: 352, y: 666 }, { x: 214, y: 666 }, { x: 214, y: 688 }, { x: 950, y: 688 }] },
  { id: "smithy-street-depth-3", depthY: 695, points: [{ x: 48, y: 663 }, { x: 52, y: 647 }, { x: 84, y: 646 }, { x: 88, y: 666 }, { x: 249, y: 666 }, { x: 249, y: 695 }, { x: 4, y: 695 }] },
  { id: "smithy-street-depth-4", depthY: 339, points: [{ x: 184, y: 334 }, { x: 182, y: 292 }, { x: 194, y: 292 }, { x: 198, y: 286 }, { x: 148, y: 244 }, { x: 131, y: 226 }, { x: 127, y: 233 }, { x: 125, y: 292 }, { x: 129, y: 330 }, { x: 135, y: 336 }, { x: 155, y: 339 }, { x: 172, y: 338 }, { x: 186, y: 333 }] },
  { id: "smithy-street-depth-5", depthY: 426, points: [{ x: 176, y: 422 }, { x: 189, y: 412 }, { x: 210, y: 411 }, { x: 221, y: 426 }, { x: 176, y: 426 }, { x: 177, y: 425 }, { x: 178, y: 421 }] },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const smithyStreetTransitions: (LogicalRect & { id: string })[] = [
  { id: "smithy-street-transition-1", x: 470, y: 405, width: 215, height: 40 },
  { id: "smithy-street-transition-2", x: 1594, y: 445, width: 25, height: 200 },
  { id: "smithy-street-transition-3", x: 0, y: 445, width: 25, height: 160 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const smithyStreetSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "smithy-street-spawn-1", x: 1520, y: 545, direction: "west" },
  { id: "smithy-street-spawn-2", x: 90, y: 525, direction: "east" },
  { id: "smithy-street-spawn-3", x: 570, y: 495, direction: "south" },
];
