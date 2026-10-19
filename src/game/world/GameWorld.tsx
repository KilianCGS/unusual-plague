"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
import {
  buildMissingIngredientConversation,
  getExaminationConversation,
  resolveStoryInteraction,
  type StoryEffect,
} from "../dialogue/storyInteractions";
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
  type InventoryState,
} from "../inventory/inventory";
import { createChapter1Inventory } from "../inventory/initialInventory";
import { InventoryOverlay } from "../inventory/InventoryOverlay";
import { useInventoryHotkeys } from "../inventory/useInventoryHotkeys";
import { storageCopy } from "../i18n/storage";
import {
  createEmptyStorage,
  STORAGE_INTERACTION_ID,
  transferStack,
} from "../storage/storage";
import { StorageOverlay, type StorageSide } from "../storage/StorageOverlay";
import { getItemName } from "../items/items";
import { MapOverlay } from "../map/MapOverlay";
import {
  BAKER_HUSBAND_ID,
  CHAPTER1_INITIAL_PATIENTS,
  getAttentionInstanceIds,
  CHAPTER1_PATIENTS,
} from "../patients/chapter1Patients";
import {
  advancePatient,
  treatPatient,
  type PatientCasesState,
} from "../patients/patientCases";
import { getPatientMissingIngredients } from "../patients/patientNeeds";
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
  // The Apothecary storage chest interface (another main interface).
  const [storageOpen, setStorageOpen] = useState(false);
  // The crafting station being used (null = none). Another main interface.
  const [craftingStation, setCraftingStation] = useState<CraftStation | null>(
    null,
  );
  const mapHeld = useMapHold();
  // STORY STATE (session only). The status of each patient case is the only
  // thing stored about a case; "can he be treated", the ticks in the Book and
  // the "!" over the baker are derived from it and the inventory. The recipes
  // the Doctor has been shown (PREPARADOS) are stored as ids. Refs mirror both
  // so effects and event handlers never read a stale value.
  const [patients, setPatients] = useState<PatientCasesState>(
    CHAPTER1_INITIAL_PATIENTS,
  );
  const patientsRef = useRef(patients);
  const [knownRecipeIds, setKnownRecipeIds] = useState<ReadonlySet<string>>(
    new Set(),
  );
  // What happens when the conversation on screen ends (a scripted flow).
  const afterDialogueRef = useRef<
    "go-to-examination" | "examination-finished" | "leave-bedroom" | null
  >(null);
  const examinationStartedRef = useRef(false);
  // What the Doctor carries and which world collectibles he has picked up.
  // Both live here, above the scenes, so they survive scene changes; they last
  // for the session (no saving yet). The ref mirrors the inventory so two
  // pickups in the same frame cannot both read a stale one.
  const [inventory, setInventory] = useState<InventoryState>(
    createChapter1Inventory,
  );
  const inventoryRef = useRef(inventory);
  // The Apothecary storage: another InventoryState owned here, above the
  // scenes, for the session. Crafting never reads it.
  const [storage, setStorage] = useState<InventoryState>(createEmptyStorage);
  const storageRef = useRef(storage);
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
  // The Baker's Bedroom is a narrative scene: nothing opens and the Doctor does
  // not walk while the story is there.
  const inNarrativeScene = world.sceneId === "bakers-bedroom";
  const canOpenInterface =
    phase === "playing" &&
    !dialogue.active &&
    craftingStation === null &&
    !storageOpen &&
    !inNarrativeScene;
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
    craftingStation === null &&
    !storageOpen &&
    !inNarrativeScene;

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
  const startTransition = useCallback(
    (sceneId: SceneId, spawnName: string) => {
      if (phaseRef.current !== "playing") {
        return;
      }

      pendingRef.current = { sceneId, spawnName };
      changePhase("fading-out");
    },
    [changePhase],
  );

  const handleExit = useCallback(
    (exitName: string) => {
      const exit = WORLD_SCENES[world.sceneId].exits.find(
        (candidate) => candidate.name === exitName,
      );

      if (exit) {
        startTransition(exit.targetScene, exit.targetSpawn);
      }
    },
    [world.sceneId, startTransition],
  );

  const showNotice = useCallback(
    (text: string) =>
      setNotice((current) => ({ id: (current?.id ?? 0) + 1, text })),
    [],
  );

  // Applies what a story interaction decided, all or nothing: every effect is
  // checked first and nothing changes if one cannot be done. Returns whether
  // it was applied.
  const applyStoryEffects = useCallback(
    (effects: readonly StoryEffect[]): boolean => {
      let nextInventory = inventoryRef.current;
      let nextPatients = patientsRef.current;
      const obtained: string[] = [];

      for (const effect of effects) {
        if (effect.type === "give-item") {
          const added = addItem(nextInventory, effect.itemId, effect.quantity);

          if (!added) {
            return false;
          }

          nextInventory = added;
          obtained.push(effect.itemId);
        } else {
          const definition = CHAPTER1_PATIENTS[effect.patientId];
          const treated = treatPatient(nextPatients, definition, nextInventory);

          if (!treated) {
            return false;
          }

          nextPatients = treated.state;
          nextInventory = treated.inventory;
        }
      }

      if (nextInventory !== inventoryRef.current) {
        inventoryRef.current = nextInventory;
        setInventory(nextInventory);
      }

      if (nextPatients !== patientsRef.current) {
        patientsRef.current = nextPatients;
        setPatients(nextPatients);
      }

      for (const itemId of obtained) {
        showNotice(
          itemFeedbackCopy[language].obtained + getItemName(itemId, language),
        );
      }

      return true;
    },
    [language, showNotice],
  );

  // Click on a stack in the storage interface: the whole stack goes to the
  // other side, or nothing moves and a short notice says why.
  const handleStorageTransfer = useCallback(
    (from: StorageSide, itemId: string) => {
      const toStorage = from === "inventory";
      const result = transferStack(
        toStorage ? inventoryRef.current : storageRef.current,
        toStorage ? storageRef.current : inventoryRef.current,
        itemId,
      );

      if (!result) {
        const copy = storageCopy[language];

        showNotice(toStorage ? copy.noRoomInStorage : copy.noRoomInInventory);
        return;
      }

      const nextInventory = toStorage ? result.source : result.destination;
      const nextStorage = toStorage ? result.destination : result.source;

      inventoryRef.current = nextInventory;
      storageRef.current = nextStorage;
      setInventory(nextInventory);
      setStorage(nextStorage);
    },
    [language, showNotice],
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

      // The Apothecary storage chest: open its interface.
      if (interactionId === STORAGE_INTERACTION_ID) {
        setStorageOpen(true);
        return;
      }

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

      // Interactions whose result depends on the story and on what the Doctor
      // carries (the baker, the merchant's cloth, the river).
      const outcome = resolveStoryInteraction(
        interactionId,
        { patients: patientsRef.current, inventory: inventoryRef.current },
        language,
        source.instanceId ?? "",
      );

      if (outcome && !outcome.conversation) {
        // Light interaction (the river): effects and a short notice, no dialogue.
        if (applyStoryEffects(outcome.effects)) {
          if (outcome.notice) {
            showNotice(outcome.notice);
          }
        } else {
          showNotice(itemFeedbackCopy[language].inventoryFull);
        }

        return;
      }

      if (outcome?.conversation && applyStoryEffects(outcome.effects)) {
        afterDialogueRef.current =
          outcome.after === "go-to-examination" ? "go-to-examination" : null;
        startDialogue(outcome.conversation);
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
    [language, startDialogue, notifyTutorial, applyStoryEffects, showNotice],
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

  // The patient flow of the baker's husband, driven by the end of each
  // conversation: the baker's invitation > fade to the bedroom > examination >
  // (Doctor's thoughts about what he still lacks) > fade back to the bakery.
  const finishExamination = useCallback(() => {
    const definition = CHAPTER1_PATIENTS[BAKER_HUSBAND_ID];
    const examined = advancePatient(
      patientsRef.current,
      BAKER_HUSBAND_ID,
      "examined",
    );

    patientsRef.current = examined;
    setPatients(examined);
    setKnownRecipeIds(
      (current) => new Set([...current, ...definition.revealsRecipeIds]),
    );

    const thoughts = buildMissingIngredientConversation(
      getPatientMissingIngredients(definition, inventoryRef.current),
      language,
    );

    if (thoughts) {
      afterDialogueRef.current = "leave-bedroom";
      startDialogue(thoughts);
    } else {
      startTransition("bakery-interior", "from-bakers-bedroom");
    }
  }, [language, startDialogue, startTransition]);

  useEffect(() => {
    if (dialogue.active) {
      return;
    }

    const action = afterDialogueRef.current;

    afterDialogueRef.current = null;

    if (action === "go-to-examination") {
      startTransition("bakers-bedroom", "narrative");
    } else if (action === "examination-finished") {
      finishExamination();
    } else if (action === "leave-bedroom") {
      startTransition("bakery-interior", "from-bakers-bedroom");
    }
  }, [dialogue.active, startTransition, finishExamination]);

  // Once the fade into the bedroom is over, the examination starts (once).
  useEffect(() => {
    if (!inNarrativeScene) {
      examinationStartedRef.current = false;
      return;
    }

    if (phase !== "playing" || examinationStartedRef.current) {
      return;
    }

    const examination = getExaminationConversation(BAKER_HUSBAND_ID, language);

    if (examination) {
      examinationStartedRef.current = true;
      afterDialogueRef.current = "examination-finished";
      startDialogue(examination);
    }
  }, [inNarrativeScene, phase, language, startDialogue]);

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

    // A speaker that is not in the scene (e.g. the husband before he is placed)
    // speaks from the Doctor's anchor instead of silently vanishing.
    const anchor =
      context.getSpeakerAnchor(dialogue.line.speaker) ??
      context.getSpeakerAnchor(DOCTOR_SPEAKER);

    return anchor ? (
      <DialogueBubble
        anchorX={anchor.x}
        anchorY={anchor.y}
        placement={anchor.placement}
        frameWidth={context.frameWidth}
        frameHeight={context.frameHeight}
        visibleText={dialogue.visibleText}
        fullText={dialogue.fullText}
        isComplete={dialogue.isComplete}
        isDoctor={dialogue.line.speaker === DOCTOR_SPEAKER}
      />
    ) : null;
  };

  // The characters with news for the Doctor: derived from the cases (a case
  // that is only discovered still waits for its visit).
  const attentionInstanceIds = useMemo(
    () => getAttentionInstanceIds(patients),
    [patients],
  );

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
    craftingStation === null &&
    !storageOpen &&
    !inNarrativeScene;

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
          attentionInstanceIds={attentionInstanceIds}
          renderOverlay={renderDialogue}
          onPlayerMoved={handlePlayerMoved}
          onInteractionAvailable={setInteractionAvailable}
        />
      )}
      {bookOpen ? (
        <BookOverlay
          context={{ language, patients, inventory, knownRecipeIds }}
        />
      ) : null}
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
      {storageOpen ? (
        <StorageOverlay
          storage={storage}
          inventory={inventory}
          language={language}
          onTransfer={handleStorageTransfer}
          onClose={() => setStorageOpen(false)}
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
