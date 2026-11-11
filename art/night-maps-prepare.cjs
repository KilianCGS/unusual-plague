// Copies the six night paintings from the Desktop into public/game/new-world-map/night/,
// lined up on their day background (found by comparing edges, see the shift below).
// A 1-pixel shift of the painting is invisible, but it makes the day collisions fit exactly.
//   node art/night-maps-prepare.cjs "<folder with the six PNGs>"
const path = require("path");
const sharp = require("sharp");

const SRC = process.argv[2];
if (!SRC) throw new Error('usage: node art/night-maps-prepare.cjs "<folder with the night PNGs>"');
const OUT = path.resolve(__dirname, "../public/game/new-world-map/night");

// [night id, source file, day width, day height, dx, dy]  (dx, dy = where the night
// painting is displaced from the day one; 0 0 = already exact)
const NIGHTS = [
  ["outskirts", "Mapa medieval bajo la luna-5.png", 1546, 1017, 0, 0],
  ["apothecary-street", "Mapa medieval pixelado bajo la luna-2.png", 1120, 1405, 0, 1],
  ["bakery-street", "Mapa medieval pixelado bajo la luna-3.png", 1168, 1346, 0, 0],
  ["tavern-street", "Mapa medieval pixelado de noche-1.png", 1730, 909, 0, 0],
  ["smithy-street", "Mapa nocturno pixelado con forja encendida.png", 1619, 971, 1, 0],
  ["forest", "Mapa pixelado nocturno con cabaña y estanque.png", 1426, 1103, 0, 1],
];

(async () => {
  for (const [id, file, w, h, dx, dy] of NIGHTS) {
    const meta = await sharp(path.join(SRC, file)).metadata();
    const width = Math.min(meta.width - dx, w);
    const height = Math.min(meta.height - dy, h);
    let img = await sharp(path.join(SRC, file)).extract({ left: dx, top: dy, width, height }).png().toBuffer();
    if (width < w || height < h) {
      img = await sharp(img).extend({ right: w - width, bottom: h - height, extendWith: "copy" }).png().toBuffer();
    }
    await sharp(img).toFile(path.join(OUT, `${id}-night-background.png`));
    console.log(id, `${meta.width}x${meta.height} -> ${w}x${h}`, "shift", dx, dy);
  }
})();
