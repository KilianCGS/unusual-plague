// Fattens the title's P (the branch loop with the hanging plague mask) and gives its wood the
// SAME colouring as the carved letters (2026-11-13). Two things:
//  1. the branch grows one pixel all around (the outline moves out with it), so it is not so thin.
//     The canvas gets 2 px of transparent margin on every side to hold the growth: in the page
//     the image is made that much bigger (see .title-p in src/app/globals.css) so the P keeps
//     exactly the size it had;
//  2. the wood is repainted like the letters: the same four stripes at the letters' angle (96deg)
//     and width, with the same light top and dark bottom gradient. The mask, its brown rim, the
//     eye and the golden cord are left untouched.
//   node art/title-p-fatten.cjs <source png> <output png>
const sharp = require("sharp");

const [src, out] = process.argv.slice(2);
if (!src || !out) throw new Error("usage: node art/title-p-fatten.cjs <source png> <output png>");

const PAD = 2;
// How many CSS pixels one image pixel takes on a typical window (the P is 0.7em high, 109 px tall).
const CSS_PER_PX = 0.62;
// The letters' stripes, from the title in globals.css (repeating-linear-gradient 96deg).
const STRIPES = [[7, [0xb8, 0x79, 0x3a]], [3, [0xd8, 0x9c, 0x55]], [7, [0xa2, 0x6b, 0x34]], [3, [0xc0, 0x84, 0x44]]];
const PERIOD = 20;
const OUTLINE = [0x2a, 0x1a, 0x0e];
const GOLDS = [[0xe3, 0xb8, 0x3e], [0xb8, 0x90, 0x2a]];

function hsv(r, g, b) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  return { s: max ? (max - min) / max : 0, v: max / 255 };
}

(async () => {
  const src0 = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w0 = src0.info.width, h0 = src0.info.height;
  const w = w0 + PAD * 2, h = h0 + PAD * 2;
  const data = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h0; y++) src0.data.copy(data, ((y + PAD) * w + PAD) * 4, y * w0 * 4, (y + 1) * w0 * 4);
  const at = (x, y) => (y * w + x) * 4;
  const inside = (x, y) => x >= 0 && y >= 0 && x < w && y < h;
  const solid = (x, y) => inside(x, y) && data[at(x, y) + 3] > 8;

  // 0 empty, 1 wood colour, 2 dark, 3 mask / other, 4 golden cord
  const kind = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!solid(x, y)) continue;
    const i = at(x, y);
    const r = data[i], g = data[i + 1], b = data[i + 2];
    if (GOLDS.some((c) => Math.abs(c[0] - r) + Math.abs(c[1] - g) + Math.abs(c[2] - b) < 12)) { kind[y * w + x] = 4; continue; }
    const c = hsv(r, g, b);
    kind[y * w + x] = c.v < 0.3 ? 2 : c.s > 0.45 ? 1 : 3;
  }
  const k = (x, y) => (inside(x, y) ? kind[y * w + x] : 0);

  // the branch = the biggest piece of wood-coloured pixels (the brown rim of the mask is another one)
  const comp = new Int32Array(w * h).fill(-1);
  const sizes = [];
  for (let y0 = 0; y0 < h; y0++) for (let x0 = 0; x0 < w; x0++) {
    if (kind[y0 * w + x0] !== 1 || comp[y0 * w + x0] !== -1) continue;
    const id = sizes.length;
    let n = 0;
    const stack = [[x0, y0]];
    comp[y0 * w + x0] = id;
    while (stack.length) {
      const [x, y] = stack.pop();
      n++;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy;
        if (inside(nx, ny) && kind[ny * w + nx] === 1 && comp[ny * w + nx] === -1) { comp[ny * w + nx] = id; stack.push([nx, ny]); }
      }
    }
    sizes.push(n);
  }
  const main = sizes.indexOf(Math.max(...sizes));
  const isBranch = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) if (comp[i] === main) isBranch[i] = 1;

  // 1. grow: an outline pixel that touches the branch (not the mask or the cord) becomes wood
  const grow = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (kind[y * w + x] !== 2) continue;
    const touchesBranch = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => inside(x + dx, y + dy) && isBranch[(y + dy) * w + x + dx]);
    let touchesOther = false;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const t = k(x + dx, y + dy);
      if (t === 3 || t === 4) touchesOther = true;
    }
    if (touchesBranch && !touchesOther) grow.push([x, y]);
  }
  for (const [x, y] of grow) isBranch[y * w + x] = 1;
  // the new outline: every empty pixel that touches the grown branch
  const ring = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (solid(x, y) || isBranch[y * w + x]) continue;
    let near = false;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (inside(x + dx, y + dy) && isBranch[(y + dy) * w + x + dx] && kind[(y + dy) * w + x + dx] !== 0 && (dx === 0 || dy === 0)) near = true;
    }
    if (near) ring.push([x, y]);
  }
  for (const [x, y] of ring) {
    const i = at(x, y);
    data[i] = OUTLINE[0]; data[i + 1] = OUTLINE[1]; data[i + 2] = OUTLINE[2]; data[i + 3] = 255;
  }

  // 2. repaint the branch like the letters: stripes at 96deg, light top and dark bottom
  const ang = (96 * Math.PI) / 180;
  const dirX = Math.sin(ang), dirY = -Math.cos(ang);
  let minY = h, maxY = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (isBranch[y * w + x]) { minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
  let painted = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!isBranch[y * w + x]) continue;
    const t = ((x * dirX + y * dirY) * CSS_PER_PX) % PERIOD;
    let p = t < 0 ? t + PERIOD : t, base = STRIPES[0][1];
    for (const [len, col] of STRIPES) { if (p < len) { base = col; break; } p -= len; }
    let [r, g, b] = base;
    const f = (y - minY) / Math.max(1, maxY - minY);
    // linear-gradient(180deg, rgba(255,224,170,.38), transparent 38%, rgba(30,14,4,.4))
    if (f < 0.38) {
      const a = 0.38 * (1 - f / 0.38);
      r += (255 - r) * a; g += (224 - g) * a; b += (170 - b) * a;
    } else {
      const a = 0.4 * ((f - 0.38) / 0.62);
      r += (30 - r) * a; g += (14 - g) * a; b += (4 - b) * a;
    }
    const i = at(x, y);
    data[i] = Math.round(r); data[i + 1] = Math.round(g); data[i + 2] = Math.round(b); data[i + 3] = 255;
    painted++;
  }
  console.log(`canvas ${w0}x${h0} -> ${w}x${h}; grew ${grow.length} px, ring ${ring.length} px, repainted ${painted} px`);
  await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toFile(out);
})();
