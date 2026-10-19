// The approved full-screen narrative illustrations (runtime PNGs, untouched
// originals). Today only "doctor-writing" is used, for the opening of a day;
// the other two are kept here so the end-of-day interludes can pick them by id
// later. Sizes are the real file sizes: the interlude lays the picture out from
// its aspect ratio and never stretches it.
export type NarrativeIllustrationId =
  "doctor-writing" | "doctor-eating" | "doctor-fireplace";

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
};
