# Orchestration Folder Spec

When a Phase 2b run starts, create or update this structure inside the active project folder:

```text
orchestration/
  dispatch.md
  contracts/
    worker-{id}.md
  outputs/
    worker-{id}-output.md
  gap-reports/
    wave-{n}-gap-report.md
  synthesis.md
  gap-report-final.md
  retrospective.md
```

## File ownership

- `dispatch.md`: orchestrator
- `contracts/worker-{id}.md`: orchestrator
- `outputs/worker-{id}-output.md`: worker
- `gap-reports/wave-{n}-gap-report.md`: orchestrator or gap-review worker
- `synthesis.md`: orchestrator
- `gap-report-final.md`: orchestrator
- `retrospective.md`: orchestrator

## Operating rule

These files are not optional bookkeeping. They are the durable operating surface for the run: what is being asked, what came back, what gaps were found, what was synthesized, and what was learned.
