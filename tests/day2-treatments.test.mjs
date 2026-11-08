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
    assert.ok(inventory,'all effects fit the actual six-slot inventory');
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
function complete(facts,id){
  const first=interact(ids[id],facts);
  assert.equal(first.after,'examine-in-place');assert.equal(first.patientId,id);
  assert.deepEqual(first.effects,[]);
  facts.patients=advancePatient(advancePatient(facts.patients,id,'discovered'),id,'examined');
  assert.deepEqual(interact(ids[id],facts).effects,[]);
  apply(facts,interact('chapter2.farm.woman',facts));
  if(id===WOOD){
    const water=interact('gather.water',facts);
    assert.equal(water.effects.find(e=>e.type==='give-item').quantity,2);
    apply(facts,water);
    make(facts,'fire.citrus-drink');make(facts,'fire.mint-infusion');
  }else{
    apply(facts,interact('chapter2.bakery.baker',facts));
    make(facts,'manual.medicinal-paste');make(facts,'manual.poultice');
    apply(facts,interact('chapter2.mill.neighbour',facts));
    make(facts,'fire.ointment-base');make(facts,'manual.medicinal-compress');
  }
  assert.equal(isTreatable(facts.patients,cases[id],facts.inventory),true);
  const treatment=interact(ids[id],facts);
  assert.deepEqual(treatment.effects,[{type:'treat',patientId:id}]);
  apply(facts,treatment);
  assert.equal(facts.patients[id],'treated');
  assert.deepEqual(interact(ids[id],facts).effects,[]);
  for(const need of cases[id].requiredTreatments)assert.equal(countItem(facts.inventory,need.itemId),0);
}
test('both patient orders complete with six slots, Day 1 rewards claimed and leech already carried',()=>{
  for(const order of [[WOOD,SMITH],[SMITH,WOOD]]){
    const start=createDay2DevStart();
    const facts={patients:start.patients,inventory:addItem(start.inventory,'leech',1),claimedRewards:start.claimedRewards};
    for(const id of order) complete(facts,id);
    assert.equal(countItem(facts.inventory,'leech'),1);
    assert.equal(countItem(facts.inventory,'empty-flask'),1);
    assert.equal(shouldCloseDay1(facts.patients,facts.claimedRewards),false);
  }
});
test('suppliers stay ambient before exams and do not consume supplies when inventory is full',()=>{
  const facts={patients:{},inventory:createEmptyInventory(),claimedRewards:new Set()};
  for(const id of ['chapter2.farm.woman','chapter2.bakery.baker','chapter2.mill.neighbour'])assert.equal(interact(id,facts),null);
  facts.patients={[WOOD]:'examined'};
  facts.inventory={capacity:6,slots:Array.from({length:6},(_,i)=>({itemId:`filler${i}`,quantity:1}))};
  const blocked=interact('chapter2.farm.woman',facts);
  assert.deepEqual(blocked.effects,[]);assert.ok(blocked.conversation.id.endsWith('noRoom'));
  facts.inventory=createEmptyInventory();
  const gift=interact('chapter2.farm.woman',facts);
  assert.deepEqual(gift.effects,[{type:'give-item',itemId:'orange',quantity:1},{type:'give-item',itemId:'mint',quantity:1}]);
  apply(facts,gift);assert.equal(interact('chapter2.farm.woman',facts),null);
});
test('carried intermediates reduce raw supply requests',()=>{
  const facts={patients:{[SMITH]:'examined'},inventory:addItem(createEmptyInventory(),'medicinal-paste',1),claimedRewards:new Set()};
  assert.deepEqual(interact('chapter2.farm.woman',facts).effects,[{type:'give-item',itemId:'animal-fat',quantity:1}]);
  assert.deepEqual(interact('chapter2.bakery.baker',facts).effects,[{type:'give-item',itemId:'flour',quantity:1}]);
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
console.log(`\n${passed} tests passed`);

