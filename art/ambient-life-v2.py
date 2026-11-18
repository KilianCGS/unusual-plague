"""Small hand-made ambient sprites (2026-11-18, Kilian: more life for the scenes, no new NPCs): fireflies, two fish
shadows (horizontal and vertical) and a river current with bubbles. Drawn pixel by pixel, a few frames each, so they
need no generations. Run:  python art/ambient-life-v2.py [--sheet path.png]
Writes the frames to public/game/ambient/<id>/<n>.png; src/game/decor/decorAssets.ts registers them.
"""
import math
import os
import sys

from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "game", "ambient")


def save(asset_id, frames):
    folder = os.path.join(ROOT, asset_id)
    os.makedirs(folder, exist_ok=True)
    for i, frame in enumerate(frames):
        frame.save(os.path.join(folder, f"{i}.png"))
    return frames


def plot(px, w, h, x, y, color):
    if 0 <= x < w and 0 <= y < h:
        r, g, b, a = color
        old = px[x, y]
        if old[3] == 0 or a >= old[3]:
            px[x, y] = color


# ---------------------------------------------------------------- fireflies: three, each blinking in its own time
def fireflies():
    w = h = 32
    spots = [(8, 11, 0.0), (23, 8, 2.1), (15, 23, 4.2)]
    n = 8
    frames = []
    for f in range(n):
        im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        px = im.load()
        for (x0, y0, phase) in spots:
            t = 2 * math.pi * f / n + phase
            glow = (math.sin(t) + 1) / 2
            x = x0 + round(1.2 * math.sin(t * 0.5 + phase))
            y = y0 + round(1.2 * math.cos(t * 0.5 + phase))
            # halo first (under the body)
            for dy in range(-3, 4):
                for dx in range(-3, 4):
                    d = math.hypot(dx, dy)
                    if d == 0 or d > 3:
                        continue
                    a = int(110 * glow * (1 - d / 3.2))
                    if a > 12:
                        plot(px, w, h, x + dx, y + dy, (210, 240, 90, a))
            core = (245, 250, 150, 255) if glow > 0.45 else (150, 170, 60, 230)
            plot(px, w, h, x, y, core)
            if glow > 0.7:
                plot(px, w, h, x + 1, y, (235, 248, 130, 255))
        frames.append(im)
    return save("fireflies", frames)


# ---------------------------------------------------------------- fish shadow: a translucent silhouette with a tail wiggle
def fish_horizontal():
    w, h = 32, 16
    n = 4
    frames = []
    shade = (18, 36, 52)
    for f in range(n):
        im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        px = im.load()
        phase = 2 * math.pi * f / n
        body_len = 21
        for x in range(body_len):
            u = x / (body_len - 1)
            half = 3.6 * (math.sin(math.pi * (0.12 + 0.88 * u)) ** 0.9) * (1 - 0.35 * u)
            wiggle = 1.6 * math.sin(phase - u * 3.2) * (u ** 1.3)
            cy = 7.5 + wiggle
            for y in range(h):
                if abs(y - cy) <= half:
                    edge = abs(abs(y - cy) - half) < 1
                    plot(px, w, h, 4 + x, y, shade + ((95 if edge else 120),))
        # tail fin: a filled fork that follows the wiggle
        tx = 4 + body_len - 1
        ty = 7.5 + 1.6 * math.sin(phase - 3.2)
        for k in range(7):
            half = 0.9 + 0.55 * k
            for y in range(h):
                d = abs(y - ty)
                if d <= half and not (k >= 4 and d < 0.9 + 0.3 * (k - 3)):
                    edge = d > half - 1
                    plot(px, w, h, tx + k, y, shade + ((90 if edge else 112),))
        frames.append(im)
    return frames


def fish_vertical(horizontal_frames):
    # the same fish swimming up the screen (head to the top): a quarter turn of every frame
    return [frame.rotate(90, expand=True) for frame in horizontal_frames]


# ---------------------------------------------------------------- river current: streaks and bubbles carried along
def river_current():
    w, h = 64, 32
    n = 8
    frames = []
    streaks = [(2, 7, 18), (20, 15, 22), (6, 25, 16), (38, 5, 12)]
    bubbles = [(10, 12, 0.0), (30, 20, 1.7), (50, 9, 3.4), (44, 26, 5.1)]
    for f in range(n):
        im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        px = im.load()
        shift = f * (w // n)
        for (sx, sy, length) in streaks:
            for i in range(length):
                x = (sx + shift + i) % w
                curve = round(1.4 * math.sin((i + sx) / 4.0))
                u = i / (length - 1)
                a = int(150 * math.sin(math.pi * u) ** 0.8)
                if a > 20:
                    plot(px, w, h, x, sy + curve, (205, 240, 250, a))
                    if i % 5 == 2:
                        plot(px, w, h, x, sy + curve + 1, (160, 210, 230, a // 2))
        for (bx, by, phase) in bubbles:
            t = 2 * math.pi * f / n + phase
            x = (bx + shift // 2 + round(1.5 * math.sin(t))) % w
            y = by - round((f % n) * 0.5)
            size = 1 + (1 if math.sin(t) > 0.2 else 0)
            for dy in range(size):
                for dx in range(size):
                    plot(px, w, h, x + dx, y + dy, (230, 248, 255, 200))
            plot(px, w, h, x, y, (255, 255, 255, 230))
        frames.append(im)
    return frames


# ---------------------------------------------------------------- a small swarm of bees, like the fireflies
def bee_swarm():
    w = h = 32
    n = 8
    bees = [(9, 11, 0.0), (21, 9, 1.9), (15, 21, 3.7), (25, 22, 5.3)]
    yellow = (250, 205, 45, 255)
    dark = (45, 32, 20, 255)
    wing = (226, 240, 250, 215)
    frames = []
    for f in range(n):
        im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        px = im.load()
        for (x0, y0, phase) in bees:
            t = 2 * math.pi * f / n + phase
            x = x0 + round(2.2 * math.sin(t) + 0.8 * math.sin(2 * t))
            y = y0 + round(1.6 * math.cos(t * 1.3))
            up = f % 2 == 0
            wy = y - 1 if up else y
            # wings (buzz: up on even frames, level on odd ones)
            plot(px, w, h, x, wy, wing)
            plot(px, w, h, x + 2, wy, wing)
            if up:
                plot(px, w, h, x + 1, y - 1, wing)
            # body: head, a yellow band, a dark stripe, the stinger
            plot(px, w, h, x - 1, y + 1, dark)
            plot(px, w, h, x, y + 1, yellow)
            plot(px, w, h, x + 1, y + 1, dark)
            plot(px, w, h, x + 2, y + 1, yellow)
            plot(px, w, h, x + 3, y + 1, dark)
            plot(px, w, h, x, y + 2, dark)
            plot(px, w, h, x + 1, y + 2, yellow)
            plot(px, w, h, x + 2, y + 2, dark)
        frames.append(im)
    return frames


# ---------------------------------------------------------------- a small, simple bat that flutters around
def bat_small():
    """A tiny silhouette bat (about 13x7 px, no detail) that flaps and circles in a 32x32 frame (2026-11-18, Kilian:
    smaller, fluttering around, less detail). Replaces the detailed PixelLab bat."""
    w = h = 32
    n = 8
    edge = (38, 28, 48, 255)
    skin = (72, 56, 88, 255)
    frames = []
    # each wing, left side only: for x = 1..5 steps from the body, the rows (top, bottom) it covers; the right wing mirrors it
    wings = {
        "up": [(0, 2), (-1, 1), (-2, 0), (-3, -1), (-4, -2)],
        "mid": [(1, 3), (1, 3), (1, 3), (1, 2), (2, 2)],
        "down": [(1, 3), (2, 4), (3, 5), (4, 6), (5, 6)],
    }
    cycle = ["up", "mid", "down", "mid", "up", "mid", "down", "mid"]
    for f in range(n):
        im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
        px = im.load()
        t = 2 * math.pi * f / n
        cx = 16 + round(8 * math.sin(t))
        cy = 15 + round(5 * math.sin(2 * t))
        for sign in (-1, 1):
            for step, (top, bottom) in enumerate(wings[cycle[f]], start=1):
                for y in range(top, bottom + 1):
                    color = edge if (y == top or y == bottom) else skin
                    plot(px, w, h, cx + sign * step, cy + y, color)
        # body (3 x 3) with two ears
        for dy in range(3):
            for dx in (-1, 0, 1):
                plot(px, w, h, cx + dx, cy + 1 + dy, edge)
        plot(px, w, h, cx - 1, cy, edge)
        plot(px, w, h, cx + 1, cy, edge)
        plot(px, w, h, cx, cy + 2, (170, 60, 70, 255))  # one tiny reddish dot for the face
        frames.append(im)
    return frames


def main():
    ff = fireflies()
    fh = save("fish-shadow-horizontal", fish_horizontal())
    fv = save("fish-shadow-vertical", fish_vertical(fh))
    rc = save("river-current", river_current())
    bs = save("bee-swarm", bee_swarm())
    if "--bat" in sys.argv:
        bat = bat_small()
        folder = os.path.join(ROOT, "..", "animals", "bat")
        for i in range(9):
            q = os.path.join(folder, f"{i}.png")
            if os.path.exists(q):
                os.remove(q)
        for i, frame in enumerate(bat):
            frame.save(os.path.join(folder, f"{i}.png"))
        print("small bat written", len(bat))
    if "--sheet" in sys.argv:
        out = sys.argv[sys.argv.index("--sheet") + 1]
        scale = 6
        sets = [ff, fh, fv, rc, bs]
        W = max(sum(f.width for f in s) for s in sets) * scale + 20
        H = sum(s[0].height for s in sets) * scale + 60
        sheet = Image.new("RGBA", (W, H), (60, 120, 150, 255))
        y = 10
        for s in sets:
            x = 10
            for frame in s:
                sheet.alpha_composite(frame.resize((frame.width * scale, frame.height * scale), Image.NEAREST), (x, y))
                x += frame.width * scale
            y += s[0].height * scale + 10
        sheet.save(out)
    print("fireflies", ff[0].size, "fish h", fh[0].size, "fish v", fv[0].size, "current", rc[0].size)


if __name__ == "__main__":
    main()
