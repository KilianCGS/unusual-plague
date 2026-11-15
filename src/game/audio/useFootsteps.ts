"use client";

import { useEffect, useRef } from "react";

import type { Direction } from "../protagonist/useDirectionInput";
import { getRunFrameCount, getWalkFrameCount } from "../protagonist/protagonistRun";
import { playSound } from "./audioPlayer";
import type { SoundId } from "./soundManifest";

// One step sound per footfall: the Doctor's walk cycle has two footfalls, at its first
// frame and at its middle frame, so the sound follows the animation (and its speed) on
// its own. Nothing plays while he stands still or is blocked.
export function useFootsteps(
  player: { frame: number; isWalking: boolean; isRunning: boolean; direction: Direction },
  sound: SoundId,
) {
  const lastFrame = useRef<number | null>(null);

  useEffect(() => {
    if (!player.isWalking) {
      lastFrame.current = null;
      return;
    }
    if (lastFrame.current === player.frame) return;
    lastFrame.current = player.frame;
    const count = player.isRunning ? getRunFrameCount(player.direction) : getWalkFrameCount(player.direction);
    if (player.frame === 0 || player.frame === Math.floor(count / 2)) {
      playSound(sound, { rate: player.isRunning ? 1.15 : 1 });
    }
  }, [player.frame, player.isWalking, player.isRunning, player.direction, sound]);
}
