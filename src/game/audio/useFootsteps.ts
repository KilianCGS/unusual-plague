"use client";

import { useEffect, useRef } from "react";

import type { Direction } from "../protagonist/useDirectionInput";
import { getRunFrameCount, getWalkFrameCount } from "../protagonist/protagonistRun";
import type { SceneId } from "../world/worldScenes";
import { playSound } from "./audioPlayer";
import { footstepSoundAt } from "./footstepSurface";

// The frames of the walk where a foot is planted on the ground (picked by eye from the sprites;
// tune here). The 4-frame walks (north, south) plant a foot on frames 0 and 2; the 8-frame side
// walks (east, west) on 2 and 6. Running plants one foot per half cycle.
const WALK_FOOTFALLS: Record<Direction, readonly number[]> = {
  north: [0, 2],
  south: [0, 2],
  east: [2, 6],
  west: [2, 6],
};

// One step sound per footfall, only on the frames where the Doctor's foot lands. Nothing plays
// while he stands still or is blocked.
export function useFootsteps(
  player: { x: number; y: number; frame: number; isWalking: boolean; isRunning: boolean; direction: Direction },
  sceneId: SceneId,
) {
  const lastFrame = useRef<number | null>(null);

  useEffect(() => {
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
  }, [player.frame, player.isWalking, player.isRunning, player.direction, player.x, player.y, sceneId]);
}
