<!-- qa-skip -->
---
name: image-utils
description: Download, resize, convert, and optimize images. Use when building artifacts that need real photos, resizing images for API limits, converting formats, or preparing images for web/HTML embedding.
---

# Image Utilities

**This is a utility, not a project.** Skip the session-start checklist. Skip project setup. Just execute.

## Prerequisites (verified on this machine)

- Python `Pillow` (PIL): installed
- `curl`: available via Bash
- `httpx`: installed (Python)

## Common patterns

### Download an image from the web
```bash
curl -L -o "output.jpg" "https://example.com/image.jpg"
```

For multiple images:
```bash
urls=("https://example.com/1.jpg" "https://example.com/2.jpg" "https://example.com/3.jpg")
for i in "${!urls[@]}"; do
  curl -L -o "image-$((i+1)).jpg" "${urls[$i]}"
done
```

### Download from NASA Image Library (public domain)
```bash
# Search: https://images.nasa.gov/search?q=X-15
# Direct download pattern:
curl -L -o "x15-flight.jpg" "https://images-assets.nasa.gov/image/ECN-2131/ECN-2131~large.jpg"
```

### Download from Wikimedia Commons
```bash
# Find the direct file URL on the file page, then:
curl -L -o "output.jpg" "https://upload.wikimedia.org/wikipedia/commons/X/XX/Filename.jpg"
```

### Resize images (Pillow)
```python
from PIL import Image
import os

def resize_image(input_path, output_path=None, max_dim=2048, quality=85):
    """Resize image so longest side is max_dim pixels."""
    if output_path is None:
        base, ext = os.path.splitext(input_path)
        output_path = f"{base}-resized{ext}"
    
    img = Image.open(input_path)
    w, h = img.size
    if max(w, h) > max_dim:
        ratio = max_dim / max(w, h)
        img = img.resize((int(w * ratio), int(h * ratio)), Image.LANCZOS)
    
    img.save(output_path, quality=quality)
    new_size = os.path.getsize(output_path) / (1024 * 1024)
    print(f"{input_path}: {w}x{h} -> {img.size[0]}x{img.size[1]} ({new_size:.1f}MB)")
    return output_path
```

**Common resize targets:**
- Claude API limit: max 5MB per image → use `max_dim=2048, quality=85`
- Web/HTML embedding: `max_dim=1200, quality=80`
- Thumbnail: `max_dim=400, quality=75`

### Batch resize all images in a folder
```python
from PIL import Image
from pathlib import Path

def batch_resize(folder, max_dim=2048, quality=85):
    exts = {'.jpg', '.jpeg', '.png', '.webp', '.bmp'}
    for f in Path(folder).iterdir():
        if f.suffix.lower() in exts:
            resize_image(str(f), max_dim=max_dim, quality=quality)
```

### Convert format
```python
from PIL import Image

# PNG to JPEG
img = Image.open("input.png").convert("RGB")
img.save("output.jpg", "JPEG", quality=85)

# JPEG to WebP (smaller file size)
img = Image.open("input.jpg")
img.save("output.webp", "WebP", quality=80)

# Any format to PNG (lossless)
img = Image.open("input.jpg")
img.save("output.png", "PNG")
```

### Base64 encode for HTML embedding
```python
import base64
from pathlib import Path

def image_to_base64(image_path):
    """Return base64 data URI for embedding in HTML <img src='...'> tags."""
    data = Path(image_path).read_bytes()
    ext = Path(image_path).suffix.lower()
    mime = {'jpg': 'jpeg', 'jpeg': 'jpeg', 'png': 'png', 'webp': 'webp', 'gif': 'gif'}
    mime_type = mime.get(ext.lstrip('.'), 'jpeg')
    b64 = base64.b64encode(data).decode()
    return f"data:image/{mime_type};base64,{b64}"

# Usage in HTML:
# <img src="{image_to_base64('photo.jpg')}" alt="description">
```

### Optimize image for web (reduce file size)
```python
from PIL import Image

def optimize_for_web(input_path, output_path=None, max_width=1200, target_kb=200):
    """Reduce image to target file size for web use."""
    if output_path is None:
        base, ext = os.path.splitext(input_path)
        output_path = f"{base}-web{ext}"
    
    img = Image.open(input_path)
    # Resize if wider than max_width
    if img.width > max_width:
        ratio = max_width / img.width
        img = img.resize((max_width, int(img.height * ratio)), Image.LANCZOS)
    
    # Binary search for quality that hits target size
    for quality in range(85, 20, -5):
        img.save(output_path, quality=quality)
        if os.path.getsize(output_path) / 1024 <= target_kb:
            break
    
    print(f"Optimized: {os.path.getsize(output_path)/1024:.0f}KB at quality={quality}")
    return output_path
```

### Get image dimensions and metadata
```python
from PIL import Image

img = Image.open("photo.jpg")
print(f"Size: {img.size[0]}x{img.size[1]}")
print(f"Format: {img.format}")
print(f"Mode: {img.mode}")  # RGB, RGBA, L (grayscale), etc.
```

## Copyright-safe image sources

| Source | License | Best for |
|---|---|---|
| NASA Image Library (images.nasa.gov) | Public domain | Space, aviation, Earth science |
| Wikimedia Commons | Varies (check each) | General reference |
| Unsplash | Free commercial use | High-quality photos |
| Pexels | Free commercial use | Stock photography |
| User's own photos | No restriction | Personal projects |

**For child artifacts:** prefer NASA (public domain) + user photos. Always verify license before embedding in distributed content. For personal use (like the child's learning artifacts), fair use applies more broadly.

## When to use this vs. other approaches

- **Need real photos for an artifact** → download via curl, resize with Pillow, embed as base64 or local file reference
- **User sends images that are too large** → resize with Pillow (Claude API limit is 5MB)
- **Building HTML that needs images** → download + base64 encode for self-contained single-file artifacts
- **Need to verify visual output** → use `/browser-automation` skill instead (Playwright screenshots)
