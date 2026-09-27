import type { SceneCollider } from "../../../game/collision";
import { PROTAGONIST_FEET_HITBOX } from "../../../game/protagonist/useProtagonistController";
import type { DecorAsset, DecorCategory, DecorInstance } from "./decorTypes";

// Asset library V1. Only REAL assets that already exist in the project; new
// assets (animals, ambient, resources...) get registered here when they exist.
export const DECOR_ASSETS: DecorAsset[] = [
  {
    // The approved pilot villager, static.
    id: "villager-pilot",
    label: "Villager (pilot)",
    category: "people",
    sprite: {
      frames: ["/game/npcs/villager-pilot/idle-south.png"],
      frameWidth: 96,
      frameHeight: 96,
      fps: 0,
      loop: false,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Same approved body collider as the pilot NPC.
    defaultCollider: { offsetX: -24, offsetY: -80, width: 48, height: 66 },
  },
  {
    // The protagonist's real walk cycle, used only to test animated in-place
    // previews. Not a decoration to ship.
    id: "doctor-walk-south-test",
    label: "Doctor walk cycle (animation test)",
    category: "test",
    sprite: {
      frames: [0, 1, 2, 3].map(
        (index) => `/game/characters/protagonist/walk/south/${index}.png`,
      ),
      frameWidth: 96,
      frameHeight: 96,
      fps: 8,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultCollider: { ...PROTAGONIST_FEET_HITBOX },
  },
];

export const DECOR_CATEGORY_ORDER: DecorCategory[] = [
  "people",
  "animals",
  "ambient",
  "resources",
  "test",
];

const ASSETS_BY_ID = new Map(DECOR_ASSETS.map((asset) => [asset.id, asset]));

export function getDecorAsset(assetId: string): DecorAsset | undefined {
  return ASSETS_BY_ID.get(assetId);
}

// World collider of an instance (null when it has none or it is switched off).
// `instance.scale` is the size of this entity, sprite AND collider alike: the
// asset's defaultCollider (its shape at scale 1) is scaled around the anchor,
// same as the sprite. Flipping mirrors the scaled box around the anchor.
export function getInstanceCollider(
  instance: DecorInstance,
  asset: DecorAsset,
  ignoreEnabled = false,
): SceneCollider | null {
  const collider = asset.defaultCollider;

  if (!collider || (!instance.colliderEnabled && !ignoreEnabled)) {
    return null;
  }

  const width = collider.width * instance.scale;
  const height = collider.height * instance.scale;
  const offsetX = instance.flipX
    ? -(collider.offsetX * instance.scale + width)
    : collider.offsetX * instance.scale;

  return {
    id: `${instance.instanceId}-collider`,
    x: instance.x + offsetX,
    y: instance.y + collider.offsetY * instance.scale,
    width,
    height,
  };
}
