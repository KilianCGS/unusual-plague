import type { LogicalRect } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// Interior of the Apothecary. World is 480x270 logical units (see
// ApothecaryScene). The colliders stay in apothecaryColliders.ts.

// PROVISIONAL door zone: the gap between room-bottom-wall-left (x 0..214) and
// room-bottom-wall-right (x 266..480) at the bottom of the room.
export const apothecaryInteriorTransitions: (LogicalRect & { id: string })[] = [
  { id: "apothecary-interior-transition-1", x: 214, y: 258, width: 52, height: 12 },
];

export const apothecaryInteriorSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  // Where the game starts after the intro (unchanged behaviour).
  { id: "apothecary-interior-start", x: 240, y: 220, direction: "south" },
  // Arrival from Calle Botica: inside, looking north.
  { id: "apothecary-interior-spawn-1", x: 240, y: 220, direction: "north" },
];
