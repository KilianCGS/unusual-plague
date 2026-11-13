import type { Direction } from "./useDirectionInput";

// Doctor's Run, the data of it. Walking and running change only the speed and
// the animation: the feet hitbox, colliders, interaction zones, feet anchor,
// scale and logical position are the same.
export const PROTAGONIST_WALK_SPEED = 160;
// +50% of the walk.
export const PROTAGONIST_RUN_SPEED = 240;
export const PROTAGONIST_WALK_FRAME_DURATION = 120;
// The run is an 8-frame cycle (contact, absorption, push-off and flight, once
// per leg): 8 x 60 ms = 480 ms, the same cadence as the 4 x 120 ms walk.
export const PROTAGONIST_RUN_FRAME_DURATION = 60;
export const PROTAGONIST_RUN_FRAME_COUNT = 8;
// 12 frames x 60 ms = 720 ms a stride: a lighter, less hurried run to the north.
export const PROTAGONIST_RUN_NORTH_FRAME_DURATION = 60;

// Not every direction has the same number of frames: the sideways steps and the
// run to the east and north got more frames so they read smoother. West walks
// with its own frames and runs with the east ones, mirrored.
export const PROTAGONIST_WALK_FRAME_COUNTS = {
  north: 4,
  south: 4,
  east: 8,
  west: 8,
} as const satisfies Record<Direction, number>;

export const PROTAGONIST_RUN_FRAME_COUNTS = {
  south: 8,
  north: 12,
  east: 12,
} as const;

export function getWalkFrameCount(direction: Direction): number {
  return PROTAGONIST_WALK_FRAME_COUNTS[direction];
}

export function getRunFrameCount(direction: Direction): number {
  return PROTAGONIST_RUN_FRAME_COUNTS[direction === "west" ? "east" : direction];
}

// Time per frame. A longer cycle keeps a little more time (walk 8 frames: 70 ms
// = 560 ms a step; run 12 frames: 45 ms = 540 ms) so more frames do not mean a
// faster-looking gait.
export function getFrameDuration(
  running: boolean,
  frameCount: number,
  walkFrameDuration: number = PROTAGONIST_WALK_FRAME_DURATION,
  direction?: Direction,
): number {
  if (running) {
    // The 12-frame run to the north (2026-11-13) read as hurried next to the south one: its
    // frames last longer, so the whole cycle is ~720 ms (the south run is 480 ms).
    if (direction === "north" && frameCount > PROTAGONIST_RUN_FRAME_COUNT) {
      return PROTAGONIST_RUN_NORTH_FRAME_DURATION;
    }

    return frameCount > PROTAGONIST_RUN_FRAME_COUNT
      ? Math.round((PROTAGONIST_RUN_FRAME_DURATION * 3) / 4)
      : PROTAGONIST_RUN_FRAME_DURATION;
  }

  return frameCount > 4
    ? Math.round((walkFrameDuration * 7) / 12)
    : walkFrameDuration;
}
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
  return Array.from(
    { length: PROTAGONIST_RUN_FRAME_COUNTS[direction] },
    (_, frame) => `/game/characters/protagonist/run/${direction}/${frame}.png`,
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

// Loads the real run frames (south 8, north 12, east 12) once, so the first run does not flash an empty
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

// A small vertical body bob on top of the frames (visual only: the feet anchor,
// hitbox and logical position never change). The long coat hides the legs, so the
// sideways walk and the run to the north read as a slide; a rise and fall twice per
// cycle (lowest at each foot contact, highest as the legs pass) gives them a gait.
// Returns the offset in logical pixels (negative = up).
const BOB_AMPLITUDE = { walk: 1.1, run: 1.6, runNorth: 1.0 } as const;

export function getMovementBob(
  direction: Direction,
  isWalking: boolean,
  isRunning: boolean,
  frame: number,
): number {
  if (!isWalking && !isRunning) return 0;
  const frameCount = isRunning ? getRunFrameCount(direction) : getWalkFrameCount(direction);
  const phase = (frame % frameCount) / frameCount;
  const amplitude = isRunning
    ? direction === "north"
      ? BOB_AMPLITUDE.runNorth
      : BOB_AMPLITUDE.run
    : BOB_AMPLITUDE.walk;
  return -amplitude * Math.abs(Math.sin(2 * Math.PI * phase));
}
