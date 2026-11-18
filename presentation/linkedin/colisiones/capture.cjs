// Real captures for the "colliders, depth and transitions" carousel. Read-only
// against the game: it only opens /dev/collisions and /dev/day2 in headless Chrome.
//   (dev server running)  node presentation/linkedin/colisiones/capture.cjs
const fs = require("fs");
const path = require("path");
const { withBrowser, sleep } = require("../lib-cdp.cjs");

const RAW = path.join(__dirname, "raw");
fs.mkdirSync(RAW, { recursive: true });
const BASE = "http://localhost:3000";

// the same React-fiber helpers the dev checks use to start a scene from /dev/day2
const FIBER = `
(() => {
  const k = Object.keys(document).find((x) => x.startsWith('__reactContainer'));
  window.__gw = () => {
    const stack = [document[k]]; let f = null;
    while (stack.length) { const n = stack.pop(); if (!n) continue;
      if (typeof n.type === 'function' && n.type.name === 'GameWorld') { f = n; break; }
      if (n.sibling) stack.push(n.sibling); if (n.child) stack.push(n.child); }
    return f;
  };
  window.__go = (scene, spawn) => {
    const f = window.__gw(); let h = f.memoizedState;
    while (h) { const v = h.memoizedState;
      if (Array.isArray(v) && typeof v[0] === 'function') { const src = v[0].toString();
        if (src.includes('fading-out') && src.includes('caption') && src.includes('pendingRef')) { v[0](scene, spawn); return 'started'; } }
      h = h.next; }
    return 'no startTransition';
  };
  return 'ready';
})()`;

const KEYS = { up: ["ArrowUp", 38], down: ["ArrowDown", 40], left: ["ArrowLeft", 37], right: ["ArrowRight", 39] };

async function openGame({ evalJs, sleep }) {
  await evalJs(`location.href='${BASE}/dev/day2'`);
  await sleep(9000);
  await evalJs("document.querySelectorAll('nextjs-portal').forEach(n=>n.remove())");
  await evalJs(FIBER);
}

withBrowser(async (b) => {
  const { send, evalJs, viewport, shot, key } = b;
  const hold = async (dir, ms) => {
    const [k, vk] = KEYS[dir];
    await key("keyDown", k, k, vk);
    await sleep(ms);
    await key("keyUp", k, k, vk);
    await sleep(250);
  };
  const feet = () =>
    evalJs(`(() => { const im=[...document.querySelectorAll('img')].find(i=>i.src.includes('/characters/protagonist/')); if(!im) return null; const s=im.parentElement.getAttribute('style')||''; return JSON.stringify({x:+(s.match(/left: ([\\d.]+)px/)||[])[1], y:+(s.match(/top: ([\\d.]+)px/)||[])[1]}); })()`);

  // ---- 1) /dev/collisions: the plaza with the hand-drawn geometry --------------
  await viewport(1600, 1000, 2);
  await send("Page.navigate", { url: `${BASE}/dev/collisions` });
  await sleep(5000);
  await evalJs(`[...document.querySelectorAll('button')].find(b=>b.textContent.startsWith('Plaza')).click()`);
  await sleep(1200);
  const rect = JSON.parse(await evalJs(`(() => { const r=document.querySelector('[class*="layer"]').getBoundingClientRect(); return JSON.stringify({x:r.left,y:r.top,width:r.width,height:r.height}); })()`));
  await shot(path.join(RAW, "tool-plaza-geometry.png"), rect);
  console.log("tool layer", JSON.stringify(rect));
  // the smithy street in the same tool: the yellow transition zone and the blue spawn
  await evalJs(`[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Calle Herrer')).click()`);
  await sleep(1200);
  const rect2 = JSON.parse(await evalJs(`(() => { const r=document.querySelector('[class*="layer"]').getBoundingClientRect(); return JSON.stringify({x:r.left,y:r.top,width:r.width,height:r.height}); })()`));
  await shot(path.join(RAW, "tool-smithy-street.png"), rect2);
  console.log("tool smithy layer", JSON.stringify(rect2));

  // ---- 2) game: the Doctor behind and in front of the statue ----------------------
  await viewport(1600, 900, 2);
  await openGame(b);
  console.log(await evalJs("window.__go('plaza','from-apothecary-street')"));
  await sleep(4500);
  await hold("down", 2300); // straight south into the fountain: the red shape stops him
  console.log("behind statue", await feet());
  await shot(path.join(RAW, "game-statue-behind.png"));
  await hold("left", 700);
  await hold("down", 1500);
  console.log("walking around", await feet());
  await hold("right", 1500);
  await hold("down", 1500);
  console.log("in front", await feet());
  await shot(path.join(RAW, "game-statue-front-walk.png"));

  // same statue, arriving from the south: the Doctor stops against the base, IN FRONT
  console.log(await evalJs("window.__go('plaza','from-bakery-street')"));
  await sleep(4500);
  await hold("up", 2600);
  console.log("front of statue", await feet());
  await shot(path.join(RAW, "game-statue-front.png"));

  // ---- 3) game: smithy door -> fade -> interior ------------------------------------
  console.log(await evalJs("window.__go('smithy-street','from-smithy-interior')"));
  await sleep(4500);
  console.log("street start", await feet());
  await shot(path.join(RAW, "game-smithy-street-before.png"));
  const [k, vk] = KEYS.up;
  await key("keyDown", k, k, vk);
  // poll the black overlay while the exit zone fires
  const fadeOpacity = () =>
    evalJs(`(() => { const o=[...document.querySelectorAll('div')].find(d=>/transition-duration: 450ms/.test(d.getAttribute('style')||'')); return o? getComputedStyle(o).opacity : 'none'; })()`);
  let n = 0;
  let midShot = null;
  const t0 = Date.now();
  while (Date.now() - t0 < 2500) {
    const o = parseFloat(await fadeOpacity());
    if (o > 0.25 && o < 0.8 && !midShot) {
      midShot = path.join(RAW, "game-fade-mid.png");
      await shot(midShot);
      console.log("mid fade captured at opacity", o);
      break; // let go of the key: the Doctor must arrive standing on the spawn
    }
    n += 1;
    await sleep(25);
  }
  await key("keyUp", k, k, vk);
  console.log("polls", n, "mid", midShot ? "yes" : "no");
  await sleep(1800);
  console.log("interior arrival", await feet());
  await shot(path.join(RAW, "game-smithy-interior-after.png"));
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
