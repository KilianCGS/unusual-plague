// Speech bubble colours: NPCs a soft yellow parchment (#f2dfa0, body and tail),
// the Doctor keeps his grey (#d0cbbe), dark text and border unchanged.
//   node tests/dialogue-bubble-colors.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const css = fs
  .readFileSync(
    path.join(root, "src/game/dialogue/DialogueBubble.module.css"),
    "utf8",
  )
  .replace(/\r\n/g, "\n")
  .replace(/\/\*[\s\S]*?\*\//g, "");

// The declarations of the rule whose selector is exactly this one.
const rule = (selector) => {
  for (const match of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    if (match[1].trim() === selector) {
      return match[2];
    }
  }

  throw new Error(`rule ${selector}`);
};

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

test("NPC bubble: soft yellow parchment on the body and on the tail", () => {
  assert.ok(/background:\s*#f2dfa0/.test(rule(".paper")));
  assert.ok(/background:\s*#f2dfa0/.test(rule(".tail::after")));
});

test("the Doctor keeps his grey on body and tail", () => {
  assert.ok(/background:\s*#d0cbbe/.test(rule(".doctor .paper")));
  assert.ok(/background:\s*#d0cbbe/.test(rule(".doctor .tail::after")));
});

test("dark text and dark border are unchanged; the old beige is gone from the bubble", () => {
  assert.ok(/color:\s*#1c1009/.test(rule(".paper")));
  assert.ok(/background:\s*#2b1a14/.test(rule(".bubble")));
  assert.ok(/background:\s*#2b1a14/.test(rule(".tail")));
  assert.ok(!css.includes("#e9dbb9"));
});

console.log(`\n${passed} tests passed`);
