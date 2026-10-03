"use client";

import { useEffect } from "react";

import { DialogueBubble } from "../../../game/dialogue/DialogueBubble";
import { SAMPLE_CONVERSATION } from "../../../game/dialogue/sampleConversation";
import { useDialogue } from "../../../game/dialogue/useDialogue";
import { useDirectionInput } from "../../../game/protagonist/useDirectionInput";
import { useIsClient } from "../../../game/ui/useIsClient";
import { ExteriorScene } from "../../../game/world/ExteriorScene";
import { WORLD_SCENES } from "../../../game/world/worldScenes";
import type {
  ExteriorWorldScene,
  SpawnPoint,
} from "../../../game/world/worldScenes";
import styles from "./page.module.css";

// Dialogue V1 preview. It reuses the REAL Plaza scene, the real Doctor and the
// pilot villager that already lives there, with the same camera as the game.
// The Doctor starts next to the villager; he can walk until the conversation
// starts, and is blocked while it is open (isPlaying = false).
const PLAZA = WORLD_SCENES.plaza as ExteriorWorldScene;
const SPAWN: SpawnPoint = { x: 640, y: 352, direction: "east" };

export default function DialoguePreviewPage() {
  const input = useDirectionInput();
  const isClient = useIsClient();
  const dialogue = useDialogue();
  const { active, start } = dialogue;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() === "t" && !event.repeat && !active) {
        start(SAMPLE_CONVERSATION);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, start]);

  return (
    <>
      {isClient ? (
        <ExteriorScene
          scene={PLAZA}
          spawn={SPAWN}
          input={input}
          isPlaying={!dialogue.active}
          onExit={() => undefined}
          onInteract={() => undefined}
          renderOverlay={(context) => {
            if (!dialogue.line) {
              return null;
            }

            const anchor = context.getSpeakerAnchor(dialogue.line.speaker);

            return anchor ? (
              <DialogueBubble
                anchorX={anchor.x}
                anchorY={anchor.y}
                frameWidth={context.frameWidth}
                frameHeight={context.frameHeight}
                visibleText={dialogue.visibleText}
                fullText={dialogue.fullText}
                isComplete={dialogue.isComplete}
              />
            ) : null;
          }}
        />
      ) : null}
      <aside className={styles.panel}>
        <strong>/dev/dialogue</strong>
        <span>
          WASD / flechas: mover al Doctor (bloqueado durante el diálogo)
        </span>
        <span>T: iniciar conversación de prueba</span>
        <span>Space: completar texto / siguiente línea / cerrar</span>
        <button
          type="button"
          className={styles.button}
          onClick={(event) => {
            // Keep keyboard focus off the button so Space does not click it.
            event.currentTarget.blur();
            dialogue.start(SAMPLE_CONVERSATION);
          }}
          disabled={dialogue.active}
        >
          Iniciar conversación (T)
        </button>
      </aside>
    </>
  );
}
