import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";
import type { InteractionZone } from "../interactions/interactionZone";

// The Doctor's Room, redesigned (2026-11-13): the 1254x1254 painting, world 470x470, drawn BY
// HAND in /dev/collisions. The export is the source of truth: do not regenerate, scale, merge or
// normalise it. (Only the interactionId of the chest zone was filled in; the hand export leaves it
// empty, exactly as the previous room's did.)

// COLLIDERS (red): floor the feet cannot occupy.
export const doctorRoomRedesignColliders: SceneCollider[] = [
  { id: "doctor-room-redesign-1", x: 387, y: 13, width: 59, height: 212 },
  { id: "doctor-room-redesign-2", x: 326, y: 9, width: 65, height: 138 },
  { id: "doctor-room-redesign-3", x: 30, y: 17, width: 299, height: 151 },
  { id: "doctor-room-redesign-4", x: 324, y: 155, width: 82, height: 41 },
  { id: "doctor-room-redesign-5", x: 346, y: 187, width: 50, height: 31 },
  { id: "doctor-room-redesign-6", x: 283, y: 373, width: 186, height: 51 },
  { id: "doctor-room-redesign-7", x: 420, y: 225, width: 50, height: 178 },
  { id: "doctor-room-redesign-8", x: 383, y: 267, width: 40, height: 96 },
  { id: "doctor-room-redesign-9", x: 36, y: 303, width: 39, height: 68 },
  { id: "doctor-room-redesign-10", x: 0, y: 373, width: 183, height: 57 },
  { id: "doctor-room-redesign-11", x: 270, y: 379, width: 15, height: 49 },
  { id: "doctor-room-redesign-12", x: 182, y: 383, width: 14, height: 45 },
  { id: "doctor-room-redesign-13", x: 171, y: 168, width: 133, height: 15 },
  { id: "doctor-room-redesign-14", x: 124, y: 168, width: 27, height: 23 },
  { id: "doctor-room-redesign-15", x: 7, y: 168, width: 112, height: 129 },
  { id: "doctor-room-redesign-16", x: 10, y: 295, width: 66, height: 9 },
];

// TRANSITIONS (yellow): activation zones. transition-1: the lower exit, to the Apothecary (Botica).
export const doctorRoomRedesignTransitions: (LogicalRect & { id: string })[] = [
  { id: "doctor-room-redesign-transition-1", x: 199, y: 392, width: 72, height: 39 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
// spawn-1: arrival from the Apothecary. spawn-2: the start of every day.
export const doctorRoomRedesignSpawns: { id: string; x: number; y: number; direction: Direction }[] = [
  { id: "doctor-room-redesign-spawn-1", x: 233, y: 366, direction: "south" },
  { id: "doctor-room-redesign-spawn-2", x: 236, y: 263, direction: "south" },
];

// INTERACTIONS (green): interaction-1 is the Doctor's Storage chest (the interactionId names the
// one existing Storage, see storage.ts).
export const doctorRoomRedesignInteractions: InteractionZone[] = [
  { id: "doctor-room-redesign-interaction-1", x: 337, y: 277, width: 38, height: 95, interactionId: "storage.doctor-room" },
];
