"use client";

import { getPatientDefinitions } from "../patients/patientRegistry";
import { canAnalyzeFarmerSample, FARMER_ANALYSIS_ID, FARMER_RECIPE_IDS } from "../patients/farmerInvestigation";
import { farmerAnalysisResult } from "../dialogue/chapter2AnalysisDialogues";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ApothecaryScene } from "../apothecary/ApothecaryScene";
import { BookOverlay } from "../book/BookOverlay";
import { DiagnosisOverlay } from "../patients/DiagnosisOverlay";
import { DIAGNOSIS_SYMPTOMS, checkDiagnosis, diagnosisConversation, type DiagnosisSession } from "../patients/diagnosis";
import { CompendiumNotice } from "../book/CompendiumNotice";
import {
  markCollected,
  NO_COLLECTED,
  type CollectedInstanceIds,
} from "../collectibles/collectibles";
import { useBookHotkeys } from "../book/useBookHotkeys";
import { PlayerBark } from "../bark/PlayerBark";
import { useRunBark } from "../bark/useRunBark";
import { CraftingOverlay } from "../crafting/CraftingOverlay";
import { craftingCopy } from "../i18n/crafting";
import { moneyCopy } from "../i18n/money";
import { CoinHud, resetCoinHudMemory } from "../money/CoinHud";
import { getObjectives } from "../objectives/objectives";
import { ObjectivesPanel } from "../objectives/ObjectivesPanel";
import { addCoins, canAfford, spendCoins, STARTING_COINS } from "../money/money";
import { getPatientPayment } from "../money/payments";
import { ShopOverlay } from "../shop/ShopOverlay";
import { buyEffects, getShop, shopForChapter, type ShopDefinition, type ShopEntry } from "../shop/shops";
import { CRAFT_STATION_BY_INTERACTION_ID } from "../crafting/crafting";
import type { CraftStation } from "../crafting/recipes";
import { learnRecipesFromItems } from "../crafting/recipeDiscovery";
import { recipeDiscoveryCopy } from "../i18n/recipeDiscovery";
import { DialogueBubble } from "../dialogue/DialogueBubble";
import {
  buildMissingIngredientConversation,
  getExaminationConversation,
  resolveStoryInteraction,
  type StoryEffect,
} from "../dialogue/storyInteractions";
import { day1Closing } from "../dialogue/chapter1Day1Dialogues";
import { day2Closing } from "../dialogue/chapter2ClosingDialogues";
import { day3Closing } from "../dialogue/chapter3ClosingDialogues";
import { DAY2_COMPLETED_ID, shouldCloseDay2 } from "../patients/day2";
import { DAY3_COMPLETED_ID, shouldCloseDay3 } from "../patients/day3";
import { messengerOpening } from "../dialogue/chapter2OpeningDialogues";
import { day2OpeningCopy } from "../i18n/day2Opening";
import { DOCTOR_SPEAKER } from "../dialogue/dialogueTypes";
import { localizeConversation } from "../dialogue/localizedConversation";
import {
  resolveChapterIntro,
  resolveInteractionConversation,
} from "../dialogue/interactionDialogues";
import { useDialogue } from "../dialogue/useDialogue";
import {
  collectBarkCopy,
  formatObtainedNotice,
  itemFeedbackCopy,
} from "../i18n/items";
import { tutorialCopy } from "../i18n/tutorial";
import type { Language } from "../i18n/types";
import {
  addItem,
  removeItem,
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
} from "../patients/chapter1Patients";
import {
  advancePatient,
  treatPatient,
  type PatientCasesState,
} from "../patients/patientCases";
import { getActiveTreatments, getPatientMissingIngredients } from "../patients/patientNeeds";
import { getCraftingTargets } from "../crafting/needs";
import { SCENE_TO_MAP_LOCATION } from "../map/mapLocations";
import { useMapHold } from "../map/useMapHold";
import { useDirectionInput } from "../protagonist/useDirectionInput";
import { NarrativeInterlude } from "../narrative/NarrativeInterlude";
import { getLockedDoorNotice } from "./lockedDoors";
import { FLOUR_SACK_MARK, shouldMarkFlourSack } from "../dialogue/chapter2Supplies";
import { NARRATIVE_ILLUSTRATIONS } from "../narrative/illustrations";
import { TutorialHint } from "../tutorial/TutorialHint";
import { useTutorial } from "../tutorial/useTutorial";
import { fastTravelCopy } from "../i18n/fastTravel";
import { FastTravelButton, TravelCaption } from "../ui/FastTravelButton";
import { ItemFeedback } from "../ui/ItemFeedback";
import { DAY1_COMPLETED_ID, shouldCloseDay1 } from "../patients/day1";
import { INITIAL_CHAPTER_ID } from "./currentChapter";
import dayClosingStyles from "./DayClosing.module.css";
import { ExteriorScene, type SceneOverlayContext } from "./ExteriorScene";
import {
  FAST_TRAVEL_CAPTION_MS,
  FAST_TRAVEL_DESTINATION,
  canFastTravel,
} from "./fastTravel";
import { getChapterStart, getNextChapterId } from "./chapterStart";
import {
  getNarrativeHiddenInstanceIds,
  getMessengerArrivalSpawn,
  isMessengerEncounterReady,
  MESSENGER_INSTANCE_ID,
  MESSENGER_LEFT_ID,
  MESSENGER_MET_ID,
  MESSENGER_CAPTION_ID,
  shouldShowMessengerCaption,
  shouldStartMessengerEncounter,
  type Arrival,
} from "./day2Opening";
import type { GameDevStart } from "./devStart";
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

// "holding" is the black screen of a trip that shows a line (fast travel): the
// scene change waits there, fully covered, until the line has been read.
type Phase = "playing" | "fading-out" | "holding" | "fading-in";
type WorldState = { sceneId: SceneId; spawnName: string; arrival: number };
// Owns the current scene, the navigation and the fade. The keyboard input
// lives here (not in the scenes), so keys that stay physically held survive a
// scene change and keep walking once the fade ends.
export function GameWorld({
  language,
  devStart,
}: {
  language: Language;
  // A development start (see /dev/day2). The real game never passes it.
  devStart?: GameDevStart;
}) {
  const input = useDirectionInput();
  const [world, setWorld] = useState<WorldState>(() => {
    const start = devStart
      ? getChapterStart(devStart.chapterId)
      : CHAPTER_START;

    return {
      sceneId: start.sceneId,
      spawnName: start.spawnName,
      arrival: 0,
    };
  });
  const dialogue = useDialogue();
  const startDialogue = dialogue.start;
  const [phase, setPhase] = useState<Phase>("playing");
  // The active chapter (= the day). It starts at the initial one and only
  // moves when a closing says so (Day 1 > Day 2, see the closing below).
  const [chapterId, setChapterId] = useState(
    devStart?.chapterId ?? INITIAL_CHAPTER_ID,
  );
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
    () =>
      devStart === undefined &&
      CHAPTER_START.opening !== undefined &&
      openingConversation !== null,
  );
  // The closing of Day 1 (a narrative interlude, like the opening) blocks the
  // world exactly as the opening does.
  const [closingActive, setClosingActive] = useState(false);
  const [closingChapter, setClosingChapter] = useState("chapter-1");
  const interludeActive = openingActive || closingActive;

  // Main interfaces. They never open on top of each other, of a conversation
  // or during a scene fade, and each one blocks the Doctor while it is up.
  const [bookOpen, setBookOpen] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisSession | null>(null);
  const diagnosisRef = useRef<DiagnosisSession | null>(null);
  const updateDiagnosis = useCallback((next: DiagnosisSession | null) => {
    diagnosisRef.current = next;
    setDiagnosis(next);
  }, []);
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
    devStart?.patients ?? CHAPTER1_INITIAL_PATIENTS,
  );
  const patientsRef = useRef(patients);
  // One-time narrative rewards already received (session only). Kept apart
  // from the patients: a case is "treated" with or without its thank-you.
  const [claimedRewards, setClaimedRewards] = useState<ReadonlySet<string>>(
    new Set(devStart?.claimedRewards),
  );
  const claimedRewardsRef = useRef(claimedRewards);
  const [learnedRecipeIds, setKnownRecipeIds] = useState<ReadonlySet<string>>(
    new Set(),
  );
  const learnedRecipesRef = useRef<ReadonlySet<string>>(new Set(devStart?.knownRecipeIds));
  const rememberRecipes = useCallback((nextInventory: InventoryState): boolean => {
    const current = learnedRecipesRef.current;
    const next = learnRecipesFromItems(current,
      nextInventory.slots.flatMap(slot => slot ? [slot.itemId] : []));
    if (next === current) return false;
    learnedRecipesRef.current = next;
    setKnownRecipeIds(next);
    return true;
  }, []);
  // What the Book shows: what was learned in this game, plus (only for a dev
  // start) the recipes its finished Day 1 would have shown.
  const knownRecipeIds = useMemo(
    () =>
      devStart
        ? new Set([...devStart.knownRecipeIds, ...learnedRecipeIds])
        : learnedRecipeIds,
    [devStart, learnedRecipeIds],
  );
  // What happens when the conversation on screen ends (a scripted flow).
  const afterDialogueRef = useRef<
    | "go-to-examination"
    | "examination-finished"
    | "leave-bedroom"
    | "leave-messenger"
    | "diagnosis-retry"
    | "diagnosis-confirmed"
    | null
  >(null);
  const examinationStartedRef = useRef(false);
  // The closing moves the story to the next chapter once (never twice).
  const chapterAdvancedRef = useRef(false);
  // The case whose examination is under way (the baker's husband unless a
  // conversation says otherwise).
  const examiningPatientRef = useRef<string>(BAKER_HUSBAND_ID);
  // A one-off remark of the Doctor after a pick-up (not a conversation).
  const [pickupBark, setPickupBark] = useState<{
    id: number;
    text: string;
  } | null>(null);
  // What the Doctor carries and which world collectibles he has picked up.
  // Both live here, above the scenes, so they survive scene changes; they last
  // for the session (no saving yet). The ref mirrors the inventory so two
  // pickups in the same frame cannot both read a stale one.
  const [inventory, setInventory] = useState<InventoryState>(
    () => devStart?.inventory ?? createChapter1Inventory(),
  );
  const inventoryRef = useRef(inventory);
  // The Apothecary storage: another InventoryState owned here, above the
  // scenes, for the session. Crafting never reads it.
  const [storage, setStorage] = useState<InventoryState>(
    () => devStart?.storage ?? createChapter1Storage(),
  );
  const storageRef = useRef(storage);
  // The copper coins in the Doctor's purse (a counter, not items). The ref
  // mirrors it for the same reason as the inventory's.
  const [coins, setCoins] = useState<number>(() => devStart?.coins ?? STARTING_COINS);
  // leaving the game forgets what the coin HUD last drew (see CoinHud)
  useEffect(() => resetCoinHudMemory, []);
  const coinsRef = useRef(coins);
  // The shop interface that is open (the merchant's counter) and its last line.
  const [openShop, setOpenShop] = useState<ShopDefinition | null>(null);
  const [shopMessage, setShopMessage] = useState<string | null>(null);
  const [collected, setCollected] = useState<CollectedInstanceIds>(() =>
    devStart ? new Set(devStart.collected) : NO_COLLECTED,
  );
  const [notice, setNotice] = useState<{ id: number; text: string } | null>(
    null,
  );
  const noticeId = notice?.id;
  // The tutorial only OBSERVES: the pieces below report what really happened.
  const tutorial = useTutorial(devStart?.tutorialStep);
  const notifyTutorial = tutorial.notify;
  // Which interaction the [E] prompt is for right now (null = none).
  // The word after the E over the Doctor's head: only the crafting stations have
  // one for now ("Preparar" at the table, "Cocinar" at the stove).
  const promptLabelFor = useCallback(
    (interactionId: string) => {
      const station = CRAFT_STATION_BY_INTERACTION_ID[interactionId];

      if (!station) return undefined;

      const word = craftingCopy[language].action[station];

      return word.charAt(0) + word.slice(1).toLowerCase();
    },
    [language],
  );
  const [availableInteractionId, setAvailableInteractionId] = useState<
    string | null
  >(null);
  // The Baker's Bedroom is a narrative scene: nothing opens and the Doctor does
  // not walk while the story is there.
  const inNarrativeScene = world.sceneId === "bakers-bedroom";
  const canOpenInterface =
    diagnosis === null &&
    phase === "playing" &&
    !interludeActive &&
    !dialogue.active &&
    craftingStation === null &&
    !storageOpen &&
    openShop === null &&
    !inNarrativeScene;
  const mapVisible = mapHeld && canOpenInterface && !bookOpen;
  const pendingRef = useRef<{
    sceneId: SceneId;
    spawnName: string;
    // A line to show over the black screen before arriving (fast travel).
    caption?: string;
    captionDurationMs?: number;
    // A fade that STAYS in the scene: nothing is swapped or re-mounted, the
    // Doctor keeps his place, and `whileBlack` runs while the screen is black.
    stay?: boolean;
    whileBlack?: () => void;
  } | null>(null);
  // The arrival the last transition completed. The Day 2 encounter belongs to
  // that arrival: it is read once, when control is back, and then forgotten.
  const arrivalRef = useRef<Arrival | null>(null);
  const [travelCaption, setTravelCaption] = useState<string | null>(null);
  const scene = WORLD_SCENES[world.sceneId];
  const spawn = getMessengerArrivalSpawn(
    chapterId,
    world,
    scene.arrivals[world.spawnName],
    claimedRewards,
  );
  // The Doctor is blocked (and nothing else can trigger) during a fade and
  // while a conversation is open; control returns when its last line closes.
  const isPlaying =
    phase === "playing" &&
    diagnosis === null &&
    !interludeActive &&
    !dialogue.active &&
    !bookOpen &&
    !mapVisible &&
    craftingStation === null &&
    !storageOpen &&
    openShop === null &&
    !inNarrativeScene;

  // A scene change takes the input away for a moment. Tell the run key that
  // THIS pause is a transition (so whoever was running and keeps Space held
  // gets the run back when control returns, with no new press); a dialogue or
  // an interface is any other pause and drops the run as before. It is a
  // layout effect so the mark is set before the scenes report "no input".
  useLayoutEffect(() => {
    if (phase === "playing") {
      input.run?.endTransition(isPlaying);
    } else {
      input.run?.beginTransition();
    }
  }, [phase, isPlaying, input]);

  // The Doctor's remarks while he keeps running: not a conversation, they
  // never block anything and go away the moment plain play stops.
  const runBark = useRunBark({ running: doctorRunning, enabled: isPlaying });

  useBookHotkeys({
    open: bookOpen,
    setOpen: (open) => {
      if (!open) {
        setBookOpen(false);
        const current = diagnosisRef.current;
        if (current?.stage === "book") updateDiagnosis({ ...current, stage: "choose" });
      } else if (diagnosisRef.current?.stage === "choose") {
        updateDiagnosis({ ...diagnosisRef.current, stage: "book" });
        setBookOpen(true);
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
    (sceneId: SceneId, spawnName: string, caption?: string, captionDurationMs?: number) => {
      if (phaseRef.current !== "playing" || diagnosisRef.current !== null) {
        return;
      }

      pendingRef.current = { sceneId, spawnName, caption, captionDurationMs };
      changePhase("fading-out");
    },
    [changePhase],
  );

  // A short fade that does not move the Doctor or change the scene: something
  // in the scene changes while the screen is black.
  const startStayFade = useCallback(
    (whileBlack: () => void) => {
      if (phaseRef.current !== "playing") {
        return;
      }

      pendingRef.current = {
        sceneId: world.sceneId,
        spawnName: world.spawnName,
        stay: true,
        whileBlack,
      };
      changePhase("fading-out");
    },
    [changePhase, world.sceneId, world.spawnName],
  );

  // Fast travel to the apothecary: only while plain exploration is available
  // (a pure rule), through the very same fade and the arrival of the street
  // door. It moves the Doctor and nothing else.
  const fastTravelAvailable = canFastTravel({
    sceneId: world.sceneId,
    phase,
    openingActive: interludeActive,
    tutorialStep: tutorial.step,
    dialogueActive: dialogue.active,
    bookOpen,
    mapVisible,
    storageOpen: storageOpen || openShop !== null,
    craftingOpen: craftingStation !== null,
    inNarrativeScene,
  });
  const handleFastTravel = useCallback(() => {
    if (!fastTravelAvailable) {
      return;
    }

    startTransition(
      FAST_TRAVEL_DESTINATION.sceneId,
      FAST_TRAVEL_DESTINATION.spawnName,
      fastTravelCopy[language].caption,
    );
  }, [fastTravelAvailable, language, startTransition]);

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
      let nextCoins = coinsRef.current;
      let earned = 0;
      const obtained: { itemId: string; quantity: number }[] = [];

      for (const effect of effects) {
        if (effect.type === "give-item") {
          const added = addItem(nextInventory, effect.itemId, effect.quantity);

          if (!added) {
            return false;
          }

          nextInventory = added;
          obtained.push({ itemId: effect.itemId, quantity: effect.quantity });
        } else if (effect.type === "take-item") {
          const removed = removeItem(
            nextInventory,
            effect.itemId,
            effect.quantity,
          );

          if (!removed) {
            return false;
          }

          nextInventory = removed;
        } else if (effect.type === "give-coins") {
          nextCoins = addCoins(nextCoins, effect.amount);
          earned += effect.amount;
        } else if (effect.type === "take-coins") {
          const paid = spendCoins(nextCoins, effect.amount);

          if (paid === null) {
            return false;
          }

          nextCoins = paid;
        } else if (effect.type === "claim-reward") {
          nextRewards = new Set([...nextRewards, effect.rewardId]);
        } else if (effect.type === "advance-patient") {
          nextPatients = advancePatient(
            nextPatients,
            effect.patientId,
            effect.to,
          );
        } else {
          const definition = getPatientDefinitions(nextRewards)[effect.patientId];
          const treated = treatPatient(nextPatients, definition, nextInventory);

          if (!treated) {
            return false;
          }

          nextPatients = treated.state;
          nextInventory = treated.inventory;

          // Patients pay once treated (Kilian's economy): a rule keyed by the
          // patient, so every conversation that treats one pays the same.
          const payment = getPatientPayment(effect.patientId);

          nextCoins = addCoins(nextCoins, payment);
          earned += payment;
        }
      }

      const recipesDiscovered = nextInventory !== inventoryRef.current && rememberRecipes(nextInventory);
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

      if (nextCoins !== coinsRef.current) {
        coinsRef.current = nextCoins;
        setCoins(nextCoins);
      }

      if (earned > 0) {
        showNotice(moneyCopy[language].received(earned));
      }

      for (const { itemId, quantity } of obtained) {
        showNotice(
          formatObtainedNotice(
            language,
            getItemName(itemId, language),
            quantity,
          ) + (recipesDiscovered ? ` ${recipeDiscoveryCopy[language]}` : ""),
        );
      }

      return true;
    },
    [language, showNotice, rememberRecipes],
  );

  // The Buy button of a shop: pay, receive and remember, all or nothing.
  const handleBuy = useCallback(
    (shop: ShopDefinition, entry: ShopEntry) => {
      const copy = moneyCopy[language];

      if (!canAfford(coinsRef.current, entry.price)) {
        setShopMessage(copy.notEnough);
        return;
      }

      const applied = applyStoryEffects(
        buyEffects(claimedRewardsRef.current, shop, entry),
      );

      setShopMessage(applied ? copy.spent(entry.price) : copy.noRoom);
    },
    [language, applyStoryEffects],
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
      if (!toStorage && rememberRecipes(nextInventory)) {
        showNotice(recipeDiscoveryCopy[language]);
      }
    },
    [language, showNotice, rememberRecipes],
  );

  // The scene only reports WHICH interaction was activated (and the decor
  // instance it belongs to); a data table turns the id into a conversation in
  // the current language. Nothing here knows what an interactionId means.
  const handleInteract = useCallback(
    (
      interactionId: string,
      source: { instanceId?: string; itemId?: string; quantity?: number },
    ) => {
      if (phaseRef.current !== "playing" || diagnosisRef.current !== null) {
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

      // A seller: open the buying interface.
      const shop = getShop(interactionId);

      if (shop) {
        setShopMessage(null);
        setOpenShop(shop);
        return;
      }

      // A collectible: pick it up if it fits, otherwise leave it where it is.
      if (source.itemId && source.instanceId) {
        const quantity = source.quantity ?? 1;
        const next = canAddItem(inventoryRef.current, source.itemId)
          ? addItem(inventoryRef.current, source.itemId, quantity)
          : null;
        const copy = itemFeedbackCopy[language];
        const showNotice = (text: string) =>
          setNotice((current) => ({ id: (current?.id ?? 0) + 1, text }));

        if (next) {
          const recipesDiscovered = rememberRecipes(next);
          inventoryRef.current = next;
          setInventory(next);
          setCollected((current) => markCollected(current, source.instanceId!));
          showNotice(
            formatObtainedNotice(
              language,
              getItemName(source.itemId, language),
              quantity,
            ) + (recipesDiscovered ? ` ${recipeDiscoveryCopy[language]}` : ""),
          );

          // A group (a branch of oranges) earns a remark; a single one does not.
          const bark =
            quantity > 1 ? collectBarkCopy[language][source.itemId] : undefined;

          if (bark) {
            setPickupBark((current) => ({
              id: (current?.id ?? 0) + 1,
              text: bark,
            }));
          }
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
        if (outcome.patientId) {
          examiningPatientRef.current = outcome.patientId;
        }

        afterDialogueRef.current =
          outcome.after === "go-to-examination"
            ? "go-to-examination"
            : outcome.after === "examine-in-place"
              ? "examination-finished"
              : null;
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
    [language, startDialogue, applyStoryEffects, showNotice, rememberRecipes],
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

  // THE END OF DAY 1, derived from the cases and one claimed flag (see
  // patients/day1.ts). Everything reads the refs, never a stale render, so a
  // remount or a double effect cannot close the day twice.
  const claimFlag = useCallback((flag: string) => {
    const next = new Set([...claimedRewardsRef.current, flag]);

    claimedRewardsRef.current = next;
    setClaimedRewards(next);
  }, []);

  const handleExit = useCallback(
    (exitName: string) => {
      const exit = WORLD_SCENES[world.sceneId].exits.find(
        (candidate) => candidate.name === exitName,
      );

      if (exit) {
        // A shut door (the Witch's house): a short notice, no transition.
        const locked = getLockedDoorNotice(world.sceneId, exit.targetScene, chapterId, language);
        if (locked) {
          showNotice(locked);
          return;
        }
        const showMessengerCaption =
          world.sceneId === "apothecary-interior" &&
          shouldShowMessengerCaption(
            chapterId,
            { sceneId: exit.targetScene, spawnName: exit.targetSpawn },
            claimedRewardsRef.current,
          );
        if (showMessengerCaption && phaseRef.current === "playing") {
          claimFlag(MESSENGER_CAPTION_ID);
        }
        startTransition(
          exit.targetScene,
          exit.targetSpawn,
          showMessengerCaption ? day2OpeningCopy[language].caption : undefined,
          showMessengerCaption ? 4000 : undefined,
        );
      }
    },
    [world.sceneId, chapterId, language, claimFlag, startTransition, showNotice],
  );

  // The closing is ONE sequence: the narrative interlude over the supper
  // picture for Day 1 and the fireplace picture for Day 2 (its first line is
  // the caption about going home), and
  // while the picture covers the game the next chapter becomes the active one
  // and the Doctor wakes in the Doctor's Room. Nothing of Day 1 (inventory,
  // storage, recipes, cases, flags, collected things) is touched.
  const startNextChapter = useCallback(() => {
    // Every closing (Day 1, 2 and 3) leads to the next chapter (2026-11-12: Day 3
    // and Day 4 exist now).
    const nextChapterId = getNextChapterId(chapterId);

    if (nextChapterId === null || chapterAdvancedRef.current) {
      return;
    }

    chapterAdvancedRef.current = true;

    const start = getChapterStart(nextChapterId);

    pendingRef.current = null;
    setChapterId(nextChapterId);
    setWorld((current) => ({
      sceneId: start.sceneId,
      spawnName: start.spawnName,
      arrival: current.arrival + 1,
    }));
  }, [chapterId]);
  const finishClosing = useCallback(() => {
    // Covered already when the interlude ended early (Esc); harmless otherwise.
    startNextChapter();
    setClosingActive(false);
  }, [startNextChapter]);
  const closingConversation = useMemo(
    () => localizeConversation(
      closingChapter === "chapter-3" ? day3Closing : closingChapter === "chapter-2" ? day2Closing : day1Closing,
      language,
      DOCTOR_SPEAKER,
    ),
    [language, closingChapter],
  );

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
    const patientId = examiningPatientRef.current;
    const definition = getPatientDefinitions(claimedRewardsRef.current)[patientId];
    const inPlace = definition.examination === "in-place";
    // A case that was never announced is noticed by looking at him.
    const noticed = advancePatient(
      patientsRef.current,
      patientId,
      "discovered",
    );
    const examined = advancePatient(noticed, patientId, "examined");

    patientsRef.current = examined;
    setPatients(examined);
    const learned = new Set([...learnedRecipesRef.current, ...definition.revealsRecipeIds]);
    learnedRecipesRef.current = learned;
    setKnownRecipeIds(learned);

    // An in-place examination already said everything in its own conversation
    // and stays in the scene; the narrative one thinks out loud and goes back.
    const thoughts = inPlace
      ? null
      : buildMissingIngredientConversation(
          getPatientMissingIngredients(definition, inventoryRef.current),
          language,
        );

    if (thoughts) {
      afterDialogueRef.current = "leave-bedroom";
      startDialogue(thoughts);
    } else if (!inPlace) {
      startTransition("bakery-interior", "from-bakers-bedroom");
    }
  }, [language, startDialogue, startTransition]);

  const beginDiagnosis = useCallback(() => {
    const patientId = examiningPatientRef.current;
    if (!DIAGNOSIS_SYMPTOMS[patientId]) { finishExamination(); return; }
    const noticed = advancePatient(patientsRef.current, patientId, "discovered");
    patientsRef.current = noticed;
    setPatients(noticed);
    updateDiagnosis({ patientId, stage: "choose" });
  }, [finishExamination, updateDiagnosis]);

  const chooseDiagnosis = useCallback((choice: string) => {
    const current = diagnosisRef.current;
    if (current?.stage !== "choose") return;
    const result = checkDiagnosis(current.patientId, choice);
    if (result === "invalid") return;
    const correct = result === "correct";
    updateDiagnosis({ ...current, stage: correct ? "confirm" : "review" });
    afterDialogueRef.current = correct ? "diagnosis-confirmed" : "diagnosis-retry";
    startDialogue(diagnosisConversation(current.patientId, language, correct));
  }, [language, startDialogue, updateDiagnosis]);

  const consultDiagnosis = useCallback(() => {
    const current = diagnosisRef.current;
    if (current?.stage !== "choose") return;
    updateDiagnosis({ ...current, stage: "book" });
    setBookOpen(true);
  }, [updateDiagnosis]);

  useEffect(() => {
    if (dialogue.active) {
      return;
    }

    const action = afterDialogueRef.current;

    afterDialogueRef.current = null;

    if (action === "go-to-examination") {
      startTransition("bakers-bedroom", "narrative");
    } else if (action === "examination-finished") {
      beginDiagnosis();
    } else if (action === "diagnosis-retry") {
      const current = diagnosisRef.current;
      if (current?.stage === "review") updateDiagnosis({ ...current, stage: "choose" });
    } else if (action === "diagnosis-confirmed") {
      if (diagnosisRef.current?.stage === "confirm") {
        updateDiagnosis(null);
        finishExamination();
      }
    } else if (action === "leave-bedroom") {
      startTransition("bakery-interior", "from-bakers-bedroom");
    } else if (action === "leave-messenger") {
      // The woman goes: a short fade, and her instance is out of the world
      // for the rest of the game (narrative flag, never the collected set).
      startStayFade(() => claimFlag(MESSENGER_LEFT_ID));
    }
  }, [
    dialogue.active,
    startTransition,
    finishExamination,
    beginDiagnosis,
    updateDiagnosis,
    startStayFade,
    claimFlag,
  ]);

  // The day closes by itself when the LAST case is done: only at a moment of
  // plain play, i.e. after the whole conversation of that treatment (its lines,
  // its goodbye and its effects) has closed, and never over a scripted step of
  // another flow or a fade. It is declared after the effect above so a flow
  // that just started a transition is seen here.
  const closingChapterAvailable = chapterId === "chapter-1" && getNextChapterId(chapterId) !== null;

  useEffect(() => {
    if (
      isPlaying &&
      phaseRef.current === "playing" &&
      afterDialogueRef.current === null &&
      closingChapterAvailable &&
      shouldCloseDay1(patientsRef.current, claimedRewardsRef.current)
    ) {
      claimFlag(DAY1_COMPLETED_ID);
      setClosingChapter("chapter-1");
      chapterAdvancedRef.current = false;
      setClosingActive(true);
    }
  }, [isPlaying, patients, claimedRewards, closingChapterAvailable, claimFlag]);

  useEffect(() => {
    if (chapterId === "chapter-2" && isPlaying && phaseRef.current === "playing" &&
      afterDialogueRef.current === null && shouldCloseDay2(patientsRef.current, claimedRewardsRef.current)) {
      claimFlag(DAY2_COMPLETED_ID);
      setClosingChapter("chapter-2");
      chapterAdvancedRef.current = false;
      setClosingActive(true);
    }
  }, [chapterId, isPlaying, patients, claimedRewards, claimFlag]);

  // The closing of Day 3: the same rule as Day 2, over its own cases.
  useEffect(() => {
    if (chapterId === "chapter-3" && isPlaying && phaseRef.current === "playing" &&
      afterDialogueRef.current === null && shouldCloseDay3(patientsRef.current, claimedRewardsRef.current)) {
      claimFlag(DAY3_COMPLETED_ID);
      setClosingChapter("chapter-3");
      chapterAdvancedRef.current = false;
      setClosingActive(true);
    }
  }, [chapterId, isPlaying, patients, claimedRewards, claimFlag]);

  // THE OPENING ENCOUNTER OF DAY 2. It belongs to the arrival that follows the
  // Botica's street door: read once, when the transition is over and control is
  // back. If its data is not there (no placement or no approved text) it does
  // nothing, claims nothing and the arrival is simply forgotten. Declared after
  // the after-dialogue effect, like the closing, so a flow that just started a
  // transition is seen here.
  const messengerReady = isMessengerEncounterReady(chapterId);

  useEffect(() => {
    if (!isPlaying || phaseRef.current !== "playing") {
      return;
    }

    const arrival = arrivalRef.current;

    arrivalRef.current = null;

    if (
      afterDialogueRef.current === null &&
      MESSENGER_INSTANCE_ID !== null &&
      shouldStartMessengerEncounter({
        chapterId,
        arrival,
        claimedRewards: claimedRewardsRef.current,
        ready: messengerReady,
      })
    ) {
      claimFlag(MESSENGER_MET_ID);
      afterDialogueRef.current = "leave-messenger";
      startDialogue(
        localizeConversation(messengerOpening, language, MESSENGER_INSTANCE_ID),
      );
    }
  }, [
    isPlaying,
    chapterId,
    messengerReady,
    language,
    claimFlag,
    startDialogue,
  ]);

  // What the story keeps out of the world (the woman, once she has left).
  const narrativeHiddenInstanceIds = useMemo(
    () => getNarrativeHiddenInstanceIds(claimedRewards),
    [claimedRewards],
  );

  // Once the fade into the bedroom is over, the examination starts (once).
  useEffect(() => {
    if (!inNarrativeScene) {
      examinationStartedRef.current = false;
      return;
    }

    if (phase !== "playing" || examinationStartedRef.current) {
      return;
    }

    const examination = getExaminationConversation(
      examiningPatientRef.current,
      language,
    );

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

        // A fade that stays: the change happens under the black and the
        // scene, the arrival and the Doctor's place are left as they are.
        if (pending?.stay) {
          pendingRef.current = null;
          pending.whileBlack?.();
          changePhase("fading-in");
          return;
        }

        // A trip with a line waits on the black screen until it is read.
        if (pending?.caption) {
          setTravelCaption(pending.caption);
          changePhase("holding");
          return;
        }

        pendingRef.current = null;

        if (!pending) {
          changePhase("playing");
          return;
        }

        arrivalRef.current = {
          sceneId: pending.sceneId,
          spawnName: pending.spawnName,
        };
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

    if (phase === "holding") {
      const timeoutId = window.setTimeout(() => {
        const pending = pendingRef.current;

        pendingRef.current = null;
        setTravelCaption(null);

        if (!pending) {
          changePhase("playing");
          return;
        }

        arrivalRef.current = {
          sceneId: pending.sceneId,
          spawnName: pending.spawnName,
        };
        setWorld((current) => ({
          sceneId: pending.sceneId,
          spawnName: pending.spawnName,
          arrival: current.arrival + 1,
        }));
        changePhase("fading-in");
      }, pendingRef.current?.captionDurationMs ?? FAST_TRAVEL_CAPTION_MS);

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
    openingActive: interludeActive,
    inNarrativeScene,
    tutorialDone: tutorial.step === "done",
    bookOpen,
    storageOpen: storageOpen || openShop !== null,
    craftingOpen: craftingStation !== null,
    mapVisible,
  });
  // A pick-up remark does not outlive plain play either.
  if (!isPlaying && pickupBark !== null) {
    setPickupBark(null);
  }

  const renderRunBark = (context: SceneOverlayContext) => {
    const anchor = context.getSpeakerAnchor(DOCTOR_SPEAKER);

    if (pickupBark && anchor) {
      return (
        <PlayerBark
          key={`pickup-${pickupBark.id}`}
          text={pickupBark.text}
          anchorX={anchor.x}
          anchorY={anchor.y}
          frameWidth={context.frameWidth}
          frameHeight={context.frameHeight}
          onDone={() => setPickupBark(null)}
        />
      );
    }

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
  // The errands panel's list: derived from the cases, never stored.
  const objectives = useMemo(
    () => getObjectives(patients, language),
    [patients, language],
  );
  const renderSceneOverlay = (context: SceneOverlayContext) => (
    <>
      {renderDialogue(context)}
      {renderRunBark(context)}
      {inventoryHudVisible ? (
        <InventoryHud inventory={inventory} language={language} />
      ) : null}
      {inventoryHudVisible ? <CoinHud coins={coins} language={language} /> : null}
      {inventoryHudVisible ? (
        <ObjectivesPanel
          objectives={objectives}
          language={language}
          keyboardActive={isPlaying && !dialogue.active}
        />
      ) : null}
    </>
  );

  // The characters with news for the Doctor: derived from the cases (a case
  // that is only discovered still waits for its visit, a treated one may still
  // owe its thank-you).
  const attentionInstanceIds = useMemo(
    () => getAttentionInstanceIds(patients, claimedRewards, inventory),
    [patients, claimedRewards, inventory],
  );

  // What the known cases still need to be prepared; any other recipe is refused
  // in the crafting interface ("I don't need that right now").
  const activeTreatments = useMemo(
    () => getActiveTreatments(patients, getPatientDefinitions(claimedRewards)),
    [patients, claimedRewards],
  );
  const craftableOutputs = useMemo(
    () => getCraftingTargets(activeTreatments, inventory),
    [activeTreatments, inventory],
  );

  // "!" over painted zones (not placed instances): today the baker's flour sack
  // in Day 2, once she has allowed it and flour is still missing.
  const attentionPoints = useMemo(
    () =>
      world.sceneId === FLOUR_SACK_MARK.sceneId &&
      shouldMarkFlourSack(patients, claimedRewards, inventory)
        ? [{ id: "chapter2-flour-sack-attention", x: FLOUR_SACK_MARK.x, y: FLOUR_SACK_MARK.y }]
        : [],
    [world.sceneId, patients, claimedRewards, inventory],
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
    !interludeActive &&
    !dialogue.active &&
    (!bookOpen || hintOverBook) &&
    !mapVisible &&
    craftingStation === null &&
    (!storageOpen || hintOverStorage) &&
    openShop === null &&
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
          promptLabelFor={promptLabelFor}
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
          hiddenInstanceIds={narrativeHiddenInstanceIds}
          attentionInstanceIds={attentionInstanceIds}
          attentionPoints={attentionPoints}
          renderOverlay={renderSceneOverlay}
          onPlayerMoved={handlePlayerMoved}
          onRunningChange={setDoctorRunning}
          onInteractionAvailable={setAvailableInteractionId}
          promptLabelFor={promptLabelFor}
        />
      )}
      {bookOpen ? (
        <BookOverlay
          context={{ language, patients, inventory, knownRecipeIds, storyFlags: claimedRewards, diagnosisPatientId: diagnosis?.patientId }}
          // While the tutorial teaches page turning, the book opens on a section
          // with several pages made of things the Doctor already knows
          // (PACIENTES has a single page at the start). INGREDIENTES, not
          // DOLENCIAS: its pages are plain descriptions, whereas the ailment
          // pages already spell out future treatments. Only the tab changes.
          initialSectionId={
            diagnosis !== null ? "ailments" : tutorialStep === "book" || tutorialStep === "book-page"
              ? "ingredients"
              : undefined
          }
          onPageChange={() => notifyTutorial("book-page-changed")}
          onSectionChange={() => notifyTutorial("book-tab-changed")}
        />
      ) : null}
      {diagnosis?.stage === "choose" && !dialogue.active && !bookOpen ? (
        <DiagnosisOverlay patientId={diagnosis.patientId} language={language}
          onChoose={chooseDiagnosis} onConsult={consultDiagnosis} />
      ) : null}
      {mapVisible ? (
        <MapOverlay currentLocationId={SCENE_TO_MAP_LOCATION[world.sceneId]} language={language} />
      ) : null}
      {craftingStation ? (
        <CraftingOverlay
          key={craftingStation}
          station={craftingStation}
          inventory={inventory}
          language={language}
          craftableOutputs={craftableOutputs}
          activeTreatments={activeTreatments}
          onOpenMortar={() => setCraftingStation("mortar")}
          onBackToTable={() => setCraftingStation("manual")}
          onInventoryChange={(next) => {
            inventoryRef.current = next;
            setInventory(next);
            if (rememberRecipes(next)) showNotice(recipeDiscoveryCopy[language]);
          }}
          onAnalyzeSample={craftingStation === "manual" && canAnalyzeFarmerSample(patients, claimedRewards) ? () => {
            if (!canAnalyzeFarmerSample(patientsRef.current, claimedRewardsRef.current)) return;
            claimFlag(FARMER_ANALYSIS_ID);
            const learned = new Set([...learnedRecipesRef.current, ...FARMER_RECIPE_IDS]);
            learnedRecipesRef.current = learned;
            setKnownRecipeIds(learned);
            setCraftingStation(null);
            startDialogue(localizeConversation(farmerAnalysisResult, language, "doctor"));
          } : undefined}
          onClose={() => setCraftingStation(null)}
        />
      ) : null}
      {openShop ? (
        <ShopOverlay
          shop={shopForChapter(openShop, chapterId)}
          coins={coins}
          claimedRewards={claimedRewards}
          language={language}
          message={shopMessage}
          onBuy={(entry) => handleBuy(openShop, entry)}
          onClose={() => setOpenShop(null)}
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
      <CompendiumNotice context={{ language, patients, inventory, knownRecipeIds, storyFlags: claimedRewards, diagnosisPatientId: diagnosis?.patientId }} />
      {fastTravelAvailable ? (
        <FastTravelButton
          label={fastTravelCopy[language].label}
          onTravel={handleFastTravel}
        />
      ) : null}
      {phase === "holding" && travelCaption ? (
        <TravelCaption text={travelCaption} />
      ) : null}
      <div
        className="title-screen-fade"
        data-scene={world.sceneId}
        data-phase={phase}
        style={{
          opacity: phase === "fading-out" || phase === "holding" ? 1 : 0,
          pointerEvents: isPlaying ? "none" : "auto",
          transitionDuration: `${SCENE_FADE_MS}ms`,
        }}
      />
      {closingActive ? (
        <div className={dayClosingStyles.fadeIn}>
          <NarrativeInterlude
            illustration={closingChapter === "chapter-3"
              ? NARRATIVE_ILLUSTRATIONS["doctor-writing"]
              : closingChapter === "chapter-2"
                ? NARRATIVE_ILLUSTRATIONS["doctor-fireplace"]
                : NARRATIVE_ILLUSTRATIONS["doctor-eating"]}
            conversation={closingConversation}
            language={language}
            onCovered={startNextChapter}
            onFinished={finishClosing}
          />
        </div>
      ) : null}
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
