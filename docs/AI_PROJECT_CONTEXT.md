# Unusual Plague: AI Project Context

## Latest Day 2 placement update

DAY 1 CLOSING ILLUSTRATION (Kilian, 2026-11-08): `doctor-eating.png` is the
correct picture for the narrative bridge between the Day 1 closing and Day 2,
with the Doctor's lines. The Day 1 closing therefore shows `doctor-eating` with
the already approved `chapter1Day1Dialogues.ts` lines (unchanged, no new text);
`doctor-fireplace.png` stays registered but unused. NOTE: the Day 2 epilogue
(below, text NOT approved) currently reuses that same picture too; whether it
should use another image or its own text is an open question for Kilian.
Tests updated; browser review of the new closing image is pending.

PLAYER DIAGNOSIS IMPLEMENTED: after a first patient examination, GameWorld opens
a seven-option diagnosis dialog (six previous ailments plus poisoning). Wrong
choices play three parenthesized Doctor thoughts reviewing the same symptoms,
then return to the choice, with no item, reward, recipe or patient advancement.
The Book button/Q opens Ailments; Q/Esc closes it and returns to the SAME pending
case. Pending patient pages show observed symptoms without a diagnosis or cure.
Only the correct-answer conversation finishing calls the existing examination
completion, records the diagnosis and learns case recipes. All six implemented
Day 1/2 cases participate; completed dev fixture cases do not repeat exams.
Farmer poisoning is a hypothesis: the sample, analysis flag and treatment gating
remain intact. No culprit or poison source is assigned. Dialogue examinations
now describe signs rather than naming their conclusion in advance; the woodcutter
case title no longer gives the answer away. Movement, interactions, travel and
other interfaces are blocked during diagnosis; consulting the Book is allowed.
Synchronous session refs reject double choices and stale interaction events.
Poisoning has its own ink illustration and bilingual Book entry. All seven
ailment reference pages are now available in English too. Old references to
uncatalogued remedy names were aligned with existing preparations, without
changing any recipe or patient treatment requirement. New tests exercise every
choice for all cases, retry thoughts, pending Book entries, confirmation wiring
and server-rendered dialog labels. Browser interaction/pacing review pending.
This supersedes the earlier diagnosis-proposal-only notes below.

PREPARATION PAGINATION CONFIRMED: Kilian answered the layout question: one
recipe per physical leaf, TWO recipes per opening. This supersedes the earlier
one-per-opening placeholder below. `buildPreparationSpreads` now pairs known
recipes (including learned prerequisites) in catalog order; 15 entries make
eight openings with an empty final right leaf. Each leaf stacks its approved
image, name, description and use, followed by its own ingredients, prerequisite
note when relevant, station and carried-stock availability. Preparation-only
text roles keep the denser layout separate from other Book sections. No images,
discovery rules, recipes or patient mechanics changed. The diagnosis-selection
idea remains a proposal, not an implemented feature. Browser layout review pending.

SHARED FIRE: Kilian supplied a new chapter-1 export and requested permanent
campfires/flames just like vegetation. Only its 41 fire placements were added
to `shared-environment.ts`: campfire 2, candle-flame 39. The existing 55 plants
are preserved, for 96 shared instances. No NPC, resource or other export change
was imported. All authored ids, positions, scales, flips and collision settings
are preserved. Shared ids deduplicate chapter copies across all chapters.
The botica authoring id `apothecary-main-zone` maps to `apothecary-interior` for
shared decor only: both use the same background and 480x293 logical space.
ApothecaryScene now renders those nine shared flames with DecorSprite; its
manual colliders, interaction zones, spawns and transitions are unchanged.
Other rooms already use the ordinary composition renderer. Decorator's shared
backdrop now says "Ambiente compartido" to include vegetation and fire.
Browser placement/animation review remains pending.

AILMENT ART V2: Kilian requested improved ailment illustrations matching the
approved ingredients/preparations engraving style. The six existing ailment
drawings have new sibling `*-v2.png` assets under `public/game/ui/book/ailments/`;
original PNGs are retained. Their existing subjects and 176x176 Book slots are
preserved; the new high-resolution brown ink art is smoothed, contained and
multiply-blended over the shared parchment. No symptom/treatment text, ailment
list, patient rules or recipe data changed. `/dev/book` has "Ver las 6 dolencias"
to enter that section directly. Source prompts are recorded under
`art/medical-book/ailments-v2/`. These new illustrations await Kilian's visual
review; browser rendering has not been manually validated.

PREPARATION ENTRY UPDATE: Kilian approved all 15 final preparation images.
Keep those assets unchanged. Known recipes (including prerequisite recipes)
alone produce entries; obtaining/using inventory does not erase them.
Each entry's left leaf now stacks illustration, name, bilingual description,
and indication. The existing right leaf retains actual ingredients, station,
prerequisite steps and carried-stock availability. Physical-leaf versus full-
opening pagination clarification was asked; this preserves the existing one-
preparation-per-opening layout meanwhile. `book/preparations.ts` describes all
15 outputs and derives indications from registered game treatment requirements,
using the completed farmer investigation definition for its medical indication
only. This does not mutate player flags or reveal patient identities. Intermediates
name their products instead of claiming a direct cure; balsamic syrup currently
has no case indication and says so. No new cure, recipe or patient was added.

COMPENDIUM NOTICE: GameWorld mounts CompendiumNotice, observing known recipe ids
and visible patient records (including effective investigation definitions).
Knowledge changes show a nonblocking ES/EN toast at top right for 4.5 seconds;
simultaneous changes coalesce and subsequent changes refresh its duration.
Initial/dev fixture knowledge, bag changes and opening the Book do not trigger
it. Existing item feedback stays separate. Browser visual review pending.
Kilian requests more natural dialogue with occasional humor, and soft contextual
links between patients rather than mandatory order. Preparation illustrations
should match the ingredients' brown ink engraving style, not inventory pixels.
Preparation spreads now allocate one whole opening per known recipe: name and
illustration on the left, live localized ingredients/station/prerequisites and
bag availability on the right. Artwork uses contain scaling and multiply blending
(opaque white source paper, preserving ink; the first transparent batch had
destructive cutouts and was rejected). Ingredient pages
and existing inventory icons are preserved. `/dev/book` offers an explicit
all-15 preparation fixture and ES/EN selector, without teaching runtime recipes.

DAY 2 EPILOGUE: `patients/day2.ts` derives completion from all three Day 2 cases,
in any order, and its own `chapter2.day2.completed` flag. GameWorld waits for
plain play after the last treatment conversation (no dialogue, overlay, fade or
pending scripted step), claims the flag first and opens a single interlude using
the existing doctor-eating illustration and bilingual `chapter2ClosingDialogues`.
The caption is followed by parenthesized Doctor thoughts, with no artifacts or
new narrative cause assigned to the poisoning. While the image covers the game,
the Doctor returns to the existing Chapter 2 room/start spawn exactly once.
Inventory, storage, cases, collected ids, recipes and flags are preserved.
Chapter 2 remains active for aftercare/free exploration; this is an epilogue,
NOT a transition into unfinished Chapter 3. `getNextChapterId("chapter-2")` remains
null. Chapter 1 keeps its separate closing and chapter transition unchanged.
The Day 2 dev page (both aliases) now has "Probar cierre": a disposable fixture
with Day 2 cases treated and investigation/messenger flags set, but completion
unclaimed. Restart restores the normal Day 2 test fixture. Nothing is saved.
New epilogue is implemented for play review; browser pacing/visual review pending.

SHARED ENVIRONMENT: Kilian supplied a chapter-1 export and explicitly requested
its wind vegetation in EVERY chapter. Only its 55 bush-round/bush-tall/grass-tuft/
fern-weed instances were extracted into `compositions/shared-environment.ts`:
farm 16, forest 5, mill-farmland 14, mountain-path 12, outskirts 8. All authored
instance values are preserved; all anchors are within their scene worlds.
NPCs, collectible herbs/resin/etc and other export changes were NOT imported.
`getComposition` layers these placements over any chapter (including future
chapters without population), deduplicating by stable instanceId with shared
placements authoritative. No legacy exterior population is reintroduced.
Decorator previews shared vegetation as a read-only backdrop outside local
drafts/exports; a matching local id suppresses that preview for editing. Updating
the shared placements still requires integrating the approved vegetation export.
These assets are animated, nonblocking and noncollectible. `DecorSprite` frame
keys now include their sequence index, allowing intentionally repeated PNGs
without duplicate React child keys. No character or manual geometry was changed.

CONDITIONAL HINTS: new internal Doctor lines use `doctorThought` (ES/EN text
wrapped in parentheses). Farmer examination ends with a sample hint that knows
whether a leech is already carried. Witch's gift explicitly mentions leeches'
taste for blood; the following thought mentions returning to the granary only
if that case was examined. Before obtaining the sample, an examined case with
no carried leech can prompt the recovering miner's cave clue. If the Witch gift
was already received, the thought instead suggests checking storage. These
clues never spawn the Witch or gate access; the miner hint disappears once the
sample exists. The solo analysis result is internal speech as well.

FARMER INVESTIGATION IMPLEMENTED: after examination, interacting with the farmer
while carrying a leech consumes that existing item and claims
`chapter2.farmer.sampleCollected` atomically. The used leech/sample are narrative
state (no new inventory item). The Witch's existing gift flag prevents duplicates.
The Book directs the player to the apothecary work table. Only the manual
CraftingOverlay offers "Analyze the farmer's sample" while the examined case
has a collected, unanalyzed sample. The guarded action claims
`chapter2.farmer.sampleAnalyzed`, learns suspension/infusion recipes, closes
crafting and plays the Doctor's bilingual result conversation. No new station,
coordinates, reagent items, recipes, poison cause or culprit were introduced.

`farmerInvestigation.ts` derives case definitions from flags. GameWorld treatment,
Book, material suppliers and river all use those effective definitions; before
analysis the case remains an unresolved investigation and cannot be treated.
After analysis it requires charcoal suspension + medicinal infusion. Existing
recovering miner supplies missing coal, farm woman missing herbs, and river
water uses the existing flask. Delivery consumes both preparations exactly once;
farmer/carer/farm woman have aftercare dialogue. The three Day 2 cases now have
treatment paths, but Day 2 closing and Day 3 remain unimplemented.
Tests exercise sample gating, one-shot collection/analysis, six-slot crafting,
all Book stages and treatment with Day 1 rewards already claimed. Browser
validation of the new button and full route remains pending.

DAY 2 TWO COMPLETE CASES: the woodcutter (exhaustion) and blacksmith
(inflamed hand wound, existing infected-wound ailment) now have hidden ->
examined in-place -> treated flows, with bilingual examination, waiting,
delivery and aftercare dialogue. Woodcutter takes citrus drink + mint infusion;
blacksmith takes poultice + medicinal compress. Both can be completed independently
with the existing six slots, empty flask and leech carried; tests exercise both
orders with all Day 1 reward flags already claimed. Treatment consumes both
preparations atomically, once. Neither case ends Day 2 or advances the farmer.

MATERIAL SOURCES (existing Day 2 NPC interactions, no new placements): farm
woman supplies orange/mint/herb/animal fat; baker flour/honey; mill neighbour
resin/cloth. `chapter2Supplies.ts` derives quantities from examined untreated
Day 2 cases, recursively accounting for carried intermediates and prepared cures.
No known need means normal ambient dialogue. Full inventory gives nothing and
allows retry. Supplies do not depend on Day 1's one-time reward flags and may be
requested again only when a real shortage remains. Player still carries/transfers
materials normally; chest contents are not used remotely. River water logic now
reads the combined patient registry, so Day 2 water needs fill the existing flask.
Blacksmith is no longer the blood-sample case; that investigation stays with the
farmer and is still pending. Assets, placements and manual geometry are unchanged.

RECIPE DISCOVERY ACTIVE: `crafting/recipeDiscovery.ts` maps existing recognizable
ingredients to recipe ids (water, vessels and leech are excluded). Successful
world pickups, story gifts/trades, chest withdrawals and crafting results call
the same pure learner. Receiving a preparation reveals its recipe too. Knowledge
is monotonic for the session and prerequisite recipes are included. Patient
examination updates the same remembered recipe set; dev known recipes are retained.
Failed transactions teach nothing. A bilingual obtained/recipe notice directs
the player to the Compendium (Q); learned preparation pages now report whether
their immediate ingredients are carried (not chest stock or raw substitutes).
This supersedes the earlier pending-discovery notes; new Day 2 ingredient
sources and patient treatments still remain pending. No changes to the seven
new decor assets, their colliders, or placements were made in this task.

CRAFTING CATALOG UPDATE: following Kilian's instruction to use existing items,
all 15 catalog preparations now have recipes (seven previous recipes unchanged,
eight added). Four chains use intermediate items: mint infusion -> syrup,
medicinal paste -> poultice, ointment base -> compress, crushed coal -> suspension.
Manual remains two slots; fire three. Single-input processing is enabled only
for an actual matching recipe at its station (coal grinding), not arbitrary
single items. Ingredient needs now expand recursively, aggregate shared demands
before allocating carried intermediates/batch rounding, and reject cyclic data.
The Book reveals intermediate recipes when their final recipe is known and
shows a bilingual "Prepare first" note. This does NOT implement learning on
pickup, new material sources, new patient treatments or a blood-analysis cure.
See `docs/CRAFTING_CATALOG.md` for all exact ingredients and dev presets.

PLAZA ENVIRONMENT ACTIVE: Kilian supplied three interaction rectangles, now
integrated verbatim in `environmentZones.ts`: noticeboard (967,254,103,21),
well (399,403,97,21), statue (718,607,109,25). Assigned the corresponding
`world.plaza.*` text ids to the blank exported interactionIds. Statue adds two
brief ES/EN Doctor observations. No colliders, transitions or spawns changed.
These three zones are shared between chapters and preload in the editor;
the other environment objects still await manually painted zones.

DAY 2 AMBIENT UPDATE: Kilian authorized adding NPC/environment writing.
15 additional bilingual conversations are now connected to the supplied human
placements (including woodcutter/blacksmith introductions, not their treatment
mechanics). The bartender reuses the Day 1 interaction reach across the counter.
Tests check separate reachable interaction floor for every connected NPC using
actual scene and decor colliders; this is not browser validation of E input.
Farm woman dialogue changes after the farmer's examination. Witch dialogue
also responds to that knowledge; she gives the existing leech item once, before
or after discovering the case, using atomic give-item/claim-reward effects and
`chapter2.witch.leech`. Full inventory consumes neither item nor reward flag.
Sample extraction, analysis and treatment remain unimplemented.

Six everyday-object conversations are available in ES/EN, with Doctor-only
speakers: noticeboard, well, mill tools, granary sacks, tavern hearth and anvil.
`/dev/collisions` suggests their scene-specific ids. Their geometry has NOT been
guessed: `environmentZones.ts` is empty pending Kilian's painted exports, so
these object interactions are not yet active in runtime. See
`docs/ENVIRONMENT_INTERACTIONS.md` for the authoring workflow. Environment zones
merge with existing interactions; they never replace water, crafting or storage.

Reported issues: Kilian did not see interactions in play; previously only the
two granary characters had Day 2 interaction definitions, and now the remaining
15 humans are wired too. Root cause of the reported granary input issue is not
verified in browser. The doll child is intentionally nonblocking in the supplied
export and has no asset defaultCollider, explaining why the Doctor crosses her.
No manual collision geometry has been invented to change that.

GRANARY RUNTIME UPDATE: Kilian supplied 12 colliders, one exit zone and one
arrival (228, 340, south), preserved in `granaryInteriorGeometry.ts`.
`granary-interior` is now a runtime scene connected bidirectionally to the V2
mill barn door (mill-farmland-transition-2), returning at mill-farmland-spawn-2.
The collision editor preloads this geometry; the map groups it with the mill.
This supersedes earlier authoring-only notes.

GRANARY FIRST PLAYABLE SCENE: under Kilian's instruction to build the scene,
`chapter2GranaryDialogues.ts` adds bilingual carer introduction/revisits and
the farmer's in-place examination/revisits. Either person can be approached
first. The carer introduces the case but does not examine it; the farmer's
medical status advances only after his examination conversation fully closes.
These authored lines are implemented for Kilian's next play review; no separate
approval of their exact wording or browser validation is implied.
The examination suggests poisoning without assigning a cause or culprit and
opens the blood-sample investigation. The next step is recorded in the Book.
`patientRegistry.ts` combines the two chapters for GameWorld and Book; Day 1
closing continues to read only its three cases. An optional `investigation`
note on a case prevents treating an unresolved investigation with an empty
treatment list. No sample extraction, new recipe or antidote is implemented.
Carer dialogue remembers the introduction and responds to examination status;
farmer revisit dialogue also recognizes a leech already carried, without
consuming it. Chapter 2 interaction zones derive from the approved sprites'
scaled bounds plus reach; placements/colliders remain unchanged. Tests check
that both conversations are separately reachable with scene/decor colliders.

Dialogue direction reaffirmed: ambient conversations are a core part of the
experience, not filler. Give them character, immersive village detail and
meaningful observations; retain occasional character-led humor like Day 1.

### Updated Day 2 direction (Kilian, 2026-11-08)

The full supplied COPY CHAPTER export is now integrated unchanged (14 scenes,
including the existing messenger). Granary placements are active in runtime.
Other characters do not gain dialogue merely from being present in this export.

The three Day 2 patients are the poisoned farmer, exhausted woodcutter and
injured-hand blacksmith. Kilian now assigns the Witch's leech and blood-sample
investigation to the FARMER, superseding the earlier blacksmith investigation
concept below. Cases should be approachable without a forced order. The Witch
is available in the cave independently of case discovery. Exact sample analysis,
whether an antidote is crafted, recipes, materials and the leech handover dialogue
are still proposals to settle, not implemented or approved details. Prefer the
existing crafting model, with a small number of new items where useful. Ambient
NPC dialogue should reflect the supplied population and relevant story state;
future dialogue wording still needs review; the granary scene was subsequently
authorized for implementation as described above.

Kilian visually approved the opening transition pacing in browser. The granary
is now selectable in `/dev/collisions`, using the same visual as Decorator and
export prefix `granaryInterior`. It now preloads Kilian's supplied geometry.

Kilian supplied the messenger placement: instance
`apothecary-street-villager-woman-01-01`, asset `villager-woman-01`, at (327, 438),
scale 1, flipX false, collider enabled, zOffset 0. This supersedes the earlier
empty-export and no-collider notes below. Chapter 2 now contains this instance.
The first Botica-door arrival in Day 2 keeps the Doctor's authored arrival X,
aligns his Y with her (438), and faces west, without changing manual geometry
or Chapter 1. Later arrivals after the encounter use the normal spawn.
Kilian approved the revised opening dialogue on 2026-11-08; the encounter is active.
The opening caption now holds for 4000 ms, independently of fast-travel timing.
This latest update supersedes older pending-approval notes below.
The first exit through the Botica door shows an approved ES/EN caption over
black before revealing the pair: "Nada mas salir, encuentras a la granjera
preocupada y agitada." (accented in the actual localized text). It reuses the
existing transition caption with its own 4000 ms reading duration. `chapter2.messenger.captionShown`
prevents repeats independently of dialogue approval and never consumes the
encounter's met/left flags. No caption is shown without the messenger placement.

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
A fade can also STAY in the scene (`startStayFade` in GameWorld): nothing is
swapped or re-mounted, the Doctor keeps his place, and an action runs while the
screen is black. GameWorld remembers the last arrival a transition completed
(`arrivalRef`) so that something can belong to THAT arrival.
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
`chapterStart.ts` defines each chapter's start (Doctor's Room, `chapter-start`
spawn; only Chapter 1 has the doctor-writing opening interlude) and the successor
of each chapter (`getNextChapterId`: `chapter-1` -> `chapter-2`, nothing after).
GameWorld keeps the ACTIVE chapter ID in state: it starts at the initial one and
moves only when the Day 1 closing says so. This is not a general day progression
system. Compositions are keyed by scene and chapter.

IMPLEMENTED (approved design, replaces the earlier "go home yourself" flow):
`src/game/patients/day1.ts` derives the closing from Chapter 1 patient statuses
and one claimed flag, `chapter1.day1.completed`. When all three cases are treated
and the conversation of the last treatment has fully closed (GameWorld only asks
at a moment of plain play: no dialogue, interface or fade), the day closes by
itself. The flag is claimed as the closing starts, so it cannot fire twice and is
never reused for Day 2. The closing is ONE sequence: the existing narrative
interlude over `doctor-eating` (formerly `doctor-fireplace`, changed 2026-11-08), whose first line is the caption ("Con los
pacientes atendidos, regresas a casa para descansar." / "With your patients cared
for, you return home to rest.") followed by the Doctor's three lines
(`chapter1Day1Dialogues.ts`). While the picture covers the game, the active
chapter becomes `chapter-2` and the Doctor appears in the Doctor's Room on the
existing `chapter-start` spawn, with no opening; control returns when the interlude
ends. Inventory, storage, known recipes, patient states, flags and collected items
are kept and nothing is saved or reset. There is no walking home, no night scene
and no hour simulation. Cases have no required ordering in that rule.

DAY 2 OPENING ENCOUNTER (implemented and prepared, INACTIVE until its data
exists; `src/game/world/day2Opening.ts`, `GameWorld.tsx`): a farm woman reusing
`villager-woman-01` waits outside the Botica in `apothecary-street`. When the
arrival through the Botica's street door (`from-apothecary-interior`) in
`chapter-2` is over and control is back, a conversation starts by itself; when it
closes, a short stay-fade removes only her instance and the Doctor keeps scene
and place. It happens once per session: `chapter2.messenger.met` is claimed before
the dialogue starts and `chapter2.messenger.left` hides her instance afterwards
(narrative flags; the collected-objects set is not used). The instance is hidden
through `hiddenInstanceIds` of `ExteriorScene`. With no placement or no approved
text it does nothing, claims nothing and breaks nothing.
Two pieces of data are PENDING and live as constants in `day2Opening.ts`:
`MESSENGER_INSTANCE_ID` (null until Kilian's chapter-2 Decorator export contains
her, no collider) and `MESSENGER_DIALOGUE_APPROVED` (false). The text in
`dialogue/chapter2OpeningDialogues.ts` is a PROPOSAL: no explicit approval was
found, so it is not canon and stays out of play until approved.
Instance ids: the collected set lasts the whole game, so a Day 2 collectible
reusing the id of a Day 1 pick-up would never show up. `tests/day2-opening.test.mjs`
fails if the chapter-2 export contains such an id (the export is empty today).
DEV ACCESS: `/dev/day2` (also available at `/dev/testChapter2`) mounts the real GameWorld through an optional `devStart`
(`src/game/world/devStart.ts`): chapter-2, Doctor's Room, finished Day 1,
tutorial done, encounter pending. Everything in that start (flags, recipes,
carried flask, empty chest, collected ids) is TEST DATA, not a decision about the
real chapter. The normal game never passes a start. Nothing is saved.

PENDING DEPENDENCY: `src/game/compositions/chapter-2.ts` is only a slot (an empty
list marked PENDING EXPORT). Until Kilian provides the `/dev/decorator` export for
chapter-2, Day 2 starts with no decor instances in any scene (no NPCs, collectibles
or props) and no interactions table. The messenger encounter is implemented but
inactive pending placement and text approval; other Day 2 dialogues and patient
cases are not implemented. Decorator chapter options or assets named for Day 2 do
not establish approved future story content.

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
are treated and the last treatment's conversation ends, Day 1 closes
automatically: a narrative caption and the fireplace interlude show the Doctor
returning home to rest, and Day 2 begins in the Doctor's Room. There is no
playable night. Do not impose an order between the cases.

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

Prepared Day 2 assets currently include the tired woodcutter, blacksmith with
hurt hand, sick farmer lying flat, Witch with cave lantern, the girl with a doll,
the recovering miner and the fish bucket (animated idles where noted in
`decorAssets.ts`). These are poses/states of existing identities, not new
characters. Asset presence does not mean Day 2 gameplay logic exists. Day 2 can
now be entered from the Day 1 closing (see "Current chapter/day architecture"),
but its population still depends on the chapter-2 export. Placement must be
performed/approved through Decorator.

### Canon discipline

Clearly distinguish implemented behavior, approved future direction, and tentative
ideas. Do not hard-code tentative details into canon merely because they appear
here, or turn implementation details into narrative canon. If exact dialogue,
recipes, item requirements, NPC relationships, coordinates, quest conditions, or
rewards are unapproved, inspect existing implementation and ask/report rather
than inventing them. Shared collaboration and implementation rules remain in
`AGENTS.md`.
