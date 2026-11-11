import type { LogicalRect, PolygonCollider, SceneCollider } from "../../collision";
import type { OcclusionShape } from "../../occlusion";
import type { Direction } from "../../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const mountainPathColliders: SceneCollider[] = [
  { id: "mountain-path-1", x: 0, y: 0, width: 264, height: 320 },
  { id: "mountain-path-2", x: 0, y: 320, width: 80, height: 264 },
  { id: "mountain-path-3", x: 76, y: 360, width: 92, height: 80 },
  { id: "mountain-path-4", x: 104, y: 444, width: 104, height: 76 },
  { id: "mountain-path-5", x: 264, y: 0, width: 1068, height: 184 },
  { id: "mountain-path-6", x: 264, y: 184, width: 304, height: 160 },
  { id: "mountain-path-7", x: 560, y: 184, width: 320, height: 120 },
  { id: "mountain-path-8", x: 872, y: 184, width: 460, height: 156 },
  { id: "mountain-path-9", x: 1140, y: 288, width: 192, height: 116 },
  { id: "mountain-path-10", x: 1268, y: 524, width: 64, height: 232 },
  { id: "mountain-path-11", x: 747, y: 596, width: 585, height: 159 },
  { id: "mountain-path-12", x: 860, y: 571, width: 415, height: 30 },
  { id: "mountain-path-13", x: 1109, y: 543, width: 163, height: 26 },
  { id: "mountain-path-14", x: 527, y: 621, width: 60, height: 134 },
  { id: "mountain-path-15", x: 0, y: 589, width: 579, height: 30 },
  { id: "mountain-path-16", x: 0, y: 547, width: 323, height: 41 },
  { id: "mountain-path-17", x: 0, y: 618, width: 519, height: 137 },
  { id: "mountain-path-18", x: 874, y: 340, width: 25, height: 27 },
];

// FREE-HAND COLLIDERS (red shapes): same job as the colliders above,
// drawn point by point. The shape closes itself; it may be concave.
export const mountainPathPolygonColliders: PolygonCollider[] = [
  { id: "mountain-path-poly-1", points: [{ x: 745, y: 556 }, { x: 822, y: 539 }, { x: 834, y: 543 }, { x: 843, y: 556 }, { x: 843, y: 567 }, { x: 744, y: 586 }, { x: 741, y: 575 }] },
  { id: "mountain-path-poly-2", points: [{ x: 498, y: 570 }, { x: 576, y: 559 }, { x: 582, y: 555 }, { x: 569, y: 537 }, { x: 559, y: 530 }, { x: 555, y: 517 }, { x: 443, y: 519 }, { x: 433, y: 514 }, { x: 418, y: 545 }, { x: 421, y: 560 }, { x: 414, y: 565 }, { x: 450, y: 574 }, { x: 452, y: 573 }] },
  { id: "mountain-path-poly-3", points: [{ x: 768, y: 385 }, { x: 802, y: 383 }, { x: 842, y: 395 }, { x: 901, y: 368 }, { x: 804, y: 366 }, { x: 779, y: 366 }] },
  { id: "mountain-path-poly-4", points: [{ x: 393, y: 386 }, { x: 487, y: 359 }, { x: 473, y: 347 }, { x: 384, y: 371 }] },
  { id: "mountain-path-poly-5", points: [{ x: 359, y: 358 }, { x: 339, y: 345 }, { x: 391, y: 344 }] },
];

// DEPTH SHAPES (violet): part of the background that covers the Doctor
// while his feet are above depthY (a treetop, a roof).
export const mountainPathOccluders: OcclusionShape[] = [
  { id: "mountain-path-depth-1", depthY: 361, points: [{ x: 808, y: 360 }, { x: 859, y: 326 }, { x: 871, y: 325 }, { x: 872, y: 334 }, { x: 874, y: 357 }, { x: 874, y: 361 }] },
  { id: "mountain-path-depth-2", depthY: 562, points: [{ x: 793, y: 517 }, { x: 808, y: 517 }, { x: 844, y: 535 }, { x: 793, y: 555 }, { x: 742, y: 562 }, { x: 751, y: 533 }] },
  { id: "mountain-path-depth-3", depthY: 541, points: [{ x: 560, y: 513 }, { x: 550, y: 482 }, { x: 516, y: 473 }, { x: 443, y: 515 }, { x: 422, y: 510 }, { x: 408, y: 519 }, { x: 404, y: 541 }] },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const mountainPathTransitions: (LogicalRect & { id: string })[] = [
  { id: "mountain-path-transition-1", x: 1312, y: 432, width: 20, height: 88 },
  { id: "mountain-path-transition-2", x: 112, y: 316, width: 152, height: 52 },
  { id: "mountain-path-transition-3", x: 593, y: 692, width: 152, height: 57 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const mountainPathSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "mountain-path-spawn-1", x: 1248, y: 476, direction: "west" },
  { id: "mountain-path-spawn-2", x: 224, y: 408, direction: "south" },
  { id: "mountain-path-spawn-3", x: 669, y: 631, direction: "south" },
];
