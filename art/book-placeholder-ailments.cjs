// PLACEHOLDER engravings for the three ailments added on 2026-11-12 (burn, fracture, insomnia).
// The Compendium's drawings are 1254x1254 sepia engravings; until Kilian paints these in the same
// hand-drawn style, each one is a pixel icon (art/ailment-icons) enlarged and turned into a one-colour
// brown ink picture on white (the book multiplies them over the paper).
//   node art/book-placeholder-ailments.cjs
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const IDS = { burn: "burn-v2", fracture: "fracture-v2", insomnia: "insomnia-v2" };
const INK = [0x5a, 0x2e, 0x1a];

(async () => {
  for (const [id, file] of Object.entries(IDS)) {
    const size = 960;
    const big = await sharp(path.join(__dirname, "ailment-icons", `${id}.png`))
      .resize(size, size, { kernel: "nearest" })
      .flatten({ background: "#ffffff" })
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const rgb = Buffer.alloc(size * size * 3);
    for (let i = 0; i < size * size; i++) {
      const a = 1 - Math.min(1, Math.max(0, big.data[i] / 255));
      for (let k = 0; k < 3; k++) rgb[i * 3 + k] = Math.round(255 * (1 - a) + INK[k] * a);
    }
    const tile = await sharp(rgb, { raw: { width: size, height: size, channels: 3 } }).png().toBuffer();
    await sharp({ create: { width: 1254, height: 1254, channels: 3, background: "#ffffff" } })
      .composite([{ input: tile, left: (1254 - size) / 2, top: (1254 - size) / 2 }])
      .png()
      .toFile(path.join(ROOT, "public/game/ui/book/ailments", `${file}.png`));
    console.log(file);
  }
})();
