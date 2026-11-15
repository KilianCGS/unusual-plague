import type { SoundId } from "./soundManifest";

// Working NPCs make their sound on the frame where the tool lands, once per cycle of their
// animation, so the sound follows their pace by itself. `radius` is how far (world units)
// it can be heard: the volume fades with the Doctor's distance. Frames were picked by eye
// from the sprites (blacksmith: hammer on the apron; woodcutter: axe in the log) and are
// meant to be tuned. Keyed by decor asset id.
export type DecorImpactSound = { sound: SoundId; frame: number; radius: number };

export const DECOR_IMPACT_SOUNDS: Record<string, DecorImpactSound> = {
  blacksmith: { sound: "loop.blacksmith", frame: 2, radius: 420 },
  "blacksmith-hammer": { sound: "loop.blacksmith", frame: 3, radius: 420 },
  woodcutter: { sound: "loop.woodChop", frame: 1, radius: 420 },
};

// 1 next to the source, fading smoothly to 0 at `radius`.
export function impactVolume(distance: number, radius: number): number {
  const t = Math.max(0, 1 - distance / radius);
  return t * t;
}
