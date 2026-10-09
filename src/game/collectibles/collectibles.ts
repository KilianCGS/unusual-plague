// World collectibles. There is no separate placement system: a collectible is
// a DecorInstance whose DecorAsset declares `collectibleItemId`, so it is
// placed, scaled and exported with the same Decorator pipeline as everything
// else. Two ids must never be confused:
//   itemId      WHAT you receive (the inventory groups by it);
//   instanceId  WHICH concrete object in the world was picked up (the world
//               remembers by it).

// The interactionId of every collectible of an item. The scene reports the
// instanceId separately, so ids never encode a position or an instance.
export function collectInteractionId(itemId: string): string {
  return `collect.${itemId}`;
}

// The instanceIds picked up during this session. Immutable: every change
// returns a new set, so React sees it and a scene can never mutate it.
export type CollectedInstanceIds = ReadonlySet<string>;

export const NO_COLLECTED: CollectedInstanceIds = new Set<string>();

export function isCollected(
  collected: CollectedInstanceIds,
  instanceId: string,
): boolean {
  return collected.has(instanceId);
}

export function markCollected(
  collected: CollectedInstanceIds,
  instanceId: string,
): CollectedInstanceIds {
  return new Set([...collected, instanceId]);
}
