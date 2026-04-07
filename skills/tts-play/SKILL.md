---
name: tts-play
description: Read any MD file aloud on desktop using edge-tts. Starts streaming within seconds. This is a simple tool command — do NOT run the session-start checklist or create a project plan.
---

# Read Aloud (Desktop)

**This is a utility command, not a project.** Skip the session-start checklist. Skip project setup. Just execute the steps below.

## Step 1: Ask for the file

Always ask: **"Which file do you want me to read aloud? Paste the path or describe which file."**

If the user provided a file path as an argument to the command (e.g., `/tts-play path/to/file.md`), use that path directly and skip asking.

## Step 2: Run the command

```bash
python "{YOUR_PATH}/tools/read-aloud/read-aloud.py" "<file-path>"
```

This streams audio to mpv which starts playing within seconds while the file is still being generated. The user gets full playback controls.

Tell the user: "Playing in mpv — space=pause, left/right=seek, [/]=slower/faster, q=quit."

## Options (apply if user requests)

- Speed up: add `--rate "+25%"`
- Change voice: add `--voice en-US-EmmaNeural`
- No UI (background): add `--headless`
- TTS-friendly version first: invoke `/tts-convert` on the file before reading

## Requirements

- Desktop must be active (audio plays on the desktop machine)
- `edge-tts` and `mpv` must be installed on this machine
