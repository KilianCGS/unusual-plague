// PLACEHOLDER for the ending illustration (Day 4): the Doctor writing, at night. A night grade
// (dark, blue-violet shadows, the warm light kept faintly) of public/game/narrative/doctor-writing.png
// until Kilian paints the real one.
//   node art/narrative-night.cjs
const path = require("path");
const sharp = require("sharp");

const DIR = path.resolve(__dirname, "../public/game/narrative");

(async () => {
  const { data, info } = await sharp(path.join(DIR, "doctor-writing.png")).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 3) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const l = (0.3 * r + 0.59 * g + 0.11 * b) / 255;
    const k = 0.42;
    out[i] = Math.min(255, Math.round(r * k * 0.72 + l * 30));
    out[i + 1] = Math.min(255, Math.round(g * k * 0.8 + l * 38));
    out[i + 2] = Math.min(255, Math.round(b * k * 1.05 + l * 70));
  }
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 3 } }).png().toFile(path.join(DIR, "doctor-writing-night.png"));
  console.log("doctor-writing-night.png", info.width, info.height);
})();
