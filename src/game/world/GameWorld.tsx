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
import { PlayerBark } from "../bark/PlayerBark";
import { useRunBark } from "../bark/useRunBark";
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
import { formatObtainedNotice, itemFeedbackCopy } from "../i18n/items";
import { tutorialCopy } from "../i18n/tutorial";
import type { Language } from "../i18n/types";
import {
  addItem,
  canAddItem,
  countItem,
  type InventoryState,
} from "../inventory/inventory";
import {
  createChapter1Inventory,
  createChapter1Storage,
} from "../inventory/initialInventory";
import { runBarkLines } from "../i18n/runBarks";
import { InventoryHud } from "../inventory/InventoryHud";
import { isInventoryHudVisible } from "../inventory/inventoryHudVisibility";
import { storageCopy } from "../i18n/storage";
import { STORAGE_INTERACTION_ID, transferStack } from "../storage/storage";
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
import { NarrativeInterlude } from "../narrative/NarrativeInterlude";
import { NARRATIVE_ILLUSTRATIONS } from "../narrative/illustrations";
import { TutorialHint } from "../tutorial/TutorialHint";
import { useTutorial } from "../tutorial/useTutorial";
import { ItemFeedback } from "../ui/ItemFeedback";
import { INITIAL_CHAPTER_ID } from "./currentChapter";
import { ExteriorScene, type SceneOverlayContext } from "./ExteriorScene";
import { getChapterStart } from "./chapterStart";
import { WORLD_SCENES } from "./worldScenes";
import type { SceneId } from "./worldScenes";

// Scene changes fade to black and back. The scene swap happens while the
// screen is completely covered.
const SCENE_FADE_MS = 450;
// Small margin so the swap never happens before the overlay is fully opaque.
const COVER_MARGIN_MS = 50;
// How long an item notice stays on screen (display time only, not gameplay).
const ITEM_NOTICE_MS = 2600;
// Where the chapter begins: its first scene and, if it has one, its opening.
const CHAPTER_START = getChapterStart(INITIAL_CHAPTER_ID);

type Phase = "playing" | "fading-out" | "fading-in";
type WorldState = { sceneId: SceneId; spawnName: string; arrival: number };
// Owns the current scene, the navigation and the fade. The keyboard input
// lives here (not in the scenes), so keys that stay physically held survive a
// scene change and keep walking once the fade ends.
export function GameWorld({ language }: { language: Language }) {
  const input = useDirectionInput();
  const [world, setWorld] = useState<WorldState>({
    sceneId: CHAPTER_START.sceneId,
    spawnName: CHAPTER_START.spawnName,
    arrival: 0,
  });
  const dialogue = useDialogue();
  const startDialogue = dialogue.start;
  const [phase, setPhase] = useState<Phase>("playing");
  // No narrative state yet: the chapter is fixed at its initial value.
  const [chapterId] = useState(INITIAL_CHAPTER_ID);
  const phaseRef = useRef<Phase>("playing");
  // The chapter's opening (illustration + monologue over black) runs once per
  // GameWorld (= per game session) and never again on scene changes or
  // re-renders. There is no persistent game state yet. While it runs, the first
  // scene is already loaded behind it, but nothing can be done in it.
  const openingConversation = useMemo(
    () => resolveChapterIntro(INITIAL_CHAPTER_ID, language),
    [language],
  );
  const [openingActive, setOpeningActive] = useState(
    () => CHAPTER_START.opening !== undefined && openingConversation !== null,
  );

  // Main interfaces. They never open on top of each other, of a conversation
  // or during a scene fade, and each one blocks the Doctor while it is up.
  const [bookOpen, setBookOpen] = useState(false);
  // Whether the Doctor is running, as the scene reports it (for his remarks).
  const [doctorRunning, setDoctorRunning] = useState(false);
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
  // One-time narrative rewards already received (session only). Kept apart
  // from the patients: a case is "treated" with or without its thank-you.
  const [claimedRewards, setClaimedRewards] = useState<ReadonlySet<string>>(
    new Set(),
  );
  const claimedRewardsRef = useRef(claimedRewards);
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
  const [storage, setStorage] = useState<InventoryState>(createChapter1Storage);
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
  // Which interaction the [E] prompt is for right now (null = none).
  const [availableInteractionId, setAvailableInteractionId] = useState<
    string | null
  >(null);
  // The Baker's Bedroom is a narrative scene: nothing opens and the Doctor does
  // not walk while the story is there.
  const inNarrativeScene = world.sceneId === "bakers-bedroom";
  const canOpenInterface =
    phase === "playing" &&
    !openingActive &&
    !dialogue.active &&
    craftingStation === null &&
    !storageOpen &&
    !inNarrativeScene;
  const mapVisible = mapHeld && canOpenInterface && !bookOpen;
  const pendingRef = useRef<{ sceneId: SceneId; spawnName: string } | null>(
    null,
  );
  const scene = WORLD_SCENES[world.sceneId];
  const spawn = scene.arrivals[world.spawnName];
  // The Doctor is blocked (and nothing else can trigger) during a fade and
  // while a conversation is open; control returns when its last line closes.
  const isPlaying =
    phase === "playing" &&
    !openingActive &&
    !dialogue.active &&
    !bookOpen &&
    !mapVisible &&
    craftingStation === null &&
    !storageOpen &&
    !inNarrativeScene;

  // The Doctor's remarks while he keeps running: not a conversation, they
  // never block anything and go away the moment plain play stops.
  const runBark = useRunBark({ running: doctorRunning, enabled: isPlaying });

  useBookHotkeys({
    open: bookOpen,
    setOpen: (open) => {
      if (!open) {
        setBookOpen(false);
      } else if (canOpenInterface && !mapVisible) {
        setBookOpen(true);
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
      let nextRewards = claimedRewardsRef.current;
      const obtained: { itemId: string; quantity: number }[] = [];

      for (const effect of effects) {
        if (effect.type === "give-item") {
          const added = addItem(nextInventory, effect.itemId, effect.quantity);

          if (!added) {
            return false;
          }

          nextInventory = added;
          obtained.push({ itemId: effect.itemId, quantity: effect.quantity });
        } else if (effect.type === "claim-reward") {
          nextRewards = new Set([...nextRewards, effect.rewardId]);
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

      if (nextRewards !== claimedRewardsRef.current) {
        claimedRewardsRef.current = nextRewards;
        setClaimedRewards(nextRewards);
      }

      for (const { itemId, quantity } of obtained) {
        showNotice(
          formatObtainedNotice(
            language,
            getItemName(itemId, language),
            quantity,
          ),
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

      // The Doctor's Storage chest: open its interface.
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
          showNotice(
            formatObtainedNotice(
              language,
              getItemName(source.itemId, language),
              1,
            ),
          );
        } else {
          showNotice(copy.inventoryFull);
        }

        return;
      }

      // Interactions whose result depends on the story and on what the Doctor
      // carries (the baker, the merchant's cloth, the river).
      const outcome = resolveStoryInteraction(
        interactionId,
        {
          patients: patientsRef.current,
          inventory: inventoryRef.current,
          claimedRewards: claimedRewardsRef.current,
        },
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
    [language, startDialogue, applyStoryEffects, showNotice],
  );

  // The notice only needs to disappear after a while.
  useEffect(() => {
    if (noticeId === undefined) {
      return;
    }

    const timeoutId = window.setTimeout(() => setNotice(null), ITEM_NOTICE_MS);

    return () => window.clearTimeout(timeoutId);
  }, [noticeId]);

  // The opening is over (it ended or was skipped): the Doctor's Room is
  // revealed and the tutorial begins.
  const finishOpening = useCallback(() => {
    setOpeningActive(false);
    notifyTutorial("intro-finished");
  }, [notifyTutorial]);

  // Real events for the tutorial: the Book was opened / closed, the Map was
  // actually shown.
  const bookWasOpenRef = useRef(false);

  useEffect(() => {
    if (bookOpen) {
      notifyTutorial("book-opened");
    } else if (bookWasOpenRef.current) {
      notifyTutorial("book-closed");
    }

    bookWasOpenRef.current = bookOpen;
  }, [bookOpen, notifyTutorial]);

  useEffect(() => {
    if (mapVisible) {
      notifyTutorial("map-opened");
    }
  }, [mapVisible, notifyTutorial]);

  // The chest steps, from REAL state. Range: the interaction zone of the chest
  // is the one the [E] prompt is for (the scene already runs the proximity
  // test; only while the Doctor can act). Opened / closed: the Storage
  // interface itself. Flask: the carried inventory really holds it (a failed
  // transfer changes nothing, so it can never count).
  const tutorialStepNow = tutorial.step;

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    notifyTutorial(
      availableInteractionId === STORAGE_INTERACTION_ID
        ? "chest-in-range"
        : "chest-out-of-range",
    );
  }, [availableInteractionId, isPlaying, tutorialStepNow, notifyTutorial]);

  const storageWasOpenRef = useRef(false);

  useEffect(() => {
    if (storageOpen) {
      notifyTutorial("chest-opened");
    } else if (storageWasOpenRef.current) {
      notifyTutorial("storage-closed");
    }

    storageWasOpenRef.current = storageOpen;
  }, [storageOpen, notifyTutorial]);

  const carriesFlask = countItem(inventory, "empty-flask") > 0;

  useEffect(() => {
    if (carriesFlask) {
      notifyTutorial("flask-taken");
    }
  }, [carriesFlask, tutorialStepNow, notifyTutorial]);

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

  // The inventory bar lives in the scene overlay layer (the camera frame), next
  // to the dialogue bubble, so it is centred on the playable area. When it shows
  // is a pure rule (inventoryHudVisibility.ts).
  const inventoryHudVisible = isInventoryHudVisible({
    phase,
    openingActive,
    inNarrativeScene,
    tutorialDone: tutorial.step === "done",
    bookOpen,
    storageOpen,
    craftingOpen: craftingStation !== null,
    mapVisible,
  });
  const renderRunBark = (context: SceneOverlayContext) => {
    const anchor = context.getSpeakerAnchor(DOCTOR_SPEAKER);

    return runBark.phraseIndex !== null && anchor ? (
      <PlayerBark
        key={runBark.phraseIndex}
        text={runBarkLines[language][runBark.phraseIndex]}
        anchorX={anchor.x}
        anchorY={anchor.y}
        frameWidth={context.frameWidth}
        frameHeight={context.frameHeight}
        onDone={runBark.dismiss}
      />
    ) : null;
  };
  const renderSceneOverlay = (context: SceneOverlayContext) => (
    <>
      {renderDialogue(context)}
      {renderRunBark(context)}
      {inventoryHudVisible ? (
        <InventoryHud inventory={inventory} language={language} />
      ) : null}
    </>
  );

  // The characters with news for the Doctor: derived from the cases (a case
  // that is only discovered still waits for its visit, a treated one may still
  // owe its thank-you).
  const attentionInstanceIds = useMemo(
    () => getAttentionInstanceIds(patients, claimedRewards),
    [patients, claimedRewards],
  );

  // The hint of the current step. The interaction hint only shows while the
  // [E] prompt does; none shows over an open interface or a conversation.
  const tutorialStep = tutorial.step;
  // The Book steps only make sense with the Book open; if it is closed again
  // before they are done, the hint goes back to "open the book".
  const inBookStep =
    tutorialStep === "book-page" ||
    tutorialStep === "book-tab" ||
    tutorialStep === "book-close";
  const hintStep = inBookStep && !bookOpen ? "book" : tutorialStep;
  // The Storage step is taught with the Storage open (and over it); the
  // "press E" step only while the chest's [E] prompt is showing.
  const hintOverStorage = storageOpen && tutorialStep === "take-flask";
  const hintOverBook = bookOpen && inBookStep;
  const hintCopy =
    hintStep === "book" ||
    inBookStep ||
    hintStep === "map" ||
    hintStep === "move" ||
    hintStep === "chest-approach" ||
    (hintStep === "chest-interact" &&
      availableInteractionId === STORAGE_INTERACTION_ID) ||
    hintOverStorage
      ? tutorialCopy[language][hintStep as keyof (typeof tutorialCopy)["es"]]
      : null;
  const showHint =
    hintCopy !== null &&
    phase === "playing" &&
    !openingActive &&
    !dialogue.active &&
    (!bookOpen || hintOverBook) &&
    !mapVisible &&
    craftingStation === null &&
    (!storageOpen || hintOverStorage) &&
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
          renderOverlay={renderSceneOverlay}
          onPlayerMoved={handlePlayerMoved}
          onRunningChange={setDoctorRunning}
          onInteract={handleInteract}
          onInteractionAvailable={setAvailableInteractionId}
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
          renderOverlay={renderSceneOverlay}
          onPlayerMoved={handlePlayerMoved}
          onRunningChange={setDoctorRunning}
          onInteractionAvailable={setAvailableInteractionId}
        />
      )}
      {bookOpen ? (
        <BookOverlay
          context={{ language, patients, inventory, knownRecipeIds }}
          // While the tutorial teaches page turning, the book opens on a section
          // with several pages made of things the Doctor already knows
          // (PACIENTES has a single page at the start). INGREDIENTES, not
          // DOLENCIAS: its pages are plain descriptions, whereas the ailment
          // pages already spell out future treatments. Only the tab changes.
          initialSectionId={
            tutorialStep === "book" || tutorialStep === "book-page"
              ? "ingredients"
              : undefined
          }
          onPageChange={() => notifyTutorial("book-page-changed")}
          onSectionChange={() => notifyTutorial("book-tab-changed")}
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
      {showHint ? (
        <TutorialHint
          copy={hintCopy}
          aboveOverlays={hintOverBook || hintOverStorage}
        />
      ) : null}
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
      {openingActive && openingConversation && CHAPTER_START.opening ? (
        <NarrativeInterlude
          illustration={
            NARRATIVE_ILLUSTRATIONS[CHAPTER_START.opening.illustration]
          }
          conversation={openingConversation}
          language={language}
          onFinished={finishOpening}
        />
      ) : null}
    </>
  );
}
