# Unusual Plague: AI Project Context

This is a living project context document. Update it when architecture or explicitly
approved design decisions materially change. `AGENTS.md` defines agent rules.
Implementation observations below describe the current repository, including
user-owned work in progress; they are not additional narrative canon.

## Project overview

Unusual Plague is a browser game with a controllable Doctor, connected scenes,
NPC dialogue, patient treatment, inventory, crafting, and a Medical Compendium
(Book). The entry page is `src/app/page.tsx`; gameplay orchestration lives in
`src/game/world/GameWorld.tsx`. This description reflects implemented systems,
not an inferred setting, plot, or complete product specification.

## Current stack

`package.json` declares Next.js 16.3.5, React/React DOM 19.2.8, TypeScript 5,
ESLint 9, and eslint-config-next 16.3.5. The app uses the Next.js App Router
(`src/app`), React components/hooks, CSS modules, and global CSS. Static game
assets live under `public/game`. Consult installed Next.js documentation as
required by `AGENTS.md` before writing code.

## High-level architecture

`src/game` separates world/scenes, protagonist control, collision, interactions,
decor, dialogue, inventory, storage, crafting, Book, patients, and localization.
`GameWorld.tsx` coordinates scene/transition state, overlays, dialogue, carried
inventory, storage, patient states, learned recipes, and collected instances.
Domain operations such as inventory transfers, crafting, and treatment are pure
functions alongside their React interfaces. Development routes under `src/app/dev`
include Decorator, collisions, scene, dialogue, Book, crafting, and item tools.

## World V2

World V2 is the official/default implementation; there is no legacy/V2 switch.
`src/game/new-world-map/worldVariant.ts` lists the V2 exterior scene IDs.
`newWorldScenes.ts` supplies scene definitions; `world/worldScenes.ts` incorporates
these into the runtime scene registry. V2 geometry lives under
`src/game/new-world-map/geometry`.

`src/game/compositions/index.ts` excludes legacy exterior populations from
`chapter-1.ts` and uses `newWorldChapter1Compositions` instead. Interiors retain
their shared composition sources. Legacy exterior files remain in the repository;
their presence does not make them the default or authorize expanding them.
Manual geometry and colliders remain authoritative; preserve authored values.

## Decorator/compositions

`/dev/decorator` is the preferred visual authoring tool. Its
`src/app/dev/decorator/composition.ts` supports localStorage drafts and composition/
chapter exports. Runtime reads version-controlled compositions through
`src/game/compositions/index.ts`, never those drafts. Exterior exports are in
`src/game/new-world-map/newWorldCompositions.ts`; shared/interior Chapter 1
exports are in `src/game/compositions/chapter-1.ts`.

`src/game/decor/decorTypes.ts` defines reusable assets, placed instances, and
scene/chapter compositions. Instance IDs are stable placement identities, distinct
from asset, character, and interaction IDs. Chapter interaction tables live apart
from placement exports; per-instance interactions take precedence when present
(`decorRuntime.ts`). Prepare/register assets as appropriate, then have the user
place or approve them unless explicitly directed otherwise. Never guess coordinates.
Use `flipX`, not a second `mirror` property.

## Dialogue

`src/game/dialogue` contains data, localized conversations, playback hooks, and
bubble rendering. `dialogueTypes.ts` separates speaker/text from optional actions;
actions are reserved data, not prose stage directions to put in spoken text.
`localizedConversation.ts` requires text for each supported language and binds
`subject` to the instance initiating the conversation. Chapter-specific dialogue,
story interaction resolution, and NPC trades are separate modules. Check existing
NPCs for reuse through pose, location, state, or dialogue before adding identities.
Narrative order alone must not become mandatory quest gating (see `AGENTS.md`).

## Inventory/storage

`src/game/inventory/inventory.ts` implements a six-slot carried inventory, one
item type per occupied slot, quantities without a stack limit, and pure operations.
`src/game/items/items.ts` is the item catalog; `inventory/initialInventory.ts`
provides starting inventory/storage data.

`src/game/storage/storage.ts` uses the same model with 24 slots and atomic
whole-stack transfers. The storage access interaction is the chest in the
Doctor's Room. Crafting uses carried items, not chest contents; items must first
be transferred. These are current implementation facts, not immutable design canon.

## Crafting

`src/game/crafting/recipes.ts` defines recipes and manual/fire stations;
`crafting.ts` implements selection, order-independent matching by ingredients
and quantities, and atomic consumption/output. Failed combinations do not consume
items. Known recipe IDs feed Book visibility; the crafting logic does not require
a recipe to have been learned. `CraftingOverlay.tsx` supplies the interface.

## Book

`src/game/book/BookOverlay.tsx` renders the Medical Compendium.
`bookPages.ts` defines patients, ailments, ingredients, and preparations sections.
`dynamicPages.ts` derives patient/preparation pages from patient state, inventory,
and known recipes. Ailment definitions are separate from individual patient cases.
The current Book uses image layers and optional text in a 688x384 art coordinate
space. Painted ingredient spreads are their own visual source; do not duplicate
text already baked into those images with another text layer.

## Patients

`src/game/patients/patientCases.ts` defines hidden -> discovered -> examined ->
treated progression; missing state entries mean hidden. Treatment readiness is
derived from status and carried items. Treatment consumes required items atomically.
Case IDs, ailment IDs, characters, placed instances, and interaction IDs are distinct.
`chapter1Patients.ts` defines current cases; `patientNeeds.ts` derives needs.
Do not turn this per-case lifecycle into unnecessary ordering between cases.

## Scene transitions

`src/game/world/worldScenes.ts` describes scenes, named spawns, and exits with
target scene/spawn pairs. `GameWorld.tsx` coordinates playing/fade transitions
and prevents a second transition while one is active. `useTransitionTrigger.ts`
uses feet-hitbox/exit-zone intersection and disarms on arrival until outside all
exit zones to avoid immediate bounce-back. `world/fastTravel.ts` defines fast
travel rules; GameWorld routes travel through the shared transition mechanism.
Preserve manually authored scene geometry, transition zones, and spawn positions.

## Localization

`src/game/i18n/types.ts` defines `Language` as `es` or `en`; feature-specific
copy lives under `src/game/i18n`, with bilingual conversation data also in
`src/game/dialogue`. Spanish is the canonical narrative voice by approved project
policy. English is a natural adaptation. Maintain ES/EN parity for content intended
for both languages; do not silently omit translations for new player-facing prose.

## Asset conventions

Game assets are served from `public/game`; `src/game/decor/decorAssets.ts`
registers decor definitions. The shared decor model uses one PNG per frame,
consistent frame dimensions per animation, normalized anchors, world logical
positions, instance scale, and anchor-relative colliders. `flipX` is the horizontal
mirror property. Respect existing asset-specific anchors, scale, and depth behavior.
Preserve the established visual direction, approved assets, character identities,
and transparency. Do not bake background/environment elements into transparent
character/interactive assets unless a required pose prop calls for it. Approved
assets must not be regenerated without an explicit request; manual placement
belongs in the Decorator workflow.

## Testing/validation

`package.json` exposes `npm run dev`, `npm run build`, `npm run start`, and
`npm run lint`. There is currently no package test script or declared Prettier
dependency/configuration. Tests in `tests/*.test.mjs` are executable Node scripts;
for example, run `node tests/storage.test.mjs`. Inspect the relevant test's setup
and run the scripts covering the change. Several scripts transpile TypeScript
source with the installed TypeScript package and assert domain or source behavior.

The implementation baseline is relevant project tests, TypeScript validation
(`npx tsc --noEmit`, with incremental output disabled when a read-only check is
needed), ESLint (`npm run lint`), and formatting/Prettier where applicable. Use
existing tooling; absence of Prettier does not itself authorize adding it. Build
validation (`npm run build`) is available when relevant. Automated tests and source
inspection do not establish browser behavior or visual approval. Report these
separately from manual browser checks, including any skipped or blocked validation.

## Current chapter/day architecture

`src/game/world/currentChapter.ts` sets `INITIAL_CHAPTER_ID` to `chapter-1`.
`chapterStart.ts` currently defines only that chapter's start: Doctor's Room,
`chapter-start` spawn, with the doctor-writing opening interlude. GameWorld keeps
the chapter ID fixed at its initial value; this is not a general day progression
system. Compositions are keyed by scene and chapter.

The current working tree includes `src/game/patients/day1.ts` and Day 1 closing
integration in GameWorld. Completion is derived from Chapter 1 patient statuses
and claimed flags: all cases treated marks work done; after the announcement,
arrival at the apothecary interior closes the day. Cases have no required ordering
in that rule. Decorator chapter options or assets named for Day 2 do not establish
implemented Day 2 progression or approved future story content.

## Narrative / Design Context

The following is explicitly user-approved canonical project/design context.
It is a working reference, not a full game design document. Approved future
direction is not evidence of implemented behavior or authorization to implement it.

### Game identity and tone

Unusual Plague is a short 2D pixel-art narrative adventure / medical mystery,
intended as a portfolio project with approximately 60–90 minutes total playtime.
Core play is walking/exploration, observation, conversation, patient examination,
collecting/using items, simple crafting/treatment, and small environmental or
investigative puzzles. It must not grow into an open-world RPG, combat game,
grinding game, or large quest-log-driven RPG.

The approximate tonal target is 70% mystery/atmosphere, 20% absurd or dry humor,
and 10% emotional weight. Humor supports character and pacing without undermining
serious moments.

### Doctor

The protagonist is an anonymous male plague doctor, approximately 30, wearing
the mask with long hair partially visible. He is experienced, intelligent,
observant, rational, clinical, pragmatic, relatively calm under pressure, and
kind without being sentimental. Do not make him an incompetent comedy protagonist,
an emotionless machine, or an exaggerated heroic savior.

### Narrative structure and dialogue

The game is broadly chapter/day based, with flexible exploration. Suggested
narrative order is not systemic locking: players should often discover locations,
meet characters, collect resources before knowing their use, and encounter
information in different orders. Story state primarily changes meaning, knowledge,
dialogue, context, consequences, and treatment possibilities rather than making
objects or characters appear artificially when a quest flag activates.

> The state of the story should change the meaning of things, not necessarily their existence.

Dialogue is a major component and may comprise roughly half the experience.
Important dialogue should ideally do at least two things: advance information/story,
characterize someone, establish atmosphere/world, or entertain. Avoid dialogue
whose sole purpose is mechanically delivering a quest. Spanish is the canonical
voice; English naturally preserves intent, personality, rhythm, and humor rather
than translating literally.

### NPC reuse

Reuse is a major production AND narrative principle. Before creating a person,
prefer an existing townsperson in another location, pose, activity, medical state,
or conversation. Familiar people across days make the village persistent and
later population changes more meaningful. A new pose does NOT imply a new identity.

### Witch and cat

Witch is a recurring female character and an existing acquaintance/friend of the
Doctor. Their intentional contrast is rational/clinical/pragmatic Doctor versus
intuitive/mysterious Witch, who is comfortable with uncertainty. Their relationship
has mutual respect and playful friction; do not force romance.

Her visual canon is a tall/slender silhouette, deep hood, eyes NEVER visible
(no glowing eyes), optionally visible reddish/copper hair, aubergine/night-blue/
gray-violet practical medieval clothing, and muted copper/gold accents. Avoid a
pointed hat, broom, excessive skulls, magical aura, or excessive potion clutter.
Her black cat is a separate character/asset: a normal cute black cat that seems
suspiciously intelligent and does not talk.

### Main thematic direction and later days

Later material involves mysterious modern-like artifacts resembling phones.
Themes include easy dopamine, attention, compulsive behavior, social erosion,
and increasingly absorbed/disconnected people. The message is not simply
"phones are evil"; avoid simplistic moralizing.

A later-day concept has townspeople increasingly absorbed by these artifacts.
Reusing familiar NPCs earlier makes that transformation more noticeable. This
approved direction does not authorize implementing later-day behavior.

### Day 1 — current canonical structure

Three patient cases may be completed in flexible order: the Baker's husband,
the sick man associated with the Tavern, and the injured miner. Once all three
are treated, the Doctor recognizes his work is finished and intends to return
to the Apothecary. The player is not immediately teleported and may continue
exploring. Returning to the Apothecary closes Day 1. Do not impose an order
between the cases.

### Day 2 — approved direction, visual/pre-production

The intentional production sequence is:

1. Prepare/reuse character poses.
2. Place characters visually with Decorator.
3. Establish dialogue and mission/investigation flow.
4. Implement collection, crafting, analysis, and treatments.

Do not invent quest logic before placements/dialogue are approved.

- **Severe granary/mill patient:** a known/reused agricultural NPC becomes
  seriously ill, lying flat on their back on the straw bed in the new granary
  interior. Another existing farm/mill-connected NPC seeks the Doctor outside
  the Apothecary. This is the narrative anchor starting the day's medical work;
  exact dialogue and relationship may still be refined.
- **Woodcutter:** reuse the existing woodcutter, sitting/resting on a log or stump,
  visibly exhausted, axe on the ground. The direction is exhaustion/dehydration/
  overwork: a human, ordinary case rather than making everything part of the
  central mystery.
- **Blacksmith:** reuse the existing blacksmith, seated and tired, supporting
  one injured hand with the other. Approved investigative concept: examine him
  -> determine a sample is useful -> obtain/use a leech -> obtain sample
  -> analyze at the Apothecary/alchemy workspace -> identify treatment
  -> craft/treat. Exact items, recipes, flags, and dialogue are not yet canon
  unless separately approved.
- **Witch:** present in Natural Cave from the beginning of Day 2, not spawned by
  a quest. She stands sideways/in 3/4 profile near the water, contemplative,
  holding a lantern. She likes dark/strange places and is comfortable there.
  She has casually obtained a leech relevant to the blacksmith investigation;
  the player may meet her before knowing its use. A later NPC clue about her
  heading to the cave is informational, never a systemic gate.

Prepared static Day 2 assets currently include the tired woodcutter, blacksmith
with hurt hand, sick farmer lying flat, and Witch with cave lantern. These are
poses/states of existing identities, not new characters. Asset presence does not
mean Day 2 gameplay logic exists. Placement must be performed/approved through
Decorator.

### Canon discipline

Clearly distinguish implemented behavior, approved future direction, and tentative
ideas. Do not hard-code tentative details into canon merely because they appear
here, or turn implementation details into narrative canon. If exact dialogue,
recipes, item requirements, NPC relationships, coordinates, quest conditions, or
rewards are unapproved, inspect existing implementation and ask/report rather
than inventing them. Shared collaboration and implementation rules remain in
`AGENTS.md`.
