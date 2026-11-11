// Last pass on the title's P (the branch loop with the hanging plague mask):
//  1. the branch is filled like the carved letters: flat wood with the same stripes, a
//     light edge on top and a darker one below (no bark speckles);
//  1b. the mask hangs from a thin golden cord (the brown strap and its ring are removed);
//  2. the beak of the mask is drawn longer, sweeping over the branch and curving down.
// Everything that is not branch (the mask, the eye, the outline) is kept as it is.
//   node art/title-p-finish.cjs public/game/ui/title/p-loop-beak.png public/game/ui/title/p-post.png
const sharp = require("sharp");

const [src, out] = process.argv.slice(2);
if (!src || !out) throw new Error("usage: node art/title-p-finish.cjs <source png> <output png>");

// the letters' wood stripes (see .title in src/app/globals.css), in image pixels
const STRIPES = [[4, [0xb8, 0x79, 0x3a]], [2, [0xd8, 0x9c, 0x55]], [3, [0xa2, 0x6b, 0x34]], [2, [0xc0, 0x84, 0x44]]];
const PERIOD = STRIPES.reduce((n, [len]) => n + len, 0);
const OUTLINE = [0x2a, 0x1a, 0x0e];
const CREAM = [0xe9, 0xdb, 0xb8];
const CREAM_SHADE = [0xc9, 0xb4, 0x8a];

function hsv(r, g, b) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  return { s: max ? (max - min) / max : 0, v: max / 255 };
}

(async () => {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const at = (x, y) => (y * w + x) * 4;
  const solid = (x, y) => x >= 0 && y >= 0 && x < w && y < h && data[at(x, y) + 3] > 8;
  const kind = new Uint8Array(w * h); // 0 empty, 1 wood, 2 dark, 3 mask (cream, eye)
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!solid(x, y)) continue;
    const i = at(x, y);
    const c = hsv(data[i], data[i + 1], data[i + 2]);
    kind[y * w + x] = c.v < 0.3 ? 2 : c.s > 0.45 ? 1 : 3;
  }
  const near = (x, y, test) => {
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && test(x + dx, y + dy)) return true;
    return false;
  };
  const k = (x, y) => (x >= 0 && y >= 0 && x < w && y < h ? kind[y * w + x] : 0);
  // dark pixels that are an outline (touch empty space or the mask) stay; the others are bark speckles
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (kind[y * w + x] !== 2) continue;
    const keep = near(x, y, (nx, ny) => k(nx, ny) === 0 || k(nx, ny) === 3);
    // the neutral dark of the eye is mask, not wood
    const i = at(x, y);
    const neutral = hsv(data[i], data[i + 1], data[i + 2]).s < 0.45;
    if (!keep && !neutral) kind[y * w + x] = 1;
  }
  // 1. wood: stripes + light top edge + dark lower edge
  let wood = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (kind[y * w + x] !== 1) continue;
    let p = x % PERIOD, base = STRIPES[0][1];
    for (const [len, col] of STRIPES) { if (p < len) { base = col; break; } p -= len; }
    let [r, g, b] = base;
    const above = k(x, y - 1), below = k(x, y + 1);
    if (above === 0 || above === 2) { r += 28; g += 26; b += 22; }
    if (below === 0 || below === 2) { r -= 34; g -= 30; b -= 22; }
    const i = at(x, y);
    data[i] = Math.max(0, Math.min(255, r)); data[i + 1] = Math.max(0, Math.min(255, g)); data[i + 2] = Math.max(0, Math.min(255, b));
    wood++;
  }
  // 1b. the mask hangs from a thin golden cord instead of the brown strap and its ring:
  // the strap column (found under the arc, over the mask) is cleared and a two-pixel
  // cord is drawn in its place, with a small knot at each end.
  {
    // the top of the mask: the first row with a wide run of bone colour
    let top = h;
    for (let y = 0; y < h && top === h; y++) {
      let run = 0;
      for (let x = 0; x < w; x++) if (kind[y * w + x] === 3 && data[at(x, y)] > 190) run++;
      if (run >= 10) top = y;
    }
    let cx = 0, cn = 0;
    for (let x = 0; x < w; x++) if (kind[top * w + x] === 3 && data[at(x, top)] > 190) { cx += x; cn++; }
    cx = Math.round(cx / cn);
    // the arc: first solid pixel of the column, and about 9 px of branch under it
    let arcTop = 0;
    while (arcTop < h && !solid(cx, arcTop)) arcTop++;
    const arcBottom = arcTop + 9;
    const GOLD = [0xe3, 0xb8, 0x3e], GOLD_SHADE = [0xb8, 0x90, 0x2a];
    // the strap hangs from just under the arc: clear x in [cx-6, cx+6], y from there to the mask
    const strapTop = arcBottom + 1;
    // rows where the branch continues on both sides are the arc itself: they are
    // refilled with wood, so the clearing leaves no notch in its lower edge
    const arcRows = new Set();
    for (let y = strapTop; y < top; y++) if (k(cx - 8, y) === 1 && k(cx + 8, y) === 1) arcRows.add(y); else if (arcRows.size) break;
    for (let y = strapTop; y < top; y++) for (let x = cx - 6; x <= cx + 6; x++) {
      if (arcRows.has(y)) {
        let p = x % PERIOD, col = STRIPES[0][1];
        for (const [len, c] of STRIPES) { if (p < len) { col = c; break; } p -= len; }
        const shade = arcRows.has(y + 1) ? 0 : -30;
        const i = at(x, y);
        data[i] = Math.max(0, col[0] + shade); data[i + 1] = Math.max(0, col[1] + shade); data[i + 2] = Math.max(0, col[2] + shade * 0.7);
        data[i + 3] = 255; kind[y * w + x] = 1;
      } else { data[at(x, y) + 3] = 0; kind[y * w + x] = 0; }
    }
    const firstFree = Math.max(...arcRows, strapTop - 1) + 1;
    // the cord (2 px) and its knots
    for (let y = firstFree - 1; y <= top; y++) { setCord(cx, y, GOLD); setCord(cx + 1, y, GOLD_SHADE); }
    for (const [dx, dy] of [[-1, firstFree - 1], [2, firstFree - 1], [-1, top], [2, top]]) setCord(cx + dx, dy, GOLD_SHADE);
    console.log("cord at x", cx, "from y", strapTop, "to", top, "arc bottom", arcBottom);
    function setCord(x, y, c) { const i = at(x, y); data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2]; data[i + 3] = 255; kind[y * w + x] = 1; }
  }
  // 2. a longer beak: find the tip of the cream and sweep a tapering curve from it
  let tipX = 0, tipY = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (kind[y * w + x] === 3 && data[at(x, y)] > 190 && x > tipX) { tipX = x; tipY = y; }
  // the colours of the existing beak near its tip, so the new part looks like the same bone
  let sr = 0, sg = 0, sb = 0, sn = 0, dr = 0, dg = 0, db = 0, dn = 0;
  for (let y = tipY - 6; y <= tipY + 1; y++) for (let x = tipX - 9; x <= tipX; x++) {
    if (k(x, y) !== 3) continue;
    const i = at(x, y);
    if (data[i] > 215) { sr += data[i]; sg += data[i + 1]; sb += data[i + 2]; sn++; }
    else if (data[i] > 170) { dr += data[i]; dg += data[i + 1]; db += data[i + 2]; dn++; }
  }
  const boneLight = sn ? [sr / sn, sg / sn, sb / sn].map(Math.round) : CREAM;
  const boneShade = dn ? [dr / dn, dg / dn, db / dn].map(Math.round) : CREAM_SHADE;
  const P0 = [tipX - 8, tipY - 3], P1 = [tipX + 4, tipY - 2], P2 = [tipX + 9, tipY + 9];
  const painted = new Set();
  for (let t = 0; t <= 1.0001; t += 0.01) {
    const x = (1 - t) * (1 - t) * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0];
    const y = (1 - t) * (1 - t) * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1];
    const r = 4.2 * (1 - t) + 0.6;
    for (let yy = Math.floor(y - r); yy <= Math.ceil(y + r); yy++) for (let xx = Math.floor(x - r); xx <= Math.ceil(x + r); xx++) {
      if ((xx - x) ** 2 + (yy - y) ** 2 <= r * r) painted.add(yy * w + xx);
    }
  }
  const setPx = (x, y, c) => { const i = at(x, y); data[i] = c[0]; data[i + 1] = c[1]; data[i + 2] = c[2]; data[i + 3] = 255; };
  // outline first (a ring around the painted shape), then the cream on top
  for (const key of painted) {
    const x = key % w, y = Math.floor(key / w);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx, ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < w && ny < h && !painted.has(ny * w + nx) && !(kind[ny * w + nx] === 3)) setPx(nx, ny, OUTLINE);
    }
  }
  for (const key of painted) {
    const x = key % w, y = Math.floor(key / w);
    const lowerEdge = !painted.has((y + 1) * w + x);
    setPx(x, y, lowerEdge ? boneShade : boneLight);
  }
  console.log("wood pixels", wood, "beak tip was", tipX, tipY);
  await sharp(data, { raw: { width: w, height: h, channels: 4 } }).trim().png().toFile(out);
})();
