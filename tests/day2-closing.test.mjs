// Day 2 closing and bounded development preview.
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

const { DAY2_PATIENT_IDS: IDS, DAY2_COMPLETED_ID: DONE, shouldCloseDay2 } = at("src/game/patients/day2.ts");
const { CHAPTER2_PATIENTS } = at("src/game/patients/chapter2Patients.ts");
const { createDay2DevStart, createDay2ClosingDevStart } = at("src/game/world/devStart.ts");
const { day2Closing } = at("src/game/dialogue/chapter2ClosingDialogues.ts");
const { localizeConversation } = at("src/game/dialogue/localizedConversation.ts");
const { NARRATIVE_ILLUSTRATIONS } = at("src/game/narrative/illustrations.ts");
const { getNextChapterId, getChapterStart } = at("src/game/world/chapterStart.ts");
let passed=0;const test=(name,fn)=>{fn();passed++;console.log(`ok - ${name}`);};
test('only the three Day 2 cases count, with every incomplete combination rejected',()=>{
  assert.deepEqual(IDS,Object.keys(CHAPTER2_PATIENTS));assert.equal(IDS.length,3);
  for(let mask=0;mask<8;mask++){
    const patients=Object.fromEntries(IDS.filter((_,i)=>mask&(1<<i)).map(id=>[id,'treated']));
    assert.equal(shouldCloseDay2(patients,new Set()),mask===7);
    assert.equal(shouldCloseDay2(patients,new Set([DONE])),false);
  }
});
test('every treatment order triggers only after its last conversation, then never again',()=>{
  for(const a of IDS)for(const b of IDS.filter(id=>id!==a)){
    const c=IDS.find(id=>id!==a&&id!==b);const patients={};const flags=new Set();
    let closes=0;
    for(const id of [a,b,c]){
      patients[id]='treated';
      const check=dialogueActive=>!dialogueActive&&shouldCloseDay2(patients,flags);
      assert.equal(check(true),false);
      if(check(false)){flags.add(DONE);closes++;}
    }
    assert.equal(closes,1);assert.equal(shouldCloseDay2(patients,flags),false);
  }
  const game=fs.readFileSync(path.join(root,'src/game/world/GameWorld.tsx'),'utf8');
  // the closing trigger of Days 1-3 is one effect (the Doctor says he should rest, then it closes at home)
  const start=game.indexOf('shouldCloseDayNow(chapterId, patientsRef.current');
  const trigger=game.slice(start-300,start+500);
  assert.ok(start>0);assert.ok(trigger.includes('phaseRef.current === "playing"'));
  assert.ok(trigger.includes('afterDialogueRef.current === null'));
  assert.ok(game.includes('chapter-2": DAY2_COMPLETED_ID'));
  assert.ok(trigger.indexOf('claimFlag(dayCompletedIds[chapterId])')<trigger.indexOf('setClosingActive(true)'));
});
test('epilogue uses the fireplace image, with ES/EN caption and parenthesized Doctor thoughts',()=>{
  assert.ok(fs.existsSync(path.join(root,'public',NARRATIVE_ILLUSTRATIONS['doctor-fireplace'].src)));
  for(const language of ['es','en']){
    const conversation=localizeConversation(day2Closing,language,'doctor');
    assert.equal(conversation.lines.length,4);
    for(const line of conversation.lines.slice(1))assert.match(line.text,/^\(.+\)$/);
    assert.ok(!conversation.lines.some(l=>/smartphone|artifact|artefacto/i.test(l.text)));
  }
});
test('closing leads to Day 3 in the existing room (2026-11-12: Day 3 exists now) without clearing state',()=>{
  assert.equal(getNextChapterId('chapter-2'),'chapter-3');
  assert.equal(getChapterStart('chapter-2').sceneId,'doctor-room');
  assert.equal(getChapterStart('chapter-3').sceneId,'doctor-room');
  const game=fs.readFileSync(path.join(root,'src/game/world/GameWorld.tsx'),'utf8');
  const start=game.indexOf('const startNextChapter');
  const finish=game.indexOf('const finishClosing',start);
  const next=game.slice(start,finish);
  assert.ok(next.includes('chapterAdvancedRef.current'));
  assert.ok(next.includes('getNextChapterId(chapterId)'));
  assert.ok(next.includes('setChapterId(nextChapterId)'));
  assert.ok(next.includes('setWorld'));
  // only the chapter and the place change: nothing the player owns is touched
  assert.ok(!/setInventory|setStorage|setPatients|setClaimedRewards|setKnownRecipeIds/.test(next));
});
test('preview fixtures are isolated and leave the closing unclaimed, normal Day 2 starts incomplete',()=>{
  const normal=createDay2DevStart(),preview=createDay2ClosingDevStart();
  assert.equal(shouldCloseDay2(normal.patients,normal.claimedRewards),false);
  assert.equal(shouldCloseDay2(preview.patients,preview.claimedRewards),true);
  assert.equal(preview.claimedRewards.has(DONE),false);
  assert.notEqual(preview.patients,normal.patients);
  assert.notEqual(preview.claimedRewards,normal.claimedRewards);
});
console.log(`\n${passed} tests passed`);

