import type { LogicalRect, SceneCollider } from "../../collision";
import type { OcclusionShape } from "../../occlusion";
import type { Direction } from "../../protagonist/useProtagonistController";

// THE MARKET STREET: Kilian's geometry (2026-11-16), painted in /dev/collisions on the 0.48-unit scene
// (881 x 324 world). Repaint it there and save over this file; the export names are the same ones it writes.

// COLLIDERS (red): floor the feet cannot occupy.
export const marketStreetColliders: SceneCollider[] = [
  { id: "market-street-1", x: 0, y: 0, width: 880, height: 180 },
  { id: "market-street-2", x: 1, y: 181, width: 55, height: 45 },
  { id: "market-street-3", x: 60, y: 184, width: 43, height: 32 },
  { id: "market-street-4", x: 108, y: 181, width: 83, height: 15 },
  { id: "market-street-5", x: 269, y: 181, width: 96, height: 17 },
  { id: "market-street-6", x: 302, y: 198, width: 36, height: 8 },
  { id: "market-street-7", x: 440, y: 180, width: 69, height: 20 },
  { id: "market-street-8", x: 600, y: 179, width: 34, height: 22 },
  { id: "market-street-9", x: 691, y: 183, width: 94, height: 19 },
  { id: "market-street-10", x: 2, y: 308, width: 877, height: 14 },
];

// DEPTH SHAPES (violet): part of the background that covers the Doctor
// while his feet are above depthY (a treetop, a roof).
export const marketStreetOccluders: OcclusionShape[] = [
  { id: "market-street-depth-1", depthY: 289, points: [{ x: 764, y: 287 }, { x: 764, y: 276 }, { x: 740, y: 278 }, { x: 740, y: 289 }] },
  { id: "market-street-depth-2", depthY: 290, points: [{ x: 602, y: 287 }, { x: 603, y: 276 }, { x: 576, y: 277 }, { x: 575, y: 290 }, { x: 604, y: 290 }] },
  { id: "market-street-depth-3", depthY: 289, points: [{ x: 306, y: 287 }, { x: 305, y: 272 }, { x: 332, y: 272 }, { x: 333, y: 289 }] },
  { id: "market-street-depth-4", depthY: 291, points: [{ x: 130, y: 289 }, { x: 129, y: 276 }, { x: 104, y: 277 }, { x: 104, y: 291 }] },
  { id: "market-street-depth-5", depthY: 310, points: [{ x: 880, y: 310 }, { x: 1, y: 308 }, { x: 1, y: 288 }, { x: 880, y: 288 }] },
];

// TRANSITIONS (yellow): activation zones. No destination yet.
export const marketStreetTransitions: (LogicalRect & { id: string })[] = [
  { id: "market-street-transition-1", x: 861, y: 179, width: 18, height: 109 },
  { id: "market-street-transition-2", x: 1, y: 227, width: 20, height: 62 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
export const marketStreetSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "market-street-spawn-1", x: 831, y: 251, direction: "south" },
  { id: "market-street-spawn-2", x: 63, y: 255, direction: "east" }, // arrives from the apothecary, walking east (2026-11-16)
];
