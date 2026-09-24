"use client";

import { ProtagonistSprite } from "../../../game/protagonist/ProtagonistSprite";
import { useProtagonistController } from "../../../game/protagonist/useProtagonistController";
import styles from "./page.module.css";

const SCENE_WIDTH = 480;
const SCENE_HEIGHT = 270;
const SPRITE_SIZE = 96;

export default function ProtagonistDevPage() {
  const { player, currentSpriteSrc, spriteSize } = useProtagonistController({
    sceneWidth: SCENE_WIDTH,
    sceneHeight: SCENE_HEIGHT,
    initialX: 240,
    initialY: 135,
    spriteSize: SPRITE_SIZE,
  });

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
          <ProtagonistSprite
            x={player.x}
            y={player.y}
            spriteSrc={currentSpriteSrc}
            spriteSize={spriteSize}
            direction={player.direction}
            isWalking={player.isWalking}
          />
        </div>
      </section>
    </main>
  );
}