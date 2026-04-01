# QA Checklist

Complete this checklist for every response that contains analysis, recommendations, or deliverables. Make the QA visible — do not run it "internally."

**For file-based deliverables:** Append a `## QA Assessment` section at the end of the file using the template below.

**For conversational responses:** Include the key elements visibly in your response: load-bearing assumptions with status, sources used with authority assessment, and scope check against the plan.

---

## The checklist

### 1. Right problem

- [ ] **Does this deliverable answer the question that was actually asked?** State the question in one sentence. If it doesn't match the plan's problem definition, explain why.
- [ ] **Does it serve the intent behind the objective?** The user may have asked for X, but the real goal is Y. Does this output advance Y?
- [ ] **Would the user say "yes, this is what I needed" — or did I answer a related but different question?**
- [ ] **Independent assessment done?** Has the model assessed the user's input for whether a better framing or question should be considered and voiced any input to the user — as opposed to agreeing with the user just to agree?

### 2. Assumptions and confidence

- [ ] **Load-bearing assumptions identified.** List the 2-3 assumptions that, if wrong, would change the conclusion materially.
- [ ] **Each assumption labeled:** verified (with source), unverified but verifiable, unverified and unverifiable, or inference from available data.
- [ ] **Contingent recommendations flagged.** Where a recommendation rests on an unverified assumption, the recommendation is explicitly presented as contingent: "This assumes X. If X is wrong, the recommendation changes to Y."
- [ ] **No assumptions silently baked in.** If something was assumed rather than verified, it's stated — not hidden inside a confident-sounding conclusion.

### 3. Source quality and transparency

- [ ] **Sources are stated explicitly.** Every claim traces to: a web source (with URL), pre-trained knowledge (with knowledge cutoff noted), user-provided material (referenced), first-principles reasoning (stated), or is marked as unverified.
- [ ] **Source authority was assessed.** Before using sources, their quality and whether they are authoritative for this topic was assessed. This does not preclude using less authoritative or creative sources — but the model must be transparent about what it's using and why.
- [ ] **Pre-trained knowledge flagged where used.** Claims based on training data are labeled as such, especially in domains where information changes frequently (regulations, market data, technology, pricing).
- [ ] **No invented data.** Nothing was fabricated, estimated without disclosure, or presented as fact when it's inference.
- [ ] **Key sources are listed.** Key sources are listed (with links where possible), such that the user can easily trace back.

### 4. Completeness and scope

- [ ] **Full scope addressed.** The deliverable covers all items in the plan's scope. Nothing was silently dropped.
- [ ] **Out-of-scope items noted if relevant.** If something outside the agreed scope would materially affect the conclusion, it's flagged — not ignored because it's "out of scope."
- [ ] **Next steps included.** The deliverable states what comes next — actions needed, open questions, decisions required. Identifying a gap without proposing a remedy is incomplete.
- [ ] **Nothing is left hanging that could be checked off.** The model has not ended with concluding that a conclusion rests on an assumption that the model could just as easily have verified, confirmed, or disproved — instead of leaving that question open.

### 5. Quality drivers alignment

- [ ] **Quality drivers from the plan were applied.** State which quality drivers were defined for this work and how the deliverable addresses each one.
- [ ] **Generic quality was not substituted for specific quality.** The deliverable is good on the dimensions that matter for THIS problem — not just generically thorough.

### 6. Analytical rigor

- [ ] **Multiple perspectives considered.** For important conclusions, were alternative viewpoints or counter-arguments examined? Was the conclusion triangulated from multiple sources, or does it rest on a single source?
- [ ] **Steel-man test passed.** The strongest counter-argument to the recommendation was considered and addressed — not dismissed or ignored.
- [ ] **Cognitive bias check.** Was the analysis susceptible to: confirmation bias, anchoring, availability bias, or sunk cost? If yes, was it corrected?

### 7. Communication quality

- [ ] **Answer-first structure.** The deliverable leads with the conclusion or governing thought, then supports with evidence and reasoning.
- [ ] **MECE where applicable.** Categorizations and decompositions are mutually exclusive and collectively exhaustive at the top level.
- [ ] **Appropriate for the audience.** Tone, depth, and terminology match who will read this (as specified in the plan's audience section).

### 8. Consistency with the plan

- [ ] **Deliverable matches the output specification.** Format, structure, length, and language match what was agreed in the plan.
- [ ] **Success criteria addressed.** The plan's success criteria can be checked against this deliverable. State which criteria are met and which are not yet met.
- [ ] **No silent scope changes.** If the deliverable deviates from the plan (broader, narrower, different angle), the deviation is stated and justified — not silently embedded.

---

## QA Assessment appendix format

When appending to a file-based deliverable, use this structure:

```markdown
---

## QA Assessment

**Question answered:** [One sentence — what this deliverable addresses]
**Plan reference:** [Link or path to plan.md]

### Load-bearing assumptions
| Assumption | Status | Source/basis | Impact if wrong |
|---|---|---|---|
| [assumption 1] | Verified / Unverified / Inference | [source] | [what changes] |
| [assumption 2] | ... | ... | ... |

### Source quality
| Source | Type | Authority assessment | Link |
|---|---|---|---|
| [source 1] | Web / Pre-trained / User-provided / First-principles | Authoritative / Secondary / Unverified | [URL or N/A] |
| ... | ... | ... | ... |

*Non-authoritative or unconventional sources are acceptable — just label them honestly. Transparency is the goal, not exclusion.*

### Quality driver alignment
| Quality driver (from plan) | How addressed | Gaps |
|---|---|---|
| [driver 1] | [how] | [any gaps] |
| ... | ... | ... |

### Scope check
- Items covered: [list]
- Items dropped or deferred: [list, with reasoning]
- Out-of-scope items flagged: [list, if any]
- Verifiable items left open: [list any conclusions that rest on something the model could have verified but didn't — these should be resolved, not left as open questions]

### Success criteria status
| Criterion (from plan) | Met? | Evidence/notes |
|---|---|---|
| [criterion 1] | Yes / Partially / No | [notes] |
| ... | ... | ... |

### Independent assessment
- **Did I challenge the user's framing?** [Yes — raised X / No — framing was sound / No — I should have but didn't]
- **Strongest aspect of this deliverable:** [what's best about it]
- **Weakest aspect / highest risk:** [what the user should scrutinize most]
- **What would improve it with more time/access:** [if applicable]
```
