import { getDecorAsset } from "../decor/decorAssets";
import type { DecorInteraction } from "../decor/decorTypes";
import { chapter3Compositions } from "./chapter-3";

// Instance id -> interaction id for the people Kilian places in Day 3. Day 3 inherits the
// interactions of Day 2 (see compositions/index.ts), so only the NEW ones go here. They
// are filled in when the instances exist, e.g.
//   "apothecary-street-woman-dusting-01":  "chapter3.apothecaryStreet.duster",
//   "mountain-path-miner-pick-swing-01":   "chapter3.mountainPath.miner",
//   "quarry-miner-01":                     "chapter3.quarry.stonecutter",
const ids: Record<string, string> = {
  // 2026-11-17 (Kilian's second Day 3 export): the Witch sitting on the glade log is the Witch of the glade
  // (bone, mint, herb and the omen); the spear knight in front of the mine entrance says the way is shut.
  "forest-glade-witch-sitting-back-01": "chapter3.glade.witch",
  "mountain-path-knight-spear-shield-01": "chapter3.mountainPath.guard",
  // The healthy blacksmith (hammer) takes the place of the Day 2 injured one: his Day 3 lines
  // (chapter3.smithy.blacksmith, via chapter2.smithy.blacksmith) belong to him now.
  "smithy-interior-blacksmith-hammer-01": "chapter2.smithy.blacksmith",
  // 2026-11-18 (Kilian's placements): the woman with the duster is in the BAKERY street; the "miner" patient is the
  // resting man of the quarry (with a woman beside him); the stonecutter on the stool keeps being the quarry
  // patient, now with the zone of his new place and scale.
  "bakery-street-woman-dusting-01": "chapter3.apothecaryStreet.duster",
  "quarry-stonecutter-resting-01": "chapter3.mountainPath.miner",
  "quarry-stonecutter-stool-01": "chapter3.quarry.stonecutter",
  // 2026-11-18: the people who had no words (see chapter3PeopleDialogues).
  "plaza-priest-praying-01": "chapter3.plaza.priest",
  "plaza-praying-man-side-01": "chapter3.plaza.prayingMan",
  "plaza-praying-young-woman-01": "chapter3.plaza.prayingYoungWoman",
  "plaza-praying-old-woman-back-01": "chapter3.plaza.prayingOldWoman",
  "plaza-elderly-man-seated-01": "chapter3.plaza.elderMan",
  "plaza-elderly-woman-seated-01": "chapter3.plaza.elderWoman",
  "tavern-street-villager-woman-02-01": "chapter3.tavernStreet.neighbour",
  "tavern-street-boy-spinning-top-01": "chapter3.tavernStreet.topBoy",
  "tavern-interior-villager-man-01-v2-01": "chapter3.tavernInterior.drinker",
  "outskirts-woman-washing-clothes-01": "chapter3.outskirts.washer",
  "mill-farmland-villager-woman-02-01": "chapter3.mill.woman",
  "mill-farmland-stonecutter-shovel-01": "chapter3.mill.stonecutter",
  "bakery-street-villager-woman-01-v2-01": "chapter3.bakeryStreet.basketWoman",
  "smithy-street-girl-jump-rope-01": "chapter3.smithyStreet.ropeGirl",
  "smithy-street-carpenter-workbench-01": "chapter3.smithyStreet.carpenter",
  "mountain-path-child-bow-archer-01": "chapter3.mountainPath.archerBoy",
  "mountain-path-child-wooden-sword-01": "chapter3.mountainPath.swordBoy",
  "quarry-villager-man-02-v2-01": "chapter3.quarry.visitor",
  "quarry-villager-woman-02-v2-01": "chapter3.quarry.minersWife",
};

// Reach follows each approved placement's scaled sprite bounds plus 16 units (the same
// rule as Day 2). Does not change the composition or any manually authored geometry.
export const chapter3Interactions: Record<string, DecorInteraction> = {};
for (const composition of chapter3Compositions) {
  for (const instance of composition.instances) {
    const interactionId = ids[instance.instanceId];
    const asset = getDecorAsset(instance.assetId);
    if (!interactionId || !asset) continue;
    const width = asset.sprite.frameWidth * instance.scale;
    const height = asset.sprite.frameHeight * instance.scale;
    chapter3Interactions[instance.instanceId] = {
      interactionId,
      zone: {
        offsetX: -asset.anchor.x * width - 16,
        offsetY: -asset.anchor.y * height - 16,
        width: width + 32,
        height: height + 32,
      },
    };
  }
}
