"use client";

import { useEffect, useRef, useState } from "react";

import {
  collidesWithScene,
  getHitboxRect,
  isRectWithinWorld,
  type AnchorHitbox,
  type SceneCollider,
} from "../collision";
import {
  useDirectionInput,
  type Direction,
  type DirectionInputHandle,
} from "./useDirectionInput";

export type { Direction };
export type WalkFrame = 0 | 1 | 2 | 3;

export type ProtagonistState = {
  x: number;
  y: number;
  direction: Direction;
  isWalking: boolean;
  frame: WalkFrame;
};

type ProtagonistControllerOptions = {
  sceneWidth: number;
  sceneHeight: number;
  initialX: number;
  initialY: number;
  initialDirection?: Direction;
  spriteSize?: number;
  playerSpeed?: number;
  walkFrameDuration?: number;
  sceneColliders?: SceneCollider[];
  feetHitbox?: AnchorHitbox;
  // Keyboard state owned by a parent that outlives this controller (so held
  // keys survive a scene change). When omitted the controller listens to the
  // keyboard itself, exactly as before.
  input?: DirectionInputHandle;
  // While false the player cannot move, but the keyboard state keeps being
  // tracked: a key that is still held resumes walking as soon as it is true.
  inputEnabled?: boolean;
};

const DEFAULT_SPRITE_SIZE = 96;
const DEFAULT_PLAYER_SPEED = 120;
const DEFAULT_WALK_FRAME_DURATION = 120;
const EMPTY_COLLIDERS: SceneCollider[] = [];

export const PROTAGONIST_FEET_HITBOX: AnchorHitbox = {
  offsetX: -12,
  offsetY: -19,
  width: 24,
  height: 12,
};

const protagonistIdleSprites: Record<Direction, string> = {
  north: "/game/characters/protagonist/idle/north.png",
  south: "/game/characters/protagonist/idle/south.png",
  east: "/game/characters/protagonist/idle/east.png",
  west: "/game/characters/protagonist/idle/west.png",
};

const protagonistWalkSprites: Record<Direction, string[]> = {
  north: [
    "/game/characters/protagonist/walk/north/0.png",
    "/game/characters/protagonist/walk/north/1.png",
    "/game/characters/protagonist/walk/north/2.png",
    "/game/characters/protagonist/walk/north/3.png",
  ],
  south: [
    "/game/characters/protagonist/walk/south/0.png",
    "/game/characters/protagonist/walk/south/1.png",
    "/game/characters/protagonist/walk/south/2.png",
    "/game/characters/protagonist/walk/south/3.png",
  ],
  east: [
    "/game/characters/protagonist/walk/east/0.png",
    "/game/characters/protagonist/walk/east/1.png",
    "/game/characters/protagonist/walk/east/2.png",
    "/game/characters/protagonist/walk/east/3.png",
  ],
  west: [
    "/game/characters/protagonist/walk/west/0.png",
    "/game/characters/protagonist/walk/west/1.png",
    "/game/characters/protagonist/walk/west/2.png",
    "/game/characters/protagonist/walk/west/3.png",
  ],
};

export function useProtagonistController({
  sceneWidth,
  sceneHeight,
  initialX,
  initialY,
  initialDirection = "south",
  spriteSize = DEFAULT_SPRITE_SIZE,
  playerSpeed = DEFAULT_PLAYER_SPEED,
  walkFrameDuration = DEFAULT_WALK_FRAME_DURATION,
  sceneColliders = EMPTY_COLLIDERS,
  feetHitbox = PROTAGONIST_FEET_HITBOX,
  input,
  inputEnabled = true,
}: ProtagonistControllerOptions) {
  const [player, setPlayer] = useState<ProtagonistState>({
    x: initialX,
    y: initialY,
    direction: initialDirection,
    isWalking: false,
    frame: 0,
  });
  // Own keyboard listeners only when no external input handle was given.
  const ownInput = useDirectionInput({ listen: input === undefined });
  const directionInput = input ?? ownInput;
  const inputEnabledRef = useRef(inputEnabled);
  const animationFrameRef = useRef<number | null>(null);
  const previousFrameTimeRef = useRef<number | null>(null);
  const walkFrameElapsedRef = useRef(0);

  useEffect(() => {
    inputEnabledRef.current = inputEnabled;
  }, [inputEnabled]);

  useEffect(() => {
    const { pressedRef, priorityRef } = directionInput;

    function updatePlayer(timestamp: number) {
      const previousFrameTime = previousFrameTimeRef.current ?? timestamp;
      const deltaTime = (timestamp - previousFrameTime) / 1000;
      previousFrameTimeRef.current = timestamp;

      const activeDirection = inputEnabledRef.current
        ? [...priorityRef.current]
            .reverse()
            .find((direction) => pressedRef.current[direction])
        : undefined;

      if (activeDirection) {
        setPlayer((currentPlayer) => {
          let proposedX = currentPlayer.x;
          let proposedY = currentPlayer.y;
          const distance = playerSpeed * deltaTime;

          switch (activeDirection) {
            case "north":
              proposedY -= distance;
              break;
            case "south":
              proposedY += distance;
              break;
            case "east":
              proposedX += distance;
              break;
            case "west":
              proposedX -= distance;
              break;
          }

          const proposedFeetHitbox = getHitboxRect(
            proposedX,
            proposedY,
            feetHitbox,
          );
          const isBlocked =
            !isRectWithinWorld(proposedFeetHitbox, sceneWidth, sceneHeight) ||
            collidesWithScene(proposedFeetHitbox, sceneColliders);
          const didMove =
            !isBlocked &&
            (proposedX !== currentPlayer.x || proposedY !== currentPlayer.y);

          if (didMove) {
            walkFrameElapsedRef.current += deltaTime * 1000;
          } else {
            walkFrameElapsedRef.current = 0;
          }

          let nextFrame: WalkFrame = 0;

          if (didMove) {
            nextFrame = currentPlayer.frame;

            if (walkFrameElapsedRef.current >= walkFrameDuration) {
              const framesToAdvance = Math.floor(
                walkFrameElapsedRef.current / walkFrameDuration,
              );

              walkFrameElapsedRef.current -= framesToAdvance * walkFrameDuration;
              nextFrame = ((currentPlayer.frame + framesToAdvance) %
                protagonistWalkSprites[activeDirection].length) as WalkFrame;
            }
          }

          if (
            (!didMove ||
              (proposedX === currentPlayer.x && proposedY === currentPlayer.y)) &&
            currentPlayer.direction === activeDirection &&
            !currentPlayer.isWalking &&
            currentPlayer.frame === nextFrame
          ) {
            return currentPlayer;
          }

          return {
            x: didMove ? proposedX : currentPlayer.x,
            y: didMove ? proposedY : currentPlayer.y,
            direction: activeDirection,
            isWalking: didMove,
            frame: nextFrame,
          };
        });
      } else {
        setPlayer((currentPlayer) => {
          walkFrameElapsedRef.current = 0;

          if (!currentPlayer.isWalking && currentPlayer.frame === 0) {
            return currentPlayer;
          }

          return {
            ...currentPlayer,
            isWalking: false,
            frame: 0,
          };
        });
      }

      animationFrameRef.current = window.requestAnimationFrame(updatePlayer);
    }

    animationFrameRef.current = window.requestAnimationFrame(updatePlayer);

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      previousFrameTimeRef.current = null;
      walkFrameElapsedRef.current = 0;
    };
  }, [
    directionInput,
    feetHitbox,
    playerSpeed,
    sceneColliders,
    sceneHeight,
    sceneWidth,
    walkFrameDuration,
  ]);

  const currentSpriteSrc = player.isWalking
    ? protagonistWalkSprites[player.direction][player.frame]
    : protagonistIdleSprites[player.direction];
  const playerFeetHitbox = getHitboxRect(player.x, player.y, feetHitbox);

  return {
    player,
    playerFeetHitbox,
    currentSpriteSrc,
    spriteSize,
  };
}
