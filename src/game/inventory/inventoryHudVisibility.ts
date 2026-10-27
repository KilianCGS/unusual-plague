// WHEN the inventory bar (InventoryHud) is on screen. A pure rule over what
// GameWorld already knows, so it can be tested without rendering anything.
//
// Visible during normal play, and also while a conversation is open. Hidden
// while anything else takes the screen or the Doctor cannot be acted with:
// an interface (Book, Storage, Crafting, Map), the black half of a
// scene change, the opening, a narrative scene, and the tutorial (its hint uses
// the same bottom-centre strip for now).
//
// Only "fading-out" hides it: from "fading-in" on, the new scene is already
// on screen (the black veil is just fading away over it), so the bar is there
// on the first visible frame instead of waiting for "playing".
export type InventoryHudContext = {
  // "playing" | "fading-out" | "fading-in"
  phase: string;
  openingActive: boolean;
  inNarrativeScene: boolean;
  tutorialDone: boolean;
  bookOpen: boolean;
  storageOpen: boolean;
  craftingOpen: boolean;
  mapVisible: boolean;
};

export function isInventoryHudVisible(context: InventoryHudContext): boolean {
  return (
    context.phase !== "fading-out" &&
    !context.openingActive &&
    !context.inNarrativeScene &&
    context.tutorialDone &&
    !context.bookOpen &&
    !context.storageOpen &&
    !context.craftingOpen &&
    !context.mapVisible
  );
}
