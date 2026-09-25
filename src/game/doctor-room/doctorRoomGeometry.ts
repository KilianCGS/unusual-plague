import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

export const doctorRoomColliders: SceneCollider[] = [
  { id: "doctor-room-1", x: 183, y: 260, width: 105, height: 53 },
  { id: "doctor-room-2", x: 7, y: 263, width: 102, height: 50 },
  { id: "doctor-room-3", x: 0, y: 132, width: 53, height: 149 },
  { id: "doctor-room-4", x: 0, y: 0, width: 125, height: 151 },
  { id: "doctor-room-5", x: 127, y: 0, width: 161, height: 126 },
  { id: "doctor-room-6", x: 194, y: 121, width: 94, height: 91 },
  { id: "doctor-room-7", x: 236, y: 212, width: 52, height: 45 },
];

// TRANSITIONS (yellow): activation zones.
// transition-1: the only exit, to the Apothecary (Botica).
export const doctorRoomTransitions: (LogicalRect & { id: string })[] = [
  { id: "doctor-room-transition-1", x: 111, y: 284, width: 68, height: 33 },
];

// SPAWNS (blue): exact feet position on arrival, plus facing.
// spawn-1: NOT a physical arrival. Reserved for chapter-start / narrative
// wake / interludes - do not wire it to a walk-in transition.
// spawn-2: physical arrival from the Apothecary, facing into the room.
export const doctorRoomSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "doctor-room-spawn-1", x: 173, y: 168, direction: "south" },
  { id: "doctor-room-spawn-2", x: 144, y: 264, direction: "north" },
];
