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
  // First real population batch (PixelLab, style-matched to villager-pilot).
  // Every animated one is a 5-frame in-place idle loop: frame 0 is the base
  // pose, 1-4 are the generated motion (per animate_image's own convention:
  // "index 0 is your input frame unchanged, then the generated ones, play in
  // order"). None of them walk or change position.
  {
    id: "farmer-old",
    label: "Farmer (old)",
    category: "people",
    sprite: {
      // 4-frame near-static breathing loop (arms stay down the whole time);
      // slower fps than the other idles reads as calmer, not gesturing.
      frames: [0, 1, 2, 3].map(
        (i) => `/game/npcs/farmer-old/idle/${i}.png`,
      ),
      frameWidth: 96,
      frameHeight: 96,
      fps: 4,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Body occupancy (profile pose, facing west as generated): visible
    // silhouette x28-56 y15-80 of the 96x96 frame.
    defaultCollider: { offsetX: -28, offsetY: -81, width: 45, height: 66 },
  },
  {
    id: "villager-young",
    label: "Villager (young)",
    category: "people",
    sprite: {
      // 4-frame near-static breathing loop (arms stay down the whole time).
      frames: [0, 1, 2, 3].map(
        (i) => `/game/npcs/villager-young/idle/${i}.png`,
      ),
      frameWidth: 96,
      frameHeight: 96,
      fps: 4,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Visible silhouette x35-54 y15-80 of the 96x96 frame (facing east).
    defaultCollider: { offsetX: -21, offsetY: -81, width: 36, height: 66 },
  },
  {
    id: "merchant",
    label: "Merchant",
    category: "people",
    sprite: {
      frames: [0, 1, 2, 3, 4].map((i) => `/game/npcs/merchant/idle/${i}.png`),
      frameWidth: 96,
      frameHeight: 96,
      fps: 6,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Visible silhouette x26-71 y13-80 of the 96x96 frame (facing south).
    defaultCollider: { offsetX: -30, offsetY: -83, width: 62, height: 68 },
  },
  {
    id: "woman-washing-clothes",
    label: "Woman washing clothes",
    category: "people",
    sprite: {
      // Single composite asset on purpose: woman + washtub + laundry are one
      // inseparable action, not three independently reusable entities.
      frames: [0, 1, 2, 3, 4].map(
        (i) => `/game/npcs/woman-washing-clothes/idle/${i}.png`,
      ),
      frameWidth: 112,
      frameHeight: 96,
      fps: 6,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Visible silhouette x26-85 y17-81 of the 112x96 frame.
    defaultCollider: { offsetX: -38, offsetY: -79, width: 76, height: 65 },
  },
  // Second population batch. Unlike the first batch's near-static idles,
  // woman-sweeping and child-wooden-sword perform a clearly readable action
  // (idle does not have to mean "almost no motion" when the character is
  // doing something) - only dog stays discreet, like cat. Every collider
  // below is sized to the RESTING pose (frame 0), not the widest reach of the
  // action (the broom's swing / the raised sword), so the action never turns
  // into an oversized wall.
  {
    id: "blacksmith",
    label: "Blacksmith",
    category: "people",
    sprite: {
      // Clearly visible hammering loop (the trade justifies real motion,
      // unlike the near-static farmer/villager idles).
      frames: [0, 1, 2, 3].map((i) => `/game/npcs/blacksmith/idle/${i}.png`),
      frameWidth: 96,
      frameHeight: 96,
      fps: 6,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Body-only silhouette (x33-66 y12-80 of the 96x96 frame): deliberately
    // excludes the raised hammer/arm reaching further left (down to x21 in
    // some frames), so the swing never becomes a giant invisible wall. The
    // hammer itself is part of this character, not a separate asset - the
    // anvil/forge is not: it stays scenery (map) or a future ambient asset.
    defaultCollider: { offsetX: -15, offsetY: -84, width: 34, height: 69 },
  },
  {
    id: "baker",
    label: "Baker",
    category: "people",
    sprite: {
      // Upper body only (no legs): meant to stand at a counter. Anchor stays
      // bottom-center like every other asset; Kilian positions the instance
      // so this bottom edge lines up with the counter's height on each map.
      frames: [0, 1, 2, 3].map((i) => `/game/npcs/baker/idle/${i}.png`),
      frameWidth: 96,
      frameHeight: 64,
      fps: 5,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Visible silhouette x28-64 y3-58 of the 96x64 frame. Modest by
    // construction (half-body, no legs) - the counter itself is expected to
    // supply most of the real blocking in a real composition.
    defaultCollider: { offsetX: -20, offsetY: -61, width: 37, height: 56 },
  },
  {
    id: "bartender",
    label: "Bartender",
    category: "people",
    sprite: {
      // Upper body only (no legs): meant to stand behind a bar counter.
      frames: [0, 1, 2, 3].map((i) => `/game/npcs/bartender/idle/${i}.png`),
      frameWidth: 96,
      frameHeight: 64,
      fps: 5,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Visible silhouette x28-65 y4-59 of the 96x64 frame.
    defaultCollider: { offsetX: -20, offsetY: -60, width: 38, height: 56 },
  },
  {
    id: "woman-sweeping",
    label: "Woman sweeping",
    category: "people",
    sprite: {
      // Single composite asset on purpose, like woman-washing-clothes: woman
      // + broom is one inseparable action.
      frames: [0, 1, 2, 3].map(
        (i) => `/game/npcs/woman-sweeping/idle/${i}.png`,
      ),
      frameWidth: 112,
      frameHeight: 96,
      fps: 6,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Resting-pose silhouette (frame 0) x29-70 y15-81 of the 112x96 frame;
    // the broom's mid-swing reach in frames 1-3 is intentionally NOT included.
    defaultCollider: { offsetX: -27, offsetY: -81, width: 42, height: 67 },
  },
  {
    id: "child-wooden-sword",
    label: "Child (wooden sword)",
    category: "people",
    sprite: {
      frames: [0, 1, 2, 3].map(
        (i) => `/game/npcs/child-wooden-sword/idle/${i}.png`,
      ),
      frameWidth: 72,
      frameHeight: 84,
      fps: 6,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Resting-pose silhouette (frame 0) x16-51 y21-71 of the 72x84 frame; the
    // sword raised overhead in frames 1-3 is intentionally NOT included.
    defaultCollider: { offsetX: -20, offsetY: -63, width: 36, height: 51 },
  },
  {
    id: "dog",
    label: "Dog",
    category: "animals",
    sprite: {
      frames: [0, 1, 2, 3].map((i) => `/game/npcs/dog/idle/${i}.png`),
      frameWidth: 72,
      frameHeight: 48,
      fps: 4,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Visible silhouette x20-51 y11-46 of the 72x48 frame, no extra padding -
    // same reasoning as cat: a small animal should not be an oversized wall.
    defaultCollider: { offsetX: -16, offsetY: -37, width: 32, height: 36 },
  },
  {
    id: "cat",
    label: "Cat",
    category: "animals",
    sprite: {
      frames: [0, 1, 2, 3, 4].map((i) => `/game/npcs/cat/idle/${i}.png`),
      frameWidth: 64,
      frameHeight: 64,
      fps: 6,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Deliberately just the visible silhouette (x15-46 y16-52 of the 64x64
    // frame), no extra padding: a small animal should not become an oversized
    // wall. Each instance can still switch colliderEnabled off.
    defaultCollider: { offsetX: -17, offsetY: -48, width: 32, height: 37 },
  },
  {
    id: "merchant-cart",
    label: "Merchant cart",
    category: "ambient",
    sprite: {
      frames: ["/game/npcs/merchant-cart/static.png"],
      frameWidth: 144,
      frameHeight: 112,
      fps: 0,
      loop: false,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Visible silhouette x16-117 y19-89 of the 144x112 frame.
    defaultCollider: { offsetX: -56, offsetY: -93, width: 102, height: 71 },
  },
  {
    id: "merchant-table",
    label: "Merchant table",
    category: "ambient",
    sprite: {
      frames: ["/game/npcs/merchant-table/static.png"],
      frameWidth: 96,
      frameHeight: 64,
      fps: 0,
      loop: false,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Visible silhouette x19-71 y9-55 of the 96x64 frame.
    defaultCollider: { offsetX: -29, offsetY: -55, width: 53, height: 47 },
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
