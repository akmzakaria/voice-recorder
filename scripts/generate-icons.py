#!/usr/bin/env python3
"""
Generates all voice recorder app icons using Pillow.
Microphone design on a blue (#208AEF) background.
"""

import math
from PIL import Image, ImageDraw, ImageFilter

BLUE = (32, 138, 239)       # #208AEF
LIGHT_BLUE = (230, 244, 254) # #E6F4FE  (android background)
WHITE = (255, 255, 255)
TRANSPARENT = (0, 0, 0, 0)

def draw_mic(draw, cx, cy, size, color=WHITE, bg_color=None):
    """
    Draw a microphone centered at (cx, cy).
    size controls the overall scale.
    """
    # --- Mic capsule (rounded rectangle) ---
    cap_w = size * 0.28
    cap_h = size * 0.42
    cap_r = cap_w / 2   # fully rounded sides
    cap_top = cy - size * 0.30
    cap_bot = cap_top + cap_h
    cap_left = cx - cap_w / 2
    cap_right = cx + cap_w / 2

    # draw capsule as a rounded rectangle
    draw.rounded_rectangle(
        [cap_left, cap_top, cap_right, cap_bot],
        radius=cap_r,
        fill=color
    )

    # --- Arc (stand) ---
    arc_r = size * 0.26
    arc_top = cy - arc_r
    arc_bot = cy + arc_r
    arc_left = cx - arc_r
    arc_right = cx + arc_r
    arc_width = max(2, int(size * 0.045))

    # Draw arc from 0° to 180° (bottom half = stand curve)
    draw.arc(
        [arc_left, arc_top, arc_right, arc_bot],
        start=0, end=180,
        fill=color,
        width=arc_width
    )

    # --- Vertical stem ---
    stem_top = cy + arc_r - arc_width // 2
    stem_bot = cy + size * 0.38
    stem_x = cx
    stem_w = arc_width
    draw.rectangle(
        [stem_x - stem_w // 2, stem_top, stem_x + stem_w // 2, stem_bot],
        fill=color
    )

    # --- Base horizontal line ---
    base_half = size * 0.18
    base_y = stem_bot
    draw.rectangle(
        [stem_x - base_half, base_y - arc_width // 2,
         stem_x + base_half, base_y + arc_width // 2],
        fill=color
    )


def make_app_icon(size):
    """Main app icon: blue background + white mic, rounded square."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Rounded square background
    corner_r = int(size * 0.22)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=corner_r, fill=BLUE)

    # Subtle radial glow in center
    glow_size = int(size * 0.7)
    glow = Image.new("RGBA", (glow_size, glow_size), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([0, 0, glow_size - 1, glow_size - 1], fill=(255, 255, 255, 30))
    glow = glow.filter(ImageFilter.GaussianBlur(glow_size * 0.25))
    img.paste(glow, ((size - glow_size) // 2, (size - glow_size) // 2), glow)

    draw_mic(draw, size // 2, size // 2, size * 0.72)
    return img


def make_foreground_icon(size):
    """Android adaptive icon foreground: transparent bg + white mic (shows on blue bg)."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw_mic(draw, size // 2, size // 2, size * 0.55, color=WHITE)
    return img


def make_background_icon(size):
    """Android adaptive icon background: solid app blue to match the icon."""
    img = Image.new("RGBA", (size, size), (*BLUE, 255))
    return img


def make_monochrome_icon(size):
    """Android monochrome: transparent bg + white mic."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw_mic(draw, size // 2, size // 2, size * 0.60, color=WHITE)
    return img


def make_splash_icon(size):
    """Splash screen icon: transparent bg + white mic, large enough to be visible."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw_mic(draw, size // 2, size // 2, size * 0.80, color=WHITE)
    return img


def make_favicon(size):
    """Web favicon: blue bg + white mic."""
    img = Image.new("RGBA", (size, size), BLUE)
    draw = ImageDraw.Draw(img)
    draw_mic(draw, size // 2, size // 2, size * 0.72, color=WHITE)
    return img


BASE = "/home/akm-zakaria/Desktop/VS Code/Projects/React Native/voice-recorder/assets/images"

tasks = [
    (make_app_icon,        1024, f"{BASE}/icon.png"),
    (make_foreground_icon, 1024, f"{BASE}/android-icon-foreground.png"),
    (make_background_icon, 1024, f"{BASE}/android-icon-background.png"),
    (make_monochrome_icon, 1024, f"{BASE}/android-icon-monochrome.png"),
    (make_splash_icon,     512,  f"{BASE}/splash-icon.png"),
    (make_favicon,         64,   f"{BASE}/favicon.png"),
]

for fn, sz, path in tasks:
    img = fn(sz)
    img.save(path)
    print(f"✓ {path}  ({sz}x{sz})")

print("\nAll icons generated successfully.")
