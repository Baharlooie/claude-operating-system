---
name: tts-save
description: Convert any MD file to MP3 and save it for mobile listening. This is a simple tool command — do NOT run the session-start checklist or create a project plan.
---

# Save as MP3

**This is a utility command, not a project.** Skip the session-start checklist. Skip project setup. Just execute the steps below.

## Step 1: Ask for the file

Always ask: **"Which file do you want me to convert to MP3? Paste the path or describe which file."**

If the user provided a file path as an argument (e.g., `/tts-save path/to/file.md`), use that path directly and skip asking.

## Step 2: Run the command

```bash
python "{YOUR_PATH}/tools/read-aloud/read-aloud.py" "<file-path>" --save
```

**Default save location:** Same directory as the source file (using `--save` without `-o`). The MP3 is named after the source file (e.g., `report.md` → `report.mp3`).

## Step 3: Confirm

Tell the user: "Saved to [path]."

## Options (apply if user requests)

- Speed up: add `--rate "+25%"`
- Change voice: add `--voice en-US-EmmaNeural`
- Custom output path: add `-o "/path/to/output.mp3"`
- TTS-friendly version first: if the file is long or complex, ask "This file has tables/complex formatting. Want me to create a TTS-friendly version first?" If yes, invoke `/tts-convert` first, then save the converted version.
