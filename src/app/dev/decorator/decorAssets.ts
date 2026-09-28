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
      // Upper body only (no legs), like baker/bartender: meant to stand
      // behind the forge/anvil work surface. Frames are a lossless top crop
      // (96x96 -> 96x64) of the original approved full-body hammering loop,
      // not a regeneration - same face, clothes, colors, hammer, motion.
      frames: [0, 1, 2, 3].map((i) => `/game/npcs/blacksmith/idle/${i}.png`),
      frameWidth: 96,
      frameHeight: 64,
      fps: 6,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Body-only silhouette (x33-66 y12-64 of the 96x64 frame): same x-range
    // as the original full-body collider (the torso didn't move when the
    // legs were cropped away), deliberately excludes the raised hammer/arm
    // reaching further left (down to x21 in some frames). The hammer itself
    // is part of this character, not a separate asset - the anvil/forge is
    // not: it stays scenery (map) or a future ambient asset.
    defaultCollider: { offsetX: -15, offsetY: -52, width: 34, height: 52 },
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
  // Fourth population batch (PixelLab, style-matched to villager-pilot /
  // dog). Miner is a full-body worker reusable in Mountain Path / Mine
  // Interior; chicken and sheep are small ambient farm animals, in-place
  // idle only, like cat and dog.
  {
    id: "miner",
    label: "Miner",
    category: "people",
    sprite: {
      // Pick-swinging loop: rest -> raise -> strike -> recover. Feet stay
      // planted at y80 in every frame; only the torso/arms/pickaxe move.
      frames: [0, 1, 2, 3].map((i) => `/game/npcs/miner/idle/${i}.png`),
      frameWidth: 96,
      frameHeight: 96,
      fps: 6,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Body-only silhouette (x32-56 y15-80 of the 96x96 frame): deliberately
    // excludes the pickaxe's swing, which reaches much further left/right in
    // different frames (down to x19 / up to x79) - same principle as
    // blacksmith's hammer. The pickaxe is part of this character, not a
    // separate asset; the rock/wall/minecart stay scenery.
    defaultCollider: { offsetX: -16, offsetY: -81, width: 25, height: 66 },
  },
  {
    id: "chicken",
    label: "Chicken",
    category: "animals",
    sprite: {
      // Single subtle head-tilt/peck loop, feet stationary.
      frames: [0, 1, 2, 3].map((i) => `/game/npcs/chicken/idle/${i}.png`),
      frameWidth: 64,
      frameHeight: 64,
      fps: 4,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Resting-pose silhouette (frame 0) x14-44 y16-48 of the 64x64 frame,
    // deliberately smaller than cat (32x37) / dog (32x36) - a chicken should
    // not block the Doctor like a person or even like the approved pets.
    defaultCollider: { offsetX: -18, offsetY: -48, width: 31, height: 33 },
  },
  {
    id: "sheep",
    label: "Sheep",
    category: "animals",
    sprite: {
      // Very discreet loop: subtle breathing / head turn, feet stationary.
      frames: [0, 1, 2, 3].map((i) => `/game/npcs/sheep/idle/${i}.png`),
      frameWidth: 96,
      frameHeight: 64,
      fps: 4,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Resting-pose silhouette (frame 0) x28-65 y20-53 of the 96x64 frame -
    // clearly bigger than cat/dog/chicken, still clearly smaller than a
    // human. Not wrapped around every wisp of wool, just the stable body.
    defaultCollider: { offsetX: -20, offsetY: -44, width: 38, height: 34 },
  },
  // Fifth population batch (PixelLab, style-matched to villager-pilot; no
  // style_image reused for any of these three - after the sheep/dog identity
  // mix-up in batch 4, kept purely to description-driven prompts here).
  // villager-sitting is deliberately drawn without any bench/chair/stool (a
  // person "sitting on an invisible surface"): Kilian places it on top of
  // real furniture instances via Decorator. fisherman and woodcutter are
  // person + tool only, no environment (river/tree) baked in.
  {
    id: "villager-sitting",
    label: "Villager (sitting)",
    category: "people",
    sprite: {
      // Very subtle seated idle: breathing / tiny head movement, legs and
      // feet never move. Frame 3 carries a faint (near-invisible, alpha
      // barely above zero) generation ghosting artifact near the head; it
      // does not affect the collider (based on the clean frame 0) and is
      // not visible in normal play.
      frames: [0, 1, 2, 3].map(
        (i) => `/game/npcs/villager-sitting/idle/${i}.png`,
      ),
      frameWidth: 96,
      frameHeight: 96,
      fps: 4,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Resting-pose silhouette (frame 0) x32-58 y33-78 of the 96x96 frame:
    // deliberately SHORTER than a standing human (44 vs 66) because the body
    // is compact/seated - this is not the opaque bbox of a standing pose,
    // it reflects the real folded-up silhouette. No bench is drawn or
    // implied in the collider; Kilian aligns it with real furniture
    // manually in Decorator.
    defaultCollider: { offsetX: -16, offsetY: -63, width: 27, height: 46 },
  },
  {
    id: "fisherman",
    label: "Fisherman",
    category: "people",
    sprite: {
      // Very calm "already fishing" idle: breathing / tiny rod sway, same
      // silhouette bounding box in all 4 frames (feet and rod tip never
      // move enough to change it), verified to actually cycle (frames are
      // not byte-identical).
      frames: [0, 1, 2, 3].map((i) => `/game/npcs/fisherman/idle/${i}.png`),
      frameWidth: 96,
      frameHeight: 96,
      fps: 4,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Body-only silhouette (x19-45 y15-80 of the 96x96 frame): deliberately
    // excludes the fishing rod and line, which reach all the way to x77 -
    // same principle as miner's pickaxe. The rod/line are part of this
    // character, not a separate asset; the river/water is not.
    defaultCollider: { offsetX: -29, offsetY: -81, width: 27, height: 66 },
  },
  {
    id: "woodcutter",
    label: "Woodcutter",
    category: "people",
    sprite: {
      // Clearly visible chopping loop (real physical work, unlike the
      // near-static sitting/fishing idles), feet planted at y80 throughout.
      frames: [0, 1, 2, 3].map((i) => `/game/npcs/woodcutter/idle/${i}.png`),
      frameWidth: 96,
      frameHeight: 96,
      fps: 6,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Body-only silhouette (x29-53 y15-80 of the 96x96 frame): deliberately
    // excludes the axe's swing arc, which reaches out to x75 in some frames
    // - same principle as miner/blacksmith. The axe is part of this
    // character, not a separate asset; the tree/log/stump are not.
    defaultCollider: { offsetX: -19, offsetY: -81, width: 25, height: 66 },
  },
  // Sixth population batch: five generic ambient villagers (no profession, no
  // tools, no narrative role - just people who live here). Generated purely
  // from descriptive prompts, no style_image reused from an existing NPC, to
  // avoid the identity/silhouette overfitting seen when a small animal was
  // used as a style reference in an earlier batch. Idle is intentionally
  // near-static ("breathing"): first/last-frame pinned, feet never move a
  // single pixel across any frame in any of the five.
  {
    id: "villager-man-01",
    label: "Villager man (1)",
    category: "people",
    sprite: {
      frames: [0, 1, 2, 3].map(
        (i) => `/game/npcs/villager-man-01/idle/${i}.png`,
      ),
      frameWidth: 96,
      frameHeight: 96,
      fps: 4,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Resting-pose silhouette (frame 0) x31-58 y17-82 of the 96x96 frame.
    defaultCollider: { offsetX: -17, offsetY: -79, width: 28, height: 66 },
  },
  {
    id: "villager-man-02",
    label: "Villager man (2)",
    category: "people",
    sprite: {
      frames: [0, 1, 2, 3].map(
        (i) => `/game/npcs/villager-man-02/idle/${i}.png`,
      ),
      frameWidth: 96,
      frameHeight: 96,
      fps: 4,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Resting-pose silhouette (frame 0) x28-59 y16-83 of the 96x96 frame.
    defaultCollider: { offsetX: -20, offsetY: -80, width: 32, height: 68 },
  },
  {
    id: "villager-woman-01",
    label: "Villager woman (1)",
    category: "people",
    sprite: {
      frames: [0, 1, 2, 3].map(
        (i) => `/game/npcs/villager-woman-01/idle/${i}.png`,
      ),
      frameWidth: 96,
      frameHeight: 96,
      fps: 4,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Resting-pose silhouette (frame 0) x33-56 y17-81 of the 96x96 frame.
    defaultCollider: { offsetX: -15, offsetY: -79, width: 24, height: 65 },
  },
  {
    id: "villager-woman-02",
    label: "Villager woman (2)",
    category: "people",
    sprite: {
      frames: [0, 1, 2, 3].map(
        (i) => `/game/npcs/villager-woman-02/idle/${i}.png`,
      ),
      frameWidth: 96,
      frameHeight: 96,
      fps: 4,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Resting-pose silhouette (frame 0) x28-59 y17-80 of the 96x96 frame.
    defaultCollider: { offsetX: -20, offsetY: -79, width: 32, height: 64 },
  },
  {
    id: "villager-child-01",
    label: "Villager child (1)",
    category: "people",
    sprite: {
      frames: [0, 1, 2, 3].map(
        (i) => `/game/npcs/villager-child-01/idle/${i}.png`,
      ),
      frameWidth: 72,
      frameHeight: 84,
      fps: 4,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Resting-pose silhouette (frame 0) x19-52 y18-73 of the 72x84 frame -
    // genuinely smaller base art (regenerated once: the first attempt came
    // out too tall, 60px vs child-wooden-sword's approved 51px; this version
    // is 56px, in line with the approved child scale), not scaled down via
    // defaultScale.
    defaultCollider: { offsetX: -17, offsetY: -66, width: 34, height: 56 },
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
