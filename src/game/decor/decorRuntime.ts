import type { SceneCollider } from "../collision";
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

export type ResolvedDecor = {
  // Instances whose asset exists, ready to be drawn with DecorSprite.
  sprites: { asset: DecorAsset; instance: DecorInstance }[];
  // Colliders of the instances with colliderEnabled.
  colliders: SceneCollider[];
  // Interaction zones of the instances that have one.
  zones: InteractionZone[];
  // Which instance each zone (by zone id) belongs to.
  zoneInstanceIds: Map<string, string>;
};

export function resolveDecorInstances(
  instances: readonly DecorInstance[],
  interactions: Record<string, DecorInteraction> = {},
): ResolvedDecor {
  const resolved: ResolvedDecor = {
    sprites: [],
    colliders: [],
    zones: [],
    zoneInstanceIds: new Map(),
  };

  for (const instance of withInteractions(instances, interactions)) {
    const asset = getDecorAsset(instance.assetId);

    if (!asset) {
      continue;
    }

    resolved.sprites.push({ asset, instance });

    const collider = getInstanceCollider(instance, asset);

    if (collider) {
      resolved.colliders.push(collider);
    }

    const zone = getInstanceInteractionZone(instance);

    if (zone) {
      resolved.zones.push(zone);
      resolved.zoneInstanceIds.set(zone.id, instance.instanceId);
    }
  }

  return resolved;
}
