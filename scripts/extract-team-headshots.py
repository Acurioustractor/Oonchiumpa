#!/usr/bin/env python3
"""
Extract individual headshots from the Oonchiumpa team group photo.

Workflow:
1. Detect faces in the group photo
2. Crop a square around each face with padding
3. Use rembg to remove the background
4. Output to public/images/team/{slug}.png as 400x400 circular-ready transparent PNGs

Usage:
    python3 scripts/extract-team-headshots.py

Requires:
    pip3 install rembg opencv-python pillow
"""

import os
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
APP_ROOT = REPO_ROOT / "oonchiumpa-app"
INPUT_IMAGE = APP_ROOT / "public" / "images" / "team" / "group-2024.jpg"
OUTPUT_DIR = APP_ROOT / "public" / "images" / "team"

# Order: back row L→R (8), then front row L→R (3)
# Edit these with real names once you've identified each person.
TEAM_ORDER = [
    # Back row (standing), left to right
    "back-1",
    "back-2",
    "back-3",
    "back-4",
    "back-5",
    "back-6",
    "back-7",
    "back-8",
    # Front row (seated), left to right
    "front-1",
    "front-2",
    "front-3",
]

OUTPUT_SIZE = 400  # Square crop size
PADDING_RATIO = 0.6  # How much of the bounding box is padding around the face


def slugify(name: str) -> str:
    return name.lower().replace(" ", "-").replace(".", "").replace(",", "")


def main():
    try:
        import cv2
        import numpy as np
        from PIL import Image
        from rembg import remove
    except ImportError as e:
        print(f"Missing dependency: {e}")
        print("Install with: pip3 install rembg opencv-python pillow")
        sys.exit(1)

    if not INPUT_IMAGE.exists():
        print(f"❌ Input image not found: {INPUT_IMAGE}")
        print("   Save the group photo to that path and rerun.")
        sys.exit(1)

    print(f"📸 Loading {INPUT_IMAGE}")
    img = cv2.imread(str(INPUT_IMAGE))
    if img is None:
        print("❌ Could not read image")
        sys.exit(1)

    h, w = img.shape[:2]
    print(f"   Image: {w}x{h}")

    # Use OpenCV's built-in face detector
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )
    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=5, minSize=(60, 60)
    )

    if len(faces) == 0:
        print("❌ No faces detected. The photo may need manual coordinates.")
        print("   Edit this script and provide explicit (x, y, w, h) boxes.")
        sys.exit(1)

    print(f"✅ Detected {len(faces)} faces")

    # Sort faces: top-to-bottom first, then left-to-right within each row
    # Rough row split: use y-coordinate median
    faces_sorted = sorted(faces, key=lambda f: f[1])
    y_median = faces_sorted[len(faces_sorted) // 2][1]
    back_row = sorted([f for f in faces if f[1] <= y_median], key=lambda f: f[0])
    front_row = sorted([f for f in faces if f[1] > y_median], key=lambda f: f[0])
    ordered = list(back_row) + list(front_row)

    print(f"   Back row: {len(back_row)}, Front row: {len(front_row)}")

    if len(ordered) != len(TEAM_ORDER):
        print(
            f"⚠️  Face count ({len(ordered)}) != name count ({len(TEAM_ORDER)})"
        )
        print("   Adjust TEAM_ORDER in this script or the detection params.")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    for i, (x, y, fw, fh) in enumerate(ordered):
        name = TEAM_ORDER[i] if i < len(TEAM_ORDER) else f"person-{i+1}"
        slug = slugify(name)

        # Expand bounding box with padding
        pad_x = int(fw * PADDING_RATIO)
        pad_y_top = int(fh * PADDING_RATIO * 0.8)
        pad_y_bottom = int(fh * PADDING_RATIO * 1.4)  # more room for shoulders

        x1 = max(0, x - pad_x)
        y1 = max(0, y - pad_y_top)
        x2 = min(w, x + fw + pad_x)
        y2 = min(h, y + fh + pad_y_bottom)

        # Make it square (take the larger dimension)
        box_w = x2 - x1
        box_h = y2 - y1
        if box_w > box_h:
            diff = box_w - box_h
            y2 = min(h, y2 + diff)
            y1 = max(0, y1 - diff // 2)
        else:
            diff = box_h - box_w
            x1 = max(0, x1 - diff // 2)
            x2 = min(w, x2 + diff // 2)

        crop = img[y1:y2, x1:x2]
        crop_resized = cv2.resize(
            crop, (OUTPUT_SIZE, OUTPUT_SIZE), interpolation=cv2.INTER_AREA
        )

        # Convert BGR→RGB for PIL
        crop_rgb = cv2.cvtColor(crop_resized, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(crop_rgb)

        # Remove background with rembg
        out_img = remove(pil_img)

        output_path = OUTPUT_DIR / f"{slug}.png"
        out_img.save(output_path, "PNG")
        print(f"   ✅ {output_path.name}")

    print(f"\n🎉 Done. {len(ordered)} headshots saved to {OUTPUT_DIR}")
    print("\nNext steps:")
    print("  1. Review the headshots, rename files with real names")
    print("  2. Update src/data/team.ts to reference /images/team/<slug>.png")
    print("  3. Or run scripts/upload-team-to-empathy-ledger.ts to sync to EL")


if __name__ == "__main__":
    main()
