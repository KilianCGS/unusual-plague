// Installs the "relaxed" gaits generated on 2026-11-12 (PixelLab pixminimax on the Doctor V3
// character) over the stiffer template ones. pixminimax returns a canvas bigger than 96 px
// (120 or 124) with the reference pose as frame 0, so: take frames 1..N, crop the centred
// 96x96 window, and place the cycle with ONE fixed shift (lowest foot to the idle's bottom
// row + 2, median centre to the idle's centre), exactly like art/doctor-v3/build.cjs.
//   node art/doctor-v3/install-relaxed.cjs <unzipped download dir> <animation folder> <direction> <walk|run> <frames>
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const [SRC, ANIM, DIR, KIND, COUNT] = process.argv.slice(2);
if (!SRC || !ANIM || !DIR || !KIND || !COUNT) throw new Error("see usage in the file header");
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
async function centre96(file) {
  const m = await sharp(file).metadata();
  const off = Math.round((m.width - 96) / 2);
  return sharp(file).extract({ left: off, top: off, width: 96, height: 96 }).png().toBuffer();
}
async function shift(buf, dx, dy) {
  const padded = await sharp(buf).extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return sharp(padded).extract({ left: PAD - dx, top: PAD - dy, width: 96, height: 96 }).png().toBuffer();
}

(async () => {
  const idle = await bbox(fs.readFileSync(path.join(OUT, "idle", `${DIR}.png`)));
  const frames = [];
  for (let i = 1; i <= Number(COUNT); i++) frames.push(await centre96(path.join(SRC, "Idle/animations", ANIM, DIR, n(i))));
  const boxes = await Promise.all(frames.map(bbox));
  const dy = Math.round(idle.bottom + 2 - Math.max(...boxes.map((b) => b.bottom)));
  const dx = Math.round(idle.cx - median(boxes.map((b) => b.cx)));
  console.log(`${KIND} ${DIR}: shift dx ${dx}, dy ${dy}`);
  const dir = path.join(OUT, KIND, DIR);
  fs.mkdirSync(dir, { recursive: true });
  for (let i = 0; i < frames.length; i++) fs.writeFileSync(path.join(dir, `${i}.png`), await shift(frames[i], dx, dy));
  console.log("installed", frames.length, "frames in", dir);
})();
