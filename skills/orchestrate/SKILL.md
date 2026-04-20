---
name: orchestrate
description: Multi-agent orchestration workflow with formal contracts, gap detection, and cross-cutting synthesis. Invoke when dispatching multiple agents for parallel research or work.
---

# Multi-Agent Orchestration Skill

You are now orchestrating — coordinating multiple agents to produce work that no single agent could do alone. This skill loads the full orchestration methodology into your active context. Follow it.

---

## Before designing the wave plan: classify work as latent vs deterministic

Before decomposing the project into worker assignments, classify each sub-problem as **latent** (model territory — judgment, synthesis, pattern recognition, reading and interpreting) or **deterministic** (code territory — same input, same output, every time: SQL, counting, sorting, combinatorial optimization, format validation).

**Worker assignments should go to the latent bucket.** Deterministic work should go to tools, scripts, or direct queries — not to sub-agents. A worker dispatched to "calculate the average contract value across these 200 PDFs" will produce a plausible-looking number that is wrong. A script with a PDF extractor and arithmetic will produce a correct one.

**The most common decomposition mistake:** putting combinatorial or exact-counting work into worker contracts as if it were judgment. If the sub-problem has a deterministic answer, write a script or a structured query instead of a contract. If it requires reading and synthesizing unstructured content, then — and only then — it's a worker assignment.

**Hybrid pattern:** Many orchestrated tasks are 80% deterministic extraction + 20% latent judgment. The correct structure is: deterministic extraction runs first (as tools or a preprocessing script), produces a structured input file, and workers receive the structured input + their latent synthesis assignment. This prevents workers from wasting judgment cycles on extraction they can't reliably do.

Source: Garry Tan, "Thin Harness, Fat Skills" (2026-04-12).

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

### 5b. Optional: two-stage review for substantive outputs

For high-stakes worker outputs (long synthesis documents, research with load-bearing conclusions, deliverables the user will act on directly), split gap detection into **two sequential sub-agent dispatches with distinct framings** rather than one combined pass:

1. **Stage 1 — Spec-compliance pass.** Reviewer-A's framing: "Does this output meet the contract? Are the required sections present, the scope covered, the output format followed, the verify criteria satisfied?" This is gap-detection levels 1, 3, 6 — mechanical compliance. Dispatch as a fresh sub-agent with the contract + the output and the narrow question "compliance against contract — yes/no per criterion."

2. **Stage 2 — Substantive-quality pass.** Reviewer-B's framing: "Would a domain expert reading this output trust it? Are the load-bearing claims verified? Is the thinking actually good?" This is gap-detection levels 2, 4, 5 — substance + cross-reference + quality. Dispatch as a SEPARATE fresh sub-agent (different persona, different frame) with the output and the narrow question "substantive quality — would you stake a decision on this?"

**Why separate passes catch different issues:** The "did it meet spec" mindset is checklist-oriented; it catches missing sections and format violations but tends to accept plausible-looking substance. The "is it actually good" mindset is expert-skeptical; it catches sloppy reasoning and weak evidence but tends to overlook format/scope issues. One mindset in one pass tends to do one well and the other poorly. Running them sequentially as distinct personas is the mechanical version of what a good human reviewer does in two reads.

**When to use the two-stage variant vs. the single-pass variant:**
- **Two-stage:** outputs over 300 lines, synthesis deliverables, any research the user will cite, orchestrated work whose results drive further decisions.
- **Single-pass (default section 5):** short outputs, status checks, mechanical tasks, early-iteration drafts where combined review is sufficient.

Source: adapted from obra/superpowers' `subagent-driven-development` pattern (reviewed in 2026-04-20 plugin research; plugin itself SKIPPED due to architectural collision, but this specific two-stage review pattern harvested).

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
