// Repaints the Witch's hair: black, with lilac tips. Nothing else changes.
//
// Her hair shows only as strands beside the face, inside the hood. In her sprites
// those strands use three browns (#7a4d43, #3a1c29, #5c3038). The same browns are also
// the mouth and the face shading, so a pixel counts as hair only if it is on a row
// that has face skin AND lies beside the skin of that row (left or right of it, never
// between), inside the head. Every connected strand is painted near-black, and the
// lowest third of it lilac, like a dyed tip.
//
// usage: node art/witch-hair/recolor.cjs [--check]    (--check only reports, writes nothing)
// Runs over public/game/characters/witch/**/*.png (not the cat). Re-running is harmless:
// once painted there is no brown left in the head box.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "../../public/game/characters/witch");
const CHECK = process.argv.includes("--check");

const HAIR_SOURCE = new Set(["7a4d43", "5c3038", "3a1c29"]);
const SKIN = new Set(["ac8972", "d5ae93", "886f61"]);
const BLACK_DARK = [0x1b, 0x14, 0x22]; // outline-side strand
const BLACK_MID = [0x2a, 0x1f, 0x36];
const LILAC_DARK = [0x7d, 0x5f, 0xb0];
const LILAC_LIGHT = [0xa9, 0x8c, 0xdc];
const HEAD_DEPTH = 26; // rows under the top of the hood that belong to the head

const hex = (r, g, b) => [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith(".png") ? [path.join(dir, e.name)] : [],
  );
}

async function repaint(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  let top = -1;
  for (let y = 0; y < h && top < 0; y++) for (let x = 0; x < w; x++) if (data[(y * w + x) * 4 + 3] > 8) { top = y; break; }
  if (top < 0) return { file, painted: 0 };
  // per row: where the face skin starts and ends
  const skinMin = new Array(h + 1).fill(Infinity);
  const skinMax = new Array(h + 1).fill(-1);
  for (let y = top; y < Math.min(h, top + HEAD_DEPTH); y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (data[i + 3] > 8 && SKIN.has(hex(data[i], data[i + 1], data[i + 2]))) {
        skinMin[y] = Math.min(skinMin[y], x);
        skinMax[y] = Math.max(skinMax[y], x);
      }
    }
  }
  // Hair is what lies between the face's own outline and the hood's inner outline (#12090e),
  // on the rows that have skin. The orange hood trim is OUTSIDE that outline, so it
  // is never touched. Only browns count (the shadow of the hood is already near-black).
  // The strands hang below the chin too: for up to CARRY rows under the last face row
  // the skin span is carried down, so they are followed all the way.
  const CARRY = 3;
  let lastSkinRow = -1;
  for (let y = top; y < Math.min(h, top + HEAD_DEPTH + CARRY); y++) {
    if (skinMax[y] >= 0) lastSkinRow = y;
    else if (lastSkinRow >= 0 && y - lastSkinRow <= CARRY) {
      skinMin[y] = skinMin[lastSkinRow];
      skinMax[y] = skinMax[lastSkinRow];
    }
  }
  const HAIR_ALL = new Set([...HAIR_SOURCE, "a4684f"]);
  const hairMask = new Uint8Array(w * h);
  for (let y = top; y < Math.min(h, top + HEAD_DEPTH + CARRY); y++) {
    if (skinMax[y] < 0) continue;
    for (const [from, step] of [[skinMin[y] - 1, -1], [skinMax[y] + 1, 1]]) {
      let inside = false; // false while still on the face's own outline
      for (let x = from, n = 0; x >= 0 && x < w && n < 9; x += step, n++) {
        const i = (y * w + x) * 4;
        if (data[i + 3] <= 8) break;
        const k = hex(data[i], data[i + 1], data[i + 2]);
        if (k === "12090e") {
          if (inside) break; // the hood's inner outline: the trim is beyond it
          continue;
        }
        inside = true;
        if (HAIR_ALL.has(k)) hairMask[y * w + x] = 1;
      }
    }
  }
  const isHair = (x, y) => x >= 0 && y >= 0 && x < w && y < h && hairMask[y * w + x] === 1;
  const seen = new Uint8Array(w * h);
  let painted = 0;
  for (let y = top; y < Math.min(h, top + HEAD_DEPTH); y++) {
    for (let x = 0; x < w; x++) {
      if (seen[y * w + x] || !isHair(x, y)) continue;
      const comp = [];
      const stack = [[x, y]];
      seen[y * w + x] = 1;
      while (stack.length) {
        const [cx, cy] = stack.pop();
        comp.push([cx, cy]);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
          const nx = cx + dx, ny = cy + dy;
          if (nx >= 0 && ny >= 0 && nx < w && ny < h && !seen[ny * w + nx] && isHair(nx, ny)) {
            seen[ny * w + nx] = 1;
            stack.push([nx, ny]);
          }
        }
      }
      const ys = comp.map((p) => p[1]);
      const y0 = Math.min(...ys), y1 = Math.max(...ys);
      const tipFrom = y1 - Math.max(1, Math.round((y1 - y0 + 1) / 3)) + 1;
      for (const [px, py] of comp) {
        const i = (py * w + px) * 4;
        const wasDark = ["5c3038", "3a1c29", "a4684f"].includes(hex(data[i], data[i + 1], data[i + 2]));
        const tip = py >= tipFrom && y1 - y0 >= 2;
        const c = tip ? (wasDark ? LILAC_DARK : LILAC_LIGHT) : wasDark ? BLACK_DARK : BLACK_MID;
        data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2];
        painted++;
      }
    }
  }
  if (!CHECK && painted) {
    await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toFile(file + ".tmp");
    fs.renameSync(file + ".tmp", file);
  }
  return { file, painted };
}

(async () => {
  let total = 0;
  for (const f of walk(ROOT)) {
    const r = await repaint(f);
    total += r.painted;
    console.log(path.relative(ROOT, r.file), r.painted);
  }
  console.log("pixels repainted:", total, CHECK ? "(check only)" : "");
})();
