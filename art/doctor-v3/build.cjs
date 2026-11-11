// Builds the Doctor's sprites from the PixelLab character "Plague Doctor Protagonist V3"
// (id 59630817-e5f8-44ea-9924-bbee5b0d0fd5) into public/game/characters/protagonist/.
//
// Source frames (downloaded from https://api.pixellab.ai/mcp/characters/<id>/download):
//   rotations           -> idle/<direction>.png
//   protagonist_v3_walk_4dir            (walking-4-frames, template)  -> walk/south, walk/north (4 frames)
//   protagonist_v3_walk_8f_side         (walking-8-frames, template)  -> walk/east, walk/west  (8 frames: a longer, softer side step)
//   protagonist_v3_run_skeleton_v3      (running-8-frames, skeleton)  -> run/south (8 frames)
//   protagonist_v3_run_12f              (custom "run" move, skeleton) -> run/east, run/north (12 frames; the north one
//                                          keeps the bag on the belt on the same side the whole cycle)
// Run west is not drawn: the game mirrors the east frames.
//
// The generator places each animation a little off the standing figure (the skeleton run sits
// ~16 px to the right and ~20 px lower). The old Doctor had his feet at the same height and the
// body at the same centre in idle, walk and run (bottom row 79-83, centre 48), and the game anchors
// the 96x96 frame by its bottom edge, so each animation is moved by ONE fixed offset (its lowest foot
// to the idle's bottom row + 2, its median centre to the idle's centre). The bounce inside the cycle
// is kept as drawn.
//
//   node art/doctor-v3/build.cjs <folder with the unzipped downloads>   (see SRC below)
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const SRC = process.argv[2];
if (!SRC) throw new Error("usage: node art/doctor-v3/build.cjs <folder with Idle/ from the character download>");
const OUT = path.resolve(__dirname, "../../public/game/characters/protagonist");
const n = (i) => `frame_${String(i).padStart(3, "0")}.png`;
const PAD = 48;

async function bbox(buf) {
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = 9999, x1 = -1, y1 = -1;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] > 8) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  }
  return { bottom: y1, cx: (x0 + x1) / 2 };
}
const median = (a) => [...a].sort((p, q) => p - q)[Math.floor(a.length / 2)];

// moves the picture by (dx, dy) inside the same 96 x 96 canvas
async function shift(buf, dx, dy) {
  const padded = await sharp(buf).extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return sharp(padded).extract({ left: PAD - dx, top: PAD - dy, width: 96, height: 96 }).png().toBuffer();
}

async function placeCycle(frames, idle, label) {
  const boxes = await Promise.all(frames.map(bbox));
  const dy = Math.round(idle.bottom + 2 - Math.max(...boxes.map((b) => b.bottom)));
  const dx = Math.round(idle.cx - median(boxes.map((b) => b.cx)));
  console.log(`${label}: shift dx ${dx}, dy ${dy}`);
  return Promise.all(frames.map((f) => shift(f, dx, dy)));
}

(async () => {
  const rot = (d) => path.join(SRC, "Idle/rotations", `${d}.png`);
  const anim = (name, d, i) => path.join(SRC, "Idle/animations", name, d, n(i));
  for (const d of ["south", "north", "east", "west"]) {
    fs.mkdirSync(path.join(OUT, "idle"), { recursive: true });
    fs.copyFileSync(rot(d), path.join(OUT, "idle", `${d}.png`));
    const idle = await bbox(fs.readFileSync(rot(d)));

    const side = d === "east" || d === "west";
    const walkSource = side ? "protagonist_v3_walk_8f_side" : "protagonist_v3_walk_4dir";
    const walkCount = side ? 8 : 4;
    const walk = await placeCycle(Array.from({ length: walkCount }, (_, i) => fs.readFileSync(anim(walkSource, d, i))), idle, `walk ${d} (${walkSource})`);
    fs.mkdirSync(path.join(OUT, "walk", d), { recursive: true });
    walk.forEach((b, i) => fs.writeFileSync(path.join(OUT, "walk", d, `${i}.png`), b));

    if (d === "west") continue;
    const runSource = d === "south" ? "protagonist_v3_run_skeleton_v3" : "protagonist_v3_run_12f";
    const runCount = d === "south" ? 8 : 12;
    const run = await placeCycle(Array.from({ length: runCount }, (_, i) => fs.readFileSync(anim(runSource, d, i))), idle, `run ${d} (${runSource})`);
    fs.mkdirSync(path.join(OUT, "run", d), { recursive: true });
    run.forEach((b, i) => fs.writeFileSync(path.join(OUT, "run", d, `${i}.png`), b));
  }
  console.log("done");
})();
