<!-- qa-skip -->
---
name: session-patterns
description: Find cross-session patterns in operating-system behavior, process adherence, tool/skill gaps, and user corrections. Proposes codification actions. This is a simple tool command — do NOT run the session-start checklist or create a project plan.
---

# System Patterns Skill

Identify cross-session patterns in how the operating system behaves — rule adherence, process failures, tool gaps, user corrections, validated techniques. The output answers: **"What should change in how we work with the model?"**

This skill is for **system/behavior patterns only**. For patterns in the actual subject matter of your work (recurring themes, emerging theses, strategic insights), use `/content-patterns` instead.

---

## Execution discipline

- **Do not narrate your reasoning.** Work silently through the steps, then present findings. The user sees the digest, not the journey.
- **Run searches in parallel** (multiple Bash calls in one message) where possible.
- **Budget: at most 10 tool calls before writing the digest.** If you're doing more, you're over-exploring. Write with what you have.
- **On Windows, qmd may produce fork errors** (`cygheap read copy failed`) under parallel load. If a search fails, retry it individually.

---

## Step 1: Determine variation

Check the staging folder:
```bash
ls -lt "{KNOWLEDGE_BASE}/staging/session-learnings/" 2>/dev/null | wc -l
```

### Variation A — Guided Bootstrap Review
**Use when:** fewer than 10 solid reflection files, OR user wants a targeted review of specific sessions.

### Variation B — Codification Digest
**Use when:** 10+ reflection files exist covering multiple session types, AND reflection quality has been validated.

Default to Variation A until the reflection corpus is mature. Do not auto-fall-back to keyword searching raw sessions.

---

## Variation A — Guided Bootstrap Review

**Core principle: the sample is chosen deliberately, not discovered by keywords.**

### A.1: Ask the user for sampling intent

Before any searching, ask:
- Which time window? (last week, last month, specific dates)
- Which session types matter most? (builds, research, client work, personal, orchestrated)
- Which 2-5 sessions felt especially good, bad, or important?

The user's selection is higher signal than any search can produce.

### A.2: Build the sample (6-10 sessions, bounded)

1. **User-nominated sessions** — find them via qmd search or file listing
2. **Stratified top-up** for diversity if the user's list is narrow:
   - build / infrastructure sessions
   - research / analytical sessions
   - client / delivery sessions
   - personal / system-usage sessions
   - orchestrated vs single-strand

To find sessions for top-up:
```bash
# List recent sessions by date/size
ls -lt "{KNOWLEDGE_BASE}/sessions/C--Users-fresh-OneDrive-Dokumenter-AI-assisted/" | head -30

# Search for a specific session
qmd search "the topic" -n 3
```

Search is for **locating** specific sessions, not for choosing the sample.

### A.3: Read each sampled session

For each session in the sample:
- **If a reflection exists** in `staging/session-learnings/` — use it (higher quality, pre-categorized)
- **If no reflection exists** — read the transcript opening + key decision points + outcome. Do a lightweight mini-reflection against the 6 system categories (rule effectiveness, skill gaps, tool gaps, process failures, user preferences, cross-project workflow transfers)

### A.4: Build cross-session matrix and identify patterns

Catalog findings by category across all sampled sessions. Look for:
- **Recurring failures** — same process failure across sessions
- **Validated techniques** — approaches that worked repeatedly
- **Emerging preferences** — user corrections pointing the same direction
- **Tool/skill gaps** — same missing capability resurfacing
- **Cross-project transfers** — techniques from one project useful in another
- **Rule decay** — rules consistently skipped or producing false positives

**Both success and failure patterns.** A biased analysis that only finds problems is incomplete.

### A.5: Write the digest

Write to `{KNOWLEDGE_BASE}\staging\patterns-digest-{YYYY-MM-DD}.md`:

```markdown
---
date: {date}
variation: A (Guided Bootstrap Review)
sessions_analyzed: {count}
patterns_found: {count}
---

# System Patterns Digest — {date}

## Sample declaration
- Sessions included: {list with topics and dates}
- Why these: {user-nominated / stratified top-up / both}
- Session types underrepresented: {what's missing from the sample}

## Established patterns (3+ sessions, cross-bucket recurrence)
{For each: what, which sessions, evidence quality, proposed action}

## Emerging patterns (2 sessions)
{Same format, flagged for watching}

## What this sample likely missed
{Blind spots from the sample composition}

## Proposed actions
{Numbered, tagged: OS rule / skill / tool / hook / memory / working procedure}
{Priority: high / medium / low}
```

### A.6: Confidence standard

- **3+ appearances in a mixed sample** = candidate pattern
- **Cross-bucket recurrence** (same pattern in build AND research sessions) matters more than simple count
- Raw-session-derived findings tagged lower confidence than reflection-derived ones

---

## Variation B — Codification Digest

**Core principle: reflections are the primary dataset. Raw sessions are drill-down evidence only.**

### B.1: Load reflections

Read all reflection files from the chosen window (default: last 2-4 weeks or last 10-20 reflections).

### B.2: Build pattern matrix

Across the 6 system categories, count:
- Repeated failures
- Repeated successes
- Repeated user corrections/preferences
- Repeated cross-project transfers

### B.3: Identify top patterns

Focus on the patterns worth action. Drill into raw sessions via qmd **only** for the top 2-4 patterns if evidence needs clarification.

### B.4: Write the digest

```markdown
---
date: {date}
variation: B (Codification Digest)
reflections_analyzed: {count}
window: {date range}
---

# System Patterns Digest — {date}

## Established patterns (3+ reflected recurrences)
{For each: frequency, session spread, category, confidence, recommended target}

## Emerging patterns
{Same format}

## Codify now
{Patterns strong enough to act on immediately}

## Watch
{Patterns to monitor for recurrence}

## No-action observations
{Noted but not actionable yet}
```

### B.5: Confidence standard

- **3+ reflected recurrences** = pattern
- **5+ reflected recurrences or cross-window persistence** = established pattern
- Raw-session drill-down can strengthen or weaken confidence but is not the main counting base

---

## What this skill does NOT do

- Does not auto-apply changes — all actions require user approval
- Does not replace `/session-reflect` — this skill analyzes reflections, it doesn't create them
- Does not auto-fall-back to keyword searching when reflections are sparse — uses Variation A (user-guided) instead
- Does not analyze content/topic patterns — that's `/content-patterns`
- Does not run automatically (that's Phase D automation)
