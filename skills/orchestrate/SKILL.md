---
name: orchestrate
description: Multi-agent orchestration workflow with formal contracts, gap detection, and cross-cutting synthesis. Invoke when dispatching multiple agents for parallel research or work.
---

# Multi-Agent Orchestration Skill

You are now orchestrating — coordinating multiple agents to produce work that no single agent could do alone. This skill loads the full orchestration methodology into your active context. Follow it.

---

## Before dispatching ANY agent

### 1. Verify sources FIRST (sequential, not parallel)

Source identification must complete BEFORE content research dispatches. Do not run source identification in parallel with content research — this is the #1 observed failure mode.

Sequence: identify authoritative sources → verify they're still considered authoritative → use verified source list to guide agent contracts → dispatch.

### 2. Write contracts as FILES

Every agent gets a contract file at `orchestration/contracts/worker-{id}-{name}.md` BEFORE dispatch.

**Required contract sections:**

```markdown
# Worker Contract: {title}

## Project reference
- Project: {name}
- Plan: {path}
- Wave: {number}

## Assignment
{One paragraph: the exact sub-question this worker answers}

## Scope
- In scope: {specific items}
- Out of scope: {explicit boundaries}

## Method guidance
{How to approach, what to prioritize, quality bar}

## Sources (verified by orchestrator)
{Specific sources to consult, grounded in source verification — not guesses}

## Quality drivers for THIS task
{What specifically drives a good outcome for this strand — not copy-pasted from the project level}

## Claim strength discipline
Do NOT overstate confidence. "Verified" means you checked the source. Pre-trained knowledge is NOT verified. Do not upgrade hedged language to absolute claims.

## Output path and format
- Write to: {exact path}
- Required structure: {sections}

## Verify criteria
- [ ] {specific, measurable checks}

## Done criteria
{Binary test: how do you know the worker is done?}

## Governance reminder
You are a sub-agent within {project}. Do not run the startup checklist. Do not create a new project folder or plan. File your output at the specified location.
```

### 3. Run step-zero per agent

For each agent: is this a qualitatively distinct sub-problem? What specifically drives a good outcome for this strand? The quality drivers in each contract must be derived for THAT task, not copied from the project level.

---

## Wave structure

Organize agents into dependency-aware waves:

- **Wave N depends on max(dependency waves) + 1**
- Within a wave: parallel execution (independent tasks)
- Between waves: sequential (dependencies respected)
- Create `orchestration/dispatch.md` documenting the wave plan before first dispatch

### Between waves: human checkpoint

After each wave completes, present findings to the user:
- What was produced
- What the gap detection found
- Cross-cutting implications
- Proposed next wave and why

**Do not proceed to the next wave without user approval.**

---

## After EACH agent completes: orchestrator responsibilities

This is your core role. Do not skip any step.

### 1. Read the FULL output end-to-end

Not a sample. Not just the opening + verify criteria. For a 740-line document, read 740 lines. If that feels like a lot of work — that's the point. QA is supposed to be work.

### 2. Verify the 2-3 most important factual claims

When a worker cites "Sala & Gobet 2023 meta-analysis shows no far transfer" — search for that paper. Confirm it exists, confirm it says what the worker claims, assess whether it's authoritative. If you can't verify a claim, flag it as unverified in the gap report.

### 3. Actively look for problems

Your gap reports consistently say "CLEAN — proceed." That means you're confirming, not reviewing. Assume every output has at least one substantive issue you haven't found yet. If your gap report has zero findings, you haven't looked hard enough.

### 4. Assess quality, not just compliance

"Did the worker follow the format" is level 1. The real question is: "Did the worker actually produce a good answer to the question?" Would a domain expert reading this output trust it?

### 5. Run gap detection — all 6 levels

1. **Existence:** Files exist, non-empty, required sections present
2. **Substance:** Real work (not placeholder), evidence quality matches claim strength, verify 2-3 key claims independently
3. **Coverage:** Verify criteria met, scope items addressed, missing items identified
4. **Cross-reference:** Outputs don't contradict each other, dependencies resolved, useful tensions preserved
5. **Quality judgment:** Does the body of work advance the objective? Is the thinking good enough?
6. **Process transparency:** Methodology described, failed attempts disclosed, shortcuts acknowledged

### 6. Cross-cutting synthesis — the orchestrator's unique value

Individual workers see only their scope. You see connections, contradictions, and compounding insights across ALL outputs. This holistic cross-cutting view is a key part of orchestration that no worker can provide.

- **Per-output so-what:** What does this output mean for the project objective?
- **Cross-output so-what:** What are the implications ACROSS tracks, streams, and topics?
- **Implications for other work:** Does this output change the approach for other topics, invalidate assumptions in other contracts, or reveal opportunities not previously visible?
- **Next steps:** What should come next, and what decisions does the user need to make?

### 7. Write gap report

File to `orchestration/gap-reports/gap-report-wave-{n}.md`:
- Summary verdict (CLEAN / MINOR GAP / MAJOR GAP / ESCALATE)
- Worker-by-worker findings
- Major gaps requiring remediation
- Minor gaps to carry into synthesis
- Cross-cutting implications
- Recommended next action

---

## Checkpoint summary

After each wave, file to `orchestration/checkpoint-wave-{n}.md`:
- What was done in this wave
- Key findings and decisions
- Gap detection summary
- Cross-cutting insights
- What's next
- Plan.md updates needed

---

## Retrospective (after substantial orchestrated work)

At project completion or after major milestones:
- What worked well in the orchestration?
- What failed or was inefficient?
- What would you do differently next time?
- Any patterns worth codifying for future orchestrations?

---

## Common orchestration failure modes

1. **Speed over rigor:** Dispatching agents in parallel with source identification instead of sequentially. The urge to "move fast" is the enemy of quality.
2. **Sampling instead of QA:** Reading the opening, grepping for structure, spot-checking, writing "CLEAN." This is not QA.
3. **Contracts in prompts only:** Embedding contracts in dispatch prompts makes them unauditable and lost if the agent fails. Write to files.
4. **Copy-pasted quality drivers:** Using the project-level quality drivers for every worker instead of deriving task-specific ones.
5. **No cross-cutting synthesis:** Presenting worker outputs to the user without synthesizing what they mean together.
6. **Overstated agent claims:** Workers systematically overstate confidence. "Verified" gets applied to training-data knowledge. Always check.
