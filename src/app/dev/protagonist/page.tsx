"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

type Direction = "north" | "south" | "east" | "west";
type WalkFrame = 0 | 1 | 2 | 3;

const SCENE_WIDTH = 480;
const SCENE_HEIGHT = 270;
const SPRITE_SIZE = 96;
const SCENE_INSET = 12;
const PLAYER_SPEED = 120;
const WALK_FRAME_DURATION = 120;

const initialPlayer: {
  x: number;
  y: number;
  direction: Direction;
  isWalking: boolean;
  frame: WalkFrame;
} = {
  x: 240,
  y: 135,
  direction: "south",
  isWalking: false,
  frame: 0,
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

type KeyState = Record<Direction, boolean>;

const directionKeys: Record<string, Direction> = {
  ArrowUp: "north",
  w: "north",
  ArrowDown: "south",
  s: "south",
  ArrowLeft: "west",
  a: "west",
  ArrowRight: "east",
  d: "east",
};

const minX = SCENE_INSET + SPRITE_SIZE / 2;
const maxX = SCENE_WIDTH - SCENE_INSET - SPRITE_SIZE / 2;
const minY = SCENE_INSET + SPRITE_SIZE;
const maxY = SCENE_HEIGHT - SCENE_INSET;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function ProtagonistDevPage() {
  const [player, setPlayer] = useState(initialPlayer);
  const pressedDirectionsRef = useRef<KeyState>({
    north: false,
    south: false,
    east: false,
    west: false,
  });
  const directionPriorityRef = useRef<Direction[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const previousFrameTimeRef = useRef<number | null>(null);
  const walkFrameElapsedRef = useRef(0);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const direction = directionKeys[event.key];

      if (!direction) {
        return;
      }

      event.preventDefault();

      if (!pressedDirectionsRef.current[direction]) {
        pressedDirectionsRef.current[direction] = true;
      }

      directionPriorityRef.current = [
        ...directionPriorityRef.current.filter(
          (activeDirection) => activeDirection !== direction,
        ),
        direction,
      ];
    }

    function handleKeyUp(event: KeyboardEvent) {
      const direction = directionKeys[event.key];

      if (!direction) {
        return;
      }

      event.preventDefault();
      pressedDirectionsRef.current[direction] = false;
      directionPriorityRef.current = directionPriorityRef.current.filter(
        (activeDirection) => activeDirection !== direction,
      );
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    function updatePlayer(timestamp: number) {
      const previousFrameTime = previousFrameTimeRef.current ?? timestamp;
      const deltaTime = (timestamp - previousFrameTime) / 1000;
      previousFrameTimeRef.current = timestamp;

      const activeDirection = [...directionPriorityRef.current]
        .reverse()
        .find((direction) => pressedDirectionsRef.current[direction]);

      if (activeDirection) {
        setPlayer((currentPlayer) => {
          let nextX = currentPlayer.x;
          let nextY = currentPlayer.y;
          const distance = PLAYER_SPEED * deltaTime;

          switch (activeDirection) {
            case "north":
              nextY -= distance;
              break;
            case "south":
              nextY += distance;
              break;
            case "east":
              nextX += distance;
              break;
            case "west":
              nextX -= distance;
              break;
          }

          const clampedX = clamp(nextX, minX, maxX);
          const clampedY = clamp(nextY, minY, maxY);
          const didMove =
            clampedX !== currentPlayer.x || clampedY !== currentPlayer.y;

          if (didMove) {
            walkFrameElapsedRef.current += deltaTime * 1000;
          } else {
            walkFrameElapsedRef.current = 0;
          }

          let nextFrame: WalkFrame = didMove ? currentPlayer.frame : 0;

          if (didMove && walkFrameElapsedRef.current >= WALK_FRAME_DURATION) {
            const framesToAdvance = Math.floor(
              walkFrameElapsedRef.current / WALK_FRAME_DURATION,
            );

            walkFrameElapsedRef.current -=
              framesToAdvance * WALK_FRAME_DURATION;
            nextFrame = ((currentPlayer.frame + framesToAdvance) %
              protagonistWalkSprites[activeDirection].length) as WalkFrame;
          }

          if (
            clampedX === currentPlayer.x &&
            clampedY === currentPlayer.y &&
            currentPlayer.direction === activeDirection &&
            currentPlayer.isWalking === didMove &&
            currentPlayer.frame === nextFrame
          ) {
            return currentPlayer;
          }

          return {
            x: clampedX,
            y: clampedY,
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
    };
  }, []);

  const currentSpriteSrc = player.isWalking
    ? protagonistWalkSprites[player.direction][player.frame]
    : protagonistIdleSprites[player.direction];

  return (
    <main className={styles.page}>
      <section className={styles.wrapper}>
        <div
          className={styles.scene}
          style={{
            width: SCENE_WIDTH,
            height: SCENE_HEIGHT,
          }}
        >
          <div className={styles.floor} />
          <div className={styles.bounds} />

          <div
            className={styles.playerAnchor}
            style={{
              left: player.x,
              top: player.y,
            }}
          >
            <Image
              src={currentSpriteSrc}
              alt={`Protagonist ${player.isWalking ? "walk" : "idle"} ${player.direction} sprite`}
              width={SPRITE_SIZE}
              height={SPRITE_SIZE}
              priority
              className={styles.playerSprite}
            />
          </div>
        </div>
      </section>
    </main>
  );
}