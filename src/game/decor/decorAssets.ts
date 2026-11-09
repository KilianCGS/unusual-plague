import type { SceneCollider } from "../collision";
import { PROTAGONIST_FEET_HITBOX } from "../protagonist/useProtagonistController";
import type { DecorAsset, DecorCategory, DecorInstance } from "./decorTypes";

// Asset library V1. Only REAL assets that already exist in the project; new
// assets (animals, ambient, resources...) get registered here when they exist.
export const DOCTOR_NARRATIVE_ASSET_ID = "doctor-narrative";

const BASE_DECOR_ASSETS: DecorAsset[] = [
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
      frames: [0, 1, 2, 3].map((i) => `/game/npcs/farmer-old/idle/${i}.png`),
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
  // Seventh population batch (PixelLab, text-only prompt, no style_image so
  // sheep/dog anatomy cannot leak in). Cow is a single lateral view facing
  // EAST as generated; use flipX for west. In-place idle only, it never walks.
  {
    id: "cow",
    label: "Cow",
    category: "animals",
    sprite: {
      // Very discreet loop: breathing, tiny head nod, ear twitch, tail sway.
      // Rows y>=45 (hooves and lower legs) are pixel-identical in every frame.
      // Cropped to 88x54 so the bottom-center anchor sits 3px under the hooves.
      frames: [0, 1, 2, 3].map((i) => `/game/npcs/cow/idle/${i}.png`),
      frameWidth: 88,
      frameHeight: 54,
      fps: 4,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Stable body (frame 0) x18-62 y15-50 of the 88x54 frame: torso, neck base
    // and legs down to the hooves. Deliberately excludes the hanging tail
    // (x<18, swings further out), the head/ears/muzzle (x>62, y9-27 while
    // nodding). 45x36 vs sheep 38x34: clearly bigger, not a wall.
    defaultCollider: { offsetX: -26, offsetY: -39, width: 45, height: 36 },
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
  // Chapter I patients (PixelLab, see art/patients/chapter-1). Visual review
  // assets only: no collider yet, not placed in any composition. Each is a
  // 4-frame breathing loop at 2 fps. The anchor is the visual base of the
  // drawing (bottom of the union silhouette over the 4 frames, horizontal
  // centre of that silhouette), not the frame bottom, so dragging sits it on
  // the floor.
  {
    // Bed included in the sprite.
    id: "bakers-husband-sick",
    label: "Baker's Husband - Sick (in bed)",
    category: "people",
    sprite: {
      frames: [0, 1, 2, 3].map(
        (i) => `/game/npcs/bakers-husband-sick/idle/${i}.png`,
      ),
      frameWidth: 128,
      frameHeight: 80,
      fps: 2,
      loop: true,
    },
    // Union silhouette x12-118 y14-72 of the 128x80 frame.
    anchor: { x: 0.512, y: 0.912 },
    defaultScale: 1,
    // Lying down: his lines hang under the bed instead of over his head.
    dialoguePlacement: "below",
  },
  {
    id: "tavern-patient-sick",
    label: "Tavern Patient - Sick (on the floor)",
    category: "people",
    sprite: {
      frames: [0, 1, 2, 3].map(
        (i) => `/game/npcs/tavern-patient-sick/idle/${i}.png`,
      ),
      frameWidth: 96,
      frameHeight: 64,
      fps: 2,
      loop: true,
    },
    // Union silhouette x2-82 y8-54 of the 96x64 frame.
    anchor: { x: 0.443, y: 0.859 },
    defaultScale: 1,
  },
  {
    id: "injured-miner",
    label: "Miner - Injured (sitting)",
    category: "people",
    sprite: {
      frames: [0, 1, 2, 3].map((i) => `/game/npcs/injured-miner/idle/${i}.png`),
      frameWidth: 96,
      frameHeight: 96,
      fps: 2,
      loop: true,
    },
    // Union silhouette x3-90 y12-83 of the 96x96 frame.
    anchor: { x: 0.49, y: 0.875 },
    defaultScale: 1,
  },
  {
    // The baker as a full-body standing figure, for narrative scenes (the Baker's
    // Bedroom). The one in the bakery (id "baker") is the half-body kneading
    // her dough; both are the same character. The PNG is the hand-adjusted
    // 114x257 drawing, used exactly as delivered (source copy in
    // art/population-batch-8). Its RESOLUTION is not its SIZE IN THE WORLD:
    // frameWidth/frameHeight below are the size it is drawn at, 0.3 world
    // units per image pixel, so the figure (242 px tall) stands ~72 units
    // high, just under the Doctor. Change an instance's scale to resize it;
    // the pixels are never touched.
    id: "baker-standing",
    label: "Baker (standing, full body)",
    category: "people",
    sprite: {
      frames: ["/game/npcs/baker-standing/static.png"],
      frameWidth: 34.2,
      frameHeight: 77.1,
      fps: 0,
      loop: false,
    },
    // Feet at the bottom of the figure (image y 251 of 257) and its horizontal
    // centre (x 61 of 114).
    anchor: { x: 0.54, y: 0.98 },
    // Figure top at image y 10: (252 - 10) * 0.3.
    headHeight: 72.6,
    defaultScale: 1,
  },
  {
    // The Doctor for NARRATIVE scenes only (e.g. the Baker's Bedroom): a static
    // picture placed like any other instance. It is exactly the frame the game
    // draws when the protagonist stands still facing south (ProtagonistSprite
    // with idle/south.png, 96x96, feet at the bottom centre). In gameplay the
    // Doctor is still the controllable protagonist, never this asset.
    id: DOCTOR_NARRATIVE_ASSET_ID,
    label: "Doctor - narrative position (idle, south)",
    category: "narrative",
    sprite: {
      frames: ["/game/characters/protagonist/idle/south.png"],
      frameWidth: 96,
      frameHeight: 96,
      fps: 0,
      loop: false,
    },
    anchor: { x: 0.5, y: 1 },
    // Same head point the Doctor's own speech bubble uses (14 transparent rows).
    headHeight: 82,
    defaultScale: 1,
  },
  // FIRST WORLD COLLECTIBLE. The id keeps its historical "-dev" suffix on
  // purpose: the placed instance (forest-medicinal-herb-dev-01) references it, and
  // renaming it would orphan that instance. Only the art is final now: the wild
  // plant growing from the soil (48x48), not the harvested bundle of the
  // inventory icon.
  {
    id: "medicinal-herb-dev",
    label: "Medicinal herb (world)",
    category: "resources",
    sprite: {
      frames: ["/game/resources/medicinal-herb/world.png"],
      frameWidth: 48,
      frameHeight: 48,
      fps: 0,
      loop: false,
    },
    // The soil patch ends at y38 of the 48 px frame and the plant is centred on
    // x23: the instance position is where it is rooted in the ground.
    anchor: { x: 0.48, y: 0.81 },
    // The plant is ~22x29 px at 1:1, about as tall as a chicken; 0.75 keeps it
    // a small ground plant next to the 66 px people.
    defaultScale: 0.75,
    collectibleItemId: "medicinal-herb",
  },
  // WORLD LEECH (art only for now): a living resource for a shallow cave pool.
  // Transparent on purpose, so it can be placed over the pool of the map. It is
  // NOT placed in any composition and NOT collectible yet.
  {
    id: "leech-world",
    label: "Leech (world, animated)",
    category: "resources",
    sprite: {
      frames: [0, 1, 2, 3].map((i) => `/game/resources/leech/idle/${i}.png`),
      frameWidth: 32,
      frameHeight: 32,
      fps: 3,
      loop: true,
    },
    anchor: { x: 0.5, y: 0.8 },
    defaultScale: 1,
  },
  // WORLD RESOURCES prepared for later placement (art only for now): the same
  // model as the Medicinal herb. Each declares the item it will give
  // (`collectibleItemId`), has no blocking collider, and is NOT placed in any
  // chapter. Placing one in the Decorator is what will make it collectible with
  // the existing collectible mechanism; nothing here adds a pick-up of its own.
  {
    id: "mint-world",
    label: "Mint (world)",
    category: "resources",
    sprite: {
      frames: ["/game/resources/mint/world.png"],
      frameWidth: 48,
      frameHeight: 48,
      fps: 0,
      loop: false,
    },
    // Soil patch ends at y39 of the 48 px frame; plant centred on x23.
    anchor: { x: 0.48, y: 0.81 },
    defaultScale: 0.75,
    collectibleItemId: "mint",
  },
  {
    id: "mushroom-world",
    label: "Mushroom (world)",
    category: "resources",
    sprite: {
      frames: ["/game/resources/mushroom/world.png"],
      frameWidth: 48,
      frameHeight: 48,
      fps: 0,
      loop: false,
    },
    // Cluster base ends at y39; centred on x22.
    anchor: { x: 0.46, y: 0.81 },
    defaultScale: 0.75,
    collectibleItemId: "mushroom",
  },
  {
    id: "resin-world",
    label: "Resin (world, on bark)",
    category: "resources",
    sprite: {
      frames: ["/game/resources/resin/world.png"],
      frameWidth: 48,
      frameHeight: 48,
      fps: 0,
      loop: false,
    },
    // Meant to be overlaid on an existing trunk or log, so it is anchored at
    // the middle of the patch rather than at a ground line.
    anchor: { x: 0.48, y: 0.49 },
    defaultScale: 1,
    collectibleItemId: "resin",
  },
  {
    id: "orange-world",
    label: "Orange (world, on branch)",
    category: "resources",
    sprite: {
      frames: ["/game/resources/orange/world.png"],
      frameWidth: 48,
      frameHeight: 48,
      fps: 0,
      loop: false,
    },
    // Meant to be overlaid on an existing fruit tree: anchored at the middle of
    // the branch.
    anchor: { x: 0.46, y: 0.5 },
    defaultScale: 1,
    collectibleItemId: "orange",
    // The sprite is a branch with THREE fallen oranges: one pick-up gives all.
    collectibleQuantity: 3,
  },
  {
    id: "orange-world-ambient",
    label: "Orange (world, on branch) - decoration only",
    category: "resources",
    // The same art as orange-world, but NOT collectible: the second branch of
    // Mill Farmland stays in the scene without giving any more oranges.
    sprite: {
      frames: ["/game/resources/orange/world.png"],
      frameWidth: 48,
      frameHeight: 48,
      fps: 0,
      loop: false,
    },
    anchor: { x: 0.46, y: 0.5 },
    defaultScale: 1,
  },
  // Reusable town population, PixelLab, style-matched to the existing NPCs.
  // Available in the Decorator only: none of them is placed in a chapter.
  {
    id: "elderly-man-with-jug",
    label: "Elderly man with jug",
    category: "people",
    sprite: {
      // 4-frame subtle idle (breathing, jug hand), calm cadence.
      frames: [0, 1, 2, 3].map(
        (i) => `/game/npcs/elderly-man-with-jug/idle/${i}.png`,
      ),
      frameWidth: 96,
      frameHeight: 96,
      fps: 3,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    headHeight: 80,
    defaultScale: 1,
    // Visible silhouette x27-58 y16-81 of the 96x96 frame (resting pose).
    defaultCollider: { offsetX: -21, offsetY: -80, width: 32, height: 66 },
  },
  {
    id: "elderly-woman-with-cane",
    label: "Elderly woman with cane",
    category: "people",
    sprite: {
      // 4-frame subtle idle (breathing, head); the cane stays planted.
      frames: [0, 1, 2, 3].map(
        (i) => `/game/npcs/elderly-woman-with-cane/idle/${i}.png`,
      ),
      frameWidth: 96,
      frameHeight: 96,
      fps: 3,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    headHeight: 77,
    defaultScale: 1,
    // Visible silhouette x31-57 y19-79 of the 96x96 frame.
    defaultCollider: { offsetX: -17, offsetY: -77, width: 27, height: 61 },
  },
  {
    id: "fruit-vegetable-seller-stall",
    label: "Fruit & vegetable seller (with stall)",
    category: "people",
    sprite: {
      // Static, seen from the front. One combined asset on purpose: the seller
      // stands behind her counter, so they are placed (and overlap) as one.
      frames: ["/game/npcs/fruit-vegetable-seller-stall/static.png"],
      frameWidth: 128,
      frameHeight: 96,
      fps: 0,
      loop: false,
    },
    anchor: { x: 0.5, y: 1 },
    headHeight: 81,
    defaultScale: 1,
    // Silhouette x20-106 y15-83; only the counter and crates block, not her.
    defaultCollider: { offsetX: -44, offsetY: -48, width: 87, height: 36 },
  },
  {
    id: "horse",
    label: "Horse",
    category: "animals",
    sprite: {
      // 4-frame calm idle (head, ear and tail), front-facing, never walks.
      frames: [0, 1, 2, 3].map((i) => `/game/npcs/horse/idle/${i}.png`),
      frameWidth: 128,
      frameHeight: 96,
      fps: 3,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Visible silhouette x44-76 y11-81 of the 128x96 frame.
    defaultCollider: { offsetX: -20, offsetY: -85, width: 33, height: 71 },
  },
  {
    id: "squirrel",
    label: "Squirrel",
    category: "animals",
    sprite: {
      // 2-frame tail idle.
      frames: [0, 1].map((i) => `/game/npcs/squirrel/idle/${i}.png`),
      frameWidth: 64,
      frameHeight: 64,
      fps: 2,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Visible silhouette x18-45 y17-50 of the 64x64 frame.
    defaultCollider: { offsetX: -14, offsetY: -47, width: 28, height: 34 },
  },
  // Two reusable working NPCs (PixelLab, style-matched to the existing ones).
  // Available in the Decorator only: neither is placed by code.
  {
    id: "beekeeper",
    label: "Beekeeper",
    category: "people",
    sprite: {
      // 4-frame work idle: the stick arm reaches toward the hive and the pale
      // smoke wisp (no flame) shifts. Slow on purpose.
      frames: [0, 1, 2, 3].map((i) => `/game/npcs/beekeeper/idle/${i}.png`),
      frameWidth: 96,
      frameHeight: 96,
      fps: 3,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    // Hood top is at y18 of the 96x96 frame (the smoke is not counted).
    headHeight: 78,
    defaultScale: 1,
    // Resting body x22-58 y18-80. Excludes the smoking stick and its smoke,
    // which reach out to x64-66 in some frames.
    defaultCollider: { offsetX: -26, offsetY: -78, width: 37, height: 63 },
  },
  {
    id: "farmer-hoeing",
    label: "Farmer (hoeing)",
    category: "people",
    sprite: {
      // 4-frame hoeing stroke: hoe raised, swinging down, at the soil, lifting.
      frames: [0, 1, 2, 3].map((i) => `/game/npcs/farmer-hoeing/idle/${i}.png`),
      frameWidth: 96,
      frameHeight: 96,
      fps: 4,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    // Head top is at y16 of the 96x96 frame.
    headHeight: 80,
    defaultScale: 1,
    // Body x30-59 y16-78. Excludes the hoe, which swings out to x67 and down
    // to y87 below his feet.
    defaultCollider: { offsetX: -18, offsetY: -80, width: 30, height: 63 },
  },
  {
    // Witch, seated at the bar of the tavern (PixelLab, approved). The stool is
    // NOT part of the sprite: it is already in the background, so the figure
    // is placed over it by hand. Three-quarter view facing screen-left, cloak
    // down behind her, a small mug in hand, hood shadowing the whole upper
    // face. Very slow breathing loop (the four files are already ordered so the
    // cycle has no jump).
    // Authoring asset: no collider and no interaction until she is placed.
    id: "witch-tavern-sitting",
    label: "Witch (sitting, drinking)",
    category: "people",
    sprite: {
      // The files already hold the loop: 0, 1, 2, then 1 again.
      frames: [0, 1, 2, 3].map(
        (i) => `/game/characters/witch/sit/tavern/${i}.png`,
      ),
      frameWidth: 96,
      frameHeight: 96,
      // ~550 ms per frame.
      fps: 1.8,
      loop: true,
    },
    // Union silhouette x20-70 y11-86 of the 96x96 frame: bottom-center of the
    // figure (the boots), like the other seated character.
    anchor: { x: 0.469, y: 0.896 },
    headHeight: 75,
    defaultScale: 1,
  },
  {
    // Witch's black cat, sitting. An asset of its own, independent of Witch:
    // it can be placed next to her, alone or elsewhere. Drawn facing screen-
    // right; use flipX on the instance to make it face left (the anchor is the
    // silhouette centre, so flipping does not move it).
    id: "witch-cat-sitting",
    label: "Witch's cat (sitting)",
    category: "animals",
    sprite: {
      // The files already hold the loop: 0, 1, 2, then 1 again.
      frames: [0, 1, 2, 3].map(
        (i) => `/game/characters/witch-cat/sit-idle/east/${i}.png`,
      ),
      frameWidth: 64,
      frameHeight: 64,
      // ~550 ms per frame.
      fps: 1.8,
      loop: true,
    },
    // Union silhouette x7-44 y9-50 of the 64x64 frame.
    anchor: { x: 0.398, y: 0.781 },
    headHeight: 41,
    defaultScale: 1,
  },
  // DAY 2 POSES (PixelLab, same identities as their Day 1 sprites). Authoring
  // assets: no collider, no interaction, not placed in any scene yet. Each is
  // drawn facing ONE side; use flipX on the instance for the other. The idles
  // are 1-px shifts of the approved pose (the file order 0,1,2,3 is the loop),
  // so the identity is the exact one of the still.
  {
    // The woodcutter, exhausted on a stump, axe on the ground. The stump and
    // the axe are part of the pose. Faces screen-right. Breathing + a tired
    // nod.
    id: "woodcutter-day2-tired",
    label: "Woodcutter (Day 2, tired on stump)",
    category: "people",
    sprite: {
      frames: [0, 1, 2, 3].map(
        (i) => `/game/npcs/woodcutter-day2-tired/idle/${i}.png`,
      ),
      frameWidth: 96,
      frameHeight: 96,
      // ~500 ms per frame.
      fps: 2,
      loop: true,
    },
    // Union silhouette x18-71 y25-80 of the 96x96 frame.
    anchor: { x: 0.469, y: 0.844 },
    headHeight: 55,
    defaultScale: 1,
  },
  {
    // The blacksmith, seated on a stool, holding his hurt hand. The stool is
    // part of the pose. Three-quarter front view, symmetric enough for flipX.
    // Breathing + a slight tremor of the held hand.
    id: "blacksmith-day2-hurt-hand",
    label: "Blacksmith (Day 2, seated, hurt hand)",
    category: "people",
    sprite: {
      frames: [0, 1, 2, 3].map(
        (i) => `/game/npcs/blacksmith-day2-hurt-hand/idle/${i}.png`,
      ),
      frameWidth: 96,
      frameHeight: 96,
      fps: 2,
      loop: true,
    },
    // Union silhouette x25-69 y20-84 of the 96x96 frame.
    anchor: { x: 0.495, y: 0.885 },
    headHeight: 64,
    defaultScale: 1,
  },
  {
    // The hoeing farmer, gravely ill, lying flat on his back seen from above:
    // head at the top of the frame, feet at the bottom, to lie along the
    // vertical bed of the granary. NO bed, straw or pillow: it goes over the
    // bed drawn in the background. Barefoot, legs relaxed and not symmetric,
    // one hand on his abdomen, head slightly tilted. Very slight breathing
    // (head and chest only; the legs never move).
    id: "farmer-hoeing-sick-lying",
    label: "Farmer (Day 2, sick, lying on his back)",
    category: "people",
    sprite: {
      frames: [0, 1, 2, 3].map(
        (i) => `/game/npcs/farmer-hoeing-sick-lying/idle/${i}.png`,
      ),
      frameWidth: 96,
      frameHeight: 128,
      // ~670 ms per frame: almost motionless.
      fps: 1.5,
      loop: true,
    },
    // Union silhouette x32-66 y9-118 of the 96x128 frame; the anchor is the
    // centre of the body.
    anchor: { x: 0.516, y: 0.5 },
    defaultScale: 1,
  },
  {
    // Witch in the Natural Cave: standing, pensive, a lit lantern in hand.
    // Side view facing screen-right, hood shadowing the whole face. Breathing,
    // a barely moving cloak and a lantern that sways one pixel.
    id: "witch-cave-lantern",
    label: "Witch (cave, lantern)",
    category: "people",
    sprite: {
      frames: [0, 1, 2, 3].map(
        (i) => `/game/characters/witch/cave-lantern/idle/${i}.png`,
      ),
      frameWidth: 96,
      frameHeight: 96,
      fps: 2,
      loop: true,
    },
    // Union silhouette x30-58 y13-82 of the 96x96 frame.
    anchor: { x: 0.464, y: 0.865 },
    headHeight: 69,
    defaultScale: 1,
  },
  {
    // The same child as villager-child-01, sitting on the ground and playing
    // with a small cloth doll (the doll is part of the pose). Breathing + a
    // nod over the doll.
    id: "villager-child-01-doll",
    label: "Villager child (1), sitting with a doll",
    category: "people",
    sprite: {
      frames: [0, 1, 2, 3].map(
        (i) => `/game/npcs/villager-child-01-doll/idle/${i}.png`,
      ),
      frameWidth: 96,
      frameHeight: 96,
      fps: 2,
      loop: true,
    },
    // Union silhouette x29-64 y24-78 of the 96x96 frame.
    anchor: { x: 0.49, y: 0.823 },
    headHeight: 55,
    defaultScale: 1,
  },
  {
    // The miner of Day 1 (injured-miner: headband, grey shirt, dark trousers),
    // recovered and back at work with the pickaxe. The bandage on his lower
    // leg is kept on purpose: the continuity between days. Loop: rest, raise,
    // strike, rest. Feet planted at y90 in every frame.
    id: "miner-recovering-working",
    label: "Miner (recovering, working, bandaged leg)",
    category: "people",
    sprite: {
      frames: [0, 1, 2, 3].map(
        (i) => `/game/npcs/miner-recovering-working/idle/${i}.png`,
      ),
      frameWidth: 128,
      frameHeight: 96,
      fps: 5,
      loop: true,
    },
    // Boots of the resting frame: x33-80, bottom y90 of the 128x96 frame.
    anchor: { x: 0.445, y: 0.948 },
    headHeight: 87,
    defaultScale: 1,
  },
  {
    // A wooden bucket full of fish, a prop for the fisherman. Static.
    id: "wooden-fish-bucket",
    label: "Wooden bucket with fish",
    category: "ambient",
    sprite: {
      frames: ["/game/npcs/wooden-fish-bucket/idle/0.png"],
      frameWidth: 48,
      frameHeight: 48,
      fps: 1,
      loop: false,
    },
    // Silhouette x14-34 y11-37 of the 48x48 frame.
    anchor: { x: 0.51, y: 0.79 },
    defaultScale: 1,
  },
  // AMBIENT LIFE PACK (PixelLab, art/ambient-life-pack). Registered so they can
  // be composed in the Decorator; NOTHING is placed in any composition. None has
  // a defaultCollider on purpose: collisions are authored later, and a visual
  // rectangle is not a physical one. Frames are listed in PLAYBACK order and may
  // repeat a file (one PNG per distinct pose).
  {
    // Seated man drinking, BUST ONLY (waist up): meant to sit behind a table
    // placed by the Decorator, which hides the cut. No table/stool drawn.
    // Review status: bucle v2 pending Kilian's final visual approval.
    id: "seated-man-tankard-bust",
    label: "Seated man with tankard (bust, behind a table)",
    category: "people",
    sprite: {
      // idle x5, blink, idle x4, tankard half way, up, drinking x2, down, idle.
      // Head and lower torso are identical in every frame.
      frames: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 2, 3, 4, 4, 3, 2, 0, 0].map(
        (i) => `/game/npcs/seated-man-tankard-bust/idle/${i}.png`,
      ),
      frameWidth: 48,
      frameHeight: 36,
      fps: 4,
      loop: true,
    },
    // Bottom edge = the waist cut; the body is centred on x22 of the 48 px frame.
    anchor: { x: 0.46, y: 1 },
    defaultScale: 1,
    // Head top is 33 px above the waist cut.
    headHeight: 33,
  },
  {
    // Adult woman mending a garment on a stool (stool and cloth are part of the
    // pose). Alternative to villager-sitting, which stays as it is. Only the
    // needle hand moves; head, torso, stool and cloth are identical per frame.
    id: "seamstress-sitting",
    label: "Seamstress (sitting, mending)",
    category: "people",
    sprite: {
      // rest x3, pull, pull, rest x2, push, push, rest x3
      frames: [0, 0, 0, 1, 1, 0, 0, 2, 2, 0, 0, 0].map(
        (i) => `/game/npcs/seamstress-sitting/idle/${i}.png`,
      ),
      frameWidth: 48,
      frameHeight: 72,
      fps: 3,
      loop: true,
    },
    // Feet / stool legs at y70 of the 72 px frame, body centred on x24.5.
    anchor: { x: 0.51, y: 0.97 },
    defaultScale: 1,
    headHeight: 67,
  },
  {
    // A small field mouse, static for now (idle sniffing is a later variant).
    id: "field-mouse",
    label: "Field mouse",
    category: "animals",
    sprite: {
      frames: ["/game/npcs/field-mouse/idle/0.png"],
      frameWidth: 48,
      frameHeight: 48,
      fps: 0,
      loop: false,
    },
    // Silhouette x11-37 y13-39 of the 48x48 frame (feet at y39).
    anchor: { x: 0.5, y: 0.81 },
    defaultScale: 1,
  },
  // Wind-swayed vegetation: 3 frames played 0,1,0,2. The lower ~40% of every
  // frame is pixel-identical, so the roots never move; only the upper leaves
  // shift by 1-2 px. Default scales keep them near the vegetation of the scene
  // backgrounds (a 60 px bush at 1:1 is almost as tall as a villager); change
  // the scale per instance in the Decorator if needed.
  {
    id: "bush-round",
    label: "Bush (round, wind)",
    category: "ambient",
    sprite: {
      frames: [0, 1, 0, 2].map((i) => `/game/ambient/bush-round/${i}.png`),
      frameWidth: 64,
      frameHeight: 64,
      fps: 2,
      loop: true,
    },
    // Silhouette x2-62 y5-62 of the 64x64 frame.
    anchor: { x: 0.5, y: 0.97 },
    defaultScale: 0.6,
  },
  {
    id: "bush-tall",
    label: "Bush (tall, wind)",
    category: "ambient",
    sprite: {
      frames: [0, 1, 0, 2].map((i) => `/game/ambient/bush-tall/${i}.png`),
      frameWidth: 64,
      frameHeight: 64,
      fps: 2,
      loop: true,
    },
    // Silhouette x15-48 of the 64x64 frame; it reaches both the top and bottom
    // edges (a known trait of this first version).
    anchor: { x: 0.49, y: 1 },
    defaultScale: 0.75,
  },
  {
    id: "grass-tuft",
    label: "Grass tuft (wind)",
    category: "ambient",
    sprite: {
      frames: [0, 1, 0, 2].map((i) => `/game/ambient/grass-tuft/${i}.png`),
      frameWidth: 32,
      frameHeight: 32,
      fps: 2,
      loop: true,
    },
    // Silhouette x3-28 y5-29 of the 32x32 frame.
    anchor: { x: 0.48, y: 0.9 },
    defaultScale: 1,
  },
  {
    id: "fern-weed",
    label: "Fern (wind)",
    category: "ambient",
    sprite: {
      frames: [0, 1, 0, 2].map((i) => `/game/ambient/fern-weed/${i}.png`),
      frameWidth: 32,
      frameHeight: 32,
      fps: 2,
      loop: true,
    },
    // Silhouette x1-31 y3-31 of the 32x32 frame; rooted in the lower middle.
    anchor: { x: 0.5, y: 0.88 },
    defaultScale: 1,
  },
  // FIRE (art/ambient-life-pack/L-fire). Colours sampled from the tavern's own
  // fireplace and candles. Neither blocks the Doctor (no defaultCollider) and
  // neither emits light: any glow is authored separately.
  {
    // Small campfire: stones and logs are identical in every frame (rows >= 31),
    // only the flame moves. 7 frames, played in order.
    id: "campfire",
    label: "Campfire (animated)",
    category: "ambient",
    sprite: {
      frames: [0, 1, 2, 3, 4, 5, 6].map(
        (i) => `/game/ambient/campfire/${i}.png`,
      ),
      frameWidth: 48,
      frameHeight: 48,
      fps: 8,
      loop: true,
    },
    // Silhouette x9-39 y5-42 of the 48x48 frame; anchored at the stone ring.
    anchor: { x: 0.5, y: 0.88 },
    defaultScale: 1,
  },
  {
    // Candle flame ONLY (the candle itself is part of the scene or of another
    // prop): 8x8, 4 shapes played upright, left, upright, tall, right, upright,
    // tall, left. Anchored on the wick.
    id: "candle-flame",
    label: "Candle flame (animated)",
    category: "ambient",
    sprite: {
      frames: [0, 1, 0, 2, 3, 0, 2, 1].map(
        (i) => `/game/ambient/candle-flame/${i}.png`,
      ),
      frameWidth: 8,
      frameHeight: 8,
      fps: 8,
      loop: true,
    },
    // The flame is x2-4 y0-6 of the 8x8 frame; the wick is just below it.
    anchor: { x: 0.44, y: 0.88 },
    defaultScale: 1,
  },
  // NPC PASS (art/npc-pass, approved by Kilian). New ids: the originals
  // (blacksmith, miner, merchant, merchant-table, miner-recovering-working)
  // are untouched. No colliders and no placements: both are authored in the
  // Decorator.
  {
    // Blacksmith bust WITHOUT anvil (the anvil is scenery). Hammer up, strike
    // down in front of the apron, back up: [high, high, up, strike, strike, up].
    id: "blacksmith-hammer",
    label: "Blacksmith - hammer (no anvil)",
    category: "people",
    sprite: {
      frames: [0, 0, 1, 2, 2, 1].map((i) => `/game/npcs/blacksmith-hammer/idle/${i}.png`),
      frameWidth: 96,
      frameHeight: 64,
      fps: 6,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
  },
  {
    // Miner swing that ends at knee height (no rock, no ground hit): the
    // rock is placed separately. Ready, wind-up, up, up, strike, strike, wind-up.
    id: "miner-pick-swing",
    label: "Miner - pick swing (knee height)",
    category: "people",
    sprite: {
      frames: [0, 1, 2, 2, 3, 3, 1].map((i) => `/game/npcs/miner-pick-swing/idle/${i}.png`),
      frameWidth: 96,
      frameHeight: 96,
      fps: 6,
      loop: true,
    },
    // Boots at y80/81 of the 96x96 frame, like the original miner.
    anchor: { x: 0.5, y: 0.85 },
    defaultScale: 1,
  },
  {
    // The recovering miner (grey headband and shirt, bandaged lower leg)
    // seated on a three-legged stool with the pickaxe on his shoulder. Two
    // frames only: slow breathing, [0,0,0,1,1].
    id: "miner-recovering-seated-stool",
    label: "Miner (recovering, seated on stool, pick on shoulder)",
    category: "people",
    sprite: {
      frames: [0, 0, 0, 1, 1].map(
        (i) => `/game/npcs/miner-recovering-seated-stool/idle/${i}.png`,
      ),
      frameWidth: 128,
      frameHeight: 96,
      fps: 3,
      loop: true,
    },
    // Stool/boots of the 128x96 frame (silhouette x19-90 y11-91).
    anchor: { x: 0.4, y: 0.94 },
    defaultScale: 1,
  },
  {
    // Humbler merchant: cloth cap, brown wool vest, linen shirt, no gold.
    // Same face and pose as the original; 7-frame gesture loop.
    id: "merchant-humble",
    label: "Merchant - humble",
    category: "people",
    sprite: {
      frames: [0, 1, 2, 3, 4, 5, 6].map((i) => `/game/npcs/merchant-humble/idle/${i}.png`),
      frameWidth: 96,
      frameHeight: 96,
      fps: 6,
      loop: true,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
  },
  {
    // Draper's table: folded linen and wool, bolt of cloth, thread basket,
    // measuring stick. Static.
    id: "merchant-table-draper",
    label: "Merchant table - draper",
    category: "ambient",
    sprite: {
      frames: ["/game/npcs/merchant-table-draper/static.png"],
      frameWidth: 96,
      frameHeight: 64,
      fps: 0,
      loop: false,
    },
    anchor: { x: 0.5, y: 1 },
    defaultScale: 1,
    // Same silhouette (x19-71 y9-55) and collider as the table it replaces.
    defaultCollider: { offsetX: -29, offsetY: -55, width: 53, height: 47 },
  },
  {
    // Day 2: the forest herb is a small pile; one pick-up gives TWO herbs (the
    // blacksmith's paste and the farmer's infusion). Same art and anchor as
    // medicinal-herb-dev, whose Day 1 pick-up still gives one.
    id: "medicinal-herb-pile",
    label: "Medicinal herb (world, pile of 2)",
    category: "resources",
    sprite: {
      frames: ["/game/resources/medicinal-herb/world.png"],
      frameWidth: 48,
      frameHeight: 48,
      fps: 0,
      loop: false,
    },
    anchor: { x: 0.48, y: 0.81 },
    defaultScale: 0.75,
    collectibleItemId: "medicinal-herb",
    collectibleQuantity: 2,
  },
  {
    // Village girl flying a kite. ONE composite on purpose: the string, kite
    // and tail are drawn from her hands (hand-built over the girl, 8 frames).
    id: "kite-girl",
    label: "Girl with a kite",
    category: "people",
    sprite: {
      frames: [0, 1, 2, 3, 4, 5, 6, 7].map((i) => `/game/npcs/kite-girl/idle/${i}.png`),
      frameWidth: 120,
      frameHeight: 136,
      fps: 6,
      loop: true,
    },
    // Her shoes: about x28, y120 of the 120x136 frame.
    anchor: { x: 0.24, y: 0.88 },
    defaultScale: 1,
  },
];

// FINAL-DAY (smartphone) VARIANTS of existing characters. They are ASSETS ONLY:
// nothing in the chapters uses them yet and they never replace the normal NPC.
// Each one is derived from its original definition, so the anchor, scale,
// collider and head height cannot drift apart, and only the art and the very
// slow two-frame cadence (a thumb tap, a head tilt) are its own. Frames live in
// /game/npcs/<id>-smartphone/idle/{0,1}.png at the same size as the original.
export const SMARTPHONE_VARIANT_BASE_IDS = [
  "woman-sweeping",
  "fisherman",
  "bartender",
  "baker",
  "villager-sitting",
  "woodcutter",
  "blacksmith",
  "woman-washing-clothes",
] as const;

const SMARTPHONE_FPS = 1.5;

const SMARTPHONE_VARIANTS: DecorAsset[] = SMARTPHONE_VARIANT_BASE_IDS.map(
  (baseId) => {
    const base = BASE_DECOR_ASSETS.find((asset) => asset.id === baseId);

    if (!base) {
      throw new Error(`Smartphone variant of an unknown asset: ${baseId}`);
    }

    return {
      ...base,
      id: `${baseId}-smartphone`,
      label: `${base.label} (smartphone)`,
      sprite: {
        ...base.sprite,
        frames: [0, 1].map(
          (i) => `/game/npcs/${baseId}-smartphone/idle/${i}.png`,
        ),
        fps: SMARTPHONE_FPS,
        loop: true,
      },
    };
  },
);

export const DECOR_ASSETS: DecorAsset[] = [
  ...BASE_DECOR_ASSETS,
  ...SMARTPHONE_VARIANTS,
];

export const DECOR_CATEGORY_ORDER: DecorCategory[] = [
  "people",
  "animals",
  "ambient",
  "resources",
  "narrative",
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
