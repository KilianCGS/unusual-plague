"use client";

import { useEffect, useRef } from "react";

import type { Direction } from "../protagonist/useDirectionInput";
import { getRunFrameCount, getWalkFrameCount } from "../protagonist/protagonistRun";
import type { SceneId } from "../world/worldScenes";
import { playSound } from "./audioPlayer";
import { footstepSoundAt } from "./footstepSurface";
import { useStepTuning } from "./stepTuning";

// The frames of the walk where a foot is planted on the ground. 2026-11-17 (Kilian: the walking steps were off, the
// running ones perfect): measured on the sprites (public/game/characters/protagonist/walk) instead of by eye.
//  * north / south (4 frames): frames 0 and 2 are the passing poses (both feet level); the feet are planted on
//    frames 1 and 3 (the lower foot alternates there), so the steps were half a beat early.
//  * east (8 frames): the widest strides, with the body at its lowest, are frames 2 and 7 (it was 2 and 6).
//  * west (8 frames, its own drawing): the widest stride and the lowest body are frames 3 and 4, and the other
//    foot lands at 7 (it was 2 and 6).
// Running plants one foot per half cycle (frames 0 and count / 2).
const WALK_FOOTFALLS: Record<Direction, readonly number[]> = {
  north: [1, 3],
  south: [1, 3],
  east: [2, 7],
  west: [3, 7],
};

// One step sound per footfall, only on the frames where the Doctor's foot lands. Nothing plays
// while he stands still or is blocked.
export function useFootsteps(
  player: { x: number; y: number; frame: number; isWalking: boolean; isRunning: boolean; direction: Direction },
  sceneId: SceneId,
) {
  const lastFrame = useRef<number | null>(null);
  const tuning = useStepTuning();
  const lastStepAt = useRef(-Infinity);
  const latest = useRef({ x: player.x, y: player.y });
  useEffect(() => {
    latest.current = { x: player.x, y: player.y };
  });

  // The step beat (stepTuning.ts): while the Doctor walks, one step every X ms, ignoring the sprite frames.
  useEffect(() => {
    if (!tuning.enabled || !player.isWalking) return;
    const every = player.isRunning ? tuning.runMs : tuning.walkMs;
    const rate = player.isRunning ? tuning.runRate : 1;
    const step = () => {
      // No double step when the walking state flickers against an obstacle: at least 60% of the beat since the last one.
      const now = performance.now();
      if (now - lastStepAt.current < every * 0.6) return;
      lastStepAt.current = now;
      playSound(footstepSoundAt(sceneId, latest.current.x, latest.current.y), { rate });
    };
    step();
    const timer = window.setInterval(step, every);
    return () => window.clearInterval(timer);
  }, [tuning, player.isWalking, player.isRunning, sceneId]);

  useEffect(() => {
    if (tuning.enabled) return;
    if (!player.isWalking) {
      lastFrame.current = null;
      return;
    }
    if (lastFrame.current === player.frame) return;
    lastFrame.current = player.frame;
    const feet = player.isRunning
      ? [0, Math.floor(getRunFrameCount(player.direction) / 2)]
      : WALK_FOOTFALLS[player.direction].filter((frame) => frame < getWalkFrameCount(player.direction));
    if (feet.includes(player.frame)) {
      playSound(footstepSoundAt(sceneId, player.x, player.y), { rate: player.isRunning ? 1.15 : 1 });
    }
  }, [tuning.enabled, player.frame, player.isWalking, player.isRunning, player.direction, player.x, player.y, sceneId]);
}
