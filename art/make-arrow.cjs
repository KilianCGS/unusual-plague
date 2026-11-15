// Draws the tutorial's arrow (pointing down) pixel by pixel: node art/make-arrow.cjs
// 2026-11-14: it is YELLOW now (the wooden one did not read well on the dark Botica).
const sharp = require("sharp");
const path = require("path");
const W = 24, H = 30;
const px = Array.from({ length: H }, () => Array(W).fill(null));
const OUT = [40, 24, 8], DARK = [214, 150, 20], MID = [250, 200, 40], LIGHT = [255, 226, 90], HI = [255, 247, 190], NAIL = [255, 247, 190];
// silhouette: shaft x 7..16 (10 wide) from y 1..14, head triangle y 15..28 widening to x 1..22
const inside = (x, y) => {
  if (y >= 1 && y <= 14) return x >= 7 && x <= 16;
  if (y >= 15 && y <= 28) { const half = 11 - Math.floor((y - 15) * 0.78); return x >= 12 - half && x <= 11 + half; }
  return false;
};
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (inside(x, y)) {
  // wood: light on the left, dark on the right, grain lines
  let c = x <= 9 ? LIGHT : x <= 13 ? MID : DARK;
  if (y <= 14 && x === 8) c = HI;
  
  px[y][x] = c;
}
// outline
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!px[y][x]) {
  for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x+dx, ny = y+dy; if (nx>=0&&ny>=0&&nx<W&&ny<H&&inside(nx,ny)) { px[y][x] = OUT; break; } }
}
// two nails

const buf = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = px[y][x]; const i = (y*W+x)*4; if (c) { buf[i]=c[0];buf[i+1]=c[1];buf[i+2]=c[2];buf[i+3]=255; } }
sharp(buf, { raw: { width: W, height: H, channels: 4 } }).png().toFile(path.resolve(__dirname, "../public/game/ui/tutorial/arrow-yellow.png")).then(() => console.log("ok"));
