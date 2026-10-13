import type { InteractionZone } from "../interactions/interactionZone";

// INTERACTIONS (green) of the Outskirts.
//
// PENDING, to be painted by hand: the river is where the Doctor takes water.
// Paint a zone on the bank in /dev/collisions (scene "outskirts") with the
// interactionId "gather.water" and paste it here. Several zones may share the
// id. No position is guessed in code: until a zone is painted there is no way
// to get water in the game.
export const outskirtsInteractions: InteractionZone[] = [];
