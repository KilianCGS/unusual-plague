// Ambient NPC and environmental interaction coverage.
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

const { chapter2AmbientDialogues } = at("src/game/dialogue/chapter2AmbientDialogues.ts");
const { environmentDialogues } = at("src/game/dialogue/environmentDialogues.ts");
const { ENVIRONMENT_INTERACTIONS } = at("src/game/interactions/environmentCatalog.ts");
const { environmentZonesByScene } = at("src/game/interactions/environmentZones.ts");
const { getSceneInteractionZones } = at("src/game/interactions/sceneInteractions.ts");
const { resolveInteractionConversation } = at("src/game/dialogue/interactionDialogues.ts");
const { chapter2Compositions } = at("src/game/compositions/chapter-2.ts");
const { getChapterInteractions } = at("src/game/compositions/index.ts");
const { resolveDecorInstances } = at("src/game/decor/decorRuntime.ts");
const { WORLD_SCENES } = at("src/game/world/worldScenes.ts");
const { getSceneWorld } = at("src/app/dev/scene/scenes.ts");
const { collidesWithScene, getHitboxRect, rectsIntersect } = at("src/game/collision.ts");
const { findAvailableInteraction } = at("src/game/interactions/interactionZone.ts");
const { resolveStoryInteraction } = at("src/game/dialogue/storyInteractions.ts");
const { DAY2_LEECH_REWARD_ID } = at("src/game/dialogue/chapter2StoryInteractions.ts");
const { FARMER_DAY2_ID } = at("src/game/patients/chapter2Patients.ts");
const { createEmptyInventory, addItem } = at("src/game/inventory/inventory.ts");
let passed=0;
const test=(name,fn)=>{fn(); passed++; console.log(`ok - ${name}`);};

test("all 15 ambient NPC dialogues are bound to actual Day 2 placements with ES/EN parity",()=>{
  const wired = Object.values(getChapterInteractions("chapter-2")).map(x=>x.interactionId);
  assert.equal(Object.keys(chapter2AmbientDialogues).length,15);
  for (const [id,source] of Object.entries(chapter2AmbientDialogues)) {
    assert.ok(wired.includes(id),id);
    for (const language of ["es","en"]) {
      const result=resolveInteractionConversation(id,language,"NPC");
      assert.equal(result.lines.length,source.lines.length);
      assert.ok(result.lines.length>=5,id);
      for (const line of result.lines) {
        assert.ok(["doctor","NPC"].includes(line.speaker));
        assert.ok(line.text.trim().length>0);
      }
    }
  }
});

test("environment catalog resolves only Doctor observations; no object speaks or grants items",()=>{
  for (const entry of ENVIRONMENT_INTERACTIONS) {
    assert.ok(WORLD_SCENES[entry.sceneId],entry.sceneId);
    assert.ok(environmentDialogues[entry.interactionId]);
    for (const language of ["es","en"]) {
      const result=resolveInteractionConversation(entry.interactionId,language,"");
      assert.ok(result.lines.length>=2);
      assert.ok(result.lines.every(line=>line.speaker==="doctor" && line.text.length>0));
    }
  }
});

test("manual environment exports merge with existing scene interactions without replacing them",()=>{
  const base=getSceneInteractionZones("outskirts");
  const zone={id:"test-zone",interactionId:"world.plaza.well",x:0,y:0,width:1,height:1};
  environmentZonesByScene.outskirts=[zone];
  try {
    assert.deepEqual(getSceneInteractionZones("outskirts"),[...base,zone]);
    assert.deepEqual(getSceneInteractionZones("plaza"), environmentZonesByScene.plaza);
  } finally { delete environmentZonesByScene.outskirts; }
});

test("the three approved plaza zones keep their exact coordinates and resolve to readable observations",()=>{
  const zones=getSceneInteractionZones("plaza");
  assert.deepEqual(zones.map(z=>[z.x,z.y,z.width,z.height,z.interactionId]),[
    [967,254,103,21,"world.plaza.noticeboard"],
    [399,403,97,21,"world.plaza.well"],
    [718,607,109,25,"world.plaza.statue"],
  ]);
  for (const zone of zones) {
    // Stand directly in the supplied green rectangle: feet are on free floor.
    const box=getHitboxRect(zone.x+zone.width/2,zone.y+zone.height+7,{offsetX:-6,offsetY:-19,width:12,height:12});
    assert.equal(collidesWithScene(box,WORLD_SCENES.plaza.colliders),false,zone.id);
    assert.equal(findAvailableInteraction(zones,box,"north")?.id,zone.id);
    for (const language of ["es","en"]) assert.ok(resolveInteractionConversation(zone.interactionId,language,"")?.lines.length);
  }
});

test("every connected Day 2 NPC has reachable interaction floor with actual scene and decor colliders",()=>{
  const interactions=getChapterInteractions("chapter-2");
  const feet={offsetX:-6,offsetY:-19,width:12,height:12};
  for (const composition of chapter2Compositions) {
    const targets=composition.instances.filter(i=>interactions[i.instanceId]);
    if (!targets.length) continue;
    const scene=WORLD_SCENES[composition.sceneId];
    const size=getSceneWorld(scene.visual);
    const decor=resolveDecorInstances(composition.instances,interactions);
    const colliders=[...scene.colliders,...decor.colliders];
    const reached=new Set(); const visited=new Set();
    // Four-unit flood from real arrivals; blocked exits are not walked through.
    for (const spawn of Object.values(scene.arrivals)) {
      const queue=[[spawn.x,spawn.y]];
      for(let i=0;i<queue.length;i++) {
        const [x,y]=queue[i]; const key=`${x},${y}`;
        if(visited.has(key)||x<6||y<19||x>size.width-6||y>size.height)continue;
        visited.add(key);
        const box=getHitboxRect(x,y,feet);
        if(collidesWithScene(box,colliders)||scene.exits.some(e=>rectsIntersect(box,e.zone)))continue;
        const available=findAvailableInteraction(decor.zones,box,"south");
        if(available) reached.add(available.interactionId);
        if(targets.every(t=>reached.has(interactions[t.instanceId].interactionId)))break;
        for(const [dx,dy] of [[4,0],[-4,0],[0,4],[0,-4]])queue.push([x+dx,y+dy]);
      }
    }
    for (const target of targets)assert.ok(reached.has(interactions[target.instanceId].interactionId),`${composition.sceneId}: ${target.instanceId}`);
  }
});

test("Witch gives the leech before or after examination, once, with no loss when inventory is full",()=>{
  for (const examined of [false,true]) {
    const facts={patients:examined?{[FARMER_DAY2_ID]:"examined"}:{},inventory:createEmptyInventory(),claimedRewards:new Set()};
    for (const language of ["es","en"]) {
      const first=resolveStoryInteraction("chapter2.cave.witch",facts,language,"WITCH");
      assert.deepEqual(first.effects,[{type:"give-item",itemId:"leech",quantity:1},{type:"claim-reward",rewardId:DAY2_LEECH_REWARD_ID}]);
      assert.ok(first.conversation.lines.every(l=>l.speaker==="WITCH"||l.speaker==="doctor"));
      const full={...facts,inventory:{capacity:1,slots:[{itemId:"cloth",quantity:1}]}};
      const blocked=resolveStoryInteraction("chapter2.cave.witch",full,language,"WITCH");
      assert.deepEqual(blocked.effects,[]);
      assert.ok(blocked.conversation.id.endsWith("noRoom"));
      const received=resolveStoryInteraction("chapter2.cave.witch",{...facts,claimedRewards:new Set([DAY2_LEECH_REWARD_ID])},language,"WITCH");
      assert.deepEqual(received.effects,[]);
      const carrying=resolveStoryInteraction("chapter2.cave.witch",{...facts,inventory:addItem(facts.inventory,"leech",1)},language,"WITCH");
      assert.deepEqual(carrying.effects,[]);
    }
  }
});

test("farm woman reacts to the actual examination without advancing cases or consuming items",()=>{
  const facts={patients:{[FARMER_DAY2_ID]:"examined"},inventory:createEmptyInventory(),claimedRewards:new Set()};
  const result=resolveStoryInteraction("chapter2.farm.woman",facts,"es","FARM_WOMAN");
  assert.equal(result.conversation.id,"chapter2.farm.woman.afterExam");
  assert.deepEqual(result.effects,[]);
  assert.equal(resolveStoryInteraction("chapter2.farm.woman",{...facts,patients:{}},"es","FARM_WOMAN"),null);
});

console.log(`\n${passed} tests passed`);

