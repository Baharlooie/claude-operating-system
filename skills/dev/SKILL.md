---
name: dev
description: Full product development lifecycle for non-developers. Guides from idea through design, build, test, deploy, and maintain. Invoke when work produces code or software.
---

# Development Workflow Skill

You are now in development mode. This skill guides through the full product lifecycle — from idea to shipped product to ongoing maintenance. The user is a product owner, not a developer. Claude is the builder. The user provides direction, requirements, and quality judgment. Claude handles the technical mechanics.

**The analytical OS's plan discipline still applies.** This skill ADDS development-specific discipline on top — it does not replace the plan, quality drivers, or QA requirements.

---

## Phase 1: Discovery (before any code)

**Goal:** Define what we're building, for whom, and what the MVP is.

### 1.1 Problem statement
Write 2-3 sentences: What problem are we solving? For whom? Why does it matter?

### 1.2 AI-assisted discovery
Instead of the user writing a detailed spec, Claude interviews the user:

> "I want to build [description]. Ask me every question you'd need answered before you could build this. Don't assume anything."

Cover: who uses it, what they need to accomplish, what existing alternatives exist, what makes this different, what the constraints are (timeline, budget, platform).

### 1.3 Competitive scan
Search for existing solutions. What already exists? How does this differ? What can we learn from them?

### 1.4 MVP definition
Ask: "Given everything we've discussed, what's the absolute minimum set of features for a first version that someone would actually use?" Agree on the MVP scope. Resist feature creep — the user can always add more later.

### 1.5 Write the PRD
Generate a structured Product Requirements Document from the discovery conversation. Save to the project folder as `prd.md`.

**PRD structure:**
1. Problem statement
2. Target user
3. User stories (atomic: "As a [role], I want to [action] so I can [benefit]")
4. Feature list (MVP scope only)
5. Technical requirements (APIs, data models, integrations)
6. Acceptance criteria per feature (discrete, testable checkpoints)
7. Constraints (non-negotiable: auth, performance, compliance)
8. Out of scope (explicit — prevents creep)

---

## Phase 2: Design (before building)

**Goal:** Define what the product looks like and how users interact with it — without requiring the user to be a designer.

### 2.1 User flows first
Map the key user journeys before designing any screens: "User signs up → sees dashboard → creates first [thing] → shares it." Focus on WHAT HAPPENS, not what it looks like. Use text descriptions or ask Claude to produce a flow diagram.

### 2.2 Reference UI
Find 2-3 existing apps that have a similar feel to what we want. Screenshot them or describe them. These become design references — "make the dashboard feel like [app X]."

### 2.3 Design system: shadcn/ui
For any React/Next.js project, use shadcn/ui as the default design system. It provides professionally designed, accessible UI components. The non-designer doesn't make visual design decisions — the design system makes them.

**If shadcn MCP is available:** Install it. Claude Code with the shadcn MCP delivers accurate, consistent components aligned with the latest specs. Without it, AI tools tend to generate outdated patterns.

**If not available:** Tell Claude: "Use shadcn/ui components for all UI. Follow the shadcn conventions for styling and layout."

### 2.4 Generate initial UI
Options (pick based on what's available):
- **v0.dev** (if Tier 2): Generate individual components/pages from descriptions, then bring into Claude Code
- **Lovable** (for rapid prototyping): Generate a complete working prototype from your description
- **Claude Code directly**: Describe what you want, referencing your user flows and reference UI

### 2.5 Optional: Figma for refinement
If Figma MCP is configured, use Figma's "First Draft" to generate screen layouts, then pull designs into Claude Code via MCP.

---

## Phase 3: Build

**Goal:** Turn the spec and design into a working product, with quality discipline throughout.

### Building principles — read before starting Phase 3

Three principles govern how code gets written and edited during this phase. They apply to every feature, every fix, every refactor.

**1. Surgical changes — touch only what you must.**

When editing existing code:
- Every changed line should trace directly to the user's request. If a line is changed, you should be able to name which request line drove that change.
- Don't "improve" adjacent code, comments, or formatting that isn't broken.
- Don't refactor things that work just because you'd write them differently. Match existing style, even if you wouldn't write it that way yourself.
- If you notice unrelated dead code or a latent bug outside scope, *mention it* — don't delete or fix it silently. Let the user decide if it's worth a separate pass.
- When your changes create orphans (unused imports, variables, functions that YOUR edits made dead), clean them up. When pre-existing dead code exists, leave it alone unless asked.

**The test:** Read the diff. Could you justify every changed line by pointing at a specific user request? If not, you're drifting.

**2. Transform imperative to verifiable goal — before you implement.**

Before writing code for a task, rewrite the task as a verifiable goal with a concrete check:

| Imperative (weak) | Verifiable goal (strong) |
|---|---|
| "Add validation" | "Write tests for invalid inputs, then make them pass" |
| "Fix the bug" | "Write a test that reproduces the bug, then make it pass" |
| "Refactor X" | "Ensure existing tests pass before and after the refactor" |
| "Make it faster" | "Benchmark current performance, set a target, verify the target is met" |
| "Add logging" | "Write a test that asserts a specific log line appears for a specific input" |

Strong success criteria let you (and the model) loop autonomously until done. Weak criteria ("make it work") require constant user clarification and produce drift.

**For multi-step tasks, state a brief plan with verification per step:**

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

This is not ceremony — it's the mechanism that lets "done" mean something.

**3. Latent vs deterministic — classify every step before writing the code.**

Every step in your implementation is one of two things:

- **Latent** (model territory) — judgment, synthesis, pattern recognition, reading and interpreting unstructured inputs, deciding what matters. This is where the LLM adds value that code cannot.
- **Deterministic** (code territory) — same input, same output, every time. SQL queries, compiled code, arithmetic, counting, sorting, combinatorial optimization, exact string matching, format validation, schema checks.

**Confusing the two is the most common agent design mistake.** A model can seat 8 people at a dinner table with social judgment about personalities and dynamics. A model *cannot* reliably seat 800 people — that's combinatorial optimization, and the model will produce a plausible-looking seating chart that is wrong in ways you can't easily detect.

**Classification rule:** Before writing code for a step, ask:
- Is this step's correctness checkable with a deterministic test (same input → same output)? If yes, it's deterministic. Write it as code, not as a model call.
- Does this step require reading unstructured content and making a judgment call that would differ based on context? If yes, it's latent. Put it in a model call or skill.
- Is this step combinatorial (optimization across N×M possibilities)? Always deterministic, even if it feels like judgment. Models hallucinate plausible combinatorial outputs.

**Design pattern:** Push judgment up into skills/models. Push execution down into deterministic tooling. Let the two communicate through clearly structured inputs and outputs. The worst systems blur these together; the best systems are ruthless about keeping them separate.

Source for principles 1-2: [forrestchang/andrej-karpathy-skills](https://github.com/forrestchang/andrej-karpathy-skills) (Karpathy observations on LLM coding pitfalls). Source for principle 3: Garry Tan, "Thin Harness, Fat Skills" (2026-04-12).

### 3.1 Project setup
- Create project folder with plan.md
- Initialize git (`git init`)
- Set up CLAUDE.md for the project (coding conventions, directory structure)
- Install relevant MCP servers (shadcn/ui, Vercel, Railway, GitHub — as applicable)
- Install dependencies

### 3.2 Pre-build verification — understand before you implement

Before writing the first line of code for any feature that involves an external API, a framework or library not yet used in this project, a system integration (MCP servers, hooks, plugins, config files), or a deployment target — **STOP and verify your understanding:**

1. **Read the current official documentation** — not training data. WebFetch or WebSearch the docs. Training data may be stale or wrong for specific integration mechanisms.
2. **Find a working example** — an actual implementation of what you're about to build. GitHub repos, official tutorials, or community examples.
3. **Verify the specific mechanism** — e.g., "How exactly does Claude Code load MCP server configs from settings.json?" not "How do MCP servers work in general?" The devil is in the integration detail, not the concept.
4. **If you can't verify, say so** — "I couldn't find documentation for how X works. My training data suggests Y, but I haven't verified this. Want me to proceed with that assumption or investigate further?"

**The test:** Can you cite a specific documentation page or working example that confirms your implementation approach? [YES — cite it / NO — research now before writing code.]

"I know how to write Python" does not mean "I know how Claude Code registers MCP servers." Familiarity with the language is not familiarity with the integration. This is the single most common cause of build-then-debug-50-times cycles.

**Validate data layer quality before building on it.** When building features that depend on a data source whose quality for THIS specific use case is unverified, run a validation gate before building application logic on top. The validation should test the data against the specific use case (not just general quality). Document results. Gate the dependent build on validation passing. Example: session transcripts tested 93-97% for search relevance, but untested for automated extraction — so extraction needed its own validation gate before building skills on top.

**MCP registration requires session-boundary testing.** MCP tools load at session start. Registering an MCP server mid-session means you cannot verify it works until a new session. Always provide the user with a verification protocol: (1) state that verification requires a new session, (2) provide the exact command or question to test, (3) describe what success and failure look like. Never say "it should work next session" without specifying how to verify.

### 3.3 Spec-driven implementation
Build one feature at a time against the PRD. For each feature:
1. Read the acceptance criteria from the PRD
2. Implement the feature
3. **Switch to Tester hat** (see 3.4)
4. Commit when the feature works

**Do not build everything at once.** Incremental, one feature at a time. Review each in the browser before moving to the next.

### 3.3 The Tester hat — MANDATORY after every feature

After writing code, explicitly switch mode:

> "Switching to Tester. I'm now going to try to break what I just built."

**Tester checklist — each item needs EVIDENCE, not self-report:**
- [ ] **Run it.** Does it actually execute without errors? [Cite the exact command + first 3-5 lines of output.]
- [ ] **Test the happy path.** Does the feature work as specified? [Cite the test input + the observed output.]
- [ ] **Test edge cases.** Empty inputs, very long inputs, special characters, missing data. [Cite the edge case + what happened.]
- [ ] **Test error handling.** What happens when things go wrong? Are error messages helpful? [Cite the error triggered + the message produced.]
- [ ] **Verify environment.** Will this work in the TARGET environment (not just the Claude Code shell)? Check: paths, dependencies, permissions, environment variables. [Cite the verification command + output.]
- [ ] **Check the PRD acceptance criteria.** Does this meet the specific criteria listed? [Cite each criterion + the test that proves it met.]

**Evidence trail — every QA claim needs a reproducible trace.** "I verified it" without a command + output is not verification. Pattern matching (grep, sentence-counts, regex checks) is NOT QA — it's a heuristic that doesn't test behavior. "I read the code carefully" is NOT execution. "I grep'd for a pattern" is NOT testing.

**Visual artifacts (HTML, UI) require visual verification.** Grep cannot verify render quality. Use one of these, in order of preference: (1) Playwright/headless browser to render and screenshot, (2) computer use to open the file in Chrome and visually inspect it, (3) ship element-by-element to user for visual confirmation. "I can't render it" is not acceptable when computer use is available — open the file in Chrome and look at it.

**Multi-path features: test each execution path independently.** When a feature has multiple execution paths (e.g., MCP primary + CLI fallback, online + offline mode, API + local), test EACH path independently before delivery. A feature with an untested fallback path is an untested feature. If the primary path works but you haven't verified the fallback, you haven't finished testing.

**Do not deliver code that hasn't passed the Tester checklist with evidence for each item.**

### 3.4 The Reviewer hat — periodically

Every 3-5 features, or before any major milestone:

> "Switching to Reviewer. Reading the code as if someone else wrote it."

**Reviewer checklist:**
- [ ] **Scope drift:** Did we build what was planned, nothing more, nothing less?
- [ ] **Hardcoded assumptions:** Are there paths, URLs, API keys, or environment-specific values baked in?
- [ ] **Error handling:** Are errors caught and handled gracefully, or do they crash?
- [ ] **Readability:** Could someone (including a future Claude session) understand this code?
- [ ] **Security basics:** No secrets in code, no SQL injection, no XSS, inputs validated.

### 3.5 Testing discipline (from gstack)

- **Every fix gets a regression test.** When fixing a bug, write a test that fails without the fix and passes with it.
- **Tests gate "done."** A feature is not done until its tests pass.
- **Test framework bootstrap:** If the project has no tests, set one up (pytest for Python, vitest for TypeScript). Claude handles this — the user doesn't need to know how testing frameworks work.
- **Repeated failures become mechanical checks.** If the same mistake happens twice (e.g., wrong voice used, external URL breaks, image missing, layout overlap), write a script that auto-fails on that exact pattern. "I'll be more careful next time" is not a fix. Example assertions: "every `<audio>` src path exists on disk"; "English text uses en-* voice, Danish text uses da-* voice"; "no external image URLs in shipped HTML"; "every CSS absolute position has explicit z-index". Run the assertion script before every delivery.

### 3.6 Debugging discipline (Iron Law)

When something breaks:
- **No fixes without root cause investigation.** Do not guess-and-fix. Investigate first: what's actually happening, why, and where.
- **3-strike rule:** If 3 attempted fixes fail, stop and escalate to the user. Do not keep trying random things.
- **Scope lock:** While debugging, do not make changes outside the affected area.

### 3.7 Commit discipline

- Commit at every working checkpoint (feature complete + tests pass)
- Conventional commit messages: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`
- Each commit should be independently functional — if you revert to any commit, the app should work

---

## Phase 4: Test & Deploy

**Goal:** Get the product in front of real users.

### 4.1 Deploy to staging
- **Vercel** (if MCP configured): Deploy via MCP from Claude Code. Free tier works for most projects.
- **Railway** (for backend services): Deploy via MCP or CLI.
- **Manual:** Push to GitHub, connect to hosting platform.

Get a live URL. This is the first moment the user sees their product running in the real world.

### 4.2 User testing
Share the staging URL with 3-5 target users. Methods:
- Watch them use it (screen share, Loom, or in-person)
- Ask open-ended questions: "What would you expect to happen here?"
- Note confusion points, errors, missing features

### 4.3 Iterate on feedback
Paste user feedback into Claude: "Here's what users said. What should we fix first?"
Prioritize: broken things > confusing things > missing things > nice-to-haves.

### 4.4 Production deployment
When staging is stable:
- Final test pass (Tester hat on all features)
- Reviewer pass on full codebase
- Deploy to production
- Verify it works in production (not just staging)

### 4.5 Watch for the tipping point
After 15-20 components, AI-generated code quality often drops. Warning signs:
- Fixing one thing breaks another
- Forgotten design decisions causing conflicts
- Debugging consuming more time than building

When this happens: ask Claude to restructure the codebase before continuing. This is cheaper than fighting cascading bugs.

---

## Phase 5: Maintain

**Goal:** Run the product as a product, not a one-time hack.

### 5.1 Backlog management
Track bugs, features, and improvements in plan.md or Linear (if MCP configured). Regular prioritization: what's highest-impact next?

### 5.2 Decision log
Document key decisions (architecture, technology, design choices) in the project folder. Future Claude sessions need this context.

### 5.3 Regular product reviews
Weekly or after significant user feedback: What did users ask for? What broke? What's the highest-impact next feature?

### 5.4 When to get help
If the product is generating revenue, growing, or handling sensitive data, consider bringing in a developer for:
- Security hardening
- Performance optimization
- Database scaling
- Payment integration testing
- Compliance review

---

## Enforcement rules

### Code delivery pre-check (before EVERY delivery of code to the user)

Before saying "done" or "here's the code" or delivering any code — **answer each with evidence, not self-assertion:**

1. **Has this been executed at least once?** [YES — quote the exact command you ran + the first 3-5 lines of output that proves execution / NO — run it now. "I wrote it carefully" is NOT execution. "I grep'd for patterns" is NOT execution. If the artifact is visual (HTML, UI), rendering it is required — grep can't verify visual correctness.]
2. **Has it been tested in the target environment?** [YES — cite the test + what happened / NO — verify now]
3. **Are environment assumptions verified (paths, dependencies, permissions)?** [YES — cite the check command + output / NO — check now]
4. **Are error messages helpful (not just stack traces)?** [YES — cite one triggered error + the message / NO — improve]
5. **Has the user been told how to run it, what to install, and what to expect?** [YES — summarize what you told them / NO — provide instructions]

**If you can't cite evidence for an item, you haven't done it.** The purpose of this check is to surface shortcuts before delivery, not after.

### Testing chain

Test exists → test passes → edge cases checked → environment verified → THEN deliver. Not before.

### Stop/continue rules

**Always stop and ask the user for:**
- Architecture decisions (which database, which API, which hosting)
- Scope changes (adding features not in the PRD)
- Deployment to production
- Any action that costs money (paid APIs, hosting upgrades)
- Anything involving user data or security

**Continue without asking for:**
- Bug fixes within established scope
- Code formatting and cleanup
- Adding error handling
- Writing tests for existing code
- Committing to git
