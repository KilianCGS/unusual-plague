import type { InteractionZone } from "../interactions/interactionZone";

// INTERACTIONS (green): where and from which facing the player can interact.
// `interactionId` names WHAT is interacted with; resolving it lives elsewhere.
//
// PROVISIONAL: the four sides of the pilot villager (feet anchor 700,350; body
// collider x 676-724, y 270-336). Each zone is a thin band flush against the
// collider, so the player is in it exactly when standing blocked against that
// side. requiredDirection is the facing TOWARD the villager.
export const plazaInteractions: InteractionZone[] = [
  // Player south of the villager, facing north.
  {
    id: "plaza-interaction-1",
    x: 676,
    y: 336,
    width: 48,
    height: 18,
    interactionId: "plaza-villager-01",
    requiredDirection: "north",
  },
  // Player north of the villager, facing south.
  {
    id: "plaza-interaction-2",
    x: 676,
    y: 252,
    width: 48,
    height: 18,
    interactionId: "plaza-villager-01",
    requiredDirection: "south",
  },
  // Player west of the villager, facing east.
  {
    id: "plaza-interaction-3",
    x: 658,
    y: 270,
    width: 18,
    height: 66,
    interactionId: "plaza-villager-01",
    requiredDirection: "east",
  },
  // Player east of the villager, facing west.
  {
    id: "plaza-interaction-4",
    x: 724,
    y: 270,
    width: 18,
    height: 66,
    interactionId: "plaza-villager-01",
    requiredDirection: "west",
  },
];
