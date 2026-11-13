// Title Screen composition: the picture is the protagonist. Title and subtitle in
// the sky, the start button over the hills, "about" in the lower-left corner and
// the languages in the upper-right corner, all in relative units.
//   node tests/title-screen-layout.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) =>
  fs.readFileSync(path.join(root, rel), "utf8").replace(/\r\n/g, "\n");

const css = read("src/app/globals.css");
const page = read("src/app/page.tsx");
const copy = read("src/game/i18n/titleScreen.ts");

let passed = 0;
const test = (name, fn) => {
  fn();
  passed++;
  console.log("ok -", name);
};

// The declarations of every top-level rule that ends with this selector.
const rule = (selector) => {
  const bodies = [];
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");

  for (const match of stripped.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const selectors = match[1].split(",").map((part) => part.trim());

    if (selectors.includes(selector)) {
      bodies.push(match[2]);
    }
  }

  assert.ok(bodies.length > 0, `rule ${selector}`);

  return bodies.join(String.fromCharCode(10));
};

test("the background is the untouched picture: nothing over it, not darkened, not blurred", () => {
  const main = rule("main.title-screen");
  assert.ok(main.includes('url("/game/narrative/title-background.png")'));
  assert.ok(
    !/linear-gradient|rgba\(0, 0, 0/.test(main),
    "no veil over the art",
  );
  // the animated version of the same picture sits on top of the still one
  assert.ok(main.includes('url("/game/narrative/title-animated.webp")'));
  assert.ok(
    fs.existsSync(path.join(root, "public/game/narrative/title-animated.webp")),
  );
  assert.ok(main.includes("background-size: cover"));
  assert.ok(!/filter|backdrop-filter/.test(main));
  assert.ok(
    !/title-background/.test(page.replace(/\/\/.*$/gm, "")),
    "the page does not touch it",
  );
  // the art itself is the same file
  assert.ok(
    fs.existsSync(
      path.join(root, "public/game/narrative/title-background.png"),
    ),
  );
});

test("title and subtitle are ONE block in the upper centre of the sky, with no panel behind", () => {
  assert.ok(
    /<div className="title-block">[\s\S]*?<h1 className="title"[^>]*>[\s\S]*?<p className="subtitle">[\s\S]*?<\/p>[\s\S]*?<div className="title-start">[\s\S]*?<\/div>\s*<\/div>/.test(
      page,
    ),
  );
  const block = rule(".title-block");
  assert.ok(/position:\s*absolute/.test(block));
  assert.ok(/top:\s*3%/.test(block));
  assert.ok(/left:\s*50%/.test(block), "centred on the viewport");
  assert.ok(!/background/.test(block), "no panel");
  // the title is the main type, the subtitle clearly smaller; contrast comes
  // from shadows only
  const title = rule(".title");
  const subtitle = rule(".subtitle");
  assert.ok(/clamp\(2\.6rem, 6\.2vw, 6\.4rem\)/.test(title));
  assert.ok(/clamp\(1\.3rem, 2\.2vw, 2\.2rem\)/.test(subtitle));
  assert.ok(/drop-shadow/.test(title) && /text-shadow/.test(subtitle));
  // the title has no panel: its "background" is only the wood grain clipped to the letters
  assert.ok(/background-clip:\s*text/.test(title) && !/background/.test(subtitle));
  // the P is a post with the plague mask, and the title sits between two vines of ivy
  assert.ok(page.includes("/game/ui/title/p-post.png"));
  assert.ok(page.includes("/game/ui/title/ivy.png"));
});

test("start sits right under the subtitle; about is secondary in the lower-left; languages in the upper-right", () => {
  const start = rule(".title-start");
  // the button is INSIDE the title block, under the subtitle (it cannot overlap it)
  assert.ok(/margin-top:\s*clamp\(/.test(start));
  assert.ok(!/position:\s*absolute/.test(start), "it follows the subtitle in the flow");
  assert.ok(
    /repeating-linear-gradient/.test(rule(".begin-button")),
    "a wooden plank in a darker wooden frame",
  );
  assert.ok(
    page.includes("begin-button secondary-title-button"),
    "about shares the same button",
  );
  const about = rule(".secondary-title-button");
  assert.ok(/position:\s*absolute/.test(about));
  assert.ok(/left:\s*clamp\(/.test(about));
  assert.ok(/bottom:\s*clamp\(/.test(about));
  assert.ok(
    !/font-size:/.test(about) && !/padding:/.test(about),
    "the same size as the start button (it shares .begin-button's font size and padding)",
  );
  const languages = rule(".language-selector");
  assert.ok(/position:\s*absolute/.test(languages));
  assert.ok(/top:\s*clamp\(/.test(languages));
  assert.ok(/right:\s*clamp\(/.test(languages));
  // the container takes no clicks, only its controls do
  assert.ok(/pointer-events:\s*none/.test(rule(".title-container")));
});

test("positions are relative (percentages, clamp, vw), never raw pixel coordinates; narrow windows are handled", () => {
  for (const selector of [
    ".title-block",
    ".title-start",
    ".language-selector",
    ".secondary-title-button",
  ]) {
    const declarations = rule(selector);
    for (const [, property, value] of declarations.matchAll(
      /(?:^|[\s;])(top|left|right|bottom|width):\s*([^;]+);/g,
    )) {
      assert.ok(
        /%|clamp|vw|vh|min\(|max\(|auto/.test(value) || value.trim() === "0",
        `${selector} ${property}: ${value}`,
      );
    }
  }
  assert.ok(
    /@media \(max-width: 900px\), \(max-aspect-ratio: 1\/1\)/.test(css),
  );
  assert.ok(
    /top:\s*max\(5%, 64px\)/.test(css),
    "the title clears the languages",
  );
});

test("the behaviour and the texts are the existing ones: same buttons, handlers and i18n", () => {
  assert.ok(page.includes("onClick={handleBegin}"));
  assert.ok(page.includes("setIsAboutPanelOpen(true)"));
  assert.ok(
    page.includes('setLanguage("es")') && page.includes('setLanguage("en")'),
  );
  assert.ok(
    page.includes("aria-label={copy.title}") &&
      page.includes("<GothicText text={copy.subtitle} />"),
  );
  assert.ok(
    page.includes("{copy.beginButton}") && page.includes("{copy.aboutButton}"),
  );
  assert.ok(
    page.includes("is-active"),
    "the selected language is still marked",
  );
  assert.ok(copy.includes('title: "UNUSUAL PLAGUE"'));
  assert.ok(
    copy.includes('beginButton: "Empezar"') &&
      copy.includes('beginButton: "Begin"'),
  );
  assert.ok(
    copy.includes('aboutButton: "Sobre el juego"') &&
      copy.includes('aboutButton: "About the game"'),
  );
  // the game after the title is untouched by this layout
  assert.ok(
    !/title-block|title-start/.test(read("src/game/world/GameWorld.tsx")),
  );
});

console.log(`\n${passed} tests passed`);
