import type { LogicalRect, SceneCollider } from "../collision";
import type { OcclusionShape } from "../occlusion";
import type { Direction } from "../protagonist/useProtagonistController";

// Authored against the approved 1536x1024 background (576x384 logical units,
// 0.375 unit per asset pixel). Colliders and depth shapes were redrawn by hand
// in /dev/collisions; the transition and the spawn below are the ones that were
// already in place (the tool did not preload them when this was exported).

// COLLIDERS (red): floor the feet cannot occupy.
export const tavernInteriorColliders: SceneCollider[] = [
  { id: "tavern-interior-1", x: 124, y: 234, width: 90, height: 62 },
  { id: "tavern-interior-2", x: 0, y: 347, width: 254, height: 31 },
  { id: "tavern-interior-3", x: 9, y: 282, width: 59, height: 58 },
  { id: "tavern-interior-4", x: 0, y: 0, width: 44, height: 278 },
  { id: "tavern-interior-5", x: 98, y: 4, width: 187, height: 161 },
  { id: "tavern-interior-6", x: 283, y: 0, width: 286, height: 143 },
  { id: "tavern-interior-7", x: 437, y: 143, width: 48, height: 8 },
  { id: "tavern-interior-8", x: 506, y: 148, width: 63, height: 22 },
  { id: "tavern-interior-9", x: 547, y: 173, width: 15, height: 193 },
  { id: "tavern-interior-10", x: 504, y: 313, width: 40, height: 53 },
  { id: "tavern-interior-11", x: 324, y: 348, width: 184, height: 25 },
  { id: "tavern-interior-12", x: 361, y: 254, width: 92, height: 58 },
  { id: "tavern-interior-13", x: 440, y: 189, width: 61, height: 35 },
  { id: "tavern-interior-14", x: 240, y: 165, width: 20, height: 11 },
  { id: "tavern-interior-15", x: 201, y: 166, width: 17, height: 9 },
  { id: "tavern-interior-16", x: 159, y: 167, width: 18, height: 9 },
  { id: "tavern-interior-17", x: 113, y: 166, width: 20, height: 11 },
  { id: "tavern-interior-18", x: 412, y: 198, width: 19, height: 12 },
  { id: "tavern-interior-19", x: 0, y: 0, width: 97, height: 153 },
];

// DEPTH SHAPES (violet): part of the background that covers the Doctor
// while his feet are above depthY (a treetop, a roof).
export const tavernInteriorOccluders: OcclusionShape[] = [
  { id: "tavern-interior-depth-1", depthY: 190, points: [{ x: 502, y: 188 }, { x: 502, y: 169 }, { x: 440, y: 168 }, { x: 441, y: 190 }] },
  { id: "tavern-interior-depth-2", depthY: 197, points: [{ x: 431, y: 196 }, { x: 414, y: 197 }, { x: 411, y: 192 }, { x: 411, y: 185 }, { x: 423, y: 181 }, { x: 430, y: 182 }, { x: 435, y: 187 }] },
  { id: "tavern-interior-depth-3", depthY: 254, points: [{ x: 451, y: 253 }, { x: 451, y: 231 }, { x: 361, y: 231 }, { x: 362, y: 254 }] },
  { id: "tavern-interior-depth-4", depthY: 234, points: [{ x: 214, y: 233 }, { x: 214, y: 213 }, { x: 126, y: 212 }, { x: 125, y: 234 }] },
  { id: "tavern-interior-depth-5", depthY: 318, points: [{ x: 505, y: 314 }, { x: 499, y: 318 }, { x: 500, y: 308 }, { x: 507, y: 305 }, { x: 498, y: 301 }, { x: 504, y: 300 }, { x: 507, y: 297 }, { x: 510, y: 294 }, { x: 514, y: 297 }, { x: 517, y: 288 }, { x: 523, y: 298 }, { x: 533, y: 295 }, { x: 532, y: 300 }, { x: 539, y: 299 }, { x: 533, y: 303 }, { x: 534, y: 308 }, { x: 539, y: 315 }] },
  { id: "tavern-interior-depth-6", depthY: 290, points: [{ x: 69, y: 288 }, { x: 76, y: 290 }, { x: 74, y: 283 }] },
  { id: "tavern-interior-depth-7", depthY: 282, points: [{ x: 76, y: 277 }, { x: 70, y: 274 }, { x: 68, y: 274 }, { x: 69, y: 270 }, { x: 73, y: 267 }, { x: 67, y: 265 }, { x: 66, y: 264 }, { x: 69, y: 259 }, { x: 61, y: 265 }, { x: 60, y: 260 }, { x: 57, y: 252 }, { x: 55, y: 251 }, { x: 51, y: 262 }, { x: 51, y: 268 }, { x: 44, y: 264 }, { x: 42, y: 271 }, { x: 47, y: 275 }, { x: 44, y: 279 }] },
  { id: "tavern-interior-depth-8", depthY: 350, points: [{ x: 348, y: 349 }, { x: 349, y: 335 }, { x: 322, y: 336 }, { x: 323, y: 349 }] },
  { id: "tavern-interior-depth-9", depthY: 347, points: [{ x: 252, y: 347 }, { x: 254, y: 335 }, { x: 227, y: 335 }, { x: 226, y: 346 }] },
];

// TRANSITIONS (yellow): activation zones.
export const tavernInteriorTransitions: (LogicalRect & { id: string })[] = [
  { id: "tavern-interior-transition-1", x: 264, y: 346, width: 57, height: 22 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const tavernInteriorSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [{ id: "tavern-interior-spawn-1", x: 292, y: 319, direction: "north" }];
