---
name: tts-convert
description: Convert any MD output to a TTS-friendly version optimized for listening. This is a simple tool command — do NOT run the session-start checklist or create a project plan.
---

# TTS-Friendly Conversion

**This is a utility command, not a project.** Skip the session-start checklist. Skip project setup. Just execute the steps below.

## Step 1: Ask for the file

Always ask: **"Which file do you want me to convert for TTS? Paste the path or describe which file."**

If the user provided a file path as an argument (e.g., `/tts-convert path/to/file.md`), use that path directly and skip asking.

## Step 2: Read the file and convert

Apply these transformations:

1. **Tables** → Prose summaries ("The first option is X, which costs Y. Note that Z.")
2. **Bullet lists** → Flowing sentences ("There are three key points. First... Second... Third...")
3. **Abbreviations** → Spelled out on first use ("Chief Financial Officer" not "CFO")
4. **URLs and markdown links** → Omit URLs; keep link text as inline references
5. **Metadata headers** → Remove (status, date, worker, frontmatter)
6. **Section headings** → Spoken transitions ("Moving on to risk assessment.")
7. **Code blocks** → Omit entirely, or summarize in one sentence
8. **Horizontal rules** → Paragraph break
9. **Bold/italic** → Keep the words, drop the markers

Preserve all substantive content, arguments, logical flow, and key data points.

## Step 3: Save

Save as `[original-filename]-tts.md` in the same directory as the source file. Tell the user the path.
