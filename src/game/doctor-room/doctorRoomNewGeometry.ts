import type { LogicalRect, SceneCollider } from "../collision";
import type { InteractionZone } from "../interactions/interactionZone";
import type { Direction } from "../protagonist/useProtagonistController";

// The Doctor's Room on its 1385x1136 background, drawn BY HAND in
// /dev/collisions (doctor-room): the export is the source of truth. World
// 519x426. Do not regenerate, scale, merge or normalise it.

// COLLIDERS (red): floor the feet cannot occupy.
export const doctorRoomNewColliders: SceneCollider[] = [
  { id: "doctor-room-new-1", x: 306, y: 376, width: 213, height: 46 },
  { id: "doctor-room-new-2", x: 452, y: 0, width: 67, height: 375 },
  { id: "doctor-room-new-3", x: 387, y: 62, width: 74, height: 206 },
  { id: "doctor-room-new-4", x: 4, y: 0, width: 509, height: 81 },
  { id: "doctor-room-new-5", x: 13, y: 77, width: 138, height: 61 },
  { id: "doctor-room-new-6", x: 223, y: 81, width: 44, height: 20 },
  { id: "doctor-room-new-7", x: 297, y: 76, width: 26, height: 13 },
  { id: "doctor-room-new-8", x: 0, y: 135, width: 80, height: 198 },
  { id: "doctor-room-new-9", x: 6, y: 338, width: 27, height: 88 },
  { id: "doctor-room-new-10", x: 36, y: 382, width: 176, height: 43 },
];

// TRANSITIONS (yellow): activation zones.
// transition-1: the lower exit, to the Apothecary (Botica).
export const doctorRoomNewTransitions: (LogicalRect & { id: string })[] = [
  { id: "doctor-room-new-transition-1", x: 215, y: 389, width: 91, height: 35 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
// spawn-1: arrival from the Apothecary. spawn-2: the start of the game.
export const doctorRoomNewSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "doctor-room-new-spawn-1", x: 261, y: 327, direction: "south" },
  { id: "doctor-room-new-spawn-2", x: 262, y: 202, direction: "south" },
];

// INTERACTIONS (green): interaction-1 is the Doctor's Storage chest (the
// interactionId names the one existing Storage, see storage.ts).
export const doctorRoomNewInteractions: InteractionZone[] = [
  {
    id: "doctor-room-new-interaction-1",
    x: 411,
    y: 287,
    width: 38,
    height: 88,
    interactionId: "storage.doctor-room",
  },
];
