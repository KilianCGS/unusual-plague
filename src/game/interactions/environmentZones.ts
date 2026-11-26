import type { InteractionZone } from "./interactionZone";

// Paste Kilian's manually painted interaction exports here, grouped by runtime
// scene id. Kept separate from colliders, spawns and chapter populations.
export const environmentZonesByScene: Record<string, InteractionZone[]> = {
  plaza: [
    { id: "plaza-interaction-1", x: 967, y: 254, width: 103, height: 21, interactionId: "world.plaza.noticeboard" },
    { id: "plaza-interaction-2", x: 399, y: 403, width: 97, height: 21, interactionId: "world.plaza.well" },
    { id: "plaza-interaction-3", x: 718, y: 607, width: 109, height: 25, interactionId: "world.plaza.statue" },
    // 2026-11-27 (Kilian's export): the other three sides of the well; every zone of the well draws water.
    { id: "plaza-interaction-4", x: 404, y: 308, width: 91, height: 15, interactionId: "world.plaza.well" },
    { id: "plaza-interaction-5", x: 382, y: 314, width: 23, height: 86, interactionId: "world.plaza.well" },
    { id: "plaza-interaction-6", x: 485, y: 378, width: 18, height: 23, interactionId: "world.plaza.well" },
  ],
  // The baker's flour sack: the two lower rectangles are where the Doctor can
  // interact. The third rectangle (x227 y84 12x10) only says where the "!"
  // goes (FLOUR_SACK_MARK in chapter2Supplies.ts) and is NOT an interaction.
  "bakery-interior": [
    { id: "bakery-interior-interaction-1", x: 218, y: 130, width: 29, height: 8, interactionId: "chapter2.bakery.flourSack" },
    { id: "bakery-interior-interaction-2", x: 215, y: 115, width: 6, height: 13, interactionId: "chapter2.bakery.flourSack" },
  ],
};
