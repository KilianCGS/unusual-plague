import type { SceneCollider } from "../collision";
import {
  collectInteractionId,
  isCollected,
  NO_COLLECTED,
  type CollectedInstanceIds,
} from "../collectibles/collectibles";
import type { InteractionZone } from "../interactions/interactionZone";
import { getDecorAsset, getInstanceCollider } from "./decorAssets";
import type { DecorAsset, DecorInstance, DecorInteraction } from "./decorTypes";

// The pieces of a composition that the game needs, derived from its instances
// with the SAME functions the Decorator uses to preview them (asset lookup,
// getInstanceCollider, the zone rule below), so a placed instance behaves in
// the game exactly as it did in the editor.

// World rect where the Doctor can interact with an instance. The zone is
// stored relative to the instance anchor, so it follows the instance when it
// is moved; it is not scaled or mirrored with the sprite.
export function getInstanceInteractionZone(
  instance: DecorInstance,
): InteractionZone | null {
  if (!instance.interaction) {
    return null;
  }

  const { zone, interactionId, requiredDirection } = instance.interaction;

  return {
    id: `${instance.instanceId}-zone`,
    x: instance.x + zone.offsetX,
    y: instance.y + zone.offsetY,
    width: zone.width,
    height: zone.height,
    interactionId,
    requiredDirection,
  };
}

// Gives each instance its interaction: the one set on the instance itself
// (authored in the Decorator) wins, otherwise the chapter's interaction table,
// looked up by the stable instanceId.
export function withInteractions(
  instances: readonly DecorInstance[],
  interactions: Record<string, DecorInteraction>,
): DecorInstance[] {
  return instances.map((instance) => {
    const interaction =
      instance.interaction ?? interactions[instance.instanceId];

    return interaction ? { ...instance, interaction } : instance;
  });
}

// Interaction zone of a collectible: its sprite box grown by a reach margin, so
// the Doctor standing next to it (it has no collider) gets the [E] prompt. Like
// every zone it follows the instance and is not scaled with the sprite.
const COLLECT_REACH = 16;

function getCollectibleZone(
  instance: DecorInstance,
  asset: DecorAsset,
  itemId: string,
): InteractionZone {
  const { frameWidth, frameHeight } = asset.sprite;
  const left = asset.anchor.x * frameWidth * instance.scale;
  const top = asset.anchor.y * frameHeight * instance.scale;

  return {
    id: `${instance.instanceId}-zone`,
    x: instance.x - left - COLLECT_REACH,
    y: instance.y - top - COLLECT_REACH,
    width: frameWidth * instance.scale + 2 * COLLECT_REACH,
    height: frameHeight * instance.scale + 2 * COLLECT_REACH,
    interactionId: collectInteractionId(itemId),
  };
}

export type ResolvedDecor = {
  // Instances whose asset exists, ready to be drawn with DecorSprite.
  sprites: { asset: DecorAsset; instance: DecorInstance }[];
  // Colliders of the instances with colliderEnabled.
  colliders: SceneCollider[];
  // Interaction zones of the instances that have one.
  zones: InteractionZone[];
  // Which instance each zone (by zone id) belongs to.
  zoneInstanceIds: Map<string, string>;
  // For the zones of collectibles: the item each one gives (by zone id).
  zoneItemIds: Map<string, string>;
};

export function resolveDecorInstances(
  instances: readonly DecorInstance[],
  interactions: Record<string, DecorInteraction> = {},
  // Collectibles already picked up this session: they are not resolved at all
  // (no sprite, no collider, no zone).
  collected: CollectedInstanceIds = NO_COLLECTED,
): ResolvedDecor {
  const resolved: ResolvedDecor = {
    sprites: [],
    colliders: [],
    zones: [],
    zoneInstanceIds: new Map(),
    zoneItemIds: new Map(),
  };

  for (const instance of withInteractions(instances, interactions)) {
    const asset = getDecorAsset(instance.assetId);

    if (!asset || isCollected(collected, instance.instanceId)) {
      continue;
    }

    resolved.sprites.push({ asset, instance });

    const collider = getInstanceCollider(instance, asset);

    if (collider) {
      resolved.colliders.push(collider);
    }

    const itemId = asset.collectibleItemId;
    const zone = itemId
      ? getCollectibleZone(instance, asset, itemId)
      : getInstanceInteractionZone(instance);

    if (zone && itemId) {
      resolved.zoneItemIds.set(zone.id, itemId);
    }

    if (zone) {
      resolved.zones.push(zone);
      resolved.zoneInstanceIds.set(zone.id, instance.instanceId);
    }
  }

  return resolved;
}
