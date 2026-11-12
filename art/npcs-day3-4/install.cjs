// Installs the NPCs generated on 2026-11-12 (PixelLab: a 96x96 pose, then animate_image_pixminimax
// idle of 4 frames, which returns 5 pictures: the pose and four more) into public/game/npcs/<name>/idle/0..4.png.
//   node art/npcs-day3-4/install.cjs <folder with anim/<name>-<0..4>.png>
// The bench-back stonecutter is the one sprite that is cut: only his back to the waist is kept
// (he is placed by hand on the bench of the quarry, which hides the rest) and it is moved down so
// the cut sits at y 80, like the feet of every other NPC; the stray pixels the animation left
// below the cut are cleared.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SRC = process.argv[2];
if (!SRC) throw new Error("usage: node art/npcs-day3-4/install.cjs <folder with anim/>");
const OUT = path.resolve(__dirname, "../../public/game/npcs");

// source name -> installed folder
const NAMES = {
  stool: "stonecutter-stool",
  "bench-back": "stonecutter-bench-back",
  shovel: "stonecutter-shovel",
  dusting: "woman-dusting",
  priest: "priest-praying",
  "back-man": "villager-back-man",
  "back-woman": "villager-back-woman",
  "back-old": "villager-back-old",
};

(async () => {
  for (const [name, folder] of Object.entries(NAMES)) {
    const dir = path.join(OUT, folder, "idle");
    fs.mkdirSync(dir, { recursive: true });
    for (let i = 0; i < 5; i++) {
      let file = path.join(SRC, "anim", `${name}-${i}.png`);
      if (name !== "bench-back") {
        fs.copyFileSync(file, path.join(dir, `${i}.png`));
        continue;
      }
      const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const w = info.width, h = info.height, CUT = 58, SHIFT = 22;
      const shifted = Buffer.alloc(data.length);
      for (let y = 0; y < CUT; y++) {
        const ty = y + SHIFT;
        if (ty >= h) continue;
        data.copy(shifted, ty * w * 4, y * w * 4, (y + 1) * w * 4);
      }
      await sharp(shifted, { raw: { width: w, height: h, channels: 4 } }).png().toFile(path.join(dir, `${i}.png`));
    }
    console.log(folder);
  }
})();
