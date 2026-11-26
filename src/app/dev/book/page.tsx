"use client";

import { useState } from "react";

import { BookOverlay } from "../../../game/book/BookOverlay";
import type { BookSectionId } from "../../../game/book/bookPages";
import { RECIPES } from "../../../game/crafting/recipes";
import { addItem, createEmptyInventory } from "../../../game/inventory/inventory";
import type { InventoryItemId, InventoryState } from "../../../game/inventory/inventory";
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
// description, use, ingredients and steps) can be looked at.
// 2026-11-27: everything else of the book can be looked at too (TEST DATA):
//  * the bag: empty, everything in the case, or everything split between the case and the chest, to see the three
//    colours of the index (green: it can be made, from the case or the chest; plain ink: something is missing) and the
//    counts in the ingredient circles;
//  * the patients: none, or the three of Day 2 examined (their treatments link to their recipes, "← Patient" comes back).
const ALL_RECIPE_IDS: ReadonlySet<string> = new Set(RECIPES.map((recipe) => recipe.id));
const ALL_INPUT_ITEM_IDS = [...new Set(RECIPES.flatMap((recipe) => recipe.inputs.map((input) => input.itemId)))];
type Bag = "empty" | "case" | "split";
const BAG_LABEL: Record<Bag, string> = {
  empty: "vacío (índice todo en negro)",
  case: "todo en el maletín (índice todo en verde)",
  split: "repartido maletín / baúl (verdes y negros)",
};
const stock = (ids: readonly string[]): InventoryState =>
  ids.reduce((bag, itemId) => addItem(bag, itemId as InventoryItemId, 3) ?? bag, createEmptyInventory(ids.length + 4));
// The split: every other ingredient in the case, the rest in the chest; the last few nowhere (so some lines are in plain ink).
const caseHalf = ALL_INPUT_ITEM_IDS.filter((_, index) => index % 2 === 0);
const chestHalf = ALL_INPUT_ITEM_IDS.filter((_, index) => index % 2 === 1).slice(0, -3);
const DAY2_EXAMINED = { "chapter2-blacksmith": "examined", "chapter2-woodcutter": "examined", "chapter2-farmer": "examined" } as const;

export default function BookPreviewPage() {
  const input = useDirectionInput();
  const isClient = useIsClient();
  const [open, setOpen] = useState(false);
  const [previewSection, setPreviewSection] = useState<BookSectionId>();
  const [language, setLanguage] = useState<Language>("es");
  const [bag, setBag] = useState<Bag>("split");
  const [patients, setPatients] = useState(true);

  useBookHotkeys({ open, setOpen });

  const inventory = bag === "empty" ? createEmptyInventory() : bag === "case" ? stock(ALL_INPUT_ITEM_IDS) : stock(caseHalf);
  const storage = bag === "split" ? stock(chestHalf) : createEmptyInventory(10);

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
        key={`${language}-${bag}-${patients}-${previewSection}`}
        initialSectionId={previewSection}
        context={{
          language,
          patients: patients ? DAY2_EXAMINED : {},
          inventory,
          storage,
          knownRecipeIds: ALL_RECIPE_IDS,
          chapterId: "chapter-2",
        }}
      /> : null}
      <aside className={styles.panel}>
        <strong>/dev/book</strong>
        <button type="button" onClick={() => { setPreviewSection("preparations"); setOpen(true); }}>
          Ver los {RECIPES.length} preparados (índice primero), todos descubiertos (datos de prueba)
        </button>
        <button type="button" onClick={() => { setPreviewSection("patients"); setOpen(true); }}>
          Ver los pacientes
        </button>
        <button type="button" onClick={() => { setPreviewSection("ingredients"); setOpen(true); }}>
          Ver los ingredientes (cantidades en los círculos)
        </button>
        <button type="button" onClick={() => { setPreviewSection("ailments"); setOpen(true); }}>
          Ver las {AILMENTS.length} dolencias
        </button>
        <button type="button" onClick={() => setBag((value) => (value === "empty" ? "case" : value === "case" ? "split" : "empty"))}>
          Ingredientes: {BAG_LABEL[bag]}
        </button>
        <button type="button" onClick={() => setPatients((value) => !value)}>
          Pacientes: {patients ? "los 3 del día 2, examinados" : "ninguno"}
        </button>
        <button type="button" onClick={() => setLanguage(value => value === "es" ? "en" : "es")}>
          Idioma: {language.toUpperCase()}
        </button>
        <span>
          WASD / flechas: mover al Doctor (bloqueado con el libro abierto)
        </span>
        <span>Q: abrir / cerrar el Compendio · Esc: cerrar</span>
        <span>
          Ratón: portada, pestañas, enlaces del índice y de los tratamientos («← Paciente» para volver)
        </span>
      </aside>
    </>
  );
}
