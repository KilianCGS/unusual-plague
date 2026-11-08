// Persistent environmental placements across all chapters.
import assert from "node:assert/strict";
import fs from "node:fs";
import Module, { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");

const cache = new Map();
function load(file) {
  if (cache.has(file)) return cache.get(file).exports;
  const src = fs.readFileSync(file, "utf8");
  const js = ts.transpileModule(src, {
    compilerOptions: { module: "commonjs", target: "es2022" },
  }).outputText;
  const mod = new Module(file);
  mod.paths = Module._nodeModulePaths(root);
  cache.set(file, mod);
  mod.require = (id) => {
    if (id.startsWith(".")) {
      const base = path.resolve(path.dirname(file), id);
      for (const candidate of [base + ".ts", path.join(base, "index.ts")]) {
        if (fs.existsSync(candidate)) return load(candidate);
      }
      throw new Error(`Cannot resolve ${id} from ${file}`);
    }
    if (id.includes("useProtagonistController"))
      return { PROTAGONIST_FEET_HITBOX: {} };
    return require(id);
  };
  mod._compile(js, file);
  return mod.exports;
}
const at = (rel) => load(path.join(root, rel));

const { sharedEnvironmentCompositions: shared, mergeSharedEnvironmentInstances: merge } = at("src/game/compositions/shared-environment.ts");
const { getComposition } = at("src/game/compositions/index.ts");
const { getDecorAsset } = at("src/game/decor/decorAssets.ts");
const { resolveDecorInstances } = at("src/game/decor/decorRuntime.ts");
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const { getSceneWorld, DEV_SCENES } = at("src/app/dev/scene/scenes.ts");
let passed=0;const test=(name,fn)=>{fn();passed++;console.log(`ok - ${name}`);};
test('96 approved placements remain identical in every current and future chapter',()=>{
  assert.equal(shared.reduce((n,c)=>n+c.instances.length,0),96);
  for(const c of shared)for(const chapterId of ['chapter-1','chapter-2','chapter-3','artifacts','final','future-day']){
    const result=getComposition(c.sceneId,chapterId);
    assert.equal(result.chapterId,chapterId);
    const ids=new Set(c.instances.map(i=>i.instanceId));
    assert.deepEqual(result.instances.filter(i=>ids.has(i.instanceId)),c.instances);
    assert.equal(new Set(result.instances.map(i=>i.instanceId)).size,result.instances.length);
    if(chapterId==='future-day')assert.deepEqual(result.instances,c.instances,'unwritten chapters inherit only the shared environment');
  }
});
test('only animated nonblocking noncollectible vegetation and fire belong to the shared layer',()=>{
  const counts={};
  for(const c of shared){
    assert.ok(WORLD_SCENES[c.sceneId] || c.sceneId === 'apothecary-main-zone');
    for(const i of c.instances){
      const asset=getDecorAsset(i.assetId);assert.ok(asset);
      assert.equal(asset.collectibleItemId,undefined);assert.equal(i.colliderEnabled,false);assert.equal(i.interaction,undefined);
      assert.ok(asset.sprite.loop && asset.sprite.frames.length>1 && asset.sprite.fps>0);
      counts[i.assetId]=(counts[i.assetId]??0)+1;
    }
    const resolved=resolveDecorInstances(c.instances);
    assert.equal(resolved.colliders.length,0);assert.equal(resolved.zones.length,0);
  }
  assert.deepEqual(counts,{'fern-weed':22,'grass-tuft':22,'bush-tall':7,'bush-round':4,'campfire':2,'candle-flame':39});
  for(const chapter of ['chapter-1','chapter-2','future-day']) {
    assert.deepEqual(getComposition('apothecary-interior',chapter).instances,
      getComposition('apothecary-main-zone',chapter).instances);
  }
});
test('duplicate chapter copies are removed by stable id without mutating chapter data or changing resources',()=>{
  const c=shared[0];const copied={...c.instances[0],x:-1};
  const resource={instanceId:'test-herb',assetId:'medicinal-herb-dev',x:10,y:10,scale:1,flipX:false,colliderEnabled:false,zOffset:0};
  const input=[copied,resource];const before=JSON.stringify(input);
  const result=merge(c.sceneId,input);
  assert.equal(result.filter(i=>i.instanceId===copied.instanceId).length,1);
  assert.deepEqual(result.find(i=>i.instanceId===copied.instanceId),c.instances[0]);
  assert.equal(result.find(i=>i.instanceId===resource.instanceId),resource);
  assert.equal(JSON.stringify(input),before);
  assert.equal(getComposition('granary-interior','future-day'),undefined);
});
const outside=[];
for(const c of shared){
  const size=getSceneWorld(WORLD_SCENES[c.sceneId]?.visual ?? DEV_SCENES.find(s=>s.id===c.sceneId));
  for(const i of c.instances)if(i.x<0||i.y<0||i.x>size.width||i.y>size.height)outside.push({id:i.instanceId,x:i.x,y:i.y,world:size});
}
console.log('Authored anchors outside world:',JSON.stringify(outside));
console.log(`\n${passed} tests passed`);

