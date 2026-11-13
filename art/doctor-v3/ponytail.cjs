// Draws the Doctor's ponytail (dark brown hair with a red tie) on the frames made by
// build.cjs. The AI redesign lost it; redrawing every frame by hand would be 70 frames, so
// the tail is a small pixel pattern pasted on each frame at a spot found from the hat:
//   - the top row of the sprite is the top of the hat (it follows the bounce of the step);
//   - the horizontal centre of the hat's brim rows is the centre of the head.
// East and west show it hanging off the back of the head, north shows it down the middle
// of the back; south shows nothing (the head hides it). Idle, walk and run frames all get it.
//
//   node art/doctor-v3/build.cjs <downloads>   then   node art/doctor-v3/ponytail.cjs [folder ...]
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "../../public/game/characters/protagonist");

const COLORS = {
  K: [0x1c, 0x11, 0x0c], // outline
  H: [0x6b, 0x45, 0x30], // hair
  h: [0x4a, 0x2e, 0x20], // hair, shade
  R: [0xc0, 0x3a, 0x2e], // red tie
  r: [0x7e, 0x22, 0x1c], // red tie, shade
};

// rows are listed top to bottom; the numbers are where the pattern hangs from the hat.
const NORTH = { dy: 19, dx: -3, rows: [".KRRK.", ".KrRK.", "KHHHhK", "KHHhhK", "KHhhhK", "KHHhhK", "KHhhhK", ".KHhhK", ".KhhK.", ".KhhK.", "..KK.."] };
const EAST = { dy: 16, dx: -14, rows: ["..KRRK", "..KrRK", ".KHHhK", "KHHhK.", "KHhhK.", "KHhK..", ".KhK..", ".KK..."] };

const mirror = (p) => ({ ...p, rows: p.rows.map((r) => [...r].reverse().join("")) });
const PATTERNS = { north: NORTH, east: EAST, west: mirror(EAST) };

function files(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? files(path.join(dir, e.name)) : e.name.endsWith(".png") ? [path.join(dir, e.name)] : [],
  );
}

// direction of a frame from its path: .../idle/east.png, .../walk/east/3.png, .../run/north/2.png
function directionOf(file) {
  const parts = path.relative(ROOT, file).split(path.sep);
  return parts[0] === "idle" ? path.basename(file, ".png") : parts[1];
}

async function paint(file) {
  const dir = directionOf(file);
  const pattern = PATTERNS[dir];
  if (!pattern) return false;
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width;
  let top = -1;
  for (let y = 0; y < info.height && top < 0; y++) for (let x = 0; x < w; x++) if (data[(y * w + x) * 4 + 3] > 8) { top = y; break; }
  // centre of the hat: the middle of the widest hat rows (the brim), near the top
  let x0 = w, x1 = -1;
  for (let y = top + 5; y <= top + 9; y++) for (let x = 0; x < w; x++) if (data[(y * w + x) * 4 + 3] > 8) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); }
  const cx = Math.round((x0 + x1) / 2);
  const left = dir === "west" ? cx - pattern.dx - pattern.rows[0].length + 1 : cx + pattern.dx;
  pattern.rows.forEach((row, ry) => {
    [...row].forEach((ch, rx) => {
      if (ch === ".") return;
      const x = left + rx, y = top + pattern.dy + ry;
      if (x < 0 || y < 0 || x >= w || y >= info.height) return;
      const i = (y * w + x) * 4;
      const c = COLORS[ch];
      data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2]; data[i + 3] = 255;
    });
  });
  await sharp(data, { raw: { width: w, height: info.height, channels: 4 } }).png().toFile(file + ".tmp");
  fs.renameSync(file + ".tmp", file);
  return true;
}

(async () => {
  let n = 0;
  // optional: only some folders (e.g. "walk/east run/north", the ones replaced on 2026-11-13)
  const only = process.argv.slice(2).map((p) => path.join(ROOT, ...p.split("/")));
  for (const f of files(ROOT)) {
    if (only.length && !only.some((dir) => f.startsWith(dir + path.sep))) continue;
    if (await paint(f)) n++;
  }
  console.log("frames with ponytail:", n);
})();
