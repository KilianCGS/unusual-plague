import { getDecorAsset } from "../decor/decorAssets";
import type { DecorInteraction } from "../decor/decorTypes";
import { chapter3Compositions } from "./chapter-3";

// Instance id -> interaction id for the people Kilian places in Day 3. Day 3 inherits the
// interactions of Day 2 (see compositions/index.ts), so only the NEW ones go here. They
// are filled in when the instances exist, e.g.
//   "apothecary-street-woman-dusting-01":  "chapter3.apothecaryStreet.duster",
//   "mountain-path-miner-pick-swing-01":   "chapter3.mountainPath.miner",
//   "quarry-miner-01":                     "chapter3.quarry.stonecutter",
const ids: Record<string, string> = {};

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
