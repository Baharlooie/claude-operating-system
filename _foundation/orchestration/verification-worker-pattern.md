# Verification Worker Pattern

## Use when

Use this worker when a claim, fact set, assumption set, or line of reasoning needs explicit validation before it can safely support a recommendation.

Typical fit:

- important factual claims
- market or product statements
- assumptions that drive a recommendation
- claims where contradictory evidence would materially change the conclusion

## Worker contract

The worker receives:

- the full plan
- the specific claims or assumptions to verify
- the required verification standard
- the output format for status reporting

The worker does **not**:

- broaden into unrelated research
- make the final recommendation
- quietly downgrade the verification standard to get to closure

## Expected output

The output should contain:

- the claim or assumption tested
- status: `verified`, `not verified`, `inference only`, or `uncertain`
- supporting evidence and counterevidence
- whether the claim is safe to use in the final output
- what changes if the claim fails
- process transparency:
  - verification approach used
  - sources checked and any failed fetches
  - where evidence quality is weaker than ideal
  - what additional verification would most reduce uncertainty

## Quality checks

Before returning, the worker should verify:

- the conclusion matches the evidence strength
- search snippets are not treated as verified evidence
- counterevidence is surfaced, not buried
- the process-transparency section makes it clear how the verification conclusion was reached
