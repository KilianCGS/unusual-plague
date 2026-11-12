// The coin HUD icon: two small piles of copper coins (3 + 2), 16x16, drawn by hand in code.
//   node art/ui/coin-stack.cjs
const sharp = require("sharp");
const path = require("path");
const W = 16, H = 16;
const px = Buffer.alloc(W * H * 4);
const C = {
  o: [43, 25, 19], F: [224, 150, 83], H: [250, 210, 160], S: [163, 92, 44], D: [115, 62, 30], L: [204, 124, 61],
};
const COIN = [
  " ooooo ",
  "oHHFFLo",
  "oFFFFLo",
  "oSSSSDo",
  " ooooo ",
];
function put(x, y, ch) {
  if (ch === " " || x < 0 || y < 0 || x >= W || y >= H) return;
  const [r, g, b] = C[ch];
  const i = (y * W + x) * 4;
  px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = 255;
}
function coin(x0, y0) {
  COIN.forEach((row, dy) => [...row].forEach((ch, dx) => put(x0 + dx, y0 + dy, ch)));
}
// left pile of three (taller), right pile of two, a gap between them; bottom coin first
[11, 9, 7].forEach((y) => coin(0, y));
[11, 9].forEach((y) => coin(9, y));
sharp(px, { raw: { width: W, height: H, channels: 4 } })
  .png()
  .toFile(path.resolve(__dirname, "../../public/game/ui/coin.png"))
  .then(() => console.log("coin.png written"));
