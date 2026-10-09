"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { ApothecaryScene } from "../apothecary/ApothecaryScene";
import { BookOverlay } from "../book/BookOverlay";
import {
  markCollected,
  NO_COLLECTED,
  type CollectedInstanceIds,
} from "../collectibles/collectibles";
import { useBookHotkeys } from "../book/useBookHotkeys";
import { CraftingOverlay } from "../crafting/CraftingOverlay";
import { CRAFT_STATION_BY_INTERACTION_ID } from "../crafting/crafting";
import type { CraftStation } from "../crafting/recipes";
import { DialogueBubble } from "../dialogue/DialogueBubble";
import { DOCTOR_SPEAKER } from "../dialogue/dialogueTypes";
import {
  resolveChapterIntro,
  resolveInteractionConversation,
} from "../dialogue/interactionDialogues";
import { useDialogue } from "../dialogue/useDialogue";
import { itemFeedbackCopy } from "../i18n/items";
import { tutorialCopy } from "../i18n/tutorial";
import type { Language } from "../i18n/types";
import {
  addItem,
  canAddItem,
  createEmptyInventory,
  type InventoryState,
} from "../inventory/inventory";
import { InventoryOverlay } from "../inventory/InventoryOverlay";
import { useInventoryHotkeys } from "../inventory/useInventoryHotkeys";
import { getItemName } from "../items/items";
import { MapOverlay } from "../map/MapOverlay";
import { SCENE_TO_MAP_LOCATION } from "../map/mapLocations";
import { useMapHold } from "../map/useMapHold";
import { useDirectionInput } from "../protagonist/useDirectionInput";
import { TutorialHint } from "../tutorial/TutorialHint";
import { useTutorial } from "../tutorial/useTutorial";
import { ItemFeedback } from "../ui/ItemFeedback";
import { INITIAL_CHAPTER_ID } from "./currentChapter";
import { ExteriorScene, type SceneOverlayContext } from "./ExteriorScene";
import { START_SCENE, START_SPAWN, WORLD_SCENES } from "./worldScenes";
import type { SceneId } from "./worldScenes";

// Scene changes fade to black and back. The scene swap happens while the
// screen is completely covered.
const SCENE_FADE_MS = 450;
// Small margin so the swap never happens before the overlay is fully opaque.
const COVER_MARGIN_MS = 50;
// How long an item notice stays on screen (display time only, not gameplay).
const ITEM_NOTICE_MS = 2600;
// The opening monologue waits for the title-to-game fade to finish.
const INTRO_DELAY_MS = 1200;

type Phase = "playing" | "fading-out" | "fading-in";
type WorldState = { sceneId: SceneId; spawnName: string; arrival: number };
// Owns the current scene, the navigation and the fade. The keyboard input
// lives here (not in the scenes), so keys that stay physically held survive a
// scene change and keep walking once the fade ends.
export function GameWorld({ language }: { language: Language }) {
  const input = useDirectionInput();
  const [world, setWorld] = useState<WorldState>({
    sceneId: START_SCENE,
    spawnName: START_SPAWN,
    arrival: 0,
  });
  const dialogue = useDialogue();
  const startDialogue = dialogue.start;
  const [phase, setPhase] = useState<Phase>("playing");
  // No narrative state yet: the chapter is fixed at its initial value.
  const [chapterId] = useState(INITIAL_CHAPTER_ID);
  const phaseRef = useRef<Phase>("playing");
  // In-memory only: the Chapter's opening monologue plays once per GameWorld
  // (= per game session), never again on scene changes, book open/close or
  // re-renders. There is no persistent game state yet.
  const introPlayedRef = useRef(false);
  // True while the opening monologue is the conversation on screen, so its end
  // (and only its end) starts the tutorial.
  const introActiveRef = useRef(false);

  // Main interfaces. They never open on top of each other, of a conversation
  // or during a scene fade, and each one blocks the Doctor while it is up.
  const [bookOpen, setBookOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  // The crafting station being used (null = none). Another main interface.
  const [craftingStation, setCraftingStation] = useState<CraftStation | null>(
    null,
  );
  const mapHeld = useMapHold();
  // What the Doctor carries and which world collectibles he has picked up.
  // Both live here, above the scenes, so they survive scene changes; they last
  // for the session (no saving yet). The ref mirrors the inventory so two
  // pickups in the same frame cannot both read a stale one.
  const [inventory, setInventory] =
    useState<InventoryState>(createEmptyInventory);
  const inventoryRef = useRef(inventory);
  const [collected, setCollected] =
    useState<CollectedInstanceIds>(NO_COLLECTED);
  const [notice, setNotice] = useState<{ id: number; text: string } | null>(
    null,
  );
  const noticeId = notice?.id;
  // The tutorial only OBSERVES: the pieces below report what really happened.
  const tutorial = useTutorial();
  const notifyTutorial = tutorial.notify;
  const [interactionAvailable, setInteractionAvailable] = useState(false);
  const canOpenInterface =
    phase === "playing" && !dialogue.active && craftingStation === null;
  const mapVisible = mapHeld && canOpenInterface && !bookOpen && !inventoryOpen;
  const pendingRef = useRef<{ sceneId: SceneId; spawnName: string } | null>(
    null,
  );
  const scene = WORLD_SCENES[world.sceneId];
  const spawn = scene.arrivals[world.spawnName];
  // The Doctor is blocked (and nothing else can trigger) during a fade and
  // while a conversation is open; control returns when its last line closes.
  const isPlaying =
    phase === "playing" &&
    !dialogue.active &&
    !bookOpen &&
    !mapVisible &&
    !inventoryOpen &&
    craftingStation === null;

  useBookHotkeys({
    open: bookOpen,
    setOpen: (open) => {
      if (!open) {
        setBookOpen(false);
      } else if (canOpenInterface && !mapVisible && !inventoryOpen) {
        setBookOpen(true);
      }
    },
  });
  useInventoryHotkeys({
    open: inventoryOpen,
    setOpen: (open) => {
      if (!open) {
        setInventoryOpen(false);
      } else if (canOpenInterface && !mapVisible && !bookOpen) {
        setInventoryOpen(true);
      }
    },
  });

  const changePhase = useCallback((nextPhase: Phase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }, []);

  // A transition only starts while the game is playable; while a fade or a
  // scene change is running nothing else can trigger.
  const handleExit = useCallback(
    (exitName: string) => {
      if (phaseRef.current !== "playing") {
        return;
      }

      const exit = WORLD_SCENES[world.sceneId].exits.find(
        (candidate) => candidate.name === exitName,
      );

      if (!exit) {
        return;
      }

      pendingRef.current = {
        sceneId: exit.targetScene,
        spawnName: exit.targetSpawn,
      };
      changePhase("fading-out");
    },
    [world.sceneId, changePhase],
  );

  // The scene only reports WHICH interaction was activated (and the decor
  // instance it belongs to); a data table turns the id into a conversation in
  // the current language. Nothing here knows what an interactionId means.
  const handleInteract = useCallback(
    (
      interactionId: string,
      source: { instanceId?: string; itemId?: string },
    ) => {
      if (phaseRef.current !== "playing") {
        return;
      }

      notifyTutorial("interaction-started");

      // A crafting station: open its interface.
      const station = CRAFT_STATION_BY_INTERACTION_ID[interactionId];

      if (station) {
        setCraftingStation(station);
        return;
      }

      // A collectible: pick it up if it fits, otherwise leave it where it is.
      if (source.itemId && source.instanceId) {
        const next = canAddItem(inventoryRef.current, source.itemId)
          ? addItem(inventoryRef.current, source.itemId)
          : null;
        const copy = itemFeedbackCopy[language];
        const showNotice = (text: string) =>
          setNotice((current) => ({ id: (current?.id ?? 0) + 1, text }));

        if (next) {
          inventoryRef.current = next;
          setInventory(next);
          setCollected((current) => markCollected(current, source.instanceId!));
          showNotice(copy.obtained + getItemName(source.itemId, language));
        } else {
          showNotice(copy.inventoryFull);
        }

        return;
      }

      const conversation = resolveInteractionConversation(
        interactionId,
        language,
        source.instanceId ?? "",
      );

      if (conversation) {
        startDialogue(conversation);
      }
    },
    [language, startDialogue, notifyTutorial],
  );

  // The notice only needs to disappear after a while.
  useEffect(() => {
    if (noticeId === undefined) {
      return;
    }

    const timeoutId = window.setTimeout(() => setNotice(null), ITEM_NOTICE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [noticeId]);

  useEffect(() => {
    if (introPlayedRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      introPlayedRef.current = true;

      const intro = resolveChapterIntro(chapterId, language);

      if (intro) {
        introActiveRef.current = true;
        startDialogue(intro);
      }
    }, INTRO_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [chapterId, language, startDialogue]);

  // Real events for the tutorial: the monologue ended, the Book / the Map were
  // actually shown.
  useEffect(() => {
    if (introActiveRef.current && !dialogue.active) {
      introActiveRef.current = false;
      notifyTutorial("intro-finished");
    }
  }, [dialogue.active, notifyTutorial]);

  useEffect(() => {
    if (bookOpen) {
      notifyTutorial("book-opened");
    }
  }, [bookOpen, notifyTutorial]);

  useEffect(() => {
    if (mapVisible) {
      notifyTutorial("map-opened");
    }
  }, [mapVisible, notifyTutorial]);

  const handlePlayerMoved = useCallback(
    () => notifyTutorial("player-moved"),
    [notifyTutorial],
  );

  useEffect(() => {
    if (phase === "fading-out") {
      const timeoutId = window.setTimeout(() => {
        const pending = pendingRef.current;

        pendingRef.current = null;

        if (!pending) {
          changePhase("playing");
          return;
        }

        setWorld((current) => ({
          sceneId: pending.sceneId,
          spawnName: pending.spawnName,
          arrival: current.arrival + 1,
        }));
        changePhase("fading-in");
      }, SCENE_FADE_MS + COVER_MARGIN_MS);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }

    if (phase === "fading-in") {
      const timeoutId = window.setTimeout(() => {
        changePhase("playing");
      }, SCENE_FADE_MS);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }
  }, [phase, changePhase]);

  // One bubble for every scene: anchored to whoever speaks, in the Doctor's
  // grey when the speaker is the Doctor.
  const renderDialogue = (context: SceneOverlayContext) => {
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
        isDoctor={dialogue.line.speaker === DOCTOR_SPEAKER}
      />
    ) : null;
  };

  // The hint of the current step. The interaction hint only shows while the
  // [E] prompt does; none shows over an open interface or a conversation.
  const tutorialStep = tutorial.step;
  const hintCopy =
    tutorialStep === "book" ||
    tutorialStep === "map" ||
    tutorialStep === "move" ||
    (tutorialStep === "interact" && interactionAvailable)
      ? tutorialCopy[language][tutorialStep]
      : null;
  const showHint =
    hintCopy !== null &&
    phase === "playing" &&
    !dialogue.active &&
    !bookOpen &&
    !mapVisible &&
    !inventoryOpen &&
    craftingStation === null;

  return (
    <>
      {scene.kind === "interior" ? (
        <ApothecaryScene
          key={`${world.sceneId}-${world.arrival}`}
          spawn={spawn}
          input={input}
          isPlaying={isPlaying}
          exits={scene.exits}
          onExit={handleExit}
          renderOverlay={renderDialogue}
          onPlayerMoved={handlePlayerMoved}
          onInteract={handleInteract}
          onInteractionAvailable={setInteractionAvailable}
        />
      ) : (
        <ExteriorScene
          key={`${world.sceneId}-${world.arrival}`}
          scene={scene}
          chapterId={chapterId}
          spawn={spawn}
          input={input}
          isPlaying={isPlaying}
          onExit={handleExit}
          onInteract={handleInteract}
          collectedInstanceIds={collected}
          renderOverlay={renderDialogue}
          onPlayerMoved={handlePlayerMoved}
          onInteractionAvailable={setInteractionAvailable}
        />
      )}
      {bookOpen ? <BookOverlay /> : null}
      {mapVisible ? (
        <MapOverlay currentLocationId={SCENE_TO_MAP_LOCATION[world.sceneId]} />
      ) : null}
      {craftingStation ? (
        <CraftingOverlay
          key={craftingStation}
          station={craftingStation}
          inventory={inventory}
          language={language}
          onInventoryChange={(next) => {
            inventoryRef.current = next;
            setInventory(next);
          }}
          onClose={() => setCraftingStation(null)}
        />
      ) : null}
      {inventoryOpen ? (
        <InventoryOverlay inventory={inventory} language={language} />
      ) : null}
      {showHint ? <TutorialHint copy={hintCopy} /> : null}
      {notice ? <ItemFeedback text={notice.text} /> : null}
      <div
        className="title-screen-fade"
        data-scene={world.sceneId}
        data-phase={phase}
        style={{
          opacity: phase === "fading-out" ? 1 : 0,
          pointerEvents: isPlaying ? "none" : "auto",
          transitionDuration: `${SCENE_FADE_MS}ms`,
        }}
      />
    </>
  );
}
