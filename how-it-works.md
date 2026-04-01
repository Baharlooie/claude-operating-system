# How it works — technical details

### Architecture overview

The system has two layers that load at different times:

**Layer 1: Behavioral rules (CLAUDE.md) — loaded every turn.** CLAUDE.md contains ~35 behavioral rules organized by priority: getting the substance right, project process discipline, maintaining focus and memory, communication quality, and tool behavior. These rules reload into Claude's context on every single turn, so they survive context compaction and long sessions. This is the quality management layer.

**Layer 2: Session-start checklist — loaded once per session.** The checklist is a five-phase procedure that runs at the start of every session:

1. **Load user profile** — read your personal-spec.md
2. **Identify the project** — continuation of existing work, or new?
3. **Create the plan** — for new work: define the problem, derive quality drivers, set scope, choose sources, design the approach, confirm with you before executing
4. **Load execution context** — relevant skills, tools, plugins
5. **Execute** — with periodic checkpoints, compaction safeguards, and plan updates throughout

Step 3 is the substantive phase — it may take several exchanges of back-and-forth. Steps 1-2 and 4-5 are quick.

### How the behavioral rules work

Each rule follows a specific pattern: it names the default LLM tendency it counteracts. *"Verify before asserting — override the tendency to state things as fact when uncertain."* This framing is deliberate. Telling Claude "be rigorous" doesn't work reliably. Telling it to override a specific tendency gives it a concrete behavior to watch for and correct.

The highest-impact rules use **structural triggers** — checkpoints that fire at defined moments rather than relying on Claude remembering to apply them:

- **Before any response:** Run a four-point quality gate (right problem? good answer? supported by evidence? complete with next steps?)
- **Before any recommendation:** Identify the 2-3 load-bearing assumptions and either verify them or present the recommendation as contingent
- **Before any research:** Identify what authoritative sources look like for this topic before searching — never use whatever comes up first as the foundation for an analytical framework
- **Before any qualitatively different sub-problem:** Reassess what "good" looks like — don't carry forward quality drivers from a different question

Structural triggers are the system's most reliable mechanism. Rules that say "regularly do X" fail under context decay. Rules that say "before doing Y, always do X" fire consistently because the trigger point is unambiguous.

### The plan

Every piece of work gets a plan. The plan is both a **strategic anchor** (eliminates assumptions, defines quality drivers, provides the reference for judgment during execution) and a **living record** (updated throughout the project with status, decisions, to-dos).

The plan covers 11 sections: problem definition, quality drivers, success criteria, scope, source strategy, approach, assumptions and risks, output specification, engagement pattern, skills/tools, and current status. The project folder and plan.md are created as the first action — not after planning is complete, but at the start. The plan file is then filled incrementally through conversation as Claude asks clarifying questions and you confirm. Execution begins only after you confirm the plan.

This is the single most important behavioral anchor in the system. The plan comes before execution, always.

### Multi-agent orchestration

For work with clearly separable parallel tracks, Claude Code can decompose the work into parallel worker agents, each with a formal contract (scope, quality drivers, source strategy, output format). An orchestrator manages wave-based execution with gap detection, quality checkpoints, and synthesis. The orchestrator must read the full orchestration protocol at `_foundation/orchestration/orchestration-protocol.md` before dispatching any agents — it cannot be improvised from memory.

This is advanced functionality. Single-strand (one conversation, iterative) is the default for most work.

### Recommended model and settings

This operating system assumes you're doing work where quality matters. Use accordingly:

- **Model:** Opus 4.6 (the latest and most capable). The behavioral rules are calibrated for Opus-class reasoning.
- **Context:** 1M tokens (Claude Code default). This gives room for the behavioral rules + your conversation + plan + source material without pressure.
- **Effort:** Extended thinking / maximum effort. The operating system adds verification steps that benefit from deeper reasoning.
- **Interface:** Claude Code (Desktop app, VS Code, or CLI) is ideal due to the 1M context window. Cowork works well for shorter projects but has a smaller context window — fine for most single-session work, not ideal for very long multi-session projects.

### Enhancing with skills

Skills are pre-built instruction sets — available from Anthropic and a growing third-party / open-source marketplace — that give Claude specialized methodology for specific task types (e.g., competitor positioning analysis, financial modeling, legal review). You can browse and install skills through the Claude Desktop app's Customize panel.

Skills work alongside the operating system. The behavioral rules define universal quality standards; skills add task-specific methodology on top. When starting a task, Claude checks whether a relevant skill is available and proposes loading it.

### QA checklist for deliverables

For file-based deliverables (analyses, recommendations, reports, memos), the operating system requires a visible QA Assessment appendix — not just an internal self-check. The QA checklist (`_foundation/qa-checklist.md`) covers 8 dimensions: right problem, assumptions and confidence, source quality, completeness, quality driver alignment, analytical rigor, communication quality, and consistency with the plan. Each dimension has specific checkpoints. The appendix includes structured tables for assumptions (with verification status), sources (with authority assessment and links), and success criteria (checked against the plan).

This makes the model's quality assessment transparent and verifiable. The user can see exactly what assumptions were made, what sources were used, and whether the deliverable matches what was agreed in the plan.

### Hooks — automatic enforcement (Claude Code only)

The operating system includes 6 hooks that run automatically during Claude Code sessions. Hooks complement the text-based behavioral rules by adding mechanical enforcement that doesn't depend on the model remembering instructions.

| Hook | Fires when | What it does |
|---|---|---|
| **Plan gate** | Before Write/Edit/Bash | **Blocks execution** if no `.plan-confirmed` marker exists — enforces plan-before-execution. Allows system maintenance (operations on `_foundation/`, `.claude/`, `_context/`). |
| **Source quality reminder** | Before WebSearch/WebFetch | Reminds to assess source authority before searching |
| **Agent contract check** | Before Agent dispatch | Warns if no contract files exist in orchestration folder |
| **Checkpoint reminder** | After every 25 tool calls | Reminds to check plan alignment and consider compaction |
| **Gap detection reminder** | After Agent completes (formal orchestration only) | Reminds orchestrator to run gap detection — only fires when `orchestration/contracts/` exists |
| **QA appendix check** | After Write | Warns if a deliverable file is missing the QA Assessment appendix |

**Key distinction:** The plan gate is true enforcement — it blocks the tool call entirely until the plan is confirmed. The other hooks are reminders that output context at the exact trigger point — more reliable than text-based rules the model may have stopped attending to.

**Cowork users:** Hooks are Claude Code only. The operating system works fully without them in Cowork — the CLAUDE.md behavioral rules and session-start checklist function identically. Hooks add an enforcement layer for Code users.

### Strategic compaction

In long sessions, context compaction can happen at arbitrary points — losing intermediate reasoning and conversation context. The operating system includes guidance on compacting proactively at logical boundaries (after research phases, between planning and execution, after debugging) rather than waiting for auto-compaction. Before compacting, the model updates plan.md with current status. CLAUDE.md and all files on disk survive compaction; conversation context and intermediate reasoning do not.

### Architecture diagram

```
CLAUDE.md (loaded every turn)
  |-- Behavioral rules (~35 rules, structural triggers)
  |-- Session-start checklist pointer
  |-- End-of-project wrap-up trigger
  |
  v
Session-start checklist (loaded once per session)
  |-- Step 1: Load personal-spec.md
  |-- Step 2: Identify project (continuation vs new)
  |-- Step 3: Create the plan (11 sections) --> .plan-confirmed marker
  |-- Step 4: Load skills and tools
  |-- Step 5: Execute with checkpoints + QA checklist
  |
  v
Project plan.md (per project)
  |-- Strategic anchor (quality drivers, scope, approach)
  |-- Living record (status, decisions, to-dos)

Hooks (Claude Code only — mechanical enforcement):
  |-- PreToolUse: plan gate (blocks execution without plan)
  |-- PreToolUse: source quality reminder (before searches)
  |-- PreToolUse: agent contract check (before dispatch)
  |-- PostToolUse: checkpoint reminder (every 25 calls)
  |-- PostToolUse: gap detection reminder (formal orchestration only)
  |-- PostToolUse: QA appendix check (after file writes)
```

### Folder structure

```
claude-operating-system/
├── _foundation/
│   ├── session-start-checklist.md  ← startup + plan creation procedure
│   ├── personal-spec.md           ← your profile (filled in during setup)
│   ├── qa-checklist.md            ← QA assessment checklist for deliverables
│   ├── handoff-note.md            ← cross-session continuity template
│   ├── hooks/                     ← automatic enforcement scripts (Code only)
│   │   ├── plan-gate.js
│   │   ├── source-check-reminder.js
│   │   ├── agent-contract-check.js
│   │   ├── checkpoint-reminder.js
│   │   ├── gap-detection-reminder.js
│   │   └── qa-appendix-check.js
│   ├── orchestration/             ← multi-agent protocol + reference files
│   └── bootstrap/
│       └── CLAUDE.md              ← behavioral rules (configured during setup)
├── _context/
│   ├── active-projects.md         ← project tracker
│   └── suggestions-for-further-improvement.md
├── projects/
│   ├── work/                      ← work project folders
│   └── personal/                  ← personal project folders
├── setup-prompt.md                ← interactive setup experience
└── uninstall-prompt.md            ← clean removal
```

### Cross-device access

All Claude Code interfaces (Desktop app, VS Code, CLI) share the same session store. Sessions started in any interface are visible from any other.

For phone/browser access: enable Remote Control from VS Code or CLI (`/remote-control`). Your session appears at claude.ai/code and in the Claude mobile app. Your machine does all the work — the remote interface is just a window.

### Known limitations

**Memory degradation in long sessions.** The behavioral rules in CLAUDE.md survive because they reload every turn. But the session-start checklist and personal-spec are read once — their influence weakens over very long sessions. For projects spanning 20+ exchanges, periodically say: *"Re-read the project plan"* or *"Run a checkpoint."*

**Over-application of process.** The operating system defaults to full process for every task. When you don't need it, say "be expedient" or "skip the process." Claude adjusts immediately.

### What the operating system does NOT do

- **Doesn't replace domain expertise.** It improves how Claude processes and presents information, not what it knows.
- **Doesn't prevent all errors.** LLMs are probabilistic. The system makes reliable behavior the default — it doesn't make failures impossible.
- **Doesn't work with Chat.** Chat doesn't load the operating system. This is by design: use Chat for quick questions.
