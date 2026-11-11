// PLACEHOLDER illustrations for the six cooking recipes of the recipe book (2026-11-11).
// The book's drawings are 1678x937 sepia engravings; until Kilian paints these six in the
// same hand-drawn style, each one is the item's pixel icon enlarged and turned into a
// one-colour brown ink picture on white (the book multiplies them over the paper).
//   node art/book-placeholder-illustrations.cjs
const path = require("path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const ITEMS = ["bone-broth", "mushroom-cream", "onion-syrup", "rehydration-drink", "citrus-syrup", "strong-broth"];
const INK = [0x5a, 0x2e, 0x1a];

(async () => {
  for (const id of ITEMS) {
    const icon = path.join(ROOT, "public/game/items/prepared-icons", `${id}.png`);
    const big = await sharp(icon).resize(528, 528, { kernel: "nearest" }).flatten({ background: "#ffffff" }).greyscale().raw().toBuffer({ resolveWithObject: true });
    const w = big.info.width, h = big.info.height;
    const rgba = Buffer.alloc(w * h * 3);
    for (let i = 0; i < w * h; i++) {
      const t = Math.min(1, Math.max(0, big.data[i] / 255)); // 0 dark .. 1 white
      const a = 1 - t; // ink amount
      for (let k = 0; k < 3; k++) rgba[i * 3 + k] = Math.round(255 * (1 - a) + INK[k] * a * 1.0 + (1 - a) * 0);
    }
    const tile = await sharp(rgba, { raw: { width: w, height: h, channels: 3 } }).png().toBuffer();
    await sharp({ create: { width: 1678, height: 937, channels: 3, background: "#ffffff" } })
      .composite([{ input: tile, left: Math.round((1678 - w) / 2), top: Math.round((937 - h) / 2) }])
      .png()
      .toFile(path.join(ROOT, "public/game/ui/book/preparations", `${id}.png`));
    console.log(id);
  }
})();
