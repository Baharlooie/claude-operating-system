# Claude Operating System

**Make Claude a more rigorous and honest problem-solver that produces work that meets your quality bar — without you having to ask for it every time.**

Created by Nima Baharlooie

---

## What is "an operating system"?

Think of them as "meta instructions" contained in a set of files that sit on your computer. Claude reads them at the start of every session, and they influence Claude to behave in a way that makes sure your tasks get off to a better start, stay on track and finish strong. It also helps sharpen your own thinking by "forcing" you to "structure the problem" up front and being mindful of and "anticipating" Claude's "biases and failure modes" thereby giving Claude better prerequisites for helping you.

## Why is it relevant?

Claude Opus 4.6 is a powerful model — fast, articulate and confident. But at least currently, it benefits from a bit of "scaffolding / harnessing", if you're working on things where being correct matters more than being quick.

This is because LLMs have predictable behavioral patterns that undermine quality work. They're not bugs — they're just how the models are built and a part of their "probabilistic nature". E.g. 

1. Speed over quality: Prioritizes giving you a fast, complete answer over making sure it's the right answer to the right question. 
2. Overconfident: Doesn't flag uncertainty, and isn't transparent about the assumptions its conclusions rest on 
3. Little up front problem structuring: Immediately starts solving without first checking what you're actually optimizing for and what would drive a good answer

And while they are not entirely avoidable, they are partly controllable with the right "operating system". The approach is grounded in what Anthropic calls **context engineering** (see [Anthropic's guide to effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)) — the principle that the infrastructure around the model matters as much as the model itself.

The system has been tested against Claude Opus 4.6 out of the box using 49 automated behavioral tests across 20 categories and has produced better results than the out-of-the-box model (although not dramatically better — Opus 4.6 out of the box is decent). The real value is that you as a user get attuned to how to prevent the classic "Claude biases and failure modes".

### Who is this for?

Professionals who use Claude for work where **being "right" and quality of output matters more than being fast**. Or anyone who has had the classic "you're absolutely right, I just made that up" experience with Claude too many times.

It's not for software development (though it runs on Claude Code infrastructure) - there are many operating systems out there that are tailored to software development. It's also not for quick factual questions — for those, just use Chat or tell Claude to ignore the operating system.

### What you get that you don't already have

Out of the box, Claude is optimized for helpfulness and fluency — which works against analytical rigor. This operating system addresses that and adds capabilities Claude doesn't have by default:

**Aligns before solving.** Instead of diving straight into a recommendation, Claude helps you solve the right question, in the right way. E.g. first checks what you're actually optimizing for and whether the problem is framed correctly. 

**Push-back when needed.** Claude challenges your framing when it sees a better path, rather than agreeably executing a suboptimal approach. You get a collaborator, not a yes-machine.

**Uncertainty is flagged, not hidden.** Distinguishes between verified facts, inferences, and speculation — and tells you which is which, rather than presenting everything with equal confidence.

**Project structure.** Claude automatically creates project folders, plans, and a working record — so nothing gets lost between sessions and you don't start from scratch each time. All files sync to your local drive, giving you one source of truth across both Cowork and Code.

**You don't need to write the perfect prompt.** Claude drafts a project plan with you before starting — clarifying the objective, assumptions, source strategy, and what "good and done" looks like. The plan is both the strategic anchor for execution and the living record of the project.

**Structured context that persists.** Beyond Claude's built-in memory, a file-based profile captures your professional background, working preferences, and project history in a format Claude reads systematically — not a flat list of things it vaguely remembers.

**Long sessions stay on track.** Built-in checkpoints prevent the quality decay that happens in longer conversations. Claude periodically re-anchors to the plan and flags when it's drifting.

**Structured QA before delivery.** Claude checks how what it has delivered compares to the plan and whatever quality criteria you have formulated — before presenting it to you.

**Multi-agent orchestration.** For complex work with separable parallel tracks, Claude Code can decompose the work into parallel worker agents, each with a formal contract, quality checks, and gap detection. An orchestrator manages the execution and synthesizes results. This isn't available out of the box.

**Automatic enforcement via hooks (Claude Code).** 6 hooks run during Claude Code sessions — mechanically enforcing behaviors that text-based rules can't guarantee. Including: blocking execution until a plan is confirmed, reminding to assess source authority before any web search, agent contract checks before dispatches, periodic checkpoint reminders, and QA checks on deliverables. These work alongside the behavioral rules, not instead of them.

## The system comes with tradeoffs

It makes the process of going from prompt to answer slower and burns a few more tokens, because of more up-front problem structuring (are we solving the right thing and in the right way), more verification, more assumption checks etc. A task that Opus 4.6 out of the box handles in one exchange might take several. BUT the tradeoff is deliberate: **quality over speed.** When you don't want that tradeoff, just tell Claude to skip the operating system entirely for that task.

---

## Getting started

### What you need

- A Claude account with a paid plan (Pro, Max, Team, or Enterprise)
- A way to run Claude Code locally — either the Claude Desktop app, the VS Code extension, or the CLI in a terminal. Any of these work. The Desktop app is optional but gives you access to Cowork in addition to Code.
- Node.js installed (optional — needed for the automatic enforcement hooks in Claude Code; the system works fully without hooks, they just add mechanical enforcement on top. Check with `node --version` — if you have Claude Code working, you almost certainly have this already)
- 10–15 minutes for initial setup
- This repository's files (download the ZIP or clone the repo)

### Setup — one step

1. **Download the files.** Click "Code" → "Download ZIP" on this repository. Extract to a folder you'll keep — for example, `Documents/claude-operating-system/`.

2. **Run the setup prompt.** Open a new Claude session (Cowork or Code), select that folder, and paste the contents of `setup-prompt.md` into the chat. Claude walks you through a brief interview (who you are, what work you do, how you prefer to communicate), creates your personal profile, and configures the system.

That's it. The setup prompt handles everything — path configuration, file placement, verification.

### Will this break anything?

No. The operating system is just files in a folder. Claude reads them — that's all that happens. There are no plugins to install, no system modifications, no code to run.

**To remove it:** Delete the files and clear your CLAUDE.md. Back to Claude out of the box in seconds. An uninstall prompt is included that does this for you — paste the contents of `uninstall-prompt.md` and Claude will clean up.

### How CLAUDE.md and Global Instructions work

The operating system needs one pointer so Claude knows to read the files. Where that pointer lives depends on how you use Claude:

**If you use the Claude Desktop app (Cowork and/or Code):**
- **CLAUDE.md** is placed at `~/.claude/CLAUDE.md`. Both Cowork and Code in the Desktop app read this file automatically.
- **Global Instructions** (Settings → Cowork → Global Instructions) should also point to the session-start checklist. This is Cowork's own pointer mechanism. The setup prompt configures both.

**If you use Claude Code only (VS Code extension or terminal CLI):**
- **CLAUDE.md** at `~/.claude/CLAUDE.md` is all you need. No Global Instructions to set because you're not using the Cowork interface.

The setup prompt detects your environment and configures the right things. You don't need to figure this out manually.

### Verify it works

After setup, start a **new** session (not the one you ran setup in) and ask: *"What do you know about me?"*

Claude should read the checklist, load your profile, and respond with a summary of who you are, your work context, and how it plans to work with you. If it does, the system is active.

---

## How it works — technical details

For a detailed explanation of the architecture, behavioral rules, structural triggers, the plan, multi-agent orchestration, recommended settings, and folder structure, see **[how-it-works.md](how-it-works.md)**.

---

## Acknowledgments

This system was built on ideas and patterns from several people and projects:

- [**Anthropic**](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — the context engineering guide that articulates the core principle: the infrastructure around the model matters as much as the model itself
- [**affaan-m/everything-claude-code**](https://github.com/affaan-m/everything-claude-code) — hook-based automation patterns, strategic compaction, continuous learning architecture
- [**msitarzewski/agency-agents (The Agency)**](https://github.com/msitarzewski/agency-agents) — the "override the tendency to..." behavioral formulation, and the insight that agent personality is structural, not cosmetic
- [**Obie Fernandez**](https://obie.medium.com/building-a-personal-cto-operating-system-with-claude-code-b3fb9c4933c7) — the "Personal CTO Operating System" concept that showed what a file-based behavioral layer can do
- [**Hamel Husain**](https://hamel.dev/blog/posts/evals-skills/) — evaluation methodology and the principle of infrastructure over model capability
- [**VoltAgent/awesome-codex-subagents**](https://github.com/VoltAgent/awesome-codex-subagents) — context isolation and multi-agent patterns
- **Rohit** — ["The Harness Is Everything"](https://x.com/) synthesis of harness engineering practices across SWE-agent, Anthropic, and OpenAI
- [**ACE (ICLR 2026)**](https://blog.softmaxdata.com/the-biggest-lesson-from-ace-iclr-2026-the-power-of-agentic-engineering/) — delta updates preserve institutional knowledge; complete rewrites cause context collapse
- [**Chroma Research**](https://research.trychroma.com/context-rot) — context rot research showing compressed context can outperform uncompressed

---

*Created by Nima Baharlooie*

*Licensed under MIT License*
