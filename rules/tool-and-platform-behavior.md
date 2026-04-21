# Tool and Platform Behavior

Operational plumbing — how to use the tools correctly.

### Always check for relevant tools — override the tendency to assume tools don't exist
Always ask if a plugin, connector, skill, or similar would be useful given what we are solving for. Provider capabilities evolve, so default to verification. Check if any exists. **Concrete inventory of what's installed on this machine lives at `~/.claude/state/tool-inventory.md` — consult it before declaring a tool unavailable.**

### Pre-flight check before claiming "tool unavailable" — override the tendency to declare unavailability without verifying
Before any response containing "I don't have access to," "I can't fetch," "not available in this environment," or equivalent denial language — consult `~/.claude/state/tool-inventory.md`. If the inventory shows the capability exists, USE it. If the inventory is stale or unclear, run a 5-second check (`which <tool>`, `npx <tool> --version`, `python -c "import <module>"`) before declaring unavailable. Do not install a tool locally into a project subfolder without first verifying it isn't already installed globally — this has recurred (residence-permit Apr 20 redownloaded 111.5 MB Chromium despite global Playwright).

### Exhaust tool fallback chains — override the tendency to accept the first tool failure
When a tool fails, don't accept it. Exhaust the full chain: dedicated MCP tool/connector → WebFetch → WebSearch → Agent Reach CLI tools → computer use (browser/screen interaction). Especially critical when the user has pointed to a specific resource. Computer use is the last resort but IS a resort — "I can't access that" is almost never true if computer use is available.

### Prefer fast purpose-built CLIs over slow general-purpose MCPs
When the same capability exists as both a CLI and an MCP, default to the CLI unless the MCP is meaningfully better. CLIs are typically 10-75x faster per operation than MCPs (e.g., Playwright CLI ~100ms per browser action vs. a Chrome MCP's ~15s round trip). Fast CLIs also keep context cleaner — fewer tokens per tool call, no MCP tool-definition overhead. Only use the MCP when (a) no CLI equivalent exists, (b) the MCP provides structured outputs a CLI cannot easily produce, or (c) the CLI is significantly worse in ways that matter for this specific task. Agent Reach's Jina Reader (`curl https://r.jina.ai/URL`) is the canonical example — a CLI fallback that works faster and more reliably than WebFetch for many pages. Source: Garry Tan, "Thin Harness, Fat Skills" (2026-04-12).

### MCP features must include Bash/CLI fallback — override the tendency to build MCP-only paths
Any feature depending on MCP tools must include a Bash/CLI fallback path. MCP tool loading is not guaranteed across all environments (VS Code extension, terminal CLI, Desktop app). When writing skills or OS rules that reference MCP tools, always provide the CLI equivalent and instruct the model: "If MCP tools aren't in your tool list, use the CLI fallback without hesitation — don't tell the user the tool isn't available." This applies to qmd, Todoist, and any future MCP integration.

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

### Default model routing — always the best available model with maximum thinking and effort
All work — main conversation and agent dispatches — defaults to the **best available model at the time of invocation**, with **extended thinking enabled** and **maximum effort level**. This is non-negotiable.

**Settings to apply:**
- **Model:** the highest-capability model currently available in the Claude lineup (flagship tier — currently Opus, previously Opus 4.6, now Opus 4.7 as of April 2026). Within the flagship tier, pick the variant with the highest context window (e.g., the 1M context variant when available). **Forward-compatible by design:** when new models release, adopt them automatically — do not hardcode a specific version. The rule is "best available," not "specific version X."
- **Thinking level:** extended thinking enabled ("thinking" mode, not fast / expedient / response-speed mode).
- **Effort level:** maximum (`max` / `high` / whichever is the top of the current scale).

**Why:** The user optimizes for quality of reasoning, not token efficiency or speed. Do not route subagents to cheaper, smaller, or faster models to save tokens or reduce latency — that defeats the purpose of the operating system.

**Where this applies:**
- The main Claude Code or Cowork session
- Any dispatched agent (Explore, research, general-purpose, orchestrated workers, code reviewers, and any `subagent_type` passed to the Agent tool)
- Any tool, plugin, or integration that accepts a `model` parameter

**Where this does NOT apply:** only when the user explicitly instructs otherwise for a specific task (e.g., "use fast mode for this one," "be expedient," "don't think hard about this"). Respect that instruction for that turn or task only — revert to the default on the next task.

### Be service-minded — do as much for the user as possible, using all available tools including computer use
When a task involves steps the user would normally do manually (sign up for a service, find an API key, configure an integration, export data from a browser, verify something visually), **don't default to "here are the steps for you to do."** Instead:

1. **Ask yourself: can I do this for the user?** Check whether computer use, a CLI tool, an MCP connector, or a Bash command could accomplish the step directly.
2. **If yes, offer to do it.** "I can open Chrome, navigate to Todoist, and retrieve your API key — want me to do that?" The user can say no, but the option should be presented.
3. **If the step involves sensitive data** (passwords, financial accounts, personal credentials, healthcare data), **flag it explicitly** before acting: "This involves accessing your [X] account. I'll need your permission, and I won't store anything beyond what's needed for the task."
4. **If you genuinely can't do it** (e.g., physical action required, or the user must authenticate with biometrics), explain specifically why and what the user needs to do — don't give a vague "please do this manually."

**The principle:** Every time you're about to write "please do X manually" or "here are the steps for you to follow," pause and ask whether you could do some or all of those steps yourself. The user's time is the scarcest resource. Manual handoffs should be the exception, not the default.

**Computer use availability:** Only available in the **Claude Desktop app** (both Cowork and Claude Code modes). **NOT available in the VS Code extension.** Before referencing computer use as an option, check your tool set — if computer use tools aren't listed, you're in VS Code and should use CLI/Bash/Playwright alternatives instead. Don't promise capabilities you don't have.

**Computer use capabilities (when available in Desktop app):**
- Navigate any website in Chrome (read content, fill forms, click buttons, extract data)
- Open and interact with desktop applications
- Visually verify outputs (HTML artifacts, UI elements, layouts)
- Export data from browser extensions (e.g., cookie export)
- Complete multi-step workflows across different tools

**Computer use limitations:**
- Desktop must be active and awake
- Slower than dedicated API/CLI tools (use those first when available)
- Don't use for: financial accounts, healthcare data, legal documents, or apps containing others' personal data
- Still in research preview — complex tasks may need a second try

### Respect cross-provider memory sync
Repository is single source of truth. Treat files from other providers as valid artifacts.
