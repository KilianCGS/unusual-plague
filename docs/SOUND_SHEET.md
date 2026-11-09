# Unusual Plague - Sound sheet

A working list of every sound the game needs, ready to feed to a sound
generator or to search in a free library. Nothing here exists in the project yet
(there is no audio at all): files will go in `public/game/audio/<category>/` and
be listed in one manifest, so a missing file is simply silent.

**Format:** OGG (also fine: MP3 or WAV, converted later). Mono for effects,
stereo for ambience and music. Loops must be seamless (no click at the join).
**Licence:** only CC0 or a licence that allows games; keep the source and
licence of every file in `docs/SOUND_CREDITS.md`.
**Style:** quiet, soft, slightly muffled; a medieval village, no modern or
electronic sounds. Effects short (under 1 s unless noted).

Priority: **A** = the game feels empty without it, **B** = very nice, **C** = polish.

Where to look (free): Kenney (kenney.nl, CC0), OpenGameArt (filter CC0),
Freesound (filter CC0), Pixabay Sound Effects. To generate: any text-to-sound
tool, using the English prompt of each row. For music: a text-to-music tool or a
composer; the prompts are at the end.

## 1. Footsteps (one short step; the game plays them in sequence)

Four variants of each (so it does not sound repeated); "run" = faster, a bit
louder. Surfaces were assigned by looking at each scene's background image.
"Confirmed" = the floor is clearly visible; "to confirm" = it cannot be told
apart for certain and Kilian should decide. Every interior is now settled.

| File | Used in | Prompt / search | Pri |
|---|---|---|---|
| steps/stone-1..4 | Interiors: apothecary, Doctor's room, bakery, tavern. Exteriors: plaza and the cobbled streets (see 1.2) | single footstep on stone flagstones, leather boot, soft | A |
| steps/dirt-1..4 | Interiors: smithy, granary. Exteriors: mountain path, farm and mill paths, forest tracks (see 1.2) | single footstep on packed dirt, boot | A |
| steps/grass-1..4 | Forest and the cottage clearing, farm and mill grass | single footstep on grass and leaves, soft | A |
| steps/wood-1..4 | Interior: Witch's cottage (clearly wooden planks; locked for now) | single footstep on wooden floorboards, boot | B |
| steps/cave-1..4 | Interiors: mine, witch's cave (rock and earth) | single footstep on rock and earth in a cave, slight echo | B |
| steps/run-* | all surfaces | same surfaces, quicker and heavier | B |

### 1.1 Interior floors, from the visual reference

| Scene | Floor seen in the background | Status |
|---|---|---|
| apothecary-interior | grey stone flagstones, a rug in the middle | **Confirmed: stone** |
| doctor-room | stone flagstones with a rug at the door and one by the bed | **Confirmed: stone** |
| bakery-interior | stone flagstones | **Confirmed: stone** |
| tavern-interior | stone flagstones with two rugs | **Confirmed: stone** |
| smithy-interior | dark brown ground with no plank or tile lines | **Confirmed: dirt** (earthen floor) |
| mine-interior | rock and earth floor | **Confirmed: cave** |
| mine-natural-cave | rock and earth floor, a pool of water | **Confirmed: cave** |
| forest-cottage-interior | clearly wooden planks | **Confirmed: wood** (the door is locked for now, so nothing plays yet) |
| bakers-bedroom | (a purely narrative scene: the Doctor does not walk in it) | **No footsteps needed** (Kilian) |
| granary-interior | floor covered in straw | **Confirmed: dirt** (Kilian) |

Important correction: no interior except the Witch's cottage has a visible
wooden floor, so the "wood" footsteps are low priority (B).

### 1.2 Exteriors (mixed, reviewed only roughly)

Most outdoor scenes mix several surfaces, so a single sound per scene is not
exact. Proposal, to confirm:
- Cobbled stone: plaza, apothecary street, bakery street, tavern street, smithy street (road), the bridge in the outskirts.
- Dirt path: mountain path (dirt and rock), the tracks of farm, mill and forest.
- Grass: forest, farm and mill outside the paths.
The game would need a way to know the surface under the Doctor (per scene or per
painted zone); that decision belongs to implementation, not to this sheet.

## 2. Interface and items

| File | When | Prompt / search | Pri |
|---|---|---|---|
| ui/coin-gain | the Doctor is paid | one or two copper coins dropped into a hand, small clink | A |
| ui/coin-spend | he pays a merchant | copper coins counted onto a wooden table, 2 to 3 clinks | A |
| ui/coin-refused | not enough coins | a soft dull coin clink then a small sigh of wood, short | B |
| ui/pickup | picks up a world item | quick rustle of picking a herb or small object | A |
| ui/inventory-open | opens the inventory | leather satchel opened, cloth rustle, 0.4 s | B |
| ui/inventory-close | closes it | leather satchel closed, soft | B |
| ui/chest-open | opens the chest | small wooden chest lid creaking open | A |
| ui/chest-close | closes it | wooden lid closing, dull thud | B |
| ui/item-move | moves a slot | soft thud of a small object put on cloth | C |
| ui/book-open | opens the Book | old book opened, paper and leather | A |
| ui/book-page | turns a page | a single page turn on thick paper | A |
| ui/compendium-note | new Compendium entry | a quill scratch with one soft chime, short | B |
| ui/mark-news | a "!" appears | tiny soft double note, gentle, not alarming | C |
| ui/mark-item | a "?" appears | tiny soft single high note | C |
| ui/thought | the Doctor's thought | very soft low breath-like tone, 0.3 s | C |
| ui/shop-buy | confirms a purchase | wooden counter tap and a coin | B |

## 3. Crafting

| File | When | Prompt / search | Pri |
|---|---|---|---|
| craft/manual | manual crafting (also the mortar grinding and mixing, if it is added) | grinding herbs in a stone mortar with a pestle | A |
| craft/fire | fire crafting | small pot simmering over a fire, crackling | A |
| craft/success | a preparation is ready | small satisfying glass-and-wood tap, a warm tone, 0.6 s | A |
| craft/not-needed | "I don't need that now" | a dry short wooden knock, neutral | B |
| craft/pour | water poured in a flask | water poured into a glass flask, short | C |

## 4. Dialogue

| File | When | Prompt / search | Pri |
|---|---|---|---|
| voice/blip-doctor | each letter, the Doctor | one short soft low wooden blip, 40 ms | A |
| voice/blip-man | each letter, adult man | one short low voice-like blip, 40 ms | B |
| voice/blip-woman | adult woman | one short mid voice-like blip, 40 ms | B |
| voice/blip-old | old people | one short wobbly voice-like blip, 50 ms | C |
| voice/blip-child | children | one short high bright blip, 35 ms | C |
| voice/cough | patient coughing | a weak dry cough, one single time | B |
| voice/groan | sick patient | a low tired groan of pain, short | B |

## 5. World and doors

| File | When | Prompt / search | Pri |
|---|---|---|---|
| world/door-open | enter a building | old wooden door opening with a creak | A |
| world/door-close | leave | wooden door closing, latch | A |
| world/door-locked | the Witch's house | a wooden door handle rattled, locked, short | A |
| world/miner-hit | the miner's pick | a pick hitting rock, short clack | B |
| world/hammer-anvil | the smith | a hammer striking an anvil, ring, 1 s | B |
| world/cat-meow | the cat | a small cat meow, soft | C |
| world/kite-flutter | the kite girl | cloth kite flapping in the wind, short loop | C |
| world/fire-hearth | the closing at the fireplace | a small hearth fire crackling, loop | B |

## 6. Ambience (loops, 20 to 60 s, seamless)

| File | Where | Prompt / search | Pri |
|---|---|---|---|
| amb/village | plaza and streets | a quiet medieval village, light wind, distant voices, a bird | A |
| amb/forest | forest and cottage | forest ambience, birds, leaves in the wind, no people | A |
| amb/farm | farm and mill | countryside, hens, a distant cow, light wind | B |
| amb/mill | mill | water wheel turning, creaking wood, running water | C |
| amb/tavern | tavern | a muffled tavern, low chatter, a cup on wood, a fire | A |
| amb/bakery | bakery | a warm kitchen, a fire, a light kneading, faint | C |
| amb/smithy | smithy | a forge with bellows breathing and fire, faint | B |
| amb/mine | mine | a cave with dripping water and a low draught | B |
| amb/night | Day closings | quiet night, crickets, a very distant owl | B |
| amb/indoors-wood | generic interior | a quiet room, a wooden house creak, very faint | C |

## 7. Music

Decision (Kilian): while exploring the game has **soft ambience and no
continuous music**. Music is reserved for the title screen, the closing
interludes and the final moments.

| File | Where | Prompt | Status |
|---|---|---|---|
| music/title | title screen | soft solo lute and low strings, melancholic, medieval, slow, loopable, 90 s | Reserved (B) |
| music/day-close | the closing illustrations (Day 1, Day 2) | a warm quiet melody on strings by candlelight, 40 s, no loop | Reserved (B) |
| music/village-day | exploration | gentle pastoral flute and plucked strings, calm, 2 min, loop | **Optional: do not prepare yet** |
| music/strange | the final chapter | unsettling, a slow drone with a distant detuned bell, 90 s, loop | **Proposal, pending review with the narrative** |
| music/ending | the ending | the same theme as the title but resolved and sad, 60 s | **Proposal, pending review with the narrative** |

## Checklist per file
- [ ] the file name matches the table (lowercase, hyphens)
- [ ] seamless loop (if it loops)
- [ ] quiet (peaks around -12 dB) so the game can set the volume
- [ ] source and licence noted in `docs/SOUND_CREDITS.md`
