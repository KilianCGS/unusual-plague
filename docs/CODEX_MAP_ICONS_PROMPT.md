# Prompt for Codex: map icons and one Compendium illustration

Copy everything below the line into Codex. It only asks for IMAGES; Codex must
not edit the game code (Claude integrates the files afterwards).

---

You are generating illustration assets for "Unusual Plague", a pixel-art
narrative game in a plague-era village. The Doctor's map is a parchment spread
across the screen (see `src/game/map/MapOverlay.tsx`). Today every place on it is
a small vector placeholder (since replaced by the painted icons this prompt produced).

## Style: match the Compendium exactly
Look at these files first and copy their look, line by line:
`public/game/ui/book/ailments/*.png`, `public/game/ui/book/ingredients/*`,
`public/game/ui/book/preparations/*.png`.
What they share (my analysis):
- Old engraving / etching: fine, slightly irregular sepia-brown outlines, never
  a thick uniform outline, never black.
- Shading is done with parallel hatching and cross-hatching, denser on the
  shadow side (light comes from the upper left, shade falls to the right and
  bottom). Fine stippling for stone, earth and texture.
- Almost no flat fill: a very pale warm wash (cream to light ochre) inside the
  shapes so the paper shows through. No saturated colour anywhere.
- Palette only: ink browns from #3b1d0e to #8a5530, wash #e9d3a4 to #f6ead0,
  a touch of terracotta #b8683a on roofs, a muted blue-grey #8fb0b4 only for
  water. No pure black, no pure white, no gradients except the paper tint.
- Hand-made imperfection: wobbling lines, small gaps in the outline, tiny
  grass tufts and pebbles at the base. A hatched ground shadow under each
  subject, not a drop shadow.
- Not cartoon, not chibi, not pixel art, not 3D, not glossy. Serious, botanical-
  atlas / medical-treatise tone. No text, no labels, no signature, no frame.

## Deliverable A: map icons
One PNG per place, 512 x 512, TRANSPARENT background (no paper in the image; the
parchment is drawn by the game), subject centred horizontally, the ground line
at about 88% of the height with a 16 px margin, all drawn at the SAME scale so a
house is about 70% of the canvas width and a mountain about 90%. Same slightly
elevated three-quarter view as the game's own scenes. Save to
`public/game/ui/map/<id>.png`:

| id | draw |
|---|---|
| pharmacy | half-timbered apothecary house, chimney with a wisp of smoke, hanging sign with a mortar and a leaf |
| plaza | round stone fountain with a central column and a little water spray, cobbles around it |
| tavern | larger half-timbered inn, chimney, hanging sign with a tankard |
| bakery | half-timbered house with a big chimney and smoke, hanging sign with a loaf |
| smithy | low stone-and-timber forge with a large chimney, an anvil and a hammer beside it |
| forest | a cluster of three or four trees: two pines and an oak, small ferns at the base |
| cottage | a small thatched wooden hut in the woods, a thin chimney, one small tree beside it |
| farm | a wooden barn with an X door, a haystack and a short fence |
| mill | a stone windmill with four lattice sails and a small door |
| mountain | two rocky peaks with a snow cap, cracks and shaded rock, a few pines at the base |
| mine | a rocky hillside with a timber-framed mine entrance, a rail leading out and a crossed pickaxe |
| river | a stone arch bridge over water, seen from the side, with rippling water under the arches |
| quarry | a work camp in a rock-walled clearing: three canvas tents, a stack of cut stone blocks, a wheelbarrow with rocks, a tool rack with pickaxes, a small campfire |
| forest-deep | a mossy clearing: two moss-covered boulders with red-capped toadstools, a fallen mossy log with small brown mushrooms, ferns, dense trees around |

Also write `art/map-icons/contact-sheet.png`: all 14 on one sheet over a
parchment colour (#f1e1b6), each with its id, so I can compare them at a glance.

## Deliverable B: one Compendium illustration
`public/game/ui/book/preparations/crushed-herb.png`: the same format and size
class as the other files in that folder (about 1536 x 1024, opaque, it is
blended with "multiply" over the book page, so a paper-white background is
right). Subject: a stone mortar and wooden pestle with medicinal herb leaves
ground to a coarse green-brown paste inside it, a few whole leaves and loose
crumbs on the table beside it. Same engraving style as its neighbours (look at
`medicinal-paste.png` and `crushed-coal.png`). This one currently has a
temporary copy of `medicinal-paste.png` that must be replaced.

## Rules
- Do NOT modify any code, tests or other assets. Only create the files above.
- Keep each file under 2 MB. PNG only.
- If an icon does not match the Compendium's engraving look, regenerate it
  rather than delivering something cartoonish.
- When done, list the files you created and anything you could not match.
