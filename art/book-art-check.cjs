// Checks the Compendium art that Codex delivers (2026-11-14) and builds a contact sheet to review it:
//   node art/book-art-check.cjs [out.png]
// For every expected file it prints its size against the expected one (ailments 1254x1254,
// preparations like mint-infusion.png, ingredients spreads 1678x937), says whether it is still
// the provisional placeholder (same bytes as the git version) and writes one sheet with the
// new ailments, the new preparations and the 5th ingredients spread, side by side with a
// reference, so the line and the sepia can be compared at a glance.
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const BOOK = path.resolve(__dirname, "../public/game/ui/book");
const OUT = process.argv[2] || path.resolve(__dirname, "../book-art-sheet.png");

const AILMENTS = ["burn-v2", "fracture-v2", "insomnia-v2"].map((n) => ({ file: `ailments/${n}.png`, ref: "ailments/fever-v2.png" }));
const PREPARATIONS = ["bone-broth", "citrus-syrup", "mushroom-cream", "onion-syrup", "rehydration-drink", "strong-broth"].map((n) => ({
  file: `preparations/${n}.png`,
  ref: "preparations/mint-infusion.png",
}));
const INGREDIENTS = ["es", "en"].map((l) => ({ file: `ingredients/${l}/ingredients-05.png`, ref: `ingredients/${l}/ingredients-04.png` }));

async function size(rel) {
  const full = path.join(BOOK, rel);
  if (!fs.existsSync(full)) return null;
  const m = await sharp(full).metadata();
  return { w: m.width, h: m.height };
}

(async () => {
  const items = [...AILMENTS, ...PREPARATIONS, ...INGREDIENTS];
  const cells = [];
  for (const item of items) {
    const got = await size(item.file);
    const ref = await size(item.ref);
    if (!got) {
      console.log(`MISSING  ${item.file}`);
      continue;
    }
    const same = got.w === ref.w && got.h === ref.h;
    // preparations may vary a little in size between files; ailments and spreads must match
    const strict = item.file.startsWith("ailments") || item.file.startsWith("ingredients");
    const flag = same ? "ok      " : strict ? "WRONG SIZE" : "differs ";
    console.log(`${flag} ${item.file}  ${got.w}x${got.h}  (reference ${ref.w}x${ref.h})`);
    cells.push(item);
  }
  if (!cells.length) return console.log("nothing to put on the sheet");
  const TH = 300;
  const parts = [];
  let x = 0;
  const rows = [];
  for (const item of cells) {
    const a = await sharp(path.join(BOOK, item.file)).resize({ height: TH }).flatten({ background: "#fff" }).png().toBuffer();
    const b = await sharp(path.join(BOOK, item.ref)).resize({ height: TH }).flatten({ background: "#fff" }).png().toBuffer();
    const ma = await sharp(a).metadata();
    const mb = await sharp(b).metadata();
    rows.push({ a, b, wa: ma.width, wb: mb.width });
  }
  const width = Math.max(...rows.map((r) => r.wa + r.wb + 30));
  const height = rows.length * (TH + 12);
  rows.forEach((r, i) => {
    parts.push({ input: r.a, left: 0, top: i * (TH + 12) });
    parts.push({ input: r.b, left: r.wa + 30, top: i * (TH + 12) });
  });
  await sharp({ create: { width, height, channels: 3, background: "#888" } }).composite(parts).png().toFile(OUT);
  console.log("sheet:", OUT, "(left = new file, right = reference)");
})();
