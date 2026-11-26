import type { LogicalRect, PolygonCollider, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const mineNaturalCaveColliders: SceneCollider[] = [];

// FREE-HAND COLLIDERS (red shapes): same job as the colliders above,
// drawn point by point. The shape closes itself; it may be concave.
export const mineNaturalCavePolygonColliders: PolygonCollider[] = [
  { id: "mine-natural-cave-poly-1", points: [{ x: 121, y: 138 }, { x: 122, y: 144 }, { x: 129, y: 148 }, { x: 162, y: 143 }, { x: 182, y: 149 }, { x: 184, y: 143 }, { x: 207, y: 138 }, { x: 214, y: 130 }, { x: 226, y: 132 }, { x: 236, y: 124 }, { x: 265, y: 118 }, { x: 317, y: 124 }, { x: 321, y: 116 }, { x: 341, y: 115 }, { x: 347, y: 117 }, { x: 358, y: 130 }, { x: 364, y: 129 }, { x: 367, y: 122 }, { x: 366, y: 112 }, { x: 353, y: 102 }, { x: 297, y: 89 }, { x: 74, y: 91 }, { x: 51, y: 105 }, { x: 45, y: 123 }, { x: 57, y: 128 }, { x: 108, y: 129 }, { x: 126, y: 136 }, { x: 121, y: 140 }] },
  { id: "mine-natural-cave-poly-2", points: [{ x: 69, y: 146 }, { x: 73, y: 158 }, { x: 64, y: 161 }, { x: 69, y: 175 }, { x: 57, y: 175 }, { x: 43, y: 181 }, { x: 42, y: 193 }, { x: 81, y: 199 }, { x: 87, y: 202 }, { x: 89, y: 208 }, { x: 73, y: 213 }, { x: 64, y: 212 }, { x: 64, y: 215 }, { x: 55, y: 217 }, { x: 51, y: 222 }, { x: 55, y: 227 }, { x: 61, y: 228 }, { x: 68, y: 240 }, { x: 78, y: 246 }, { x: 95, y: 246 }, { x: 111, y: 250 }, { x: 120, y: 267 }, { x: 133, y: 274 }, { x: 161, y: 272 }, { x: 167, y: 277 }, { x: 167, y: 291 }, { x: 173, y: 285 }, { x: 186, y: 285 }, { x: 208, y: 296 }, { x: 225, y: 295 }, { x: 241, y: 299 }, { x: 262, y: 296 }, { x: 273, y: 301 }, { x: 292, y: 301 }, { x: 311, y: 290 }, { x: 324, y: 289 }, { x: 333, y: 293 }, { x: 337, y: 301 }, { x: 361, y: 298 }, { x: 381, y: 306 }, { x: 387, y: 300 }, { x: 397, y: 297 }, { x: 418, y: 305 }, { x: 449, y: 306 }, { x: 459, y: 300 }, { x: 477, y: 299 }, { x: 484, y: 290 }, { x: 497, y: 285 }, { x: 498, y: 273 }, { x: 511, y: 266 }, { x: 516, y: 257 }, { x: 509, y: 245 }, { x: 509, y: 241 }, { x: 516, y: 234 }, { x: 529, y: 236 }, { x: 548, y: 255 }, { x: 554, y: 256 }, { x: 573, y: 245 }, { x: 571, y: 268 }, { x: 561, y: 295 }, { x: 546, y: 308 }, { x: 521, y: 319 }, { x: 501, y: 333 }, { x: 464, y: 344 }, { x: 385, y: 330 }, { x: 263, y: 330 }, { x: 212, y: 325 }, { x: 159, y: 328 }, { x: 111, y: 322 }, { x: 84, y: 314 }, { x: 59, y: 301 }, { x: 43, y: 284 }, { x: 14, y: 207 }, { x: 14, y: 175 }, { x: 24, y: 147 }, { x: 31, y: 138 }, { x: 37, y: 134 }, { x: 52, y: 133 }, { x: 56, y: 128 }, { x: 69, y: 146 }] },
  { id: "mine-natural-cave-poly-3", points: [{ x: 350, y: 122 }, { x: 344, y: 128 }, { x: 331, y: 129 }, { x: 336, y: 135 }, { x: 331, y: 138 }, { x: 303, y: 139 }, { x: 293, y: 143 }, { x: 281, y: 154 }, { x: 290, y: 156 }, { x: 291, y: 159 }, { x: 255, y: 171 }, { x: 252, y: 177 }, { x: 254, y: 183 }, { x: 264, y: 184 }, { x: 266, y: 190 }, { x: 280, y: 192 }, { x: 289, y: 206 }, { x: 298, y: 203 }, { x: 296, y: 214 }, { x: 293, y: 222 }, { x: 304, y: 224 }, { x: 322, y: 222 }, { x: 319, y: 224 }, { x: 350, y: 231 }, { x: 369, y: 236 }, { x: 369, y: 242 }, { x: 374, y: 246 }, { x: 371, y: 251 }, { x: 390, y: 252 }, { x: 409, y: 257 }, { x: 419, y: 263 }, { x: 442, y: 261 }, { x: 455, y: 260 }, { x: 469, y: 260 }, { x: 493, y: 253 }, { x: 491, y: 244 }, { x: 500, y: 239 }, { x: 526, y: 230 }, { x: 551, y: 228 }, { x: 563, y: 224 }, { x: 576, y: 211 }, { x: 576, y: 182 }, { x: 561, y: 121 }, { x: 552, y: 90 }, { x: 540, y: 71 }, { x: 536, y: 67 }, { x: 506, y: 56 }, { x: 461, y: 49 }, { x: 299, y: 45 }, { x: 295, y: 53 }, { x: 294, y: 69 }, { x: 303, y: 76 }, { x: 320, y: 78 }, { x: 343, y: 90 }, { x: 352, y: 99 }, { x: 352, y: 119 }, { x: 349, y: 121 }] },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const mineNaturalCaveTransitions: (LogicalRect & { id: string })[] = [
  { id: "mine-natural-cave-transition-1", x: 67, y: 115, width: 49, height: 29 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const mineNaturalCaveSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "mine-natural-cave-spawn-1", x: 119, y: 177, direction: "south" },
];
