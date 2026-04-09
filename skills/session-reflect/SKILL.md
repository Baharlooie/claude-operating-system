<!-- qa-skip -->
---
name: session-reflect
description: Extract structured learnings from a completed session using the 6-category framework. User invokes after a session to identify what worked, what didn't, and what should be codified. This is a simple tool command — do NOT run the session-start checklist or create a project plan.
---

# Session Reflection Skill

Extract structured learnings from a completed Claude Code session. This is the manual learning loop — the user invokes it when they want to reflect on a session's outcomes.

**When to use:** After completing a substantive session (project work, OS changes, debugging, orchestrated research). Not needed for trivial sessions (quick lookups, single-file edits).

---

## Step 1: Identify the session to reflect on

Ask the user which session to reflect on. Options:
- **Most recent completed session** (default) — search qmd for the most recent session transcript
- **Specific session** — user provides a session ID, topic, or date
- **Current session** — reflect on the session in progress (useful at natural breakpoints)

To find the session, use qmd search. **Two methods — use whichever is available:**

**Method A (MCP):** If qmd MCP tools are available (check deferred tools for `mcp__qmd__query`):
```
Use the mcp__qmd__query tool with searches: [{"type": "lex", "query": "the topic"}]
```

**Method B (Bash fallback):** If qmd MCP is not available, use Bash:
```bash
qmd search "the topic or keywords" -n 5
```

**Important:** Do NOT use `-c sessions` — the collection is registered by its full path, not a short name. Omitting `-c` searches all collections, which works fine.

Always try Method A first. If the qmd MCP tools aren't in your tool list, use Method B without hesitation — don't tell the user "qmd isn't available." The CLI works.

**Finding the right session:** Session transcripts are stored at `{KNOWLEDGE_BASE}\sessions\`. If qmd search returns a very large multi-topic session, check whether the build session you want has its own separate transcript. You can also list recent sessions directly:
```bash
ls -lt "{KNOWLEDGE_BASE}/sessions/C--Users-fresh-OneDrive-Dokumenter-AI-assisted/" | head -20
```
Look for sessions by date and size. If the session hasn't been captured yet (still active or recently ended), run auto-capture first:
```bash
python "{KNOWLEDGE_BASE}/auto-capture.py"
```

## Step 2: Read the session transcript

Retrieve the session transcript via qmd (MCP `get` tool or `qmd get <path>` via Bash). For long sessions, focus on:
- The opening (what was the goal?)
- Key decision points (where did the approach change?)
- User corrections or redirections
- The outcome (what was delivered?)

**Important:** Session transcripts are a lossy representation — assistant responses are truncated at 3,000 chars and tool results are dropped. You can see *what* tools were called (via `[Tool: name]` markers) but not their output. The user/assistant dialogue preserves reasoning, corrections, and decisions. When the transcript doesn't show enough detail for a finding, note that explicitly rather than guessing.

## Step 3: Apply the 6-category extraction framework

For each category, look for specific signals in the transcript. Rate each finding as CLEAR (directly visible in transcript), INFERRED (reasonable inference from visible signals), or UNCERTAIN (limited signal, needs user confirmation).

### Category 1: OS Rule Effectiveness (strong signal)
**Look for:** Rules that were skipped, rules that produced false positives, rules whose enforcement was too weak or too strong, rules that were followed and clearly helped.
**Signals:** Hook warnings/blocks in the transcript, user mentioning a rule, model explicitly following or deviating from a procedure.
**Output:** For each finding: which rule, what happened, proposed change (strengthen/weaken/reword/remove).

### Category 2: Skill Gaps (moderate signal)
**Look for:** Moments where the model lacked capability the user expected, where the user had to explain how to do something the model should know.
**Signals:** User explanations of procedures, model asking basic questions about the domain, multiple failed attempts before finding the right approach.
**Output:** For each gap: what capability was missing, proposed skill or skill update.

### Category 3: Tool Gaps (moderate signal)
**Look for:** Roadblocks that a tool or integration could have solved, tools the user introduced, manual steps that could be automated.
**Signals:** User saying "can you access X?" or "try using Y", manual workarounds for missing integrations, switching to another platform because Claude Code couldn't do something.
**Output:** For each gap: what tool would help, whether it exists (MCP server, CLI tool, plugin).

### Category 4: Process Failures (uncertain signal — transcript lossyness limits detection)
**Look for:** Violations of plan-first discipline, verify-before-assert, evidence-based QA, service-mindedness. Cases where the model delivered untested code or skipped the startup sequence.
**Signals:** Hook block messages, user corrections about process, model acknowledging it skipped a step. **Note:** Many process failures are visible only in tool call details (which are truncated). If you can't confirm a failure from the transcript, mark it UNCERTAIN.
**Output:** For each failure: what process was violated, what the impact was, proposed fix.

### Category 5: User Preferences (strong signal)
**Look for:** Style corrections, approach preferences, behavioral feedback. Moments where the user said "don't do X" or "yes, keep doing that."
**Signals:** Direct user statements about preferences, pushback on model behavior, approval of non-obvious choices.
**Output:** For each preference: what the user said, whether it's already captured in memory/CLAUDE.md, proposed memory entry if not.

### Category 6: Cross-Project Insights (strong signal)
**Look for:** Techniques, patterns, or discoveries that apply beyond the current project. Approaches that worked well and could be reused. Domain knowledge that has general value.
**Signals:** "This worked well" moments, approaches explicitly noted as transferable, discoveries about tools or systems that apply broadly.
**Output:** For each insight: what was learned, where it applies, proposed codification (OS rule, skill, working procedure, memory).

## Step 4: Write findings

Write the structured findings to:
```
{KNOWLEDGE_BASE}\staging\session-learnings\{session-id}.md
```

Use this format:

```markdown
---
session: {session-id or topic}
date: {date}
project: {project name}
confidence: {overall confidence: high/medium/low}
---

# Session Reflection: {topic}

## Summary
{1-2 sentence summary of the session and its outcome}

## Findings

### Category 1: OS Rule Effectiveness
{findings or "No findings in this category"}

### Category 2: Skill Gaps
{findings or "No findings in this category"}

### Category 3: Tool Gaps
{findings or "No findings in this category"}

### Category 4: Process Failures
{findings or "No findings in this category — note: transcript lossyness limits detection"}

### Category 5: User Preferences
{findings or "No findings in this category"}

### Category 6: Cross-Project Insights
{findings or "No findings in this category"}

## Proposed Actions
{Numbered list of concrete actions, each tagged with target: OS rule / skill / tool / memory / working procedure}
```

## Step 5: Present and discuss

Present findings to the user organized by confidence level:
1. **CLEAR findings** — directly visible in the transcript
2. **INFERRED findings** — reasonable inferences, ask user to confirm
3. **UNCERTAIN findings** — limited signal, present as questions

For each proposed action, ask: "Should I codify this? If yes, where?" The user decides — this skill extracts and proposes, it does not auto-apply.

---

## What this skill does NOT do

- Does not auto-apply changes to the OS, skills, or memory
- Does not run on every session automatically (that's Phase D automation)
- Does not compensate for transcript lossyness by guessing — when signal is weak, it says so
- Does not replace the session-end wrap-up in CLAUDE.md (which captures learnings within the same session) — this skill reviews sessions *after the fact*, potentially finding patterns the in-session wrap-up missed
