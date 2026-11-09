// Farmer sample, analysis, treatment and Book stages.
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
const { FARMER_DAY2_ID: ID } = at("src/game/patients/chapter2Patients.ts");
const { FARMER_SAMPLE_ID: SAMPLE, FARMER_ANALYSIS_ID: ANALYSIS, canAnalyzeFarmerSample, getChapter2PatientDefinitions } = at("src/game/patients/farmerInvestigation.ts");
const { getPatientDefinitions } = at("src/game/patients/patientRegistry.ts");
const { advancePatient, treatPatient, isTreatable } = at("src/game/patients/patientCases.ts");
const { addItem, removeItem, countItem } = at("src/game/inventory/inventory.ts");
const { craft } = at("src/game/crafting/crafting.ts");
const { RECIPES } = at("src/game/crafting/recipes.ts");
const { buildPatientSpreads } = at("src/game/book/dynamicPages.ts");
const { getActiveMissingIngredients } = at("src/game/patients/patientNeeds.ts");
let passed=0;const test=(name,fn)=>{fn();passed++;console.log(`ok - ${name}`);};
function fresh(){const s=createDay2DevStart();return {patients:s.patients,inventory:s.inventory,claimedRewards:s.claimedRewards};}
const interact=(id,f,lang='es')=>resolve(id,f,lang,'SPEAKER');
function apply(f,outcome){
  let inventory=f.inventory,patients=f.patients;const flags=new Set(f.claimedRewards);
  for(const effect of outcome.effects){
    if(effect.type==='give-item')inventory=addItem(inventory,effect.itemId,effect.quantity);
    if(effect.type==='take-item')inventory=removeItem(inventory,effect.itemId,effect.quantity);
    assert.ok(inventory);
    if(effect.type==='claim-reward')flags.add(effect.rewardId);
    if(effect.type==='treat'){
      const result=treatPatient(patients,getPatientDefinitions(flags)[effect.patientId],inventory);
      assert.ok(result);inventory=result.inventory;patients=result.state;
    }
  }
  Object.assign(f,{inventory,patients,claimedRewards:flags});
}
function examine(f){
  const exam=interact('chapter2.granary.farmer',f);assert.equal(exam.after,'examine-in-place');
  f.patients=advancePatient(advancePatient(f.patients,ID,'discovered'),ID,'examined');
}
test('sample requires examination and leech, cannot be repeated, and analysis cannot happen early',()=>{
  const f=fresh();apply(f,interact('chapter2.cave.witch',f));
  assert.equal(countItem(f.inventory,'leech'),1);
  assert.equal(canAnalyzeFarmerSample(f.patients,f.claimedRewards),false);
  const exam=interact('chapter2.granary.farmer',f);assert.deepEqual(exam.effects,[]);
  examine(f);apply(f,interact('chapter2.granary.farmer',f));
  assert.equal(countItem(f.inventory,'leech'),0);assert.ok(f.claimedRewards.has(SAMPLE));
  assert.equal(canAnalyzeFarmerSample(f.patients,f.claimedRewards),true);
  assert.deepEqual(interact('chapter2.granary.farmer',f).effects,[]);
  assert.deepEqual(interact('chapter2.cave.witch',f).effects,[],'Witch cannot duplicate the used leech');
  assert.equal(isTreatable(f.patients,getChapter2PatientDefinitions(f.claimedRewards)[ID],f.inventory),false);
});
test('the complete farmer path is playable with five slots, Day 1 leftovers in the chest and consumed Day 1 rewards',()=>{
  const f=fresh();examine(f);
  // five carried types: orange and cloth wait in the chest; the herb is a Day 1 leftover / forest pickup
  for(const id of ['orange','cloth'])f.inventory=removeItem(f.inventory,id,countItem(f.inventory,id));
  assert.deepEqual(interact('chapter2.granary.farmer',f).effects,[],'without leech wait');
  apply(f,interact('chapter2.cave.witch',f));apply(f,interact('chapter2.granary.farmer',f));
  assert.ok(canAnalyzeFarmerSample(f.patients,f.claimedRewards));
  f.claimedRewards=new Set([...f.claimedRewards,ANALYSIS]);
  assert.equal(canAnalyzeFarmerSample(f.patients,f.claimedRewards),false);
  apply(f,interact('chapter2.mine.recoveringMiner',f));
  assert.equal(interact('chapter2.farm.woman',f)?.effects?.length??0,0,'the farm woman no longer hands out herbs');
  apply(f,interact('gather.water',f));
  for(const id of ['mortar.crushed-coal','manual.charcoal-suspension','fire.medicinal-infusion']){
    const next=craft(f.inventory,RECIPES.find(r=>r.id===id));assert.ok(next,id);f.inventory=next;
  }
  const treatment=interact('chapter2.granary.farmer',f);
  assert.deepEqual(treatment.effects,[{type:'treat',patientId:ID}]);apply(f,treatment);
  assert.equal(f.patients[ID],'treated');assert.equal(countItem(f.inventory,'empty-flask'),1);
  assert.equal(countItem(f.inventory,'charcoal-suspension'),0);
  assert.deepEqual(interact('chapter2.granary.farmer',f).effects,[]);
  assert.equal(interact('chapter2.farm.woman',f).conversation.id,'chapter2.farm.woman.farmerTreated');
});
test('Book follows investigation flags and materials are not requested before analysis',()=>{
  const f=fresh();examine(f);
  for(const lang of ['es','en'])for(const flags of [[],[SAMPLE],[SAMPLE,ANALYSIS]]){
    const state=new Set(flags);
    const pages=buildPatientSpreads({language:lang,patients:{[ID]:'examined'},inventory:f.inventory,knownRecipeIds:new Set(),storyFlags:state});
    const note=pages[0].texts.find(t=>t.id===`${ID}-investigation`);
    if(flags.includes(ANALYSIS)){
      assert.equal(note,undefined);assert.equal(pages[0].texts.filter(t=>t.id.startsWith(`${ID}-need-`)).length,2);
    }else{
      assert.ok(note);assert.ok(!pages[0].texts.some(t=>t.id.startsWith(`${ID}-need-`)));
    }
    const needs=getActiveMissingIngredients({[ID]:'examined'},getChapter2PatientDefinitions(state),f.inventory);
    assert.equal(needs.length>0,flags.includes(ANALYSIS));
  }
});
test('analysis action is restricted to the manual table, guarded, and closes crafting before dialogue',()=>{
  const game=fs.readFileSync(path.join(root,'src/game/world/GameWorld.tsx'),'utf8');
  const handler=game.slice(game.indexOf('onAnalyzeSample='),game.indexOf('onAnalyzeSample=')+1050);
  assert.ok(handler.includes('craftingStation === "manual"'));
  assert.ok(handler.includes('canAnalyzeFarmerSample(patientsRef.current, claimedRewardsRef.current)'));
  assert.ok(handler.indexOf('setCraftingStation(null)')<handler.indexOf('startDialogue('));
  for(const lang of ['es','en']){
    const result=at('src/game/dialogue/chapter2AnalysisDialogues.ts').farmerAnalysisResult;
    assert.ok(result.lines.every(l=>l.speaker==='doctor' && l.text[lang].length>0));
  }
});
test('examination thoughts adapt to carried leech, and the cave clue stops after obtaining the sample',()=>{
  for(const lang of ['es','en']){
    const f=fresh();
    const before=interact('chapter2.granary.farmer',f,lang).conversation.lines.at(-1);
    assert.equal(before.speaker,'doctor');assert.match(before.text,/^\(.+\)$/);
    f.inventory=addItem(f.inventory,'leech',1);
    const carrying=interact('chapter2.granary.farmer',f,lang).conversation.lines.at(-1);
    assert.match(carrying.text,/^\(.+\)$/);assert.notEqual(carrying.text,before.text);
    f.inventory=removeItem(f.inventory,'leech',1);examine(f);
    const clue=interact('chapter2.mine.recoveringMiner',f,lang);
    assert.equal(clue.conversation.id,'chapter2.mine.farmerClue');
    assert.match(clue.conversation.lines.at(-1).text,/^\(.+\)$/);
    f.claimedRewards=new Set([...f.claimedRewards,SAMPLE]);
    assert.equal(interact('chapter2.mine.recoveringMiner',f,lang),null);
  }
});
test('Witch gives the blood clue and only thinks about the farmer if the Doctor has examined him',()=>{
  const f=fresh();
  const early=interact('chapter2.cave.witch',f).conversation.lines;
  assert.ok(early.some(l=>l.text.includes('se pirran por la sangre ajena')));
  assert.match(early.at(-1).text,/^\(.+\)$/);
  assert.ok(!early.at(-1).text.includes('granero'));
  examine(f);
  const informed=interact('chapter2.cave.witch',f).conversation.lines.at(-1).text;
  assert.ok(informed.includes('granero'));assert.match(informed,/^\(.+\)$/);
});

console.log(`\n${passed} tests passed`);

