<!-- qa-skip -->
---
name: content-patterns
description: Synthesize patterns in the actual subject matter discussed across sessions — recurring themes, emerging theses, tensions, cross-project insights. Produces synthesis memos, not QA digests. This is a simple tool command — do NOT run the session-start checklist or create a project plan.
---

# Content Patterns Skill

Identify patterns in the **substance of your work** across sessions — ideas that keep recurring, frameworks that are evolving, tensions that remain unresolved, insights that transfer across projects.

This skill answers: **"What are we learning about the subject matter itself?"**

This is NOT for system/behavior patterns (rule failures, tool gaps, process issues). Use `/session-patterns` for that.

---

## Execution discipline

- **Do not narrate your reasoning.** Work silently, then present the synthesis.
- **Run searches in parallel** where possible.
- **Budget: at most 10 tool calls before writing.** Synthesize with what you have.
- **The output is a synthesis memo, not a QA digest.** Write it as a consultant would — governing thoughts, supporting evidence, implications.

---

## Step 1: Scope the synthesis

Ask the user:

1. **Which topic or project family?** (e.g., "parenting and education," "operating system design," "client strategy," "positioning and marketing")
2. **Breadth or depth?** Breadth = scan across many sessions for themes. Depth = deep-dive into fewer sessions for nuance.
3. **Which sessions or time window?** The user may nominate specific sessions, or say "last month" or "everything on topic X."
4. **What would be most useful?** A topic map? Emerging theses? Unresolved questions? Cross-project connections? Let the user shape the output.

Do not skip this step. The user's intent determines what you search for and how you synthesize.

## Step 2: Build the sample

**Sample by topic relevance, not by friction or failure.**

System-patterns samples sessions where rules were exercised. Content-patterns samples the **most substantive sessions on the topic** — regardless of whether the system behaved well or poorly during them.

To find sessions:
```bash
# Search for topic-relevant sessions
qmd search "the topic keywords" -n 10

# List recent sessions to identify by date/size
ls -lt "{KNOWLEDGE_BASE}/sessions/C--Users-fresh-OneDrive-Dokumenter-AI-assisted/" | head -20
```

Also check project folders — plans, deliverables, and research outputs often contain synthesized thinking that transcripts don't:
```bash
ls "{YOUR_PATH}/projects/personal/{topic-folder}/"
ls "{YOUR_PATH}/projects/work/{topic-folder}/"
```

**Sample size:** 5-10 sessions or sources. Stop when new sources stop adding new themes.

## Step 3: Read for substance

For each source, extract:
- **Key ideas and claims** — what positions were taken?
- **Frameworks used or proposed** — what mental models are being applied?
- **Tensions and tradeoffs** — where did reasoning pull in different directions?
- **Questions raised but not resolved** — what's still open?
- **Evolution** — how did thinking on this topic change across sessions?

Do NOT extract system-behavior observations (rule skipping, tool failures, process issues). Stay on topic.

## Step 4: Synthesize across sources

Look for these pattern types:

### 1. Recurring themes
Topics or concerns that keep resurfacing across sessions. "Every parenting session comes back to balancing structure with autonomy."

### 2. Emerging theses / convictions
Ideas that are becoming stronger over time. "The evidence increasingly suggests X."

### 3. Persistent open questions
Issues repeatedly raised but not resolved. "We keep asking about Y but haven't settled it."

### 4. Tensions and tradeoffs
Recurring internal conflicts in the content. "We want both A and B but they pull against each other."

### 5. Cross-project transfers
An insight from one domain that helps another. "The validation-gate principle from the OS project applies to how we evaluate parenting approaches."

### 6. Framework drift / evolution
How thinking on a topic has changed over time. "In March we believed X, by April we've shifted toward Y because of Z."

### 7. Gaps / missing angles
Important dimensions repeatedly left underexplored. "We discuss methods but never measurement."

### 8. Candidate codifications
Content that now deserves a durable artifact — a memo, template, framework document, or topic map.

## Step 5: Write the synthesis

Write to the relevant project folder (not the staging folder — this is project content, not system QA):
```
{project-folder}/content-synthesis-{date}.md
```

Or if cross-project, write to a shared location the user specifies.

Format as a **synthesis memo**:

```markdown
---
date: {date}
topic: {topic or project family}
sessions_analyzed: {count}
---

# Content Synthesis: {topic}

## Governing insight
{1-2 sentences: the single most important thing that emerges from looking across these sessions}

## Recurring themes
{Each with evidence from specific sessions}

## Emerging theses
{Ideas gaining strength — with the evidence trail}

## Open questions
{Unresolved issues worth tracking}

## Tensions
{Where the content pulls in different directions}

## Cross-project connections
{Insights that transfer between domains}

## What's missing
{Angles or dimensions underexplored}

## Suggested next moves
{What to read, research, discuss, or codify based on these patterns}
```

## Step 6: Present and discuss

Present the synthesis with the governing insight first (pyramid principle). Then walk through the themes, theses, and tensions. End with suggested next moves.

For each suggested move, the user decides — write a framework document, research a gap, revisit an assumption, or note and move on.

---

## What this skill does NOT do

- Does not analyze system behavior, rule adherence, or tool gaps — that's `/session-patterns`
- Does not auto-apply changes — the user decides what to act on
- Does not run automatically
- Does not produce QA-style output — produces synthesis memos
