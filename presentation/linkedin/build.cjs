// Builds the four LinkedIn carousel images (1080 x 1350) from REAL project PNGs
// and the captures in ./raw. Nothing here touches the game: it only reads
// public/game/** and writes inside presentation/linkedin/.
//   node presentation/linkedin/capture.cjs   (needs `npm run dev`; makes ./raw)
//   node presentation/linkedin/build.cjs     (makes ./out/*.png)
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { withBrowser, sleep } = require("./lib-cdp.cjs");

const ROOT = path.resolve(__dirname, "../..");
const PUB = path.join(ROOT, "public/game");
const RAW = path.join(__dirname, "raw");
const BUILD = path.join(__dirname, "build");
const OUT = path.join(__dirname, "out");
for (const d of [BUILD, OUT]) fs.mkdirSync(d, { recursive: true });
const url = (p) => "file:///" + p.replace(/\\/g, "/");

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1350px;overflow:hidden}
body{background:#0b0a0e;color:#e8dcc0;font-family:"Segoe UI",Arial,sans-serif;position:relative}
.gold{color:#d4af37}
.serif{font-family:Georgia,"Times New Roman",serif;font-weight:bold;text-transform:uppercase}
.muted{color:#a79b84}
.frame{border:2px solid #3b2f1a;background:#050507}
.tag{display:inline-block;font-size:19px;letter-spacing:.2em;text-transform:uppercase;color:#d4af37}
`;
const page = (body, extra = "") =>
  `<!doctype html><meta charset="utf-8"><style>${CSS}${extra}</style><body>${body}</body>`;

// nearest-neighbour, integer scale, trimmed to the painted pixels
async function sprite(file, name, scale) {
  const trimmed = await sharp(file).ensureAlpha().trim({ threshold: 1 }).png().toBuffer();
  const meta = await sharp(trimmed).metadata();
  const out = path.join(BUILD, `${name}.png`);
  await sharp(trimmed)
    .resize({ width: meta.width * scale, height: meta.height * scale, kernel: "nearest" })
    .png()
    .toFile(out);
  return { src: url(out), w: meta.width * scale, h: meta.height * scale };
}

async function image1() {
  return page(`
    <div style="position:absolute;top:84px;left:0;right:0;text-align:center">
      <div class="serif gold" style="font-size:92px;letter-spacing:.07em;line-height:1">Unusual Plague</div>
      <div style="margin-top:26px;font-size:40px;color:#efe3c6">Un misterio médico en pixel art</div>
    </div>
    <div style="position:absolute;top:410px;left:0;width:1080px;height:720px">
      <img src="${url(path.join(RAW, "hero-smithy.png"))}" style="width:1080px;height:720px;display:block">
      <div style="position:absolute;inset:0;background:linear-gradient(#0b0a0e 0,rgba(11,10,14,0) 16%,rgba(11,10,14,0) 84%,#0b0a0e 100%)"></div>
    </div>
    <div class="muted" style="position:absolute;bottom:74px;left:0;right:0;text-align:center;font-size:23px;letter-spacing:.14em;text-transform:uppercase">Proyecto personal · En desarrollo</div>`);
}

async function image2() {
  const es = url(path.join(PUB, "ui/book/ingredients/es/ingredients-01.png"));
  const en = url(path.join(PUB, "ui/book/ingredients/en/ingredients-01.png"));
  return page(`
    <div style="position:absolute;top:70px;left:70px;right:70px">
      <div class="serif gold" style="font-size:74px;letter-spacing:.05em;line-height:1.02">No es solo explorar</div>
      <div style="margin-top:22px;font-size:30px;line-height:1.35;color:#efe3c6;max-width:900px">Pacientes, dolencias, ingredientes y preparados forman parte de un mismo sistema médico.</div>
    </div>
    <img src="${es}" style="position:absolute;top:380px;left:50px;width:980px;display:block;filter:drop-shadow(0 18px 30px rgba(0,0,0,.65))">
    <img src="${en}" style="position:absolute;top:975px;left:290px;width:500px;display:block;filter:drop-shadow(0 12px 22px rgba(0,0,0,.6))">
    <div class="muted" style="position:absolute;top:1085px;left:70px;width:200px;font-size:22px;line-height:1.4">Disponible en español e inglés</div>`);
}

async function image3() {
  const insp = path.join(BUILD, "inspector.png");
  await sharp(path.join(RAW, "decorator-plaza-selected-full.png"))
    .extract({ left: 6, top: 1000, width: 676, height: 662 })
    .png()
    .toFile(insp);
  return page(`
    <div style="position:absolute;top:52px;left:56px;right:56px">
      <div class="serif gold" style="font-size:37px;letter-spacing:.04em;line-height:1.16">Construir el juego también significó construir mis propias herramientas</div>
      <div style="margin-top:16px;font-size:23px;line-height:1.35;color:#d9cdb0">Placement, escala, profundidad, colliders y variantes visuales desde una herramienta propia.</div>
    </div>
    <div style="position:absolute;top:214px;left:56px;width:968px">
      <div class="tag" style="margin-bottom:9px">Decorator</div>
      <div class="frame" style="position:relative;width:968px;height:488px;overflow:hidden">
        <img src="${url(path.join(RAW, "decorator-plaza-stage.png"))}" style="width:968px;display:block">
        <img src="${url(insp)}" style="position:absolute;left:12px;bottom:12px;width:330px;border:2px solid #d4af37;box-shadow:0 6px 20px rgba(0,0,0,.7)">
      </div>
    </div>
    <div class="gold" style="position:absolute;top:748px;left:0;right:0;text-align:center;font-size:30px;line-height:1">&#9660;</div>
    <div style="position:absolute;top:792px;left:56px;width:968px">
      <div class="tag" style="margin-bottom:9px">Resultado en juego</div>
      <div class="frame" style="width:968px;height:488px;overflow:hidden">
        <img src="${url(path.join(RAW, "runtime-plaza-stage.png"))}" style="width:968px;display:block;margin-top:-6px">
      </div>
    </div>`);
}

async function image4() {
  const G = (p) => path.join(PUB, p);
  const rows = [
    { name: "Minero", d1: G("npcs/injured-miner/idle/0.png"), d2: G("npcs/miner-recovering-working/idle/0.png"), s: 2, t1: "Herido", t2: "Recuperado y otra vez trabajando" },
    { name: "Agricultor", d1: G("npcs/farmer-hoeing/idle/0.png"), d2: G("npcs/farmer-hoeing-sick-lying/idle/0.png"), s: 2, t1: "Cultivando", t2: "Gravemente enfermo" },
    { name: "Leñador", d1: G("npcs/woodcutter/idle/0.png"), d2: G("npcs/woodcutter-day2-tired/idle/0.png"), s: 3, t1: "Talando", t2: "Agotado" },
    { name: "Bruja", d1: G("characters/witch/sit/tavern/1.png"), d2: G("characters/witch/cave-lantern/idle/0.png"), s: 3, t1: "En la taberna", t2: "En la cueva" },
  ];
  let cells = "";
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const a = await sprite(r.d1, `r${i}-d1`, r.s);
    const b = await sprite(r.d2, `r${i}-d2`, r.s);
    cells += `<div class="row" style="top:${196 + i * 280}px">
      <div class="who serif">${r.name}</div>
      <div class="cell c1"><div class="art"><img src="${a.src}" width="${a.w}" height="${a.h}"></div><div class="cap">${r.t1}</div></div>
      <div class="arrow gold">&rarr;</div>
      <div class="cell c2"><div class="art"><img src="${b.src}" width="${b.w}" height="${b.h}"></div><div class="cap">${r.t2}</div><div class="wip">En desarrollo</div></div>
    </div>`;
  }
  return page(
    `
    <div style="position:absolute;top:40px;left:0;right:0;text-align:center">
      <div class="serif gold" style="font-size:46px;letter-spacing:.04em;line-height:1.05;white-space:nowrap">El mismo mundo, un día después</div>
      <div style="margin-top:14px;font-size:24px;line-height:1.3;color:#d9cdb0">Los mismos personajes. Nuevos estados. Un mundo que cambia con la historia.</div>
    </div>
    <div class="tag" style="position:absolute;top:150px;left:204px;width:366px;text-align:center">Día 1</div>
    <div class="tag" style="position:absolute;top:150px;left:640px;width:366px;text-align:center">Día 2</div>
    ${cells}`,
    `
    .row{position:absolute;left:74px;width:932px;height:270px}
    .who{position:absolute;left:0;top:0;bottom:0;width:130px;display:flex;align-items:center;font-size:14px;letter-spacing:.08em;color:#9c8f74}
    .cell{position:absolute;top:0;width:366px;height:270px;background:#121018;border:2px solid #2e2616}
    .c1{left:130px}.c2{left:566px}
    .art{position:absolute;top:0;left:0;right:0;height:228px;display:flex;align-items:center;justify-content:center}
    .cell img{image-rendering:pixelated;display:block}
    .cap{position:absolute;left:8px;right:8px;bottom:12px;font-size:19px;color:#cfc3a6;text-align:center}
    .arrow{position:absolute;left:496px;top:0;bottom:0;width:70px;display:flex;align-items:center;justify-content:center;font-size:38px}
    .wip{position:absolute;top:8px;right:8px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#d4af37;border:1px solid #6f5a1d;padding:2px 6px}
  `,
  );
}

(async () => {
  const jobs = [
    ["1-unusual-plague", image1],
    ["2-sistema-medico", image2],
    ["3-herramientas", image3],
    ["4-mismo-mundo-otro-dia", image4],
  ];
  const only = process.argv[2];
  await withBrowser(
    async ({ send, viewport, shot }) => {
      await viewport(1080, 1350, 1);
      for (const [name, fn] of jobs) {
        if (only && !name.startsWith(only)) continue;
        const html = path.join(BUILD, `${name}.html`);
        fs.writeFileSync(html, await fn());
        await send("Page.navigate", { url: url(html) });
        await sleep(1200);
        await shot(path.join(OUT, `${name}.png`));
        console.log("ok", name);
      }
    },
    { width: 1080, height: 1350 },
  );
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
