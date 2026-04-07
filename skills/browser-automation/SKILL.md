<!-- qa-skip -->
---
name: browser-automation
description: Automate browser tasks using Playwright — read authenticated web content, fill forms, extract data, navigate multi-page content, take screenshots. Use when CLI tools and WebFetch can't access what the user needs.
---

# Browser Automation via Playwright

**This is a capability, not a project.** Skip the session-start checklist. Skip project setup. Use this when you need to interact with websites that require authentication, JavaScript rendering, or multi-step navigation.

## When to use this

Use Playwright browser automation when:
- **Authenticated content**: the user is logged into a site and you need to access it with their session (e-books, dashboards, account settings)
- **Form filling**: sign up for a service, configure settings, retrieve API keys
- **Multi-page extraction**: navigate through paginated content (e-book readers, search results, documentation)
- **JavaScript-rendered content**: pages that don't return useful content via WebFetch/curl because they rely on JS rendering
- **Visual verification**: screenshot a page or artifact to verify how it renders
- **Any task where the user would otherwise do manual browser steps**

Do NOT use Playwright when simpler tools work: WebFetch for public pages, curl for APIs, Agent Reach CLI for supported platforms (Twitter, Reddit, YouTube, etc.).

## Prerequisites (verified on this machine)

- Python `playwright` package: **installed** (v1.58.0)
- Chrome: **installed** at `C:\Program Files\Google\Chrome\Application\chrome.exe`
- Chrome user profile: `{HOME}\AppData\Local\Google\Chrome\User Data`

## The Chrome profile copy pattern

**Critical:** Playwright cannot use Chrome's default profile directory directly while Chrome is running. You MUST copy the profile to a temp location first.

### Step 1: Ask user to close Chrome
```
"I need to use Playwright with your Chrome profile to access [site]. Please close Chrome completely (all windows, check system tray). I'll copy your profile to a temp location so your cookies and login sessions are preserved."
```

### Step 2: Copy profile to temp
```bash
mkdir -p "{HOME}/AppData/Local/Temp/chrome-playwright/Default"
robocopy "{HOME}\AppData\Local\Google\Chrome\User Data\Default" "{HOME}\AppData\Local\Temp\chrome-playwright\Default" /E /NFL /NDL /NJH /XD "Service Worker" "Cache" "Code Cache" "GPUCache" "ShaderCache" "GrShaderCache" /XF "*.log" "LOCK" "TransportSecurity"
robocopy "{HOME}\AppData\Local\Google\Chrome\User Data" "{HOME}\AppData\Local\Temp\chrome-playwright" "Local State" /NFL /NDL /NJH
```

### Step 3: Launch Playwright with copied profile
```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    context = p.chromium.launch_persistent_context(
        user_data_dir="{HOME}/AppData/Local/Temp/chrome-playwright",
        headless=False,  # Visible so user can see what's happening
        channel="chrome",
        viewport={"width": 1200, "height": 900},
        args=["--disable-blink-features=AutomationControlled"]
    )
    page = context.pages[0] if context.pages else context.new_page()
    
    # Now you have a browser with the user's cookies and sessions
    page.goto("https://example.com", wait_until="networkidle")
    
    # ... do work ...
    
    context.close()
```

### Step 4: Clean up temp profile (optional)
```bash
rm -rf "{HOME}/AppData/Local/Temp/chrome-playwright"
```

## Common patterns

### Extract text from a page
```python
text = page.inner_text("body")  # All visible text
# Or target specific elements:
text = page.inner_text(".article-content")
text = page.inner_text("#main-content")
```

### Extract text from an iframe
```python
frame = page.frame_locator("iframe").first
text = frame.locator("body").inner_text()
```

### Navigate multi-page content (e-book readers, paginated results)
```python
pages_content = []
for i in range(max_pages):
    text = page.inner_text(".content-area")
    pages_content.append(text)
    # Try next-page button or arrow key
    try:
        page.click("[aria-label='Next']", timeout=2000)
    except:
        page.keyboard.press("ArrowRight")
    page.wait_for_timeout(2000)  # Wait for page transition
```

### Fill a form
```python
page.fill("#email", "user@example.com")
page.fill("#password", "the-password")
page.click("button[type='submit']")
page.wait_for_load_state("networkidle")
```

### Take a screenshot (for visual QA)
```python
page.screenshot(path="screenshot.png", full_page=True)
```

### Download a file
```python
with page.expect_download() as download_info:
    page.click("a.download-link")
download = download_info.value
download.save_as("/path/to/save/file.pdf")
```

## Gotchas learned from experience

1. **Chrome must be fully closed** before launching Playwright with the profile copy. Check system tray.
2. **The robocopy step is essential** — Playwright can't use Chrome's default `User Data` directory directly (gives "non-default data directory" error).
3. **Page navigation varies by site** — e-book readers use different DOM structures. Try multiple selectors, check for iframes, and use `page.evaluate()` for complex JS extraction.
4. **Duplicate detection** — when extracting multi-page content, track content hashes to detect when navigation stops advancing.
5. **headless=False** is preferred — lets the user see what's happening and intervene if needed. Only use headless=True for background tasks like screenshots.
6. **Sensitive operations** — if accessing accounts, financial services, or personal data, flag to the user before proceeding. Same principle as computer use.

## When NOT to use this

- Public pages → use WebFetch or `curl https://r.jina.ai/URL`
- Twitter → use twitter-cli (Agent Reach)
- Reddit → use rdt-cli (Agent Reach)
- YouTube transcripts → use yt-dlp (Agent Reach)
- GitHub → use gh CLI
- Simple API calls → use curl/httpx in Python
