// Draws the tutorial's wooden arrow (pointing down) pixel by pixel: node art/make-wood-arrow.cjs
const sharp = require("sharp");
const path = require("path");
const W = 24, H = 30;
const px = Array.from({ length: H }, () => Array(W).fill(null));
const OUT = [28, 17, 12], DARK = [92, 58, 30], MID = [154, 102, 52], LIGHT = [201, 146, 79], HI = [236, 190, 122], NAIL = [200, 200, 205];
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
  if ((y + x * 2) % 7 === 0) c = c === LIGHT ? MID : c === MID ? DARK : c;
  px[y][x] = c;
}
// outline
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (!px[y][x]) {
  for (const [dx, dy] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nx = x+dx, ny = y+dy; if (nx>=0&&ny>=0&&nx<W&&ny<H&&inside(nx,ny)) { px[y][x] = OUT; break; } }
}
// two nails
for (const [x, y] of [[11, 3], [12, 3], [11, 11], [12, 11]]) px[y][x] = NAIL;
const buf = Buffer.alloc(W * H * 4);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const c = px[y][x]; const i = (y*W+x)*4; if (c) { buf[i]=c[0];buf[i+1]=c[1];buf[i+2]=c[2];buf[i+3]=255; } }
sharp(buf, { raw: { width: W, height: H, channels: 4 } }).png().toFile(path.resolve(__dirname, "../public/game/ui/tutorial/wood-arrow.png")).then(() => console.log("ok"));
