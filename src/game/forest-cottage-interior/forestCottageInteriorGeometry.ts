import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// COLLIDERS (red): floor the feet cannot occupy.
export const forestCottageInteriorColliders: SceneCollider[] = [
  { id: "forest-cottage-interior-1", x: 0, y: 0, width: 502, height: 158 },
  { id: "forest-cottage-interior-2", x: 0, y: 152, width: 49, height: 242 },
  { id: "forest-cottage-interior-3", x: 42, y: 152, width: 36, height: 32 },
  { id: "forest-cottage-interior-4", x: 173, y: 152, width: 31, height: 20 },
  { id: "forest-cottage-interior-5", x: 367, y: 269, width: 21, height: 62 },
  { id: "forest-cottage-interior-6", x: 398, y: 251, width: 115, height: 146 },
  { id: "forest-cottage-interior-7", x: 473, y: 158, width: 40, height: 151 },
  { id: "forest-cottage-interior-8", x: 443, y: 148, width: 34, height: 33 },
  { id: "forest-cottage-interior-9", x: 331, y: 153, width: 102, height: 19 },
  { id: "forest-cottage-interior-10", x: 294, y: 333, width: 128, height: 64 },
  { id: "forest-cottage-interior-11", x: 0, y: 337, width: 222, height: 60 },
];

export const forestCottageInteriorTransitions: (LogicalRect & {
  id: string;
})[] = [
  {
    id: "forest-cottage-interior-transition-1",
    x: 224,
    y: 353,
    width: 67,
    height: 30,
  },
];

export const forestCottageInteriorSpawns: {
  id: string;
  x: number;
  y: number;
  direction: Direction;
}[] = [
  { id: "forest-cottage-interior-spawn-1", x: 256, y: 307, direction: "south" },
];
