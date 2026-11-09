// Day 2 independent treatment paths and material supply.
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

const { resolveStoryInteraction: resolve } = at("src/game/dialogue/storyInteractions.ts");
const { createDay2DevStart } = at("src/game/world/devStart.ts");
const { CHAPTER2_PATIENTS: cases, WOODCUTTER_DAY2_ID: WOOD, BLACKSMITH_DAY2_ID: SMITH } = at("src/game/patients/chapter2Patients.ts");
const { advancePatient, treatPatient, isTreatable } = at("src/game/patients/patientCases.ts");
const { addItem, removeItem, countItem, createEmptyInventory } = at("src/game/inventory/inventory.ts");
const { craft } = at("src/game/crafting/crafting.ts");
const { RECIPES } = at("src/game/crafting/recipes.ts");
const { shouldCloseDay1 } = at("src/game/patients/day1.ts");
let passed=0;
const test=(name,fn)=>{fn();passed++;console.log(`ok - ${name}`);};
const ids={ [WOOD]:"chapter2.forest.woodcutter", [SMITH]:"chapter2.smithy.blacksmith" };
const interact=(id,facts,lang='es')=>resolve(id,facts,lang,'NPC');
function apply(facts,outcome) {
  let inventory=facts.inventory, patients=facts.patients;
  const rewards=new Set(facts.claimedRewards);
  for(const e of outcome.effects){
    if(e.type==='give-item')inventory=addItem(inventory,e.itemId,e.quantity);
    if(e.type==='take-item')inventory=removeItem(inventory,e.itemId,e.quantity);
    assert.ok(inventory,'all effects fit the actual five-slot inventory');
    if(e.type==='claim-reward')rewards.add(e.rewardId);
    if(e.type==='treat'){
      const result=treatPatient(patients,cases[e.patientId],inventory);
      assert.ok(result);inventory=result.inventory;patients=result.state;
    }
  }
  Object.assign(facts,{inventory,patients,claimedRewards:rewards});
}
function make(facts,id){
  const next=craft(facts.inventory,RECIPES.find(r=>r.id===id));
  assert.ok(next,id);facts.inventory=next;
}
const FAT='chapter2.woodcutter.fat', FLOUR='chapter2.bakery.flourOffered', SACK='chapter2.bakery.flourSack';
const stash=(facts,...itemIds)=>{for(const id of itemIds)if(countItem(facts.inventory,id)>0)facts.inventory=removeItem(facts.inventory,id,countItem(facts.inventory,id));};
function complete(facts,id){
  const first=interact(ids[id],facts);
  assert.equal(first.after,'examine-in-place');assert.equal(first.patientId,id);
  assert.deepEqual(first.effects,[]);
  facts.patients=advancePatient(advancePatient(facts.patients,id,'discovered'),id,'examined');
  assert.deepEqual(interact(ids[id],facts).effects,[]);
  if(id===WOOD){
    // orange: left over from Day 1; mint: picked in the forest cottage (world pickup);
    // the herbs wait in the chest (they are not needed for this case)
    stash(facts,'medicinal-herb');
    facts.inventory=addItem(facts.inventory,'mint',1);assert.ok(facts.inventory);
    const water=interact('gather.water',facts);
    assert.equal(water.effects.find(e=>e.type==='give-item').quantity,2);
    apply(facts,water);
    make(facts,'fire.citrus-drink');make(facts,'fire.mint-infusion');
  }else{
    // Day 1 leftovers and the chest: the carried inventory only holds five types
    stash(facts,'empty-flask','orange','water');
    facts.inventory=addItem(facts.inventory,'medicinal-herb',1);assert.ok(facts.inventory); // from the chest / forest
    assert.equal(countItem(facts.inventory,'animal-fat'),1,'fat comes from the woodcutter');
    // the sack does nothing before the baker has spoken
    const closed=interact(SACK,facts);assert.deepEqual(closed.effects,[]);
    apply(facts,interact('chapter2.mill.beekeeper',facts));  // honey, with a wink
    apply(facts,interact('chapter2.bakery.baker',facts));    // permission for the sack
    assert.ok(facts.claimedRewards.has(FLOUR));
    apply(facts,interact(SACK,facts));                       // flour from the sack
    make(facts,'manual.medicinal-paste');make(facts,'manual.poultice');
    apply(facts,interact('chapter2.mill.neighbour',facts));  // resin
    make(facts,'fire.ointment-base');make(facts,'manual.medicinal-compress');
  }
  assert.equal(isTreatable(facts.patients,cases[id],facts.inventory),true);
  const treatment=interact(ids[id],facts);
  const expected=[{type:'treat',patientId:id}];
  if(id===WOOD)expected.push({type:'give-item',itemId:'animal-fat',quantity:1},{type:'claim-reward',rewardId:FAT});
  assert.deepEqual(treatment.effects,expected);
  apply(facts,treatment);
  assert.equal(facts.patients[id],'treated');
  assert.deepEqual(interact(ids[id],facts).effects,[]);
  for(const need of cases[id].requiredTreatments)assert.equal(countItem(facts.inventory,need.itemId),0);
}
test('woodcutter first, then blacksmith: five slots, Day 1 leftovers (2 oranges, 1 cloth), mint pickup, sack flour and thank-you fat',()=>{
  const start=createDay2DevStart();
  assert.equal(countItem(start.inventory,'orange'),2);assert.equal(countItem(start.inventory,'cloth'),1);
  const facts={patients:start.patients,inventory:start.inventory,claimedRewards:start.claimedRewards};
  complete(facts,WOOD);
  assert.equal(countItem(facts.inventory,'animal-fat'),1);
  complete(facts,SMITH);
  assert.equal(countItem(facts.inventory,'animal-fat'),0);
  assert.equal(shouldCloseDay1(facts.patients,facts.claimedRewards),false);
});
test("the blacksmith needs the fat: without the woodcutter's gift the ointment base cannot be made",()=>{
  const inventory=addItem(addItem(createEmptyInventory(),'resin',1),'cloth',1);
  assert.equal(craft(inventory,RECIPES.find(r=>r.id==='fire.ointment-base')),null);
});
test('the thank-you fat is given once and needs room only after the preparations free their slots',()=>{
  const start=createDay2DevStart();
  const facts={patients:{...start.patients,[WOOD]:'examined'},inventory:createEmptyInventory(),claimedRewards:new Set([...start.claimedRewards,FAT])};
  facts.inventory=addItem(addItem(facts.inventory,'citrus-drink',1),'mint-infusion',1);
  const again=interact(ids[WOOD],facts);
  assert.deepEqual(again.effects,[{type:'treat',patientId:WOOD}],'no second gift once claimed');
});
test('suppliers stay ambient before exams and do not consume supplies when inventory is full',()=>{
  const facts={patients:{},inventory:createEmptyInventory(),claimedRewards:new Set()};
  for(const id of ['chapter2.farm.woman','chapter2.mill.neighbour'])assert.equal(interact(id,facts),null);
  facts.patients={[SMITH]:'examined'};
  facts.inventory={capacity:5,slots:Array.from({length:5},(_,i)=>({itemId:`filler${i}`,quantity:1}))};
  const blocked=interact('chapter2.mill.neighbour',facts);
  assert.deepEqual(blocked.effects,[]);assert.ok(blocked.conversation.id.endsWith('noRoom'));
  facts.inventory=createEmptyInventory();
  const gift=interact('chapter2.mill.neighbour',facts);
  assert.deepEqual(gift.effects,[{type:'give-item',itemId:'resin',quantity:1}]);
  apply(facts,gift);assert.equal(interact('chapter2.mill.neighbour',facts),null);
  // orange, mint, cloth, fat and flour are never handed out by these suppliers
  const woodFacts={patients:{[WOOD]:'examined'},inventory:createEmptyInventory(),claimedRewards:new Set()};
  assert.equal(interact('chapter2.farm.woman',woodFacts),null);
});
test('carried intermediates reduce raw supply requests; flour comes from the sack, only after the baker allows it',()=>{
  const facts={patients:{[SMITH]:'examined'},inventory:addItem(createEmptyInventory(),'medicinal-paste',1),claimedRewards:new Set()};
  assert.equal(interact('chapter2.farm.woman',facts),null,'herb is covered by the carried paste');
  const baker=interact('chapter2.bakery.baker',facts);
  assert.deepEqual(baker.effects,[{type:'claim-reward',rewardId:FLOUR}],'the baker only allows the sack; she gives no honey');
  assert.deepEqual(interact('chapter2.mill.beekeeper',facts).effects,[],'the carried paste already covers the honey');
  assert.deepEqual(interact('chapter2.mill.beekeeper',{...facts,inventory:createEmptyInventory()}).effects,[{type:'give-item',itemId:'honey',quantity:1}]);
  const second=interact('chapter2.bakery.baker',{...facts,claimedRewards:new Set([FLOUR])});
  assert.equal(second,null);
  assert.deepEqual(interact(SACK,{...facts,claimedRewards:new Set([FLOUR])}).effects,[{type:'give-item',itemId:'flour',quantity:1}]);
  assert.deepEqual(interact(SACK,facts).effects,[]);
});
test('medical branches have ES/EN parity and real speakers, without requiring the other patient',()=>{
  for(const id of [WOOD,SMITH])for(const status of ['hidden','examined','treated']){
    const facts={patients:status==='hidden'?{}:{[id]:status},inventory:createEmptyInventory(),claimedRewards:new Set()};
    const es=interact(ids[id],facts,'es'),en=interact(ids[id],facts,'en');
    assert.equal(es.conversation.lines.length,en.conversation.lines.length);
    for(const line of [...es.conversation.lines,...en.conversation.lines]){
      assert.ok(line.text.trim().length);assert.ok(['NPC','doctor'].includes(line.speaker));
    }
  }
});
test("the flour sack zone is Kilian's painted export and its exclamation mark shows only while the baker allowed it and flour is missing",()=>{
  const { environmentZonesByScene } = at("src/game/interactions/environmentZones.ts");
  const { FLOUR_SACK_MARK, shouldMarkFlourSack } = at("src/game/dialogue/chapter2Supplies.ts");
  const zones=environmentZonesByScene['bakery-interior'];
  assert.deepEqual(zones.map(z=>[z.x,z.y,z.width,z.height,z.interactionId]),[
    [218,130,29,8,SACK],[215,115,6,13,SACK],
  ]);
  assert.deepEqual({x:FLOUR_SACK_MARK.x,y:FLOUR_SACK_MARK.y,scene:FLOUR_SACK_MARK.sceneId},{x:233,y:94,scene:'bakery-interior'});
  const patients={[SMITH]:'examined'},inventory=createEmptyInventory();
  assert.equal(shouldMarkFlourSack(patients,new Set(),inventory),false,'before the baker allows it');
  assert.equal(shouldMarkFlourSack(patients,new Set([FLOUR]),inventory),true);
  assert.equal(shouldMarkFlourSack(patients,new Set([FLOUR]),addItem(inventory,'flour',1)),false,'flour already carried');
  assert.equal(shouldMarkFlourSack({},new Set([FLOUR]),inventory),false,'no case needs flour');
});
console.log(`\n${passed} tests passed`);

