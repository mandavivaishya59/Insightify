import requests
from PIL import Image, ImageOps, ImageDraw, ImageFont
import io
import base64

def fetch_image_bytes(url, timeout=10):
    r = requests.get(url, timeout=timeout)
    r.raise_for_status()
    return r.content

def compose_dashboard_from_urls(urls:list, template="grid", title=None):
    imgs = []
    for u in urls:
        try:
            b = fetch_image_bytes(u)
            im = Image.open(io.BytesIO(b)).convert("RGBA")
            imgs.append(im)
        except Exception as e:
            print(f"Failed to fetch chart image from {u}: {e}")
            continue

    if not imgs:
        # No images fetched successfully, return a placeholder
        dashboard = Image.new("RGBA", (800, 400), (255,255,255,255))
        draw = ImageDraw.Draw(dashboard)
        try:
            font = ImageFont.truetype("arial.ttf", 24)
        except:
            font = ImageFont.load_default()
        draw.text((20, 180), "No charts available", fill=(0,0,0), font=font)
        buf = io.BytesIO()
        dashboard.convert("RGB").save(buf, format="PNG")
        buf.seek(0)
        return buf

    # simple 2-column grid
    cols = 2
    max_w = max(im.width for im in imgs)
    max_h = max(im.height for im in imgs)
    rows = (len(imgs) + cols - 1) // cols
    header_h = 80 if title else 20
    # Increase resolution for better label readability
    scale_factor = 2  # Double the resolution
    out_w = cols * max_w * scale_factor
    out_h = (rows * max_h + header_h) * scale_factor
    dashboard = Image.new("RGBA", (out_w, out_h), (255,255,255,255))
    if title:
        draw = ImageDraw.Draw(dashboard)
        try:
            font = ImageFont.truetype("arial.ttf", 28)
        except:
            font = ImageFont.load_default()
        draw.text((20,10), title, fill=(0,0,0), font=font)
    y_offset = header_h
    for idx, im in enumerate(imgs):
        x = (idx % cols)*max_w
        y = y_offset + (idx // cols)*max_h
        thumb = ImageOps.contain(im, (max_w, max_h))
        tx = x + (max_w - thumb.width)//2
        ty = y + (max_h - thumb.height)//2
        dashboard.paste(thumb, (tx, ty), thumb)
    buf = io.BytesIO()
    dashboard.convert("RGB").save(buf, format="PNG")
    buf.seek(0)
    return buf  # file-like
