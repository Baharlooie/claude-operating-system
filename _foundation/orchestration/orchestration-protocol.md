# Multi-Agent Orchestration Protocol (Phase 2b)

This procedure turns parallelism into a governed operating protocol rather than an improvisation. The orchestrator owns the plan, the routing decision, the worker design, the checkpoints, the synthesis, and the final recommendation to the human.

The governing principle is **quality over efficiency**. Multi-agent work is chosen when the quality upside of parallel evidence gathering, critique, or verification exceeds the coordination cost.

Repository files remain the authoritative memory throughout. Do not depend on hidden UI memory or conversational residue.

---

## When to use this protocol

Activate this protocol when the plan or upfront problem structuring shows most of the following:

- workstreams are clearly separable
- each workstream can be given a narrow, explicit contract
- worker outputs have clear interfaces back to the orchestrator
- there is real upside from parallel research, QA, or verification
- the orchestrator can realistically synthesize the outputs into one recommendation

Do **not** activate this protocol when:

- the problem definition is still unstable
- the key branches are tightly coupled and need shared reasoning throughout
- the main value lies in one integrated judgment rather than parallel evidence gathering
- the work is too small for orchestration overhead to pay back

---

## Core principles

1. **The main session is the orchestrator.** Do not create a separate hidden orchestrator abstraction when the current session can own planning, dispatch, checkpointing, and synthesis directly.
2. **Parallelize the workstreams, not the judgment.** The final recommendation stays with the orchestrator and the human.
3. **Waves, not flat parallel by default.** Dependencies should shape execution order. A flat parallel launch is justified only when workers are truly dependency-free.
4. **Checkpoint before commitment.** For judgment-heavy or high-risk work, use wave-by-wave checkpoints unless the user has explicitly approved autonomous continuation.
5. **Process transparency is mandatory.** Delegated execution is partly opaque; workers must disclose methodology, failed attempts, shortcuts, biases, and what would improve the output.
6. **Remediate weak work before synthesis.** Do not silently synthesize over obvious worker-quality problems.
7. **File-based artifacts are the operating surface.** Contracts, outputs, gap reports, synthesis, and retrospectives should all live in the project folder.

---

## Roles and governance

### Orchestrator

The orchestrator always owns:

- problem structuring with the user
- plan creation and plan approval
- routing into single-strand (Phase 2a) or multi-agent orchestrated (Phase 2b)
- dependency graph and wave design
- worker assignment design
- checkpoint summaries and recommendations
- synthesis across workers
- retrospective capture
- the final recommendation to the human

### Workers

Workers always receive:

- the full plan
- a narrow assignment
- an explicit output format
- a clear escalation path

Workers do **not** own:

- project setup
- plan mutation
- silent scope expansion beyond the contract's deviation rules
- final recommendation to the human unless explicitly delegated

---

## Fallback: When delegation is unavailable

If automated delegation is unavailable or unapproved, downgrade to Phase 2a (single-strand, staged execution). Use the same contract structure as a planning aid — write explicit worker briefs into the project folder, even if you'll execute them sequentially yourself. This preserves the decomposition quality and makes the work resumable across sessions.

The key principle: no hidden coordination. Everything important should exist in files.

---

## Pattern 2: Automated multi-agent execution

Use when the workstreams are well defined and the runtime supports delegated workers.

### Phase A: Preconditions

Before dispatching any work, verify:

- the plan is approved
- the routing rationale is explicit
- the workstreams are actually separable
- delegation approval status is recorded
- the plan captures worker topology, deliverables, wave structure, checkpoint criteria, and process-transparency rules

If any of those are missing, fix the plan before dispatch.

### Phase B: Set up the orchestration surface

Create or update the orchestration files using the reference templates in ``:

- `orchestration-folder-spec.md`
- `worker-contract-template.md`
- `checkpoint-summary-template.md`
- `gap-detection-protocol.md`
- `retrospective-template.md`

At minimum, the run should create:

- `orchestration/dispatch.md`
- `orchestration/contracts/`
- `orchestration/outputs/`
- `orchestration/gap-reports/`

### Phase C: Design worker contracts

For each worker, build a contract from the plan and the relevant worker pattern.

Every contract should include:

1. project and plan reference
2. worker title and exact sub-question
3. scope and boundaries
4. method guidance
5. output path and format
6. verify criteria
7. done criteria
8. deviation rules
9. **claim strength discipline** — workers systematically overstate confidence. Every contract must explicitly warn: "verified" means you checked the source (not training-data knowledge), do not upgrade hedged language to absolute claims, understate rather than overstate when uncertain. See the template for full language.
10. process-transparency requirements
11. escalation triggers

If any of those are missing, the contract is underspecified.

### Phase D: Wave-by-wave execution

For each wave:

1. **Present the wave summary**
   - which workers will run
   - why they are grouped this way
   - what outputs are expected
   - what checkpoint decision will follow

2. **Get approval unless autonomous continuation has already been agreed**
   - for judgment-heavy or high-risk work, pause here by default

3. **Dispatch workers**
   - spawn or delegate the minimum set of workers needed for the wave
   - keep write scopes or responsibilities distinct when practical

4. **Collect outputs**
   - workers write to the project folder
   - confirm files exist and are substantive before continuing

5. **Run gap review**
   - review outputs against `gap-detection-protocol.md`
   - the gap review can be done by the orchestrator or by a delegated verification/gap-review worker

6. **Form the checkpoint recommendation**
   - proceed
   - remediate a specific worker
   - adjust scope
   - pivot or escalate to the human

7. **Present the checkpoint summary**
   - use `checkpoint-summary-template.md`
   - include findings, gaps, process quality, recommendation, and decision needed

8. **Pause for user direction unless autonomy has been explicitly extended**

### Phase E: Synthesis

Only synthesize once the final wave is approved as good enough to move forward.

The synthesis should:

- answer the plan's objective directly
- integrate findings by theme, not by worker
- surface contradictions rather than smoothing them over
- include consolidated sources and confidence markers
- state remaining gaps and items requiring human judgment
- include a process-transparency summary across workers

### Phase F: Retrospective

After substantial Phase 2b runs, write a retrospective using `retrospective-template.md`.

Capture:

- decomposition pattern used
- wave structure and whether it worked
- re-dispatches and why they happened
- whether the gap review caught real issues
- whether checkpointing improved quality
- what would change in the next run

Do not assume persistent worker memory is reliable enough to replace the file-based retrospective.

---

## Worker briefing standard

Every worker brief should contain:

1. the project and plan reference
2. the worker's exact sub-question
3. what's in scope and out of scope
4. the output path and format
5. verify and done criteria
6. deviation rules
7. what counts as escalation back to the orchestrator
8. a reminder that the worker does not mutate project setup or plan state
9. a mandatory process-transparency section

If any of those are missing, the worker brief is underspecified.

---

## Built-in worker patterns

Use the reference patterns in `` rather than inventing briefs from scratch every time:

- `research-worker-pattern.md`
- `qa-critique-worker-pattern.md`
- `verification-worker-pattern.md`
- `worker-contract-template.md`
- `gap-detection-protocol.md`
- `checkpoint-summary-template.md`
- `orchestration-folder-spec.md`
- `retrospective-template.md`

Pick the minimal set that matches the real quality drivers.

---

## Verification gates

Before dispatch:

- the plan is approved
- the routing rationale is explicit
- the wave structure is explicit when dependencies exist
- worker contracts are self-sufficient

After each wave:

- outputs exist and are substantive
- the worker stayed within scope
- the worker used the requested output format
- process transparency is present and believable
- major gaps are remediated or explicitly escalated before moving on

Before synthesis:

- the combined body of work actually answers the objective
- contradictions between workers are surfaced rather than smoothed over
- the orchestrator has integrated the worker outputs against the original plan
- the final recommendation still states load-bearing assumptions where relevant
