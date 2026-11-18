// V2 of the four LinkedIn carousel images (1080 x 1350). Same sources as
// build.cjs (real project PNGs + the captures in ./raw); V1 stays untouched in
// ./out, V2 goes to ./out-v2 so both can be compared side by side.
//   node presentation/linkedin/build-v2.cjs [prefix]
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { withBrowser, sleep } = require("./lib-cdp.cjs");

const ROOT = path.resolve(__dirname, "../..");
const PUB = path.join(ROOT, "public/game");
const RAW = path.join(__dirname, "raw");
const BUILD = path.join(__dirname, "build-v2");
const OUT = path.join(__dirname, "out-v2");
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

// 1 — cover: title and scene read as ONE composition
async function image1() {
  return page(`
    <div style="position:absolute;top:78px;left:0;right:0;text-align:center">
      <div class="serif gold" style="font-size:80px;letter-spacing:.07em;line-height:1">Unusual Plague</div>
      <div style="margin-top:22px;font-size:38px;color:#efe3c6">Un misterio médico en pixel art</div>
    </div>
    <div style="position:absolute;top:318px;left:-40px;width:1160px;height:773px">
      <img src="${url(path.join(RAW, "hero-smithy.png"))}" style="width:1160px;height:773px;display:block">
      <div style="position:absolute;inset:0;background:linear-gradient(#0b0a0e 0,rgba(11,10,14,0) 14%,rgba(11,10,14,0) 86%,#0b0a0e 100%)"></div>
    </div>
    <div class="muted" style="position:absolute;bottom:112px;left:0;right:0;text-align:center;font-size:23px;letter-spacing:.14em;text-transform:uppercase">Proyecto personal · En desarrollo</div>`);
}

// 2 — the Medical Book is the only protagonist
async function image2() {
  const es = url(path.join(PUB, "ui/book/ingredients/es/ingredients-01.png"));
  return page(`
    <div style="position:absolute;top:78px;left:70px;right:70px">
      <div class="serif gold" style="font-size:88px;letter-spacing:.04em;line-height:1.02">No es solo explorar</div>
      <div style="margin-top:26px;font-size:32px;line-height:1.35;color:#efe3c6;max-width:920px">Pacientes, dolencias, ingredientes y preparados forman parte de un mismo sistema médico.</div>
    </div>
    <img src="${es}" style="position:absolute;top:508px;left:10px;width:1060px;display:block;filter:drop-shadow(0 20px 34px rgba(0,0,0,.7))">
    <div class="muted" style="position:absolute;bottom:92px;left:0;right:0;text-align:center;font-size:24px;letter-spacing:.06em">Sistema médico · Disponible en español e inglés</div>`);
}

// 3 — Decorator -> result in game, a small callout instead of the big panel
async function image3() {
  const callout = path.join(BUILD, "callout.png");
  // only the controls that matter: Size, zOffset, Mirror (flipX), collider, interaction
  await sharp(path.join(RAW, "decorator-plaza-selected-full.png"))
    .extract({ left: 6, top: 1290, width: 676, height: 372 })
    .png()
    .toFile(callout);
  return page(`
    <div style="position:absolute;top:52px;left:56px;right:56px">
      <div class="serif gold" style="font-size:58px;letter-spacing:.04em;line-height:1.06">También construí mis propias herramientas</div>
      <div style="margin-top:18px;font-size:24px;line-height:1.35;color:#d9cdb0">Placement, escala, profundidad, colliders y variantes visuales desde mi propio editor.</div>
    </div>
    <div style="position:absolute;top:280px;left:56px;width:968px">
      <div class="tag" style="margin-bottom:9px">Decorator</div>
      <div class="frame" style="position:relative;width:968px;height:470px;overflow:hidden">
        <img src="${url(path.join(RAW, "decorator-plaza-stage.png"))}" style="width:968px;display:block">
        <div style="position:absolute;right:14px;bottom:14px;width:372px;border:2px solid #d4af37;background:#050507;box-shadow:0 8px 24px rgba(0,0,0,.75)">
          <img src="${url(callout)}" style="width:368px;display:block">
        </div>
      </div>
    </div>
    <div class="gold" style="position:absolute;top:786px;left:0;right:0;text-align:center;font-size:28px;line-height:1">&#9660;</div>
    <div style="position:absolute;top:826px;left:56px;width:968px">
      <div class="tag" style="margin-bottom:9px">Resultado en juego</div>
      <div class="frame" style="width:968px;height:420px;overflow:hidden">
        <img src="${url(path.join(RAW, "runtime-plaza-stage.png"))}" style="width:968px;display:block;margin-top:-12px">
      </div>
    </div>`);
}

// 4 — same world, one day later: per-sprite integer scales, one "en desarrollo"
async function image4() {
  const G = (p) => path.join(PUB, p);
  const rows = [
    { name: "Minero", d1: G("npcs/injured-miner/idle/0.png"), s1: 2, d2: G("npcs/miner-recovering-working/idle/0.png"), s2: 2, t1: "Herido", t2: "De vuelta al trabajo" },
    { name: "Agricultor", d1: G("npcs/farmer-hoeing/idle/0.png"), s1: 3, d2: G("npcs/farmer-hoeing-sick-lying/idle/0.png"), s2: 2, t1: "Trabajando", t2: "Gravemente enfermo" },
    { name: "Leñador", d1: G("npcs/woodcutter/idle/0.png"), s1: 3, d2: G("npcs/woodcutter-day2-tired/idle/0.png"), s2: 3, t1: "Talando", t2: "Agotado" },
    { name: "Bruja", d1: G("characters/witch/sit/tavern/1.png"), s1: 3, d2: G("characters/witch/cave-lantern/idle/0.png"), s2: 3, t1: "En la taberna", t2: "En la cueva" },
  ];
  let cells = "";
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const a = await sprite(r.d1, `r${i}-d1`, r.s1);
    const b = await sprite(r.d2, `r${i}-d2`, r.s2);
    cells += `<div class="row" style="top:${196 + i * 280}px">
      <div class="who serif">${r.name}</div>
      <div class="cell c1"><div class="art"><img src="${a.src}" width="${a.w}" height="${a.h}"></div><div class="cap">${r.t1}</div></div>
      <div class="arrow gold">&rarr;</div>
      <div class="cell c2"><div class="art"><img src="${b.src}" width="${b.w}" height="${b.h}"></div><div class="cap">${r.t2}</div></div>
    </div>`;
  }
  return page(
    `
    <div style="position:absolute;top:40px;left:0;right:0;text-align:center">
      <div class="serif gold" style="font-size:42px;letter-spacing:.04em;line-height:1.05;white-space:nowrap">El mismo mundo, un día después</div>
      <div style="margin-top:14px;font-size:24px;line-height:1.3;color:#d9cdb0">Los mismos personajes. Nuevos estados. Un mundo que cambia con la historia.</div>
    </div>
    <div class="tag" style="position:absolute;top:150px;left:204px;width:366px;text-align:center">Día 1</div>
    <div class="tag" style="position:absolute;top:150px;left:640px;width:366px;text-align:center;font-size:17px;letter-spacing:.14em;line-height:25px">Día 2 · En desarrollo</div>
    ${cells}`,
    `
    .row{position:absolute;left:74px;width:932px;height:270px}
    .who{position:absolute;left:0;top:0;bottom:0;width:130px;display:flex;align-items:center;font-size:14px;letter-spacing:.08em;color:#9c8f74}
    .cell{position:absolute;top:0;width:366px;height:270px;background:#121018;border:2px solid #2e2616}
    .c1{left:130px}.c2{left:566px}
    .art{position:absolute;top:0;left:0;right:0;height:228px;display:flex;align-items:center;justify-content:center}
    .cell img{image-rendering:pixelated;display:block}
    .cap{position:absolute;left:8px;right:8px;bottom:12px;font-size:20px;color:#d6caad;text-align:center}
    .arrow{position:absolute;left:496px;top:0;bottom:0;width:70px;display:flex;align-items:center;justify-content:center;font-size:38px}
  `,
  );
}

(async () => {
  const jobs = [
    ["1-unusual-plague-v2", image1],
    ["2-sistema-medico-v2", image2],
    ["3-herramientas-v2", image3],
    ["4-mismo-mundo-otro-dia-v2", image4],
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
