import type { SceneId } from "./worldScenes";

// FAST TRAVEL to the apothecary: a generic exploration ability, not a quest
// step. It only MOVES the Doctor (through the same fade and spawn as walking
// there); it never touches patients, rewards, chapters or any story flag.
//
// It lands on the arrival of the Botica's street door, exactly where walking in
// from the Apothecary Street would leave him, so a later "the Doctor came back
// to the Botica" check cannot tell the two ways of arriving apart.
export const FAST_TRAVEL_DESTINATION: { sceneId: SceneId; spawnName: string } =
  { sceneId: "apothecary-interior", spawnName: "from-apothecary-street" };

// Home already: the Botica and the Doctor's Room above it.
export const FAST_TRAVEL_HOME_SCENES: readonly SceneId[] = [
  "apothecary-interior",
  "doctor-room",
];

// How long the caption stays on the black screen (display time only).
export const FAST_TRAVEL_CAPTION_MS = 1600;

// What GameWorld already knows. "phase" is the scene-change phase.
export type FastTravelContext = {
  sceneId: SceneId;
  // "playing" | "fading-out" | "holding" | "fading-in"
  phase: string;
  openingActive: boolean;
  // The tutorial's "intro" step is the opening monologue still running.
  tutorialStep: string;
  dialogueActive: boolean;
  bookOpen: boolean;
  mapVisible: boolean;
  storageOpen: boolean;
  craftingOpen: boolean;
  inNarrativeScene: boolean;
};

// Pure rule: plain exploration, outside the Botica and the Doctor's Room.
export function canFastTravel(context: FastTravelContext): boolean {
  return (
    context.phase === "playing" &&
    !context.openingActive &&
    context.tutorialStep !== "intro" &&
    !context.dialogueActive &&
    !context.bookOpen &&
    !context.mapVisible &&
    !context.storageOpen &&
    !context.craftingOpen &&
    !context.inNarrativeScene &&
    !FAST_TRAVEL_HOME_SCENES.includes(context.sceneId)
  );
}
