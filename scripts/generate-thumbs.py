#!/usr/bin/env python3
"""
Generate thumbnail images for tarot cards.
Thumbnails are 300px wide (maintaining aspect ratio), JPEG quality 72.

Usage:
    python scripts/generate-thumbs.py              # all styles
    python scripts/generate-thumbs.py classical    # specific style
"""

import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Please install Pillow: pip install Pillow")
    sys.exit(1)

CARDS_DIR = Path(__file__).parent.parent / "public" / "cards"
THUMB_WIDTH = 300
QUALITY = 72


def generate_thumbs(style: str | None = None):
    style_dirs = [CARDS_DIR / style] if style else [
        d for d in CARDS_DIR.iterdir() if d.is_dir() and d.name != "__pycache__"
    ]

    for style_dir in style_dirs:
        if not style_dir.exists():
            print(f"Style directory not found: {style_dir}")
            continue

        thumbs_dir = style_dir / "thumbs"
        thumbs_dir.mkdir(exist_ok=True)

        total = skipped = generated = errors = 0
        imgs = list(style_dir.glob("*.jpg"))
        total = len(imgs)

        for img_path in sorted(imgs):
            thumb_path = thumbs_dir / img_path.name

            if thumb_path.exists():
                skipped += 1
                continue

            try:
                with Image.open(img_path) as img:
                    w, h = img.size
                    new_h = int(h * THUMB_WIDTH / w)
                    thumb = img.resize((THUMB_WIDTH, new_h), Image.LANCZOS)
                    thumb.save(thumb_path, "JPEG", quality=QUALITY, optimize=True)

                    orig_kb = img_path.stat().st_size // 1024
                    thumb_kb = thumb_path.stat().st_size // 1024
                    pct = int(thumb_kb / orig_kb * 100) if orig_kb else 0
                    print(f"  ✓ {img_path.name}: {orig_kb}KB → {thumb_kb}KB ({pct}%)")
                    generated += 1
            except Exception as e:
                print(f"  ✗ {img_path.name}: {e}")
                errors += 1

        print(f"\n[{style_dir.name}] {total} images | {generated} generated | {skipped} skipped | {errors} errors")
        if generated:
            orig_total = sum(p.stat().st_size for p in imgs) // 1024
            thumb_total = sum(p.stat().st_size for p in thumbs_dir.glob("*.jpg")) // 1024
            print(f"  Total size: {orig_total}KB → {thumb_total}KB (saved {orig_total - thumb_total}KB)\n")


if __name__ == "__main__":
    style_arg = sys.argv[1] if len(sys.argv) > 1 else None
    generate_thumbs(style_arg)
