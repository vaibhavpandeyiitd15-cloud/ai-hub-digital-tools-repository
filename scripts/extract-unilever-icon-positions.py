"""
Extract icon centre positions, rotation, and scale from the master Unilever logo
by multi-scale template-matching each icon PNG against the U mark.

Run: python scripts/extract-unilever-icon-positions.py
"""
from __future__ import annotations

import json
from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
MASTER_PATH = ROOT / "public/assets/unilever-logo.png"
ICONS_DIR = ROOT / "public/logo-icons"
OUT_JSON = ROOT / "src/lib/content/unilever-logo-icons.generated.json"
OUT_U_PNG = ROOT / "public/assets/unilever-logo-u.png"
OUT_U_WHITE_PNG = ROOT / "public/assets/unilever-logo-u-white.png"
VIEWBOX = 493
ICON_BASE_SIZE = 52

ID_ALIASES = {
    "cycle": "virtuous_cycle",
    "virtuous_cycle": "virtuous_cycle",
}

TEMPLATE_SCALES = [0.07, 0.09, 0.11, 0.13, 0.15, 0.17, 0.19, 0.21, 0.24, 0.27]
ANGLE_STEP = 3


def icon_mask(icon_bgr: np.ndarray) -> np.ndarray:
    if icon_bgr.shape[2] == 4:
        b, g, r, a = cv2.split(icon_bgr)
        blue = (b.astype(np.float32) > 80) & (b > g + 10) & (b > r + 10)
        alpha = a > 20
        mask = (blue & alpha).astype(np.uint8) * 255
    else:
        b, g, r = cv2.split(icon_bgr)
        mask = ((b > 80) & (b > g + 10) & (b > r + 10)).astype(np.uint8) * 255
    return mask


def rotate_mask(mask: np.ndarray, angle: float) -> np.ndarray:
    h, w = mask.shape
    center = (w / 2, h / 2)
    m = cv2.getRotationMatrix2D(center, angle, 1.0)
    cos, sin = abs(m[0, 0]), abs(m[0, 1])
    nw = int(h * sin + w * cos)
    nh = int(h * cos + w * sin)
    m[0, 2] += nw / 2 - center[0]
    m[1, 2] += nh / 2 - center[1]
    return cv2.warpAffine(mask, m, (nw, nh), flags=cv2.INTER_LINEAR, borderValue=0)


def crop_u_mark(master: np.ndarray) -> np.ndarray:
    h, _w = master.shape[:2]
    top = master[0 : int(h * 0.68), :, :]
    gray = cv2.cvtColor(top, cv2.COLOR_BGR2GRAY)
    _, white = cv2.threshold(gray, 210, 255, cv2.THRESH_BINARY)
    coords = cv2.findNonZero(white)
    if coords is None:
        raise RuntimeError("Could not detect logo bounds in master image")
    x, y, bw, bh = cv2.boundingRect(coords)
    return top[y : y + bh, x : x + bw]


def build_search_mask(u_crop: np.ndarray) -> np.ndarray:
    gray = cv2.cvtColor(u_crop, cv2.COLOR_BGR2GRAY)
    _, mask = cv2.threshold(gray, 210, 255, cv2.THRESH_BINARY)
    return mask


def match_icon(search: np.ndarray, icon_mask_img: np.ndarray) -> dict | None:
    best: dict | None = None
    angles = range(-55, 56, ANGLE_STEP)

    for scale in TEMPLATE_SCALES:
        resized = cv2.resize(
            icon_mask_img,
            None,
            fx=scale,
            fy=scale,
            interpolation=cv2.INTER_AREA,
        )
        if max(resized.shape) < 6:
            continue

        for angle in angles:
            tmpl = rotate_mask(resized, angle)
            th, tw = tmpl.shape
            if th >= search.shape[0] - 2 or tw >= search.shape[1] - 2:
                continue
            if th < 6 or tw < 6:
                continue

            result = cv2.matchTemplate(search, tmpl, cv2.TM_CCOEFF_NORMED)
            _, max_val, _, max_loc = cv2.minMaxLoc(result)
            if best is None or max_val > best["score"]:
                cx = max_loc[0] + tw / 2
                cy = max_loc[1] + th / 2
                best = {
                    "score": float(max_val),
                    "x": float(cx),
                    "y": float(cy),
                    "rotation": float(angle),
                    "width": float(tw),
                    "height": float(th),
                    "top_left": (int(max_loc[0]), int(max_loc[1])),
                    "template_shape": (th, tw),
                    "templateScale": float(scale),
                }
    return best


def mask_out_region(search: np.ndarray, top_left: tuple[int, int], shape: tuple[int, int]) -> None:
    th, tw = shape
    x0, y0 = top_left
    x1 = min(search.shape[1], x0 + tw)
    y1 = min(search.shape[0], y0 + th)
    pad = 4
    y0 = max(0, y0 - pad)
    x0 = max(0, x0 - pad)
    search[y0:y1 + pad, x0:x1 + pad] = 0


def save_master_u_white(u_crop: np.ndarray, out_path: Path) -> None:
    gray = cv2.cvtColor(u_crop, cv2.COLOR_BGR2GRAY)
    _, mask = cv2.threshold(gray, 210, 255, cv2.THRESH_BINARY)
    rgba = np.zeros((*mask.shape, 4), dtype=np.uint8)
    rgba[mask == 255] = (255, 255, 255, 255)
    cv2.imwrite(str(out_path), rgba)


def main() -> None:
    master = cv2.imread(str(MASTER_PATH), cv2.IMREAD_COLOR)
    if master is None:
        raise FileNotFoundError(f"Master logo not found: {MASTER_PATH}")

    u_crop = crop_u_mark(master)
    cv2.imwrite(str(OUT_U_PNG), u_crop)
    save_master_u_white(u_crop, OUT_U_WHITE_PNG)

    search = build_search_mask(u_crop)
    search_work = search.copy()

    scale_uniform = min(VIEWBOX / u_crop.shape[1], VIEWBOX / u_crop.shape[0])
    offset_x = (VIEWBOX - u_crop.shape[1] * scale_uniform) / 2
    offset_y = (VIEWBOX - u_crop.shape[0] * scale_uniform) / 2

    icon_files = sorted(ICONS_DIR.glob("*.png"))
    stems_seen: set[str] = set()
    filtered: list[Path] = []
    for path in icon_files:
        canon = ID_ALIASES.get(path.stem, path.stem)
        if canon in stems_seen:
            continue
        if path.stem == "cycle" and (ICONS_DIR / "virtuous_cycle.png").exists():
            continue
        stems_seen.add(canon)
        filtered.append(path)

    sized: list[tuple[int, Path]] = []
    for path in filtered:
        icon = cv2.imread(str(path), cv2.IMREAD_UNCHANGED)
        if icon is None:
            continue
        mask = icon_mask(icon)
        sized.append((int(np.count_nonzero(mask)), path))
    sized.sort(reverse=True, key=lambda t: t[0])

    results: list[dict] = []
    warnings: list[str] = []

    for _, path in sized:
        icon = cv2.imread(str(path), cv2.IMREAD_UNCHANGED)
        if icon is None:
            continue
        mask = icon_mask(icon)
        match = match_icon(search_work, mask)
        canon_id = ID_ALIASES.get(path.stem, path.stem)

        if match is None or match["score"] < 0.4:
            warnings.append(f"{canon_id}: weak match (score={match['score'] if match else 'none'})")
            if match is None:
                continue

        final_x = match["x"] * scale_uniform + offset_x
        final_y = match["y"] * scale_uniform + offset_y
        matched_w_viewbox = match["width"] * scale_uniform
        final_scale = matched_w_viewbox / ICON_BASE_SIZE

        results.append(
            {
                "id": canon_id,
                "src": f"/logo-icons/{path.name}",
                "label": canon_id.replace("_", " ").title(),
                "finalX": round(final_x, 2),
                "finalY": round(final_y, 2),
                "finalRotation": round(match["rotation"], 2),
                "finalScale": round(final_scale, 4),
                "matchScore": round(match["score"], 4),
            }
        )
        mask_out_region(search_work, match["top_left"], match["template_shape"])

    if not results:
        raise RuntimeError("No icons matched — check master logo and icon assets")

    for w in warnings:
        print(f"WARNING: {w}")

    xs = [r["finalX"] for r in results]
    ys = [r["finalY"] for r in results]
    scales = [r["finalScale"] for r in results]
    half = (ICON_BASE_SIZE / 2) * max(scales)
    cluster = {
        "x": round(min(xs) - half, 2),
        "y": round(min(ys) - half, 2),
        "width": round(max(xs) - min(xs) + half * 2, 2),
        "height": round(max(ys) - min(ys) + half * 2, 2),
    }

    payload = {
        "viewBox": VIEWBOX,
        "extractionMethod": "multi-scale template-match vs public/assets/unilever-logo.png (U crop)",
        "clusterBounds": cluster,
        "masterUCrop": "/assets/unilever-logo-u-white.png",
        "icons": sorted(results, key=lambda r: r["id"]),
    }

    OUT_JSON.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    print(json.dumps(payload, indent=2))


if __name__ == "__main__":
    main()
