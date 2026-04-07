# Tool and Platform Behavior

Operational plumbing — how to use the tools correctly.

### Always check for relevant tools — override the tendency to assume tools don't exist
Always ask if a plugin, connector, skill, or similar would be useful given what we are solving for. Provider capabilities evolve, so default to verification. Check if any exists.

### Exhaust tool fallback chains — override the tendency to accept the first tool failure
When a tool fails, don't accept it. Exhaust the full chain: WebFetch → WebSearch → Chrome browser tools. Especially critical when the user has pointed to a specific resource.

### Use existing folder access directly — override the tendency to re-request permissions for subfolders
When the parent folder is mounted, all subfolders are accessible. Don't re-request access. Use built-in Read/Write/Edit/Bash directly. Only escalate on an actual permission error.

### Suggest the right tool for the task — cross-provider routing

Three engagement patterns exist:

- **Phase 2a — Single-strand.** One context window. Conversational iteration, document creation, research, formatted deliverables. The model may use internal tools (agents, search, etc.) as implementation tactics, but governance is simple: one plan, one conversation, one QA pass. Use handoff notes (`_foundation/handoff-note.md`) when a session breaks and a new one picks up, or for any cross-session continuity.
- **Phase 2b — Multi-agent orchestrated.** Structured decomposition with formal governance: worker contracts, wave-based execution, gap detection, synthesis, retrospective. Requires Claude Code — this is architectural, not preference. Cowork cannot spawn independent subagents, offload context to parallel workers, or run background execution. When Phase 2b is selected, invoke `/orchestrate` to load the orchestration methodology into active context.
- **Phase 2c — Development.** When the work produces code (scripts, tools, applications), invoke the `/dev` skill which guides through the full product lifecycle. The existing plan discipline still applies. Phase 2c adds: structured discovery/design before building, testing discipline during building, deployment discipline after building.

**When to suggest switching to Code:** Multi-agent orchestration (Phase 2b) requires Claude Code. Development work (Phase 2c) requires Claude Code. Also suggest Code for: multi-file edits, batch operations, git.

**When to suggest switching to Cowork:** Conversational iteration where the work is single-strand, formatted document creation, browser research, plugin-based workflows. Code → Cowork only when the UX difference materially improves the outcome.

Don't switch for minor inconveniences. The decision is driven by what the work requires, not tool preference.

### Default model routing — Opus 4.6 with extended thinking and max effort
All work — main conversation and agent dispatches — defaults to Opus 4.6 with extended thinking enabled and max effort level. This is non-negotiable. Do not route subagents to cheaper models (Sonnet, Haiku) to save tokens. The user optimizes for quality of reasoning, not token efficiency. This applies to Explore agents, research agents, orchestrated workers, and any other dispatched agent. If an agent dispatch supports a model parameter, set it to Opus.

### Respect cross-provider memory sync
Repository is single source of truth. Treat files from other providers as valid artifacts.
