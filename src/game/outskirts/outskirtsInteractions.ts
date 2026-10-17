import type { InteractionZone } from "../interactions/interactionZone";

// INTERACTIONS (green) of the Outskirts, painted by hand in /dev/collisions.
// The river bank is where the Doctor takes water; the river itself is part of
// the background and the zone never blocks movement.
export const outskirtsInteractions: InteractionZone[] = [
  {
    id: "outskirts-interaction-1",
    x: 427,
    y: 522,
    width: 35,
    height: 66,
    interactionId: "gather.water",
  },
];
