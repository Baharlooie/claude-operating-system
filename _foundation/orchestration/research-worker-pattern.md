# Research Worker Pattern

## Use when

Use this worker when one branch of the problem needs deep source gathering or synthesis and can be investigated independently from the other branches.

Typical fit:

- a focused research question
- a market or technology scan
- one workstream in a larger due-diligence style effort
- one branch of evidence gathering before synthesis

## Worker contract

The worker receives:

- the full plan
- one specific research question
- scope boundaries and source constraints
- an explicit output path or format

The worker does **not**:

- re-scope the project
- create or mutate the plan
- give the final recommendation for the project unless explicitly asked

## Expected output

The output should contain:

- the question investigated
- key findings
- `verified` vs `inference` vs `uncertain` labeling
- contradictions or source tension
- unresolved gaps
- process transparency:
  - methodology used
  - key searches or source checks
  - failed attempts or inaccessible sources
  - shortcuts and structural biases
  - what would most improve the result if re-dispatched
- implications for the orchestrator, not the final project conclusion

## Quality checks

Before returning, the worker should verify:

- sources were actually read, not inferred from snippets alone
- the findings stay inside the assigned branch
- missing evidence is called out explicitly rather than smoothed over
- the process-transparency section is substantive rather than boilerplate
