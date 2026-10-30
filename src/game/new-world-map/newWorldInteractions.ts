import type { InteractionZone } from "../interactions/interactionZone";

// The river bank where the Doctor takes water in the new Outskirts: the zone
// painted BY HAND in /dev/collisions (source of truth, do not move or resize
// it). The hand export left its interactionId empty; it is the water the
// Patient 1 flow already resolves (gather.water, see storyInteractions.ts).
export const newWorldOutskirtsInteractions: InteractionZone[] = [
  {
    id: "outskirts-interaction-1",
    x: 474,
    y: 656,
    width: 39,
    height: 69,
    interactionId: "gather.water",
  },
];
