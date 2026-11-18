// Carousel "Colisiones, profundidad y transiciones" (3 images, 1080 x 1350).
// Real captures live in ./raw (see capture.cjs); every number shown comes from the
// repo files read below. New folder: nothing from the earlier carousels is touched.
//   node presentation/linkedin/colisiones/build.cjs
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const sharp = require("sharp");
const { withBrowser, sleep } = require("../lib-cdp.cjs");

const ROOT = path.resolve(__dirname, "../../..");
const RAW = path.join(__dirname, "raw");
const BUILD = path.join(__dirname, "build");
const OUT = path.join(__dirname, "out");
for (const d of [BUILD, OUT]) fs.mkdirSync(d, { recursive: true });
const url = (p) => "file:///" + p.replace(/\\/g, "/");

// ---------- real data from the repo --------------------------------------------
const geo = fs.readFileSync(path.join(ROOT, "src/game/new-world-map/geometry/plazaGeometry.ts"), "utf8");
const poly = geo.match(/id: "plaza-poly-1", points: \[(.*?)\] \}/s)[1];
const polyPoints = [...poly.matchAll(/x: (\d+), y: (\d+)/g)].map((m) => [+m[1], +m[2]]);
const depth1 = geo.match(/id: "plaza-depth-1", depthY: (\d+)/)[1];
// the fountain BEFORE the free shape: one rectangle (commit 9c93f24)
const oldGeo = execSync("git show 9c93f24:src/game/new-world-map/geometry/plazaGeometry.ts", { cwd: ROOT }).toString();
const oldRect = oldGeo.match(/id: "plaza-12", x: (\d+), y: (\d+), width: (\d+), height: (\d+)/).slice(1).map(Number);
const smithyExit = fs.readFileSync(path.join(ROOT, "src/game/new-world-map/geometry/smithyStreetGeometry.ts"), "utf8")
  .match(/id: "smithy-street-transition-1", x: (\d+), y: (\d+), width: (\d+), height: (\d+)/).slice(1).map(Number);
const smithySpawn = fs.readFileSync(path.join(ROOT, "src/game/smithy-interior/smithyInteriorGeometry.ts"), "utf8")
  .match(/id: "smithy-interior-spawn-1", x: (\d+), y: (\d+), direction: "(\w+)"/).slice(1);
const fadeMs = fs.readFileSync(path.join(ROOT, "src/game/world/GameWorld.tsx"), "utf8").match(/const SCENE_FADE_MS = (\d+);/)[1];
console.log({ points: polyPoints.length, depth1, oldRect, smithyExit, smithySpawn, fadeMs });

// ---------- crops ---------------------------------------------------------------
async function crop(src, name, box, width, height, kernel = "lanczos3") {
  const out = path.join(BUILD, name);
  await sharp(path.join(RAW, src))
    .extract({ left: box[0], top: box[1], width: box[2], height: box[3] })
    .resize({ width, height, kernel })
    .png()
    .toFile(out);
  return url(out);
}

const CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1350px;overflow:hidden}
body{background:#0b0a0e;color:#e8dcc0;font-family:"Segoe UI",Arial,sans-serif;position:relative}
.gold{color:#d4af37}
.serif{font-family:Georgia,"Times New Roman",serif;font-weight:bold;text-transform:uppercase}
.muted{color:#a79b84}
.tag{font-size:21px;letter-spacing:.22em;text-transform:uppercase;color:#d4af37}
.frame{border:2px solid #3b2f1a;background:#050507;position:relative;overflow:hidden}
.lab{font-size:25px;letter-spacing:.14em;text-transform:uppercase;color:#d4af37}
.sub{font-size:23px;color:#cbbfa4}
code,pre{font-family:Consolas,"Courier New",monospace}
.code{font-family:Consolas,"Courier New",monospace;background:#14110f;border:2px solid #3b2f1a;padding:20px 26px;font-size:23px;line-height:1.5;color:#e8dcc0;white-space:pre}
.code b{color:#d4af37;font-weight:normal}
.arrow{position:absolute;color:#d4af37;font-size:54px;line-height:1}
`;
const page = (body, extra = "") => `<!doctype html><meta charset="utf-8"><style>${CSS}${extra}</style><body>${body}</body>`;

// ---------- 1 · colliders -------------------------------------------------------
function image1() {
  const bg = url(path.join(ROOT, "public/game/new-world-map/plaza-background.png"));
  const VX = 640, VY = 350, VS = 280; // world window shown, 1 unit = 1 asset pixel
  const S = 470 / VS;
  const panel = (shape) => `
    <div class="frame" style="width:470px;height:470px">
      <img src="${bg}" style="position:absolute;width:${1536 * S}px;height:${1024 * S}px;left:${-VX * S}px;top:${-VY * S}px;image-rendering:pixelated">
      <svg viewBox="${VX} ${VY} ${VS} ${VS}" width="470" height="470" style="position:absolute;inset:0">${shape}</svg>
    </div>`;
  const stroke = `fill="rgba(255,92,92,.30)" stroke="#ff5c5c" stroke-width="3.5" vector-effect="non-scaling-stroke" stroke-linejoin="round"`;
  const rect = `<rect x="${oldRect[0]}" y="${oldRect[1]}" width="${oldRect[2]}" height="${oldRect[3]}" ${stroke}/>`;
  const shape = `<polygon points="${polyPoints.map((p) => p.join(",")).join(" ")}" ${stroke}/>`;
  const first = polyPoints.slice(0, 4).map((p) => `{ x: ${p[0]}, y: ${p[1]} }`);
  return page(`
    <div style="position:absolute;top:70px;left:70px;right:70px">
      <div class="tag">Colliders</div>
      <div class="serif gold" style="margin-top:20px;font-size:78px;letter-spacing:.04em;line-height:1.04">Colisiones dibujadas a mano</div>
      <div style="margin-top:26px;font-size:34px;line-height:1.3;color:#efe3c6">Un rectángulo no basta para una fuente redonda.</div>
    </div>
    <div style="position:absolute;top:470px;left:60px;display:flex;gap:20px">
      <div>${panel(rect)}
        <div class="lab" style="margin-top:16px">Antes</div>
        <div style="font-size:24px;color:#e8dcc0;margin-top:4px">1 rectángulo · ${oldRect[2]} × ${oldRect[3]}</div></div>
      <div>${panel(shape)}
        <div class="lab" style="margin-top:16px">Ahora</div>
        <div style="font-size:24px;color:#e8dcc0;margin-top:4px">1 forma libre · ${polyPoints.length} puntos</div></div>
    </div>
    <div class="code" style="position:absolute;top:1090px;left:70px;right:70px">{ id: <b>"plaza-poly-1"</b>, points: [
  ${first.slice(0, 2).join(", ")},
  ${first.slice(2).join(", ")}, … ] }</div>
    <div class="muted" style="position:absolute;bottom:46px;left:70px;right:70px;font-size:21px;letter-spacing:.04em">Esquema dibujado sobre el arte real, con la geometría de plazaGeometry.ts</div>`);
}

// ---------- 2 · depth -----------------------------------------------------------
async function image2() {
  const behind = await crop("game-statue-behind.png", "behind.png", [1232, 690, 760, 750], 470, 464);
  const front = await crop("game-statue-front.png", "front.png", [1245, 340, 760, 750], 470, 464);
  const editor = await crop("tool-plaza-geometry.png", "editor-statue.png", [1010, 545, 360, 360], 360, 360, "nearest");
  return page(`
    <div style="position:absolute;top:70px;left:70px;right:70px">
      <div class="tag">Profundidad</div>
      <div class="serif gold" style="margin-top:20px;font-size:78px;letter-spacing:.04em;line-height:1.04">Pasar por detrás</div>
      <div style="margin-top:24px;font-size:32px;line-height:1.3;color:#efe3c6">Una forma tapa al Doctor hasta que cruza su línea de profundidad.</div>
    </div>
    <div style="position:absolute;top:330px;left:60px;display:flex;gap:20px">
      <div><div class="frame" style="width:470px;height:464px"><img src="${behind}" style="display:block"></div>
        <div class="lab" style="margin-top:14px">Detrás</div>
        <div style="font-size:23px;margin-top:3px">Solo asoma el sombrero</div></div>
      <div><div class="frame" style="width:470px;height:464px"><img src="${front}" style="display:block"></div>
        <div class="lab" style="margin-top:14px">Delante</div>
        <div style="font-size:23px;margin-top:3px">Ya pasó la línea</div></div>
    </div>
    <div style="position:absolute;top:905px;left:70px;display:flex;gap:30px;align-items:flex-start">
      <div class="frame" style="width:360px;height:360px"><img src="${editor}" style="display:block"></div>
      <div style="width:520px">
        <div class="lab">En el editor</div>
        <div style="margin-top:12px;font-size:27px;line-height:1.35;color:#efe3c6">Dibujas la forma violeta sobre la estatua y fijas su línea.</div>
        <div class="code" style="margin-top:22px;padding:16px 22px;font-size:25px">depthY: <b>${depth1}</b></div>
      </div>
    </div>
    <div class="muted" style="position:absolute;bottom:38px;left:70px;right:70px;font-size:21px;letter-spacing:.04em">Capturas reales: el juego y /dev/collisions</div>`);
}

// ---------- 3 · transitions ------------------------------------------------------
async function image3() {
  const street = await crop("tool-smithy-street.png", "smithy-street.png", [565, 330, 520, 693], 280, 373, "lanczos3");
  const fade = await crop("game-fade-mid.png", "fade.png", [1168, 267, 800, 1067], 280, 373);
  const inside = await crop("game-smithy-interior-after.png", "inside.png", [1190, 300, 825, 1100], 280, 373);
  const col = (img, n, title, line) => `
    <div style="width:280px"><div class="frame" style="width:280px;height:373px"><img src="${img}" style="display:block"></div>
      <div class="lab" style="margin-top:14px;font-size:22px">${n} · ${title}</div>
      <div style="font-size:21px;margin-top:4px;line-height:1.3">${line}</div></div>`;
  return page(`
    <div style="position:absolute;top:70px;left:70px;right:70px">
      <div class="tag">Transiciones</div>
      <div class="serif gold" style="margin-top:20px;font-size:78px;letter-spacing:.04em;line-height:1.04">Entre escenas</div>
      <div style="margin-top:24px;font-size:32px;line-height:1.3;color:#efe3c6">Pisar la zona amarilla de la herrería lleva dentro.</div>
    </div>
    <div style="position:absolute;top:430px;left:70px;width:940px;display:flex;justify-content:space-between">
      ${col(street, "①", "Zona", `Amarilla ${smithyExit[2]} × ${smithyExit[3]}`)}
      ${col(fade, "②", `Fundido`, `${fadeMs} ms a negro`)}
      ${col(inside, "③", "Llegada", `(${smithySpawn[0]}, ${smithySpawn[1]}) · mira al ${smithySpawn[2] === "north" ? "norte" : smithySpawn[2]}`)}
      <div class="arrow" style="left:297px;top:155px">›</div><div class="arrow" style="left:627px;top:155px">›</div>
    </div>
    <div class="code" style="position:absolute;top:1010px;left:70px;right:70px;font-size:22px">exit(<b>"to-smithy-interior"</b>,
  smithyStreetTransitions, <b>"smithy-street-transition-1"</b>,
  <b>"smithy-interior"</b>, <b>"from-smithy-street"</b>)</div>
    <div class="muted" style="position:absolute;bottom:42px;left:70px;right:70px;font-size:21px;letter-spacing:.04em">Capturas reales del editor y del juego · las flechas son un esquema</div>`);
}

(async () => {
  const pages = [
    ["1-colliders", image1()],
    ["2-profundidad", await image2()],
    ["3-transiciones", await image3()],
  ];
  for (const [name, html] of pages) fs.writeFileSync(path.join(BUILD, `${name}.html`), await html);
  await withBrowser(async ({ send, evalJs, viewport, shot }) => {
    await viewport(1080, 1350, 1);
    for (const [name] of pages) {
      await send("Page.navigate", { url: url(path.join(BUILD, `${name}.html`)) });
      await sleep(1200);
      await shot(path.join(OUT, `${name}.png`));
      console.log("wrote", name);
    }
  }, { width: 1080, height: 1350, port: 9351 });
})().catch((e) => { console.error(e); process.exit(1); });
