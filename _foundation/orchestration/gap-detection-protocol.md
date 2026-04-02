# Gap Detection Protocol

Use this protocol after each orchestration wave, either in the orchestrator session or by briefing a dedicated gap-review worker.

## Goal

Work backward from the plan's objective, quality drivers, and success criteria to determine whether the current wave outputs are good enough to support the next wave or final synthesis.

## What gap detection is NOT

Gap detection is not spot-checking. It is not reading the first and last sections, grepping for structural elements, confirming verify criteria look met, and writing "CLEAN — proceed." That is structural compliance checking — necessary but not sufficient.

Gap detection means reading the full output and applying critical judgment. If you find yourself writing "CLEAN" for every wave, that is a signal you are confirming rather than reviewing. Assume problems exist that you haven't found yet.

**Minimum requirements before classifying as CLEAN:**
- You have read the full output, not a sample
- You have independently verified at least the 2-3 most consequential factual claims (does the cited source exist? does it say what the worker claims?)
- You have identified at least one thing that could be improved (if you found zero, you weren't looking hard enough)
- You have assessed not just "did the worker follow the format" but "did the worker actually answer the question well"

For outputs over 300 lines, consider dispatching a dedicated gap-detection agent rather than reviewing alone — you wrote the contract and are biased toward seeing compliance.

## Review levels

1. **Existence**
   - expected files exist
   - outputs are non-empty
   - required sections are present

2. **Substance**
   - output contains real work, not placeholder content
   - evidence quality matches claim strength — verify the 2-3 most important claims independently
   - confidence markers are present

3. **Coverage**
   - verify criteria were met
   - scope items were actually addressed
   - missing items are identified explicitly

4. **Cross-reference**
   - outputs do not silently contradict each other
   - dependencies between workers are resolved or flagged
   - useful tensions are preserved for synthesis

5. **Quality judgment**
   - does the body of work actually advance the objective?
   - is the thinking good enough, or only mechanically complete?
   - is the worker solving the right problem within its scope?

6. **Process-transparency audit**
   - methodology is described
   - failed attempts are disclosed
   - shortcuts and biases are acknowledged
   - suspiciously clean process logs are flagged

## Classification

- **CLEAN**: safe to proceed
- **MINOR GAP**: safe to proceed if flagged for synthesis
- **MAJOR GAP**: remediate or re-dispatch before proceeding
- **ESCALATE**: premise contradiction, scope problem, or judgment issue requiring human input

## Required output

Write a gap report that includes:

- summary verdict
- worker-by-worker findings
- major gaps requiring remediation
- minor gaps to carry into synthesis
- quality-judgment concerns
- process-transparency concerns
- recommended next action: proceed, remediate, adjust scope, or escalate
