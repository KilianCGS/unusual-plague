// Medical Book V2: PACIENTES, DOLENCIAS and PREPARADOS share ONE empty base
// (the same in every language); the painted INGREDIENTES spreads take none.
//   node tests/book-base-v2.test.mjs
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
    compilerOptions: { module: "commonjs", target: "es2022", jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const mod = new Module(file);
  mod.paths = Module._nodeModulePaths(root);
  cache.set(file, mod);
  mod.require = (id) => {
    if (id.endsWith(".module.css")) return { default: {} };
    if (id.startsWith(".")) {
      const base = path.resolve(path.dirname(file), id);
      for (const candidate of [base + ".ts", base + ".tsx", path.join(base, "index.ts")]) {
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
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

const { buildBookSections } = at("src/game/book/bookPages.ts");
const inv = at("src/game/inventory/inventory.ts");


const { checkDiagnosis, getDiagnosisOptions, diagnosisConversation, DIAGNOSIS_SYMPTOMS } = at("src/game/patients/diagnosis.ts");
const expected = {"baker-husband":"common-fever","tavern-patient":"stomach-ailment","injured-miner":"infected-wound","chapter2-woodcutter":"exhaustion","chapter2-blacksmith":"infected-wound","chapter2-farmer":"poisoning"};
let passed=0;const test=(name,fn)=>{fn();passed++;console.log("ok - "+name);};
test("ten localized options cover every patient and preserve an investigable poisoning hypothesis",()=>{
 for(const language of ["es","en"]){
  const options=getDiagnosisOptions(language);
  assert.equal(options.length,10);assert.equal(new Set(options.map(o=>o.id)).size,10);
  assert.equal(options.find(o=>o.id==='poisoning').label,language==='es'?'Envenenamiento':'Poisoning');
  for(const [id,correct] of Object.entries(expected)){
   assert.ok(DIAGNOSIS_SYMPTOMS[id][language].length>40);
   for(const choice of options)assert.equal(checkDiagnosis(id,choice.id),choice.id===correct?'correct':'retry');
   assert.equal(checkDiagnosis(id,'invented-illness'),'invalid');
  }
 }
 assert.equal(checkDiagnosis('unknown-patient','common-fever'),'invalid');
});
test("wrong answers repeat observed symptoms as private thoughts without revealing a diagnosis or treatment",()=>{
 for(const language of ['es','en'])for(const [id,correct] of Object.entries(expected)){
  const conversation=diagnosisConversation(id,language,false);
  assert.equal(conversation.lines.length,3);
  assert.ok(conversation.lines.every(line=>line.speaker==='doctor'&&line.text.startsWith('(')&&line.text.endsWith(')')));
  assert.equal(conversation.lines[1].text,'('+DIAGNOSIS_SYMPTOMS[id][language]+')');
  const answer=getDiagnosisOptions(language).find(o=>o.id===correct).label.toLowerCase();
  assert.ok(!conversation.lines.map(line=>line.text).join(' ').toLowerCase().includes(answer));
 }
 const farmer=diagnosisConversation('chapter2-farmer','es',true).lines.map(line=>line.text).join(' ');
 assert.match(farmer,/sospecha/);assert.match(farmer,/muestra/);assert.ok(!farmer.includes('suspensi?n'));
});
test("the Book records symptoms while a diagnosis is pending and withholds diagnosis and treatment",()=>{
 for(const language of ['es','en'])for(const id of Object.keys(expected)){
  const sections=buildBookSections({language,patients:{[id]:'discovered'},inventory:inv.createEmptyInventory(),knownRecipeIds:new Set(),diagnosisPatientId:id});
  const texts=sections[0].spreads[0].texts;
  assert.ok(texts.some(t=>t.id===id+'-symptoms'&&t.content[0]===DIAGNOSIS_SYMPTOMS[id][language]));
  assert.ok(!texts.some(t=>t.id.endsWith('-diagnosis')||t.id.includes('-need-')));
  const ailments=sections[1].spreads;assert.equal(ailments.length,10);
  const poisoning=ailments.find(s=>s.id==='ailment-poisoning');
  assert.ok(poisoning.texts.some(t=>t.id==='poisoning-name'&&t.content[0]===(language==='es'?'Envenenamiento':'Poisoning')));
 }
});
test("GameWorld confirms only after a correct-answer conversation, and Book consultation returns to the pending choice",()=>{
 const src=read('src/game/world/GameWorld.tsx');
 const start=src.indexOf('action === "examination-finished"');
 const flow=src.slice(start,src.indexOf('action === "leave-bedroom"',start));
 assert.ok(flow.includes('beginDiagnosis()'));
 assert.ok(flow.indexOf('action === "diagnosis-confirmed"')<flow.indexOf('finishExamination()'));
 assert.ok(flow.includes('stage === "confirm"')&&flow.includes('stage === "review"'));
 assert.ok(src.includes('diagnosis === null &&'));
 assert.ok(src.includes('current?.stage === "book") updateDiagnosis({ ...current, stage: "choose" })'));
 const correctPath=src.slice(src.indexOf('const chooseDiagnosis'),src.indexOf('const consultDiagnosis'));
 assert.ok(correctPath.includes('current?.stage !== "choose"'));
 assert.ok(!correctPath.includes('setPatients(')&&!correctPath.includes('setKnownRecipeIds(')&&!correctPath.includes('inventoryRef.current ='));
 const farmer=require('node:fs').readFileSync(require('node:path').join(root,'src/game/patients/farmerInvestigation.ts'),'utf8');
 assert.ok(farmer.includes('FARMER_SAMPLE_ID')&&farmer.includes('FARMER_ANALYSIS_ID'));
});
test("the actual diagnosis dialog renders ten labeled choices and a Book action in both languages",()=>{
 const React=require('react');const {renderToStaticMarkup}=require('react-dom/server');
 const {DiagnosisOverlay}=at('src/game/patients/DiagnosisOverlay.tsx');
 for(const language of ['es','en']){
  const html=renderToStaticMarkup(React.createElement(DiagnosisOverlay,{patientId:'chapter2-woodcutter',language,onChoose:()=>{},onConsult:()=>{}}));
  assert.equal((html.match(/<button/g)||[]).length,11);
  assert.ok(html.includes('role="dialog"')&&html.includes('aria-modal="true"'));
  for(const option of getDiagnosisOptions(language))assert.ok(html.includes(option.label));
  assert.ok(html.includes(language==='es'?'Consultar el Compendio':'Consult the Compendium'));
 }
});
console.log('\n'+passed+' tests passed');
