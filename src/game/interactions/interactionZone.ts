import { rectsIntersect, type LogicalRect } from "../collision";
import type { Direction } from "../protagonist/useProtagonistController";

// WHERE (and from which facing) something can be interacted with. It says
// nothing about WHAT happens: `interactionId` only names the thing being
// interacted with, and resolving it (dialogue, pick-up, puzzle...) is a later
// layer. Several zones may share one interactionId (e.g. one per side of an
// NPC), and a zone does not have to belong to an NPC. Zones never block
// movement.
export type InteractionZone = LogicalRect & {
  id: string;
  interactionId: string;
  // Facing the player must have. Omitted = any facing.
  requiredDirection?: Direction;
};

// Deterministic rule: the FIRST zone, in list (persisted) order, that the feet
// hitbox overlaps and whose required facing matches. One press therefore
// always resolves to at most one interaction.
export function findAvailableInteraction(
  zones: readonly InteractionZone[],
  feetHitbox: LogicalRect,
  facing: Direction,
): InteractionZone | null {
  return (
    zones.find(
      (zone) =>
        rectsIntersect(feetHitbox, zone) &&
        (zone.requiredDirection === undefined ||
          zone.requiredDirection === facing),
    ) ?? null
  );
}
