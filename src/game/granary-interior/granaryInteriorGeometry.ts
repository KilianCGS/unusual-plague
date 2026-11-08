import type { LogicalRect, SceneCollider } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// Manually authored by Kilian. Preserve coordinates verbatim.
export const granaryInteriorColliders: SceneCollider[] = [
  { id: "granary-interior-1", x: 164, y: 27, width: 51, height: 109 },
  { id: "granary-interior-2", x: 0, y: 0, width: 165, height: 159 },
  { id: "granary-interior-3", x: 14, y: 158, width: 75, height: 170 },
  { id: "granary-interior-4", x: 19, y: 329, width: 19, height: 87 },
  { id: "granary-interior-5", x: 34, y: 359, width: 141, height: 60 },
  { id: "granary-interior-6", x: 278, y: 355, width: 154, height: 62 },
  { id: "granary-interior-7", x: 370, y: 11, width: 68, height: 344 },
  { id: "granary-interior-8", x: 327, y: 18, width: 42, height: 131 },
  { id: "granary-interior-9", x: 313, y: 13, width: 15, height: 123 },
  { id: "granary-interior-10", x: 294, y: 14, width: 19, height: 103 },
  { id: "granary-interior-11", x: 214, y: 16, width: 158, height: 65 },
  { id: "granary-interior-12", x: 339, y: 275, width: 30, height: 39 },
];

export const granaryInteriorTransitions: (LogicalRect & { id: string })[] = [
  { id: "granary-interior-transition-1", x: 179, y: 394, width: 94, height: 28 },
];

export const granaryInteriorSpawns: {
  id: string; x: number; y: number; direction: Direction;
}[] = [
  { id: "granary-interior-spawn-1", x: 228, y: 340, direction: "south" },
];
