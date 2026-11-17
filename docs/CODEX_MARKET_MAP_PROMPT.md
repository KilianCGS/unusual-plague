# Prompt for Codex: the market street on the Doctor's map

Copy everything below the line into Codex. It asks for ONE IMAGE only; Codex must not edit the game code
(Claude integrates it afterwards: the new place, its link between the apothecary and the farm, and the
icon's anchor).

---

You are generating one illustration for "Unusual Plague", a pixel-art narrative game in a plague-era village.
The Doctor's map is a parchment (see `src/game/map/MapOverlay.tsx`); every place on it has a painted
engraving in `public/game/ui/map/<id>.png`.

## What to make
`public/game/ui/map/market.png`: the MARKET STREET, a new place between the apothecary ("pharmacy.png") and
the farm ("farm.png").

- 512 x 512, transparent background, the drawing standing on a ground line at 450 / 512 of the height
  (like every other file in that folder).
- Subject: a short stretch of cobbled street with a low stone wall behind it and three small market stalls
  side by side under cloth awnings (one red-and-white striped, one cream, one green), with a few crates,
  a barrel and a potted plant at the base, and a string of small pennants over them. Keep it simple and
  readable at 186 px wide, like the other icons.

## Style: match the existing map icons exactly
Look first at `public/game/ui/map/*.png` (especially `plaza.png`, `pharmacy.png`, `farm.png`,
`smithy.png`) and copy their look line by line: old engraving / etching, fine irregular sepia-brown
outlines (never black), parallel hatching and cross-hatching denser on the shadow side (light from the upper
left), almost no flat fill (a very pale warm wash so the paper shows through), no saturated colour
(ink browns #3b1d0e to #8a5530, wash #e9d3a4 to #f6ead0, a touch of terracotta #b8683a on the awnings only),
a hatched ground shadow under the subject, hand-made imperfection.

## Deliver
1. `public/game/ui/map/market.png`.
2. In your answer, say how many pixels from the TOP of the 512 px picture the ink starts (the highest drawn
   point), so the pin can be hung beside it (the map keeps this number per place).

## Do NOT
- Touch any `.ts` / `.tsx` file or any other image.
- Add text, labels or a border to the picture (the map writes the name under it).
