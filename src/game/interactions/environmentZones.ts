import type { InteractionZone } from "./interactionZone";

// Paste Kilian's manually painted interaction exports here, grouped by runtime
// scene id. Kept separate from colliders, spawns and chapter populations.
export const environmentZonesByScene: Record<string, InteractionZone[]> = {
  plaza: [
    { id: "plaza-interaction-1", x: 967, y: 254, width: 103, height: 21, interactionId: "world.plaza.noticeboard" },
    { id: "plaza-interaction-2", x: 399, y: 403, width: 97, height: 21, interactionId: "world.plaza.well" },
    { id: "plaza-interaction-3", x: 718, y: 607, width: 109, height: 25, interactionId: "world.plaza.statue" },
  ],
};
