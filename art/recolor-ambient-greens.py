"""Recolors the green of the ambient plants (grass tuft, fern, bushes) to the lighter, brighter green of
the painted scenes (2026-11-16, Kilian: the olive greens clashed with the forest).

Only pixels that are green-ish are touched (hue 40-170 degrees); wood, flowers, outlines and shading
steps keep their relative brightness: hue is moved to the scenes' (~104 degrees), saturation is raised and
the value is lifted by a factor. Run:  python art/recolor-ambient-greens.py [--preview]
The originals are in git history (commit before this one); to redo with other numbers, `git checkout`
the PNGs first.
"""
import colorsys, os, sys
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "game", "ambient")
ASSETS = ["grass-tuft", "fern-weed", "bush-round", "bush-tall"]
TARGET_HUE = 92.0    # the lime-ish green of the painted scenes
SAT_GAIN = 2.2       # the sprites were ~0.3 saturated, the scenes ~0.85
SAT_CAP = 0.72
VAL_GAIN = 1.9       # lighter ("mas clarito")
VAL_CAP = 0.95

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
            if not (40 <= hue <= 190) or s < 0.04:
                continue
            nh = (TARGET_HUE + (hue - 70) * 0.35) / 360   # keep a little of the original hue variation
            ns = min(SAT_CAP, s * SAT_GAIN)
            # the dark outline keeps its weight; the body of the leaves is lifted
            nv = min(VAL_CAP, v * (VAL_GAIN if v > 0.3 else 1.25))
            nr, ng, nb = colorsys.hsv_to_rgb(nh, ns, nv)
            px[x, y] = (round(nr * 255), round(ng * 255), round(nb * 255), a)
    return img

if __name__ == "__main__":
    preview = "--preview" in sys.argv
    for name in ASSETS:
        folder = os.path.join(ROOT, name)
        for f in sorted(os.listdir(folder)):
            if f.endswith(".png"):
                path = os.path.join(folder, f)
                out = recolor(Image.open(path))
                if not preview:
                    out.save(path)
    print("preview only" if preview else "recolored", ASSETS)
