# Worker Contract Template

Use this as the canonical brief structure for delegated workers in Phase 2b multi-agent orchestration.

```markdown
# Worker Contract: {worker_title}

## Project reference
- Project: {project_name}
- Plan: {absolute_or_project_relative_plan_path}
- Wave: {wave_number_or_not_applicable}

## Assignment
{one-paragraph description of the worker's exact sub-question}

## Scope
- In scope: {specific scope items}
- Out of scope: {explicit boundaries}

## Method guidance
{how the worker should approach the task, what to prioritize, and what quality bar to use}

## Output path and format
- Write to: `{project_path}/orchestration/outputs/worker-{id}-output.md`
- Required structure:
  - Status
  - Findings
  - Confidence assessment
  - Sources
  - Process transparency
  - Gaps and flags

## Verify criteria
{specific, measurable self-checks}

## Done criteria
{binary test for whether the worker is done}

## Deviation rules
- Auto-expand: {what the worker may broaden slightly without asking}
- Auto-flag: {what the worker should note but continue through}
- STOP and return PARTIAL: {what should halt completion}

## Claim strength discipline
Do NOT overstate confidence. This is a systematic issue in agent outputs:
- "Verified" means you checked the source and confirmed the claim. Pre-trained knowledge is NOT verified — label it "based on training data" or "unverified."
- Do not upgrade hedged language to absolute claims. "One of the strongest predictors" is not "the single strongest predictor." "Evidence suggests" is not "research proves."
- If you cannot access the original source, say so. Do not cite a paper you found in a search snippet as if you read it.
- When in doubt, understate rather than overstate. The orchestrator will flag weak claims — but cannot easily detect overstated ones.

## Process transparency requirements
The worker must disclose:
- methodology used
- key searches or checks run
- failed attempts or inaccessible sources
- shortcuts and structural biases
- what would most improve the result if re-dispatched

## Escalation triggers
{what should be escalated back to the orchestrator immediately}

## Governance reminder
You do not mutate project setup, change the plan, or deliver the final recommendation to the human.
```
