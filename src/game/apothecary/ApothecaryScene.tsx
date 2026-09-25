"use client";

import { useEffect, useState } from "react";

import { apothecaryInteriorColliders } from "./apothecaryInteriorGeometry";
import { SHOW_COLLISION_DEBUG } from "../debugFlags";
import { ProtagonistSprite } from "../protagonist/ProtagonistSprite";
import type { DirectionInputHandle } from "../protagonist/useDirectionInput";
import {
  useProtagonistController,
  type Direction,
} from "../protagonist/useProtagonistController";
import {
  useTransitionTrigger,
  type TransitionExit,
} from "../world/useTransitionTrigger";
import styles from "./ApothecaryScene.module.css";

const SCENE_WIDTH = 480;
const SCENE_HEIGHT = 270;
const SPRITE_SIZE = 96;
const SCENE_PADDING = 48;
const MAX_SCENE_SCALE = 4;
const DEFAULT_SPAWN: { x: number; y: number; direction: Direction } = {
  x: 240,
  y: 220,
  direction: "south",
};
const NO_EXITS: TransitionExit[] = [];

function getSceneScale() {
  if (typeof window === "undefined") {
    return 1;
  }

  const availableWidth = Math.max(window.innerWidth - SCENE_PADDING, 320);
  const availableHeight = Math.max(window.innerHeight - SCENE_PADDING, 180);

  return Math.min(
    availableWidth / SCENE_WIDTH,
    availableHeight / SCENE_HEIGHT,
    MAX_SCENE_SCALE,
  );
}

// All props are optional: rendered alone it behaves exactly as before. Inside
// GameWorld it receives its spawn, a shared keyboard input, whether the game is
// playable, and its exits.
export function ApothecaryScene({
  spawn = DEFAULT_SPAWN,
  input,
  isPlaying = true,
  exits = NO_EXITS,
  onExit,
}: {
  spawn?: { x: number; y: number; direction: Direction };
  input?: DirectionInputHandle;
  isPlaying?: boolean;
  exits?: TransitionExit[];
  onExit?: (exitName: string) => void;
}) {
  const [sceneScale, setSceneScale] = useState(1);
  const { player, playerFeetHitbox, currentSpriteSrc, spriteSize } =
    useProtagonistController({
      sceneWidth: SCENE_WIDTH,
      sceneHeight: SCENE_HEIGHT,
      initialX: spawn.x,
      initialY: spawn.y,
      initialDirection: spawn.direction,
      spriteSize: SPRITE_SIZE,
      sceneColliders: apothecaryInteriorColliders,
      input,
      inputEnabled: isPlaying,
    });

  useTransitionTrigger({
    feetHitbox: playerFeetHitbox,
    exits,
    enabled: isPlaying && onExit !== undefined,
    onExit: (exitName) => onExit?.(exitName),
  });

  useEffect(() => {
    const updateSceneScale = () => {
      setSceneScale(getSceneScale());
    };

    updateSceneScale();
    window.addEventListener("resize", updateSceneScale);

    return () => {
      window.removeEventListener("resize", updateSceneScale);
    };
  }, []);

  return (
    <main className={styles.page}>
      <section>
        <div
          className={styles.viewport}
          style={{
            ["--scene-scale" as string]: sceneScale,
          }}
        >
          <div className={styles.logicalScene}>
            <ProtagonistSprite
              x={player.x}
              y={player.y}
              spriteSrc={currentSpriteSrc}
              spriteSize={spriteSize}
              direction={player.direction}
              isWalking={player.isWalking}
            />
            {SHOW_COLLISION_DEBUG ? (
              <>
                {apothecaryInteriorColliders.map((collider) => (
                  <div
                    key={collider.id}
                    style={{
                      position: "absolute",
                      left: collider.x,
                      top: collider.y,
                      width: collider.width,
                      height: collider.height,
                      boxSizing: "border-box",
                      border: "1px solid #ff5c5c",
                      background: "rgba(255, 92, 92, 0.28)",
                      pointerEvents: "none",
                    }}
                  />
                ))}
                {exits.map((exit) => (
                  <div
                    key={exit.name}
                    style={{
                      position: "absolute",
                      left: exit.zone.x,
                      top: exit.zone.y,
                      width: exit.zone.width,
                      height: exit.zone.height,
                      boxSizing: "border-box",
                      border: "1px solid #ffd60a",
                      background: "rgba(255, 214, 10, 0.26)",
                      pointerEvents: "none",
                    }}
                  />
                ))}
                <div
                  style={{
                    position: "absolute",
                    left: playerFeetHitbox.x,
                    top: playerFeetHitbox.y,
                    width: playerFeetHitbox.width,
                    height: playerFeetHitbox.height,
                    boxSizing: "border-box",
                    border: "1px solid #4de7ff",
                    background: "rgba(77, 231, 255, 0.3)",
                    pointerEvents: "none",
                  }}
                />
              </>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
