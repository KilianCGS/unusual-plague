// The approved full-screen narrative illustrations (runtime PNGs, untouched
// originals). Today only "doctor-writing" is used, for the opening of a day;
// the other two are kept here so the end-of-day interludes can pick them by id
// later. Sizes are the real file sizes: the interlude lays the picture out from
// its aspect ratio and never stretches it.
export type NarrativeIllustrationId =
  "doctor-writing" | "doctor-writing-night" | "doctor-eating" | "doctor-fireplace" | "doctor-cooking" | "doctor-in-bed";

export type NarrativeIllustration = {
  src: string;
  width: number;
  height: number;
};

export const NARRATIVE_ILLUSTRATIONS: Record<
  NarrativeIllustrationId,
  NarrativeIllustration
> = {
  "doctor-writing": {
    src: "/game/narrative/doctor-writing.png",
    width: 1672,
    height: 941,
  },
  // The ending (Day 4): the same picture as the opening, at night. PLACEHOLDER: a
  // night grade of doctor-writing.png (art/narrative-night.cjs) until Kilian paints the real one.
  "doctor-writing-night": {
    src: "/game/narrative/doctor-writing-night.png",
    width: 1672,
    height: 941,
  },
  "doctor-eating": {
    src: "/game/narrative/doctor-eating.png",
    width: 1672,
    height: 941,
  },
  "doctor-fireplace": {
    src: "/game/narrative/doctor-fireplace.png",
    width: 1671,
    height: 941,
  },
  // 2026-11-18 (Kilian's new pictures): the Doctor cooking his own supper at night closes Day 2; the Doctor in
  // bed reading, the moon at the window, closes Day 3. (doctor-fireplace is no longer used by any day.)
  "doctor-cooking": {
    src: "/game/narrative/doctor-cooking.png",
    width: 1672,
    height: 941,
  },
  "doctor-in-bed": {
    src: "/game/narrative/doctor-in-bed.png",
    width: 1672,
    height: 941,
  },
};
