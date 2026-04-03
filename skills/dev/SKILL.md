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

### 3.1 Project setup
- Create project folder with plan.md
- Initialize git (`git init`)
- Set up CLAUDE.md for the project (coding conventions, directory structure)
- Install relevant MCP servers (shadcn/ui, Vercel, Railway, GitHub — as applicable)
- Install dependencies

### 3.2 Spec-driven implementation
Build one feature at a time against the PRD. For each feature:
1. Read the acceptance criteria from the PRD
2. Implement the feature
3. **Switch to Tester hat** (see 3.3)
4. Commit when the feature works

**Do not build everything at once.** Incremental, one feature at a time. Review each in the browser before moving to the next.

### 3.3 The Tester hat — MANDATORY after every feature

After writing code, explicitly switch mode:

> "Switching to Tester. I'm now going to try to break what I just built."

**Tester checklist:**
- [ ] **Run it.** Does it actually execute without errors?
- [ ] **Test the happy path.** Does the feature work as specified?
- [ ] **Test edge cases.** Empty inputs, very long inputs, special characters, missing data.
- [ ] **Test error handling.** What happens when things go wrong? Are error messages helpful?
- [ ] **Verify environment.** Will this work in the TARGET environment (not just the Claude Code shell)? Check: paths, dependencies, permissions, environment variables.
- [ ] **Check the PRD acceptance criteria.** Does this meet the specific criteria listed?

**Do not deliver code that hasn't passed the Tester checklist.**

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

Before saying "done" or "here's the code" or delivering any code:

1. **Has this been executed at least once?** [YES/NO — if NO, run it now]
2. **Has it been tested in the target environment?** [YES/NO — if NO, verify]
3. **Are environment assumptions verified (paths, dependencies, permissions)?** [YES/NO — if NO, check]
4. **Are error messages helpful (not just stack traces)?** [YES/NO — if NO, improve]
5. **Has the user been told how to run it, what to install, and what to expect?** [YES/NO — if NO, provide instructions]

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
