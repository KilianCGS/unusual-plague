import { NO_RUN_SCENES } from "../world/worldNoRun";
import type { SceneId } from "../world/worldScenes";
import type { SoundId } from "./soundManifest";

// Which step sound each scene uses. A first guess by scene (not by floor tile): interiors
// are one sound, the countryside and mountain a "wood and path" one, the town streets the
// "city / rock" one. To be tuned by ear (see /dev/sounds).
const COUNTRY_SCENES: readonly SceneId[] = ["outskirts", "forest", "farm", "mill-farmland", "mountain-path"];

export function footstepSoundFor(sceneId: SceneId): SoundId {
  if (NO_RUN_SCENES.includes(sceneId)) return "steps.interior";
  if (COUNTRY_SCENES.includes(sceneId)) return "steps.woodPath";
  return "steps.cityRock";
}
