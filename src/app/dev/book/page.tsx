"use client";

import { useState } from "react";

import { BookOverlay } from "../../../game/book/BookOverlay";
import { useBookHotkeys } from "../../../game/book/useBookHotkeys";
import { useDirectionInput } from "../../../game/protagonist/useDirectionInput";
import { useIsClient } from "../../../game/ui/useIsClient";
import { ExteriorScene } from "../../../game/world/ExteriorScene";
import { WORLD_SCENES } from "../../../game/world/worldScenes";
import type {
  ExteriorWorldScene,
  SpawnPoint,
} from "../../../game/world/worldScenes";
import styles from "./page.module.css";

// Compendium V1 preview. A real scene (the Plaza) with the real Doctor; Q
// opens / closes the book on top of it, Esc closes it. While it is open the
// Doctor cannot walk (isPlaying = false) and the world stays visible, dimmed.
const PLAZA = WORLD_SCENES.plaza as ExteriorWorldScene;
const SPAWN: SpawnPoint = { x: 640, y: 352, direction: "east" };

export default function BookPreviewPage() {
  const input = useDirectionInput();
  const isClient = useIsClient();
  const [open, setOpen] = useState(false);

  useBookHotkeys({ open, setOpen });

  return (
    <>
      {isClient ? (
        <ExteriorScene
          scene={PLAZA}
          spawn={SPAWN}
          input={input}
          isPlaying={!open}
          onExit={() => undefined}
          onInteract={() => undefined}
        />
      ) : null}
      {open ? <BookOverlay /> : null}
      <aside className={styles.panel}>
        <strong>/dev/book</strong>
        <span>
          WASD / flechas: mover al Doctor (bloqueado con el libro abierto)
        </span>
        <span>Q: abrir / cerrar el Compendio · Esc: cerrar</span>
        <span>
          Ratón: portada, pestañas y esquinas inferiores de las páginas
        </span>
      </aside>
    </>
  );
}
