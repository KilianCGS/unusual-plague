import type { Direction } from "./useDirectionInput";

// Doctor's Run, the data of it. Walking and running change only the speed and
// the animation: the feet hitbox, colliders, interaction zones, feet anchor,
// scale and logical position are the same.
export const PROTAGONIST_WALK_SPEED = 160;
// +50% of the walk.
export const PROTAGONIST_RUN_SPEED = 240;
export const PROTAGONIST_WALK_FRAME_DURATION = 120;
export const PROTAGONIST_RUN_FRAME_DURATION = 90;
// A slow frame must not move the Doctor further than his 12px feet hitbox
// (run: 240 / 30 = 8px).
export const MAX_FRAME_DELTA_SECONDS = 1 / 30;

export type MovementState = "idle" | "walk" | "run";

export function getMovementState(
  isWalking: boolean,
  isRunning: boolean,
): MovementState {
  return isRunning ? "run" : isWalking ? "walk" : "idle";
}

type RunSpriteDirection = Exclude<Direction, "west">;

function runFrames(direction: RunSpriteDirection): string[] {
  return [0, 1, 2, 3].map(
    (frame) => `/game/characters/protagonist/run/${direction}/${frame}.png`,
  );
}

// There are no west run frames: west runs with the east ones, mirrored.
export const PROTAGONIST_RUN_SPRITES: Record<RunSpriteDirection, string[]> = {
  south: runFrames("south"),
  north: runFrames("north"),
  east: runFrames("east"),
};

export function getRunSprite(
  direction: Direction,
  frame: number,
): { src: string; mirrored: boolean } {
  const source: RunSpriteDirection = direction === "west" ? "east" : direction;

  return {
    src: PROTAGONIST_RUN_SPRITES[source][frame],
    mirrored: direction === "west",
  };
}

let runSpritesPreloaded = false;

// Loads the 12 real run frames once, so the first run does not flash an empty
// image (west needs none of its own).
export function preloadRunSprites() {
  if (runSpritesPreloaded || typeof window === "undefined") {
    return;
  }

  runSpritesPreloaded = true;

  for (const sources of Object.values(PROTAGONIST_RUN_SPRITES)) {
    for (const src of sources) {
      const image = new window.Image();

      image.src = src;
      void image.decode?.().catch(() => undefined);
    }
  }
}
