# Read Aloud — Free TTS for LLM Project Outputs

Listen to your Claude/ChatGPT/LLM project outputs instead of reading them. Uses Microsoft's free neural text-to-speech voices via [edge-tts](https://github.com/rany2/edge-tts). No API key, no account, no cost.

**What it does:** Takes any Markdown file, strips the formatting, and reads it aloud with a natural-sounding voice. Streaming starts within seconds — no waiting for the full file to generate.

## Quick Start (5 minutes)

### 1. Install dependencies

```bash
pip install edge-tts
```

You also need `ffplay` (part of ffmpeg) for streaming playback:
- **Windows:** `winget install ffmpeg`
- **Mac:** `brew install ffmpeg`
- **Linux:** `sudo apt install ffmpeg`

### 2. Download the script

Download `read-aloud.py` from this folder, or clone the full repo.

### 3. Run it

```bash
python read-aloud.py "path/to/your/file.md"
```

That's it. Audio starts in a few seconds.

## Usage

```bash
# Stream aloud (default)
python read-aloud.py "file.md"

# Save as MP3
python read-aloud.py "file.md" --save

# Save to specific path
python read-aloud.py "file.md" --save -o "output.mp3"

# Speed up (useful for review listening)
python read-aloud.py "file.md" --rate "+25%"

# Change voice
python read-aloud.py "file.md" --voice en-US-EmmaNeural

# List all available English voices
python read-aloud.py --list-voices
```

### Recommended voices

| Voice | Gender | Accent |
|-------|--------|--------|
| `en-US-AndrewNeural` | Male | American (default) |
| `en-US-EmmaNeural` | Female | American |
| `en-US-BrianNeural` | Male | American |
| `en-GB-RyanNeural` | Male | British |
| `en-GB-SoniaNeural` | Female | British |

Run `--list-voices` for the full list — 200+ voices across 50+ languages.

## Mobile Listening

The script runs on your desktop. To listen on your phone:

1. Save as MP3: `python read-aloud.py "file.md" --save`
2. Save it somewhere that syncs to your phone (OneDrive, Google Drive, Dropbox, iCloud)
3. Open the MP3 from your cloud storage app on iOS/Android

**Tip for Claude Code users:** If you use Claude Code remotely from your phone, you can ask Claude to generate the MP3 for you:

> Run the read-aloud script on [file] and save the MP3 to my cloud storage folder.

The MP3 appears on your phone within a minute via cloud sync.

## Getting Better Audio from LLM Outputs

Standard LLM outputs (tables, bullet lists, abbreviations, URLs) don't sound great when read aloud. For important or long documents, ask your LLM to produce a TTS-friendly version first:

> Write a TTS-friendly version of this output. That means: replace tables with prose summaries, convert bullet lists into flowing sentences, spell out abbreviations on first use, remove URLs and metadata headers, and add spoken transitions between sections (e.g., "Moving on to..." or "The next area is..."). Save it as [filename]-tts.md.

Then run the script on the TTS-friendly version.

### What changes

| Normal LLM output | TTS-friendly |
|---|---|
| Markdown table | "The first option is X, which costs Y." |
| Bullet list | "There are three key points. First..." |
| `CFO`, `ROI` | "Chief Financial Officer", spelled out |
| `[source](https://...)` | Omitted or "according to [source name]" |
| `## Section 3` | "Moving on to section three." |

For short or simple outputs, skip this step — the script's built-in markdown stripping handles most cases fine.

## How It Works

1. Reads the Markdown file
2. Strips formatting (headings, bold, links, tables, code blocks, etc.) to produce clean text
3. Sends the text to Microsoft Edge's neural TTS service (free, no API key needed)
4. Streams audio chunks to `ffplay` for near-instant playback — or saves to MP3

The script uses [edge-tts](https://github.com/rany2/edge-tts), which accesses the same text-to-speech engine that powers Microsoft Edge's "Read Aloud" feature. The voices are neural (natural-sounding), not robotic.

## Why Not Paid Tools?

Speechify ($139/yr), NaturalReader ($119/yr), and similar tools offer polished mobile apps and premium voices. But for "review listening" — consuming LLM outputs while multitasking — Microsoft's free neural voices are more than adequate. The evaluation that led to this tool is documented in `guide.md`.

## Requirements

- Python 3.7+
- `edge-tts` (`pip install edge-tts`)
- `ffplay` for streaming playback (part of ffmpeg) — without it, the script falls back to generate-then-play mode (slower start)
- Internet connection (the TTS service is cloud-based)

## Limitations

- **Requires internet** — the TTS conversion happens via Microsoft's servers
- **Unofficial API** — edge-tts uses Microsoft Edge's TTS service. Widely used and actively maintained, but could theoretically be blocked
- **English-optimized** — works with 50+ languages, but the markdown stripping and TTS-friendly prompts are designed for English
- **No pause/resume in streaming mode** — use `--save` and open the MP3 in any player if you want playback controls
