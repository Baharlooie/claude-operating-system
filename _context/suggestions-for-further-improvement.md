# Suggestions for Further Improvement

This file is a staging buffer for potential operating system improvements. Entries are proposed by the model during sessions when a correction, pattern, or gap suggests a missing or imprecise rule. They are **not** entered into the operating system automatically — the user reviews this file periodically and decides what to incorporate.

**How to use this file:**
- Review periodically (after completing projects, or when starting a new round of operating system work)
- For each entry: decide whether to incorporate, modify before incorporating, or discard
- Once incorporated into the operating system, mark the entry as [INCORPORATED] or delete it
- Entries that don't get incorporated after two review cycles should be discarded (if the pattern hasn't recurred, the rule probably isn't needed)

**Format for entries:**

---
**[YYYY-MM-DD] — [Brief label]**
- **Gap observed:** What pattern, correction, or failure mode prompted this suggestion
- **Proposed rule:** The rule language that would address it
- **Target file:** Which operating system file it would go into
- **Status:** [Proposed / Incorporated / Discarded]

---

---
**[2026-03-28] — Agent dispatch must include contracts with override of startup sequence**
- **Gap observed:** When dispatching sub-agents for research tasks, the orchestrator (1) did not provide agent contracts with quality drivers, source strategy, or output format, and (2) the agents read CLAUDE.md, triggered the startup checklist, and created new project folders and plans — treating themselves as new sessions rather than contracted workers within an existing project.
- **Proposed rule:** Add to CLAUDE.md behavioral rules (orchestration section) or as a standing dispatch discipline: "When dispatching any sub-agent — whether formal Phase 2b workers or informal research agents — provide a contract that includes: the specific assignment, quality drivers for this task, source strategy, output format, and where to file results. The contract must explicitly state: 'You are working within [project name]. Do not create a new project folder. Do not run the startup checklist. Work within [path] and file outputs there.' This overrides the default CLAUDE.md startup behavior for sub-agents. The step-zero and quality-driver triggers apply to agent dispatch just as they do to any other work."
- **Target file:** CLAUDE.md (behavioral rules, possibly a new "Agent dispatch discipline" subsection under Project Process Discipline)
- **Status:** [INCORPORATED] — Added to CLAUDE.md as "Agent dispatch discipline" subsection under Project Process Discipline (2026-03-28)
