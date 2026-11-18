"""Second pass on the ambient plants (grass tuft, fern, bushes), 2026-11-18.

Kilian: the ambient flora (recoloured to the scenes' lime on 2026-11-16, see recolor-ambient-greens.py) is too
BRIGHT; he wants the palette of the other plants of the scenes (the big painted fern: hue ~98, median value
~0.48; the pines: darker and bluer). So this pass, applied to the files as they are now:
  * moves the hue a little toward the fern / the pines (a deeper, less yellow green),
  * lowers the value (the body of the leaves and, above all, the bright highlights),
  * keeps the saturation about where it is, and leaves outlines, flowers and wood alone.

Only green-ish pixels (hue 50-190) are touched. Run:
    python art/recolor-ambient-greens-v2.py --preview     (writes a before/after sheet, changes nothing)
    python art/recolor-ambient-greens-v2.py               (recolours the PNGs in place)
The files BEFORE this pass are in git history (the commit before the one that added this script).
"""
import colorsys
import os
import sys

from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "game", "ambient")
ASSETS = ["grass-tuft", "fern-weed", "bush-round", "bush-tall"]

TARGET_HUE = 106.0   # the fern of the scenes is ~98, the pines ~150: a deeper green than the 92 of the first pass
HUE_PULL = 0.5       # how much of the original hue variation is kept (0 = all the same hue)
VAL_GAIN = 0.78      # median 0.6 -> ~0.47, like the fern (0.48)
VAL_CAP = 0.80       # no more bright highlights (they reached 0.95)
SAT_GAIN = 1.0


def recolor(img):
    img = img.convert("RGBA")
    px = img.load()
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            h, s, v = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
            hue = h * 360
            if not (50 <= hue <= 190) or s < 0.08:
                continue
            nh = (TARGET_HUE + (hue - 92) * HUE_PULL) / 360
            ns = min(0.85, s * SAT_GAIN)
            nv = min(VAL_CAP, v * VAL_GAIN)
            nr, ng, nb = colorsys.hsv_to_rgb(nh, ns, nv)
            px[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255), a)
    return img


def frames(name):
    folder = os.path.join(ROOT, name)
    return [os.path.join(folder, f) for f in sorted(os.listdir(folder)) if f.endswith(".png")]


if __name__ == "__main__":
    if "--preview" in sys.argv:
        scale = 4
        cols = []
        for name in ASSETS:
            path = frames(name)[0]
            before = Image.open(path).convert("RGBA")
            after = recolor(before)
            cols.append((before, after))
        w = sum(max(b.width, 1) for b, _ in cols) * scale + 20 * len(cols)
        h = max(b.height for b, _ in cols) * scale * 2 + 30
        sheet = Image.new("RGBA", (w, h), (120, 160, 40, 255))
        x = 10
        for before, after in cols:
            sheet.alpha_composite(before.resize((before.width * scale, before.height * scale), Image.NEAREST), (x, 5))
            sheet.alpha_composite(after.resize((after.width * scale, after.height * scale), Image.NEAREST), (x, 15 + before.height * scale))
            x += before.width * scale + 20
        out = sys.argv[sys.argv.index("--preview") + 1] if len(sys.argv) > sys.argv.index("--preview") + 1 else "ambient-greens-preview.png"
        sheet.save(out)
        print("preview written to", out)
    else:
        for name in ASSETS:
            for path in frames(name):
                recolor(Image.open(path)).save(path)
        print("recolored", ASSETS)
