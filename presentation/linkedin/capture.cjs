// Captures from the running dev server (npm run dev, http://localhost:3000).
// Nothing in the project is modified: the Decorator drafts are seeded in a
// throw-away Chrome profile from the versioned compositions.
//   node presentation/linkedin/capture.cjs
const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const { withBrowser } = require("./lib-cdp.cjs");

const ROOT = path.resolve(__dirname, "../..");
const RAW = path.join(__dirname, "raw");
const BASE = process.env.BASE || "http://localhost:3000";

function loadExport(rel, name) {
  const js = ts.transpileModule(fs.readFileSync(path.join(ROOT, rel), "utf8"), { compilerOptions: { module: "commonjs", target: "es2022" } }).outputText;
  const m = { exports: {} };
  new Function("exports", "module", "require", js)(m.exports, m, require);
  return m.exports[name];
}
// Same precedence as src/game/compositions/index.ts: the new-world exteriors
// take their population from newWorldCompositions, the interiors from chapter-1.
const compositions = [
  ...loadExport("src/game/new-world-map/newWorldCompositions.ts", "newWorldChapter1Compositions"),
  ...loadExport("src/game/compositions/chapter-1.ts", "chapter1Compositions"),
];
const instancesOf = (sceneId) => compositions.find((c) => c.sceneId === sceneId && c.chapterId === "chapter-1").instances;

withBrowser(async ({ evalJs, viewport, shot, key, click, sleep }) => {
  await viewport(1600, 1000);
  const seed = async (sceneId) => evalJs(`localStorage.setItem(${JSON.stringify(`unusual-plague:decorator:v1:${sceneId}:chapter-1`)}, ${JSON.stringify(JSON.stringify(instancesOf(sceneId)))})`);
  const pickScene = (value) => evalJs(`(()=>{const l=[...document.querySelectorAll('label')].find(x=>x.textContent.trim().startsWith('Scene'));const s=l.querySelector('select');Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype,'value').set.call(s,'${value}');s.dispatchEvent(new Event('change',{bubbles:true}))})()`);
  const hold = async (k, code, vk, ms) => { await key("keyDown", k, code, vk); await sleep(ms); await key("keyUp", k, code, vk); };
  const stageRect = () => evalJs(`(()=>{const e=[...document.querySelectorAll('*')].filter(e=>getComputedStyle(e).backgroundImage.includes('-background')||(e.tagName==='IMG'&&e.src.includes('-background')))[0];const r=e.getBoundingClientRect();return {x:r.left,y:r.top,width:r.width,height:r.height}})()`);

  // ---- Decorator, Plaza (the scene that also exists in the runtime preview)
  await evalJs("1"); await (async () => {})();
  await require("./lib-cdp.cjs").sleep(0);
  await evalJs(`location.href='${BASE}/dev/decorator'`); await sleep(7000);
  await seed("plaza"); await seed("smithy-interior");
  await evalJs("location.reload()"); await sleep(7000);

  const hideDevUi = () => evalJs(`document.querySelectorAll('nextjs-portal').forEach(n=>n.remove())`);
  const rectOf = (js) => evalJs(`(()=>{const e=${js};if(!e)return null;e.scrollIntoView({block:'center'});const r=e.getBoundingClientRect();return {x:r.left,y:r.top,width:r.width,height:r.height}})()`);
  const stageClip = async () => { const r = await stageRect(); return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) }; };

  // ---- Hero source: smithy interior, no collider overlay (x2 pixels)
  await viewport(1600, 1000, 2);
  await pickScene("smithy-interior"); await sleep(2500); await hideDevUi();
  await evalJs(`(()=>{const c=[...document.querySelectorAll('label')].find(l=>l.textContent.includes('SHOW COLLIDERS')).querySelector('input');if(c.checked)c.click()})()`);
  await sleep(600);
  await shot(path.join(RAW, "hero-smithy.png"), await stageClip());

  // ---- Decorator, Plaza: stage with colliders + the inspector of a selected NPC
  await pickScene("plaza"); await sleep(2500); await hideDevUi();
  await evalJs(`(()=>{const c=[...document.querySelectorAll('label')].find(l=>l.textContent.includes('SHOW COLLIDERS')).querySelector('input');if(!c.checked)c.click()})()`);
  await sleep(500);
  // select the merchant by its world position (stage = 1536 x 1024 world units)
  { const r = await stageRect(); await click(r.x + (1052 / 1536) * r.width, r.y + (300 / 1024) * r.height); await sleep(800); }
  await shot(path.join(RAW, "decorator-plaza-stage.png"), await stageClip());
  const insp = await rectOf(`[...document.querySelectorAll('label')].find(l=>l.textContent.trim().startsWith('Mirror'))`);
  console.log("mirror label rect", insp);
  await shot(path.join(RAW, "decorator-plaza-selected-full.png"));
  fs.writeFileSync(path.join(RAW, "decorator-mirror-rect.json"), JSON.stringify(insp));

  // ---- Runtime: the same Plaza drawn by the game's own scene component
  await viewport(1600, 1000, 2);
  await evalJs(`location.href='${BASE}/dev/dialogue'`); await sleep(7000); await hideDevUi();
  await evalJs(`(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('Iniciar conversaci'));if(b&&b.parentElement)b.parentElement.style.display='none'})()`);
  await sleep(500);
  await shot(path.join(RAW, "runtime-plaza-full.png"));
  await shot(path.join(RAW, "runtime-plaza-stage.png"), { x: 24, y: 98, width: 1552, height: 804 });
}).catch((e) => { console.error(e); process.exit(1); });
