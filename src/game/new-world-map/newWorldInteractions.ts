import type { InteractionZone } from "../interactions/interactionZone";

// The river bank where the Doctor takes water, adapted to the new Outskirts.
// The old zone was painted on the old river bank; this is the same idea (the
// grass strip on the west bank of the southern canal, 0.85 unit per pixel) and
// NOT a measured equivalent: review it in /dev/collisions.
export const newWorldOutskirtsInteractions: InteractionZone[] = [
  {
    id: "outskirts-interaction-1",
    x: 408,
    y: 553,
    width: 77,
    height: 94,
    interactionId: "gather.water",
  },
];
