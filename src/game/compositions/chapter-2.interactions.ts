import { getDecorAsset } from "../decor/decorAssets";
import type { DecorInteraction } from "../decor/decorTypes";
import { chapter2Compositions } from "./chapter-2";
import { chapter1Interactions } from "./chapter-1.interactions";

const ids: Record<string, string> = {
  "granary-interior-farmer-hoeing-sick-lying-01": "chapter2.granary.farmer",
  "granary-interior-elderly-woman-with-cane-01": "chapter2.granary.carer",
  "bakery-interior-baker-01": "chapter2.bakery.baker",
  "bakery-street-villager-man-01-01": "chapter2.bakeryStreet.man",
  "bakery-street-villager-woman-02-01": "chapter2.bakeryStreet.woman",
  "farm-villager-woman-01-01": "chapter2.farm.woman",
  "forest-woodcutter-day2-tired-01": "chapter2.forest.woodcutter",
  "mill-farmland-villager-man-02-01": "chapter2.mill.neighbour",
  // Only takes effect if Kilian places the beekeeper in Chapter 2.
  "mill-farmland-beekeeper-01": "chapter2.mill.beekeeper",
  "mine-interior-miner-recovering-working-01": "chapter2.mine.recoveringMiner",
  "mine-natural-cave-witch-cave-lantern-01": "chapter2.cave.witch",
  "outskirts-villager-young-01": "chapter2.outskirts.young",
  "outskirts-fisherman-01": "chapter2.outskirts.fisherman",
  "smithy-interior-blacksmith-day2-hurt-hand-01": "chapter2.smithy.blacksmith",
  "tavern-interior-bartender-01": "chapter2.tavern.bartender",
  "tavern-interior-villager-child-01-doll-01": "chapter2.tavern.child",
  "tavern-street-villager-sitting-01": "chapter2.tavernStreet.sitting",
  "tavern-street-elderly-man-with-jug-01": "chapter2.tavernStreet.elder",
};

// Reach follows each approved placement's scaled sprite bounds plus 16 units.
// Does not change the composition or any manually authored collision geometry.
export const chapter2Interactions: Record<string, DecorInteraction> = {};
for (const composition of chapter2Compositions) {
  for (const instance of composition.instances) {
    const interactionId = ids[instance.instanceId];
    const asset = getDecorAsset(instance.assetId);
    if (!interactionId || !asset) continue;
    const width = asset.sprite.frameWidth * instance.scale;
    const height = asset.sprite.frameHeight * instance.scale;
    chapter2Interactions[instance.instanceId] = {
      interactionId,
      zone: {
        offsetX: -asset.anchor.x * width - 16,
        offsetY: -asset.anchor.y * height - 16,
        width: width + 32,
        height: height + 32,
      },
    };
    if (interactionId === "chapter2.tavern.bartender") {
      // Same counter and character: reuse the authored cross-counter reach.
      chapter2Interactions[instance.instanceId].zone = {
        ...chapter1Interactions["tavern-interior-bartender-01"].zone,
      };
    }
  }
}
