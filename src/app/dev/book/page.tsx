"use client";

import { useState } from "react";

import { BookOverlay } from "../../../game/book/BookOverlay";
import type { BookSectionId } from "../../../game/book/bookPages";
import { RECIPES } from "../../../game/crafting/recipes";
import { addItem, createEmptyInventory } from "../../../game/inventory/inventory";
import type { InventoryItemId } from "../../../game/inventory/inventory";
import { AILMENTS } from "../../../game/book/ailments";
import type { Language } from "../../../game/i18n/types";
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

// 2026-11-17 (Kilian): the book here always has EVERY recipe discovered, so each preparation page (its engraving,
// description, use, ingredients and steps) can be looked at. The bag is empty ("some ingredients are missing") or
// holds one of every ingredient ("ingredients available") to see both lines.
const ALL_RECIPE_IDS: ReadonlySet<string> = new Set(RECIPES.map((recipe) => recipe.id));
const ALL_INPUT_ITEM_IDS = [...new Set(RECIPES.flatMap((recipe) => recipe.inputs.map((input) => input.itemId)))];
const stockedInventory = () =>
  ALL_INPUT_ITEM_IDS.reduce(
    (bag, itemId) => addItem(bag, itemId as InventoryItemId, 3) ?? bag,
    createEmptyInventory(ALL_INPUT_ITEM_IDS.length + 4),
  );

export default function BookPreviewPage() {
  const input = useDirectionInput();
  const isClient = useIsClient();
  const [open, setOpen] = useState(false);
  const [previewSection, setPreviewSection] = useState<BookSectionId>();
  const [language, setLanguage] = useState<Language>("es");
  const [stocked, setStocked] = useState(false);

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
      {open ? <BookOverlay
        key={`${language}-${stocked}`}
        initialSectionId={previewSection}
        context={{
          language,
          patients: {},
          inventory: stocked ? stockedInventory() : createEmptyInventory(),
          knownRecipeIds: ALL_RECIPE_IDS,
        }}
      /> : null}
      <aside className={styles.panel}>
        <strong>/dev/book</strong>
        <button type="button" onClick={() => { setPreviewSection("preparations"); setOpen(true); }}>
          Ver los {RECIPES.length} preparados, todos descubiertos (datos de prueba)
        </button>
        <button type="button" onClick={() => { setPreviewSection("ailments"); setOpen(true); }}>
          Ver las {AILMENTS.length} dolencias
        </button>
        <button type="button" onClick={() => setStocked(value => !value)}>
          Bolsa: {stocked ? "con un poco de todo" : "vacía"}
        </button>
        <button type="button" onClick={() => setLanguage(value => value === "es" ? "en" : "es")}>
          Idioma: {language.toUpperCase()}
        </button>
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
