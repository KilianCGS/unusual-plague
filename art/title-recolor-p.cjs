// Repaints the wood of the title's P (the crooked branch) with the same palette as the
// wooden letters, so the P and the letters read as one carving. The mask is not touched:
// it is found as the bright cream area, and only brown pixels OUTSIDE its box are recoloured.
//   node art/title-recolor-p.cjs <source png> <output png>
const sharp = require("sharp");

const [src, out] = process.argv.slice(2);
if (!src || !out) throw new Error("usage: node art/title-recolor-p.cjs <source png> <output png>");

// the letters' wood (see .title in src/app/globals.css), dark to light
const RAMP = [[0x7a, 0x4a, 0x22], [0xa2, 0x6b, 0x34], [0xb8, 0x79, 0x3a], [0xc0, 0x84, 0x44], [0xd8, 0x9c, 0x55], [0xee, 0xc0, 0x7c]];

function hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), l = (max + min) / 2, d = max - min;
  if (!d) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  return { h, s, l };
}

(async () => {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const px = (x, y) => { const i = (y * w + x) * 4; return [data[i], data[i + 1], data[i + 2], data[i + 3]]; };
  // the mask: bright cream (high lightness), its bounding box
  let x0 = w, x1 = -1, y0 = h, y1 = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const [r, g, b, a] = px(x, y);
    if (a < 8) continue;
    const c = hsl(r, g, b);
    if (c.l > 0.74 && c.s < 0.9) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  }
  const pad = 4;
  x0 -= pad; x1 += pad; y0 -= pad; y1 += pad;
  console.log("mask box", x0, y0, x1, y1, "of", w, h);
  let n = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const i = (y * w + x) * 4;
    if (data[i + 3] < 8) continue;
    if (x >= x0 && x <= x1 && y >= y0 && y <= y1) continue;
    const c = hsl(data[i], data[i + 1], data[i + 2]);
    if (c.s < 0.25 || c.h < 8 || c.h > 55 || c.l < 0.1) continue; // outline, greys, strap metal
    const t = Math.min(1, Math.max(0, (c.l - 0.12) / 0.5)) * (RAMP.length - 1);
    const lo = Math.floor(t), hi = Math.min(RAMP.length - 1, lo + 1), f = t - lo;
    for (let k = 0; k < 3; k++) data[i + k] = Math.round(RAMP[lo][k] * (1 - f) + RAMP[hi][k] * f);
    n++;
  }
  console.log("pixels recoloured", n);
  await sharp(data, { raw: { width: w, height: h, channels: 4 } }).png().toFile(out);
})();
