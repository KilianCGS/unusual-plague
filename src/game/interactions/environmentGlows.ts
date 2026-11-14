// Things of the scenery the Doctor can interact with (not picked up): they get the same soft
// glow as the collectibles. Measured on the painting of each scene (world units = its pixels):
// the plaza notice board covers x 967-1065, y 156-250.
export const environmentGlowsByScene: Record<string, readonly { id: string; x: number; y: number; width: number; height: number }[]> = {
  plaza: [{ id: "plaza-noticeboard-glow", x: 1016, y: 205, width: 150, height: 130 }],
};
