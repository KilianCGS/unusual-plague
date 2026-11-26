import type { LogicalRect, PolygonCollider, SceneCollider } from "../collision";
import type { OcclusionShape } from "../occlusion";
import type { Direction } from "../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const mineInteriorColliders: SceneCollider[] = [
  { id: "mine-interior-1", x: 450, y: 0, width: 39, height: 161 },
  { id: "mine-interior-2", x: 172, y: 1, width: 276, height: 104 },
  { id: "mine-interior-3", x: 114, y: 1, width: 34, height: 102 },
  { id: "mine-interior-4", x: 145, y: 0, width: 36, height: 87 },
];

// FREE-HAND COLLIDERS (red shapes): same job as the colliders above,
// drawn point by point. The shape closes itself; it may be concave.
export const mineInteriorPolygonColliders: PolygonCollider[] = [
  { id: "mine-interior-poly-1", points: [{ x: 171, y: 105 }, { x: 178, y: 110 }, { x: 200, y: 108 }, { x: 206, y: 114 }, { x: 219, y: 115 }, { x: 219, y: 118 }, { x: 227, y: 119 }, { x: 229, y: 122 }, { x: 246, y: 122 }, { x: 255, y: 116 }, { x: 265, y: 118 }, { x: 299, y: 115 }, { x: 320, y: 119 }, { x: 332, y: 114 }, { x: 335, y: 118 }, { x: 341, y: 119 }, { x: 343, y: 116 }, { x: 352, y: 115 }, { x: 353, y: 118 }, { x: 363, y: 119 }, { x: 374, y: 126 }, { x: 401, y: 127 }, { x: 407, y: 122 }, { x: 435, y: 119 }, { x: 441, y: 122 }, { x: 447, y: 142 }, { x: 451, y: 142 }, { x: 460, y: 121 }, { x: 460, y: 95 }, { x: 452, y: 86 }, { x: 424, y: 70 }, { x: 394, y: 58 }, { x: 303, y: 43 }, { x: 151, y: 45 }, { x: 106, y: 38 }, { x: 46, y: 64 }, { x: 18, y: 107 }, { x: 11, y: 129 }, { x: 6, y: 168 }, { x: 14, y: 218 }, { x: 14, y: 240 }, { x: 30, y: 287 }, { x: 48, y: 303 }, { x: 75, y: 312 }, { x: 95, y: 312 }, { x: 116, y: 306 }, { x: 171, y: 307 }, { x: 228, y: 316 }, { x: 256, y: 324 }, { x: 271, y: 324 }, { x: 263, y: 312 }, { x: 250, y: 311 }, { x: 249, y: 305 }, { x: 228, y: 289 }, { x: 222, y: 291 }, { x: 212, y: 287 }, { x: 192, y: 287 }, { x: 178, y: 291 }, { x: 174, y: 286 }, { x: 156, y: 282 }, { x: 148, y: 290 }, { x: 135, y: 291 }, { x: 123, y: 288 }, { x: 117, y: 291 }, { x: 91, y: 281 }, { x: 76, y: 282 }, { x: 68, y: 275 }, { x: 47, y: 271 }, { x: 49, y: 265 }, { x: 55, y: 263 }, { x: 74, y: 262 }, { x: 83, y: 256 }, { x: 100, y: 256 }, { x: 101, y: 253 }, { x: 107, y: 252 }, { x: 110, y: 246 }, { x: 103, y: 245 }, { x: 97, y: 237 }, { x: 88, y: 237 }, { x: 83, y: 231 }, { x: 69, y: 234 }, { x: 67, y: 231 }, { x: 70, y: 228 }, { x: 67, y: 226 }, { x: 65, y: 229 }, { x: 59, y: 229 }, { x: 56, y: 227 }, { x: 56, y: 221 }, { x: 45, y: 220 }, { x: 33, y: 214 }, { x: 25, y: 197 }, { x: 23, y: 160 }, { x: 27, y: 154 }, { x: 66, y: 129 }, { x: 73, y: 128 }, { x: 74, y: 134 }, { x: 80, y: 137 }, { x: 95, y: 136 }, { x: 90, y: 115 }, { x: 78, y: 113 }, { x: 76, y: 107 }, { x: 68, y: 102 }, { x: 69, y: 99 }, { x: 101, y: 89 }, { x: 104, y: 83 }, { x: 113, y: 80 }, { x: 122, y: 71 }, { x: 161, y: 72 }, { x: 170, y: 75 }, { x: 175, y: 84 }, { x: 173, y: 105 }] },
  { id: "mine-interior-poly-2", points: [{ x: 104, y: 194 }, { x: 71, y: 195 }, { x: 66, y: 199 }, { x: 71, y: 214 }, { x: 94, y: 219 }, { x: 102, y: 210 }, { x: 104, y: 195 }] },
  { id: "mine-interior-poly-3", points: [{ x: 45, y: 218 }, { x: 53, y: 211 }, { x: 48, y: 196 }, { x: 53, y: 186 }, { x: 52, y: 174 }, { x: 60, y: 165 }, { x: 57, y: 146 }, { x: 63, y: 137 }, { x: 52, y: 135 }, { x: 37, y: 142 }, { x: 32, y: 149 }, { x: 24, y: 180 }, { x: 30, y: 207 }, { x: 38, y: 216 }, { x: 46, y: 217 }] },
  { id: "mine-interior-poly-4", points: [{ x: 257, y: 174 }, { x: 263, y: 170 }, { x: 278, y: 172 }, { x: 284, y: 167 }, { x: 321, y: 169 }, { x: 326, y: 194 }, { x: 308, y: 197 }, { x: 289, y: 192 }, { x: 274, y: 194 }, { x: 266, y: 188 }, { x: 257, y: 189 }, { x: 250, y: 183 }, { x: 258, y: 172 }] },
  { id: "mine-interior-poly-5", points: [{ x: 339, y: 315 }, { x: 354, y: 299 }, { x: 373, y: 296 }, { x: 385, y: 287 }, { x: 393, y: 286 }, { x: 413, y: 294 }, { x: 427, y: 284 }, { x: 443, y: 282 }, { x: 449, y: 271 }, { x: 458, y: 267 }, { x: 463, y: 260 }, { x: 464, y: 253 }, { x: 461, y: 247 }, { x: 469, y: 236 }, { x: 469, y: 215 }, { x: 472, y: 209 }, { x: 466, y: 199 }, { x: 477, y: 191 }, { x: 483, y: 191 }, { x: 485, y: 194 }, { x: 481, y: 203 }, { x: 483, y: 251 }, { x: 478, y: 263 }, { x: 475, y: 286 }, { x: 467, y: 302 }, { x: 452, y: 310 }, { x: 376, y: 318 }, { x: 347, y: 327 }, { x: 341, y: 327 }, { x: 339, y: 314 }] },
  { id: "mine-interior-poly-6", points: [{ x: 172, y: 89 }, { x: 166, y: 93 }, { x: 166, y: 103 }, { x: 176, y: 110 }, { x: 178, y: 88 }, { x: 172, y: 88 }, { x: 171, y: 91 }] },
];

// DEPTH SHAPES (violet): part of the background that covers the Doctor
// while his feet are above depthY (a treetop, a roof).
export const mineInteriorOccluders: OcclusionShape[] = [
  { id: "mine-interior-depth-1", depthY: 177, points: [{ x: 266, y: 166 }, { x: 263, y: 162 }, { x: 269, y: 162 }, { x: 279, y: 169 }, { x: 287, y: 160 }, { x: 287, y: 154 }, { x: 300, y: 149 }, { x: 313, y: 154 }, { x: 314, y: 163 }, { x: 322, y: 168 }, { x: 321, y: 175 }, { x: 273, y: 177 }, { x: 263, y: 173 }, { x: 265, y: 166 }] },
  { id: "mine-interior-depth-2", depthY: 198, points: [{ x: 68, y: 196 }, { x: 67, y: 187 }, { x: 85, y: 178 }, { x: 105, y: 189 }, { x: 105, y: 198 }, { x: 69, y: 198 }, { x: 67, y: 194 }] },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const mineInteriorTransitions: (LogicalRect & { id: string })[] = [
  { id: "mine-interior-transition-1", x: 454, y: 168, width: 23, height: 24 },
  { id: "mine-interior-transition-2", x: 271, y: 309, width: 65, height: 18 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const mineInteriorSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "mine-interior-spawn-1", x: 300, y: 280, direction: "south" },
  { id: "mine-interior-spawn-2", x: 416, y: 184, direction: "south" },
];
