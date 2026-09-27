import type { AnchorHitbox } from "../../../game/collision";
import type { Direction } from "../../../game/protagonist/useProtagonistController";

// DEV-ONLY scene composition model, kept apart on purpose:
//   DecorAsset        reusable definition (sprite, anchor, default collider)
//   DecorInstance     one placement of an asset in one scene + chapter
//   DecorComposition  the instances of ONE scene + chapter (independent, no
//                     inheritance between chapters)
// What an interaction DOES is never described here: an interaction only has an
// id and a zone (where / from which facing).

export type DecorCategory =
  | "people"
  | "animals"
  | "ambient"
  | "resources"
  | "test";

export type DecorAsset = {
  id: string;
  label: string;
  category: DecorCategory;
  // Convention V1: ONE PNG PER FRAME, all frames the same size, played in
  // order. This is how the project's real assets come (protagonist walk
  // 0.png..3.png, PixelLab animation frames). One frame = static.
  sprite: {
    frames: string[];
    frameWidth: number;
    frameHeight: number;
    fps: number;
    loop: boolean;
  };
  // Visual anchor inside a frame, normalized 0..1: {0.5, 1} = bottom-center.
  // The instance position is the world point this anchor sits on.
  anchor: { x: number; y: number };
  defaultScale?: number;
  // Blocking area relative to the anchor, in unscaled logical units.
  defaultCollider?: AnchorHitbox;
};

export type DecorInteraction = {
  // Names WHAT is interacted with; resolved by a later layer.
  interactionId: string;
  // Zone relative to the instance anchor (it follows the instance).
  zone: { offsetX: number; offsetY: number; width: number; height: number };
  // Omitted = any facing.
  requiredDirection?: Direction;
};

export type DecorInstance = {
  // Stable inside its composition. NOT an assetId, characterId or
  // interactionId.
  instanceId: string;
  assetId: string;
  // Anchor position in WORLD logical units.
  x: number;
  y: number;
  scale: number;
  flipX: boolean;
  colliderEnabled: boolean;
  // Added to the depth (anchor Y) for things that are not on the floor.
  zOffset: number;
  interaction?: DecorInteraction;
};

export type DecorComposition = {
  sceneId: string;
  chapterId: string;
  instances: DecorInstance[];
};
