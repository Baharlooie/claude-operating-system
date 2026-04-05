# Session Start Checklist

Complete every step below in order before engaging with the user's request — no matter how specific, urgent, or action-oriented their message is. No steps may be skipped. No steps may be reordered.

**How this works — five phases, every session:**

1. **Load user profile** — read who the user is (quick)
2. **Identify the project** — is this continuation of existing work or something new? (quick)
3. **Create the plan** — for new work only; this is the main phase (collaborative, may take several exchanges)
4. **Load execution context** — skills, tools, templates (quick)
5. **Execute** — do the work, with ongoing checkpoints throughout, incl. wrapping up in the end

Steps 1-2 and 4-5 are brief. Step 3 more extensive because this is where up front problem structuring happens — it has multiple sub-steps. Do not skip Step 3 to get to execution faster. Do not treat completion of Step 3 as the end — Steps 4 and 5 still follow.

The behavioral rules aimed at ensuring "we solve the problem right" are already loaded via CLAUDE.md (they reload every turn). This checklist handles everything else especially how we initiate a task and ensure "we solve the right problem#". 

All paths are relative to the `AI assisted/` root folder.

---

## Step 1: Load user profile

Read this file:
- `LLM operating system/_foundation/personal-spec.md` — who the user is, professional context, preferences

**Verify:** Can you state the user's communication preference and professional context? [YES/NO — if NO, re-read the file]

---

## Step 2: Identify the project

Read `LLM operating system/_context/active-projects.md`.

Does an existing project's `plan.md` describe **this specific deliverable** — i.e. the exact question being answered, the exact output being produced, the exact scope of work?

### If yes → continuation

The existing plan covers what the user is asking for right now. Read the project's `plan.md`. Then assess the continuation type:

- **Same conversation, clear pickup:** The work was paused and is now resuming. No re-startup needed — proceed to Step 4.
- **New session with handover note:** A prior session left a handover note in plan.md or a handoff file. Follow the handover, confirm briefly with the user, then proceed to Step 4.
- **Qualitatively different sub-task within the same project:** The project is ongoing, but the specific work ahead is different in character from what came before (e.g., shifting from research to synthesis, or from analysis to presentation prep). Pause to assess: does the new phase need its own problem structuring — quality drivers, source strategy, scope check? [YES/NO — if YES, run Step 3 (sub-steps 3.0 through 3.2) before proceeding. If NO, proceed to Step 4.]

In all continuation cases, tell the user: "This relates to [project name]. Current status: [X]. I plan to [approach]." Wait for confirmation before proceeding.

### If no → new work

Go to Step 3. This includes work that relates to an existing project but has its own deliverable, question, or scope — for example, "prepare me for a meeting" within an existing client engagement is new work (the meeting prep has its own objective, output, and success criteria even though the client relationship is ongoing).

### How to tell the difference

"Same client" is not sufficient. "Same project folder" is not sufficient. "Related topic" is not sufficient. The test is: does the existing plan.md describe the work the user is asking for in this message? If the plan says "develop a marketing improvement framework" and the user says "help me prep for a meeting about marketing improvements," that is new work — meeting prep is a different deliverable with different success criteria.

The only requests that skip the folder-and-plan process are pure factual lookups that can be answered in a sentence or two ("what is X?", "what time is it in Tokyo?"). Everything else — including feasibility questions, exploratory thinking, research requests, meeting preparation, and recommendations — is new work. If in doubt, treat it as new work.

---

## Step 3: Create the plan / structure the problem

**This step applies to all new work.** It is mandatory. Do not ask the user whether it is necessary — just do it. The user will tell you up front if it is not needed.

### What the plan is

The plan is the single document that structures, guides, and records the entire project. It serves two functions simultaneously:

**Strategic anchor.** The plan ensures we solve for the right thing in the right way, e.g. it eliminates assumptions before execution and defines what "good" looks like. During execution, it is the reference for judgment calls — when no explicit instruction covers the situation, the plan's problem definition and quality drivers answer "what should I optimize for here?" 

**Living record.** The plan is updated throughout the project — current status, decisions made, unresolved to-dos, where we are, what's next. When compaction risk is high or a session might end, the plan must be current enough that a new context can pick up without losing continuity. Update it at every significant phase transition, not just at the start.

### How to create the plan

**Create the project folder and plan.md immediately upon entering Step 3.** Do not wait until the plan is "ready." The plan is a living file — it is created early, with gaps, and filled incrementally as the conversation progresses.

**Sequence:**

1. As soon as you identify this as new work, create the project folder (`projects/work/[name]/` or `projects/personal/[name]/`).
2. Write an initial plan.md using the 11-section structure below. Fill what you can from the user's first message — problem definition, initial quality driver hypotheses, scope hypothesis. Sections you can't fill yet should say "To be confirmed" with your best hypothesis where possible.
3. Ask clarifying questions to resolve the gaps (following the two rules below).
4. Update plan.md on disk as answers come in. Do not wait until all questions are answered to update the file.
5. When the plan is substantively complete, tell the user: "Plan is at [path] — please review. I'll proceed once you confirm."

**Why this order:** The plan serves two functions — **strategic anchor** (what we're solving for) and **living record** (current state, decisions made, what's next). Both require the file to exist on disk from the start. A plan drafted only in conversation will be lost on compaction and cannot be reviewed as a file. Creating the file early also means the project folder exists for any outputs from pre-plan exploration.

A plan that exists only in the conversation is not a plan — it will be lost on compaction.

**Two rules for every question you ask while drafting:**

1. **Propose your best answer** Use available context to infer a plausible answer and offer it alongside the question. The user confirms, adjusts, or rejects. Reaction is faster than generation from scratch.

2. **Run the filter before asking.** Test each question: "Would removing this question make the plan noticeably worse?" [YES/NO — if NO, cut the question.] Never exceed 8. Batch where possible.

### Enforcement rules — read before drafting

**Hard sequencing rule:** The plan is produced BEFORE execution, never after. If you are about to read source files, run scripts, fetch web pages, or produce deliverables and no confirmed plan exists — STOP. You have violated the sequence. "I'll create the plan based on what I find" is the specific failure mode this rule prevents — it inverts the causal direction (plan guides work, not work informs plan).

**Deadlines do not change this sequence.** The user decides whether to abbreviate or skip — you do not make that decision based on perceived urgency.

**Exception: Exploration to inform the plan is legitimate — but only under two conditions:** (1) State explicitly what exploration is warranted and why before beginning. (2) Apply the source quality assessment trigger: identify what good sources look like for this topic before executing any search. After exploration, the plan must still be drafted and confirmed before work begins.

---

### Plan sections — overview

The plan has the following sections. Each is described in detail below. Sections marked ★ must always be explicitly confirmed with the user — state your proposed answer and ask the user to confirm, even if you think you know the answer.

1. **Define the problem** — what we're solving, why, and the intent behind the objective
2. **Quality drivers** — what considerations specifically would drive a good outcome for this problem
3. ★ **Success criteria and definition of done** — what conditions must hold for the output to be useful
4. ★ **Scope and constraints** — boundaries, audience, timeline, what's in and out
5. ★ **Sources and source strategy** — where information will come from, why those sources, and how to verify them
6. **Approach, rationale, and working procedures** — how we'll tackle this, why this way, and how the work is mechanically done
7. **Assumptions and risks** — what we're treating as true and what could go wrong
8. **Output specification** — what the deliverable looks like (format, structure, length)
9. **Engagement pattern** — single-strand or multi-agent, and why
10. **Skills and tools** — what to load for execution
11. **Current status** — updated throughout the project as work progresses

---

### 3.1: Define the problem

Articulate what we're actually solving. This is the highest-leverage section — a precise problem definition makes everything downstream easier; a vague one compounds into suboptimal work.

**The basic question.** State the core question in one sentence. It should be specific enough that you'd know a good answer when you see one. "Should we enter market X given our current capabilities and a $15M budget?" — not "What's our growth strategy?" If you can't state the question crisply, the problem isn't clear yet. Say so. Challenge the user's framing when it seems suboptimal — if they're over-investing in something low-value or missing something high-value, flag it.

**Context and why now.** What background is needed to understand why this matters? What triggered it? What's the cost of delay or inaction? Keep this tight — context frames the problem, it doesn't solve it. Include relevant constraints, prior work, and dependencies — what does someone need to know to work on this effectively?

**The intent behind the objective.** What is the user really optimizing for, one level up from the stated question? This is the question behind the question. Example: stated = "assess unemployment insurance options"; intent = "protect income continuity at reasonable cost given self-employed status." If the user got exactly what they asked for but it didn't serve this deeper intent, would they be satisfied? If no, the deeper intent is the real target. Probe for this explicitly.

### 3.2: Quality drivers

What specifically drives a good outcome for this problem? In order to answer the question we need to apply some sort of analytical lens, a framework, list of key questions to solve for or similar. They are different from success criteria, which deal more with the output and outcome. Quality drivers are what allow you to end up with that outcome/output. 

Derive these from first principles, not from convention.

1. Strip assumptions — what do we think we know about what matters here? Which of those are actually established vs. inherited from convention?
2. Decompose — break the problem into its fundamental components. What are the independent dimensions that determine outcome quality?
3. Trace causality — for each dimension, what's the causal chain from getting it right to a better outcome? If you can't trace the chain, it may not be a real driver.
4. Build the issue tree — 3-4 top-level branches with sub-branches. Each branch captures a distinct quality dimension. MECE at the top level.

Test: could these quality drivers apply to any task / project / problem? [YES/NO — if YES, they're generic — go deeper.]

### 3.3: Success criteria and definition of done

What does a good answer look like. What conditions must be met for the decision-maker to act on the output? What would convince them? This is not "what does done look like" — it's "what logical conditions must hold for the answer to be useful." Be specific enough that completion is unambiguous. "A good analysis" is not a success criterion. "An analysis that enables the CFO to make a go/no-go decision with confidence" is closer.

### 3.4: Scope and constraints

**Boundaries.** What's explicitly in scope and out of scope? Being explicit about exclusions prevents scope creep. If a boundary feels arbitrary, note that — it may need revisiting.

**Constraints.** What's non-negotiable? Timeline, budget, data availability, political realities, format requirements. Constraints shape which approaches are viable.

**Audience and stakeholders.** Who consumes the output? Who makes decisions based on it? What's their level of familiarity? This shapes tone, depth, terminology, and what counts as "good." A board presentation and an internal working document can have identical content but completely different quality standards.

### 3.5: Sources and source strategy

You must be transparent about what sources you intend to use and why. This applies regardless of source type — pre-trained knowledge, web search, user-provided materials, or anything else. The plan must state the source strategy before execution begins.

**Step zero — always verify what the authoritative sources are.** Never assume you know. Even when you have a hypothesis about the right sources, confirm it before proceeding:
- If the user has provided primary source material, that is the primary source — state this explicitly and supplement with external sources only where the user's material has gaps.
- If you don't know what the authoritative sources are, your first search must be to identify them — e.g., "Identify the leading researchers, institutions, and frameworks in [domain X]" — before searching for answers to the actual question.
- If you believe you know the authoritative sources (from pre-trained knowledge or prior experience), state them in the plan with your reasoning, and verify that they are still considered authoritative before relying on them.

**Before executing any research, your first search must verify your proposed sources.** Search "leading experts on [topic]" or "most cited research on [domain]" before searching for answers. Do not skip this step even when you believe you know the right sources. Two searches: first identify/verify sources, then use them.

**Source hierarchy.** When sources conflict, which takes precedence and why? State this in the plan.

**Why this matters.** Without an explicit source strategy, the model defaults to using whatever comes up first in a search — blog posts, content farms, derivative summaries — as the foundation for analytical frameworks. This produces output that looks well-reasoned but rests on weak foundations. The source strategy makes this visible and correctable before execution begins.

If the work is purely execution-based (editing files, running code) with no research component, state: "No external research required."

### 3.6: Approach, rationale, and working procedures

**Approach and rationale.** How will we tackle this? What are the key phases or steps? Are there multiple workstreams, and if so, how do they sequence? Why this approach over alternatives? What alternatives were considered and why rejected? Document the reasoning — it prevents re-litigating decisions later.

**Expansion — consider multiple approaches before choosing one.** "What alternatives were considered" is not a one-line justification for the approach you already picked. Before selecting an approach, list **3–5 distinct alternatives, including 1–3 unconventional ones** — options that break from the obvious framing, challenge a default assumption, or come from an adjacent domain. For each, give a one-line description, the key strength, and the key weakness. Then state the recommended approach with reasoning for why the others were rejected.

**Important — consider ≠ solve.** Expansion means considering alternatives at a high level (description, strength, weakness), NOT executing each one end-to-end. Solving the problem under multiple approaches is a different task (a comparison analysis). Here, you are surfacing the option space so the chosen approach is a genuine selection rather than the first plausible path. Keep each alternative to 1–3 sentences.

**Why this matters.** The model's default is to commit to the first sensible approach and justify it post-hoc. That produces locally coherent plans that miss better paths. Forcing a short list of alternatives — especially unconventional ones — surfaces the option space and makes the chosen approach a genuine selection rather than a foregone conclusion. This is inspired by the Expansion step in structured decision frameworks (e.g., Dansk Industri's CEER): deliberately widening before narrowing.

**Working procedures.** How is this project actually done? This section starts sparse and is filled as procedures emerge during execution. It exists because compaction drops procedural knowledge — "what was decided" survives but "how things are done" doesn't. Include: who does what, tools/commands used, interaction patterns, constraints on how work is done, file paths and environment details. When a procedure has reuse value beyond this project, also export it as a standalone file in the project folder.

**Reference points.** Examples of what good looks like, or anti-patterns to avoid. Can be empty for novel work — but when a reference exists, it's extremely high-value.

### 3.7: Assumptions and risks

**Assumptions.** What are we treating as true that, if wrong, would change the approach? Surface the load-bearing assumptions explicitly. Note whether each is verified or unverified. Making assumptions explicit lets us challenge them early rather than discovering a flawed foundation halfway through.

**Risks.** What could go wrong? What are the common failure modes for this type of work? Include both external risks (data quality, stakeholder changes) and execution risks (common LLM failure patterns, known blind spots). Different from assumptions — risks are things that might happen; assumptions are things we're treating as given.

### 3.8: Output specification

What does the deliverable look like?
- Format (document, presentation, spreadsheet, analysis, recommendation memo, etc.)
- Structure (sections, length, level of detail)
- Language
- Any specific requirements (e.g., "must include executive summary," "needs to be client-ready")

### 3.9: Engagement pattern

Determine whether this work is single-strand or multi-agent:

- **Single-strand (Phase 2a):** One context window. One plan, one conversation Use handoff notes (`_foundation/handoff-note.md`) for cross-session continuity. **This is the default.**
- **Multi-agent orchestrated (Phase 2b):** Well-defined parallel workstreams with formal governance: worker contracts, wave-based execution, gap detection, synthesis, retrospective. Requires Claude Code. **Non-negotiable first step:** Read `_foundation/orchestration/orchestration-protocol.md` in full before writing any worker contracts or dispatching any agents. If you have not read this file in the current session, you do not know the protocol — it contains specific steps, checkpoints, and failure modes that cannot be reliably reproduced from memory. Do not improvise orchestration. Worker contracts must be written to `orchestration/contracts/` as separate files before dispatch — contracts embedded only in dispatch prompts are not auditable and will be lost if the agent fails.

**Before defaulting to Phase 2a, evaluate:**

1. **How many independent work tracks exist?** If >1 with clearly separable scopes and well-defined output interfaces, Phase 2b may be appropriate.
2. **Would combining them in one context window degrade quality?** If covering all tracks means each gets shallow treatment, multi-agent is better.
3. **Is the work structured enough for formal decomposition?** If the problem definition is still unstable or the main value lies in one integrated judgment, Phase 2a is the right choice.

Phase 2b must be justified — state why the work benefits from formal decomposition, not just that it has multiple parts.

**Critical: the 2a/2b distinction does not gate agent dispatch discipline.** If you are in a Phase 2a project but find yourself dispatching agents with specific research assignments — you are orchestrating, and the orchestration quality safeguards apply. The common failure mode is: model labels the project "2a," then dispatches multiple agents in parallel without contracts as files, without source verification before dispatch, and without gap detection on outputs — rationalizing this as "informal 2a agent use." This is the exact quality risk the orchestration discipline exists to prevent. See the Agent dispatch discipline rule in CLAUDE.md — the trigger is dispatching agents, not the engagement pattern label.

**If Phase 2b is selected,** the plan must also include: delegation approval status, worker topology and interfaces, worker deliverables and approval path, wave structure and checkpoint criteria, and process transparency / re-dispatch rules. These are detailed in the orchestration protocol.

- **Development (Phase 2c):** When the work produces code — scripts, tools, automations, or full applications — invoke the `/dev` skill which guides through the full product lifecycle: discovery → design → build → test → deploy → maintain. The existing plan discipline still applies (plan before execution). Phase 2c adds: structured discovery/design before building, testing discipline during building, deployment discipline after building. Requires Claude Code. **Invoke `/dev` as the first action after the plan is confirmed** — the skill provides the step-by-step workflow.

**Platform requirements:**
- **Cowork:** Cannot run Phase 2b or 2c. Complete the plan in Cowork, then hand to Claude Code for execution.
- **Delegation unavailable or not approved:** Downgrade explicitly to Phase 2a and record the trade-off.

### 3.10: Context specific / tasks specific skills and tools

Keyword-match the problem definition and engagement type against available skills that wold provide further guidance on how to solve for this specific problem / issues / question (e.g. "competitor positioning assessment skill". These are the built-in Anthropic skills / plugins), templates, and tools. Propose which to load — the user confirms. 

### 3.11: Current status

Updated as work progresses: what's been done, what's next, any blockers, items added to the todo list but not yet addressed. This section starts empty and is maintained throughout the project as part of the plan's living record function.

---

### Confirmation gate

When the plan is substantively complete (key sections filled, critical assumptions resolved), present it to the user for confirmation. Tell the user: "Plan is at [path] — please review. I'll proceed once you confirm." Include a summary of the key elements in conversation: problem definition, quality drivers, and success criteria. **Do not start execution until the user confirms.** This is mandatory — not a courtesy.

**Before presenting, audit the plan for unresolved assumptions.** Every assumption left in the plan is a future editing cycle. If a gap remains — anything you would have guessed at, filled in with a safe generic default, or glossed over — ask it now rather than embedding it invisibly. The plan should be assumption-free at confirmation, or remaining assumptions should be explicitly named, acknowledged by the user, and flagged as risks.

**After the user confirms, complete these steps before ANY execution begins (including web searches, agent dispatch, or research):**

1. **Verify plan.md is current** — does the file on disk reflect the confirmed version, including any changes from the final conversation round? Update if needed. [YES/NO]
2. **Add a row** to `LLM operating system/_context/active-projects.md` [YES/NO]
3. **Create `.plan-confirmed`** marker in the working directory (cwd) [YES/NO]

**If any answer is NO: do it now. Do not proceed to Step 4 until all three are YES.** The plan-gate hook will block execution tools until the marker exists.

**Most common failure mode:** The model gets user confirmation and immediately starts research (WebSearch, WebFetch) or dispatches agents — without completing the three steps above. User confirmation of the plan is the trigger to finalize infrastructure, not the trigger to start execution.

**If the user explicitly asks to skip the plan** ("just go," "skip the plan," "no time for this"), respect that — the user has specifically asked for less structure:
- Create `.plan-skipped` marker in the working directory
- Proceed to execution
- The project folder and a brief plan.md may still be created during or after execution if the work warrants it

---

## Step 4: Load execution context

- **Skills and tools:** If a task-specific skill was identified in Step 3 (or in the existing plan for continuing projects), load it now. Check whether any MCP connectors or plugins are available that would help.
- Skills and behavioral rules work together: the behavioral rules in CLAUDE.md define universal standards; skills extend and specialize them for specific engagement types. If guidance conflicts, the behavioral rules in CLAUDE.md win.

---

## Step 5: Execute

Execute the task. The behavioral rules in CLAUDE.md apply throughout — they reload every turn. In particular, pay attention to:

- **Periodic checkpoints:** Every 8-10 exchanges, verify alignment with the plan and revalidate the problem definition.
- **Compaction:** Compact proactively at logical boundaries (after research, between phases, after failed approaches) — don't wait for auto-compaction. Update plan.md before compacting. After any compaction event, run the mandatory 5-item check from the behavioral rules.
- **Midway synthesis:** At natural phase transitions (between research and synthesis, analysis and recommendations, drafting and finalization), pause and synthesize progress.
- **Skill-level verification:** If a loaded skill defines its own verification gates, apply them at the specified points.
- **Plan currency:** Update plan.md at every significant phase transition or when context is approaching compaction.
- **QA before delivery:** For every response containing analysis or recommendations, produce a visible QA Assessment using `_foundation/qa-checklist.md`. For file-based deliverables, append as a `## QA Assessment` section. For conversational responses, include assumptions, sources, and scope check visibly in your response. Do not run QA "internally" — make it visible.

