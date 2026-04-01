# Gap Detection Protocol

Use this protocol after each orchestration wave, either in the orchestrator session or by briefing a dedicated gap-review worker.

## Goal

Work backward from the plan's objective, quality drivers, and success criteria to determine whether the current wave outputs are good enough to support the next wave or final synthesis.

## Review levels

1. **Existence**
   - expected files exist
   - outputs are non-empty
   - required sections are present

2. **Substance**
   - output contains real work, not placeholder content
   - evidence quality matches claim strength
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
