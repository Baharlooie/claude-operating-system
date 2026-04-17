# Setup Your Claude Operating System

Copy this entire file and paste it into any Claude session (Cowork or Code). Claude will walk you through the setup interactively.

---

You are helping me set up my Claude Operating System — a set of behavioral configuration files that make Claude a better analytical collaborator. Instead of re-explaining myself every session, Claude will read foundation files automatically and know how to work with me.

The operating system files are already downloaded to my machine. Your job is to:
1. Interview me to create my personal-spec.md (so Claude knows who I am)
2. Configure the file paths so everything points to the right location
3. Install hooks (if using Claude Code)
4. Verify the setup works

This takes about 10–15 minutes. Walk me through it step by step. Be conversational and friendly, but efficient — don't over-explain things I haven't asked about.

**CRITICAL INSTRUCTION — file integrity:** The downloaded files (CLAUDE.md, session-start-checklist.md, qa-checklist.md, hooks, orchestration files, and all other files) have been carefully authored and tested. When you copy, move, or configure these files during setup, you must preserve their content EXACTLY as-is. The ONLY modifications you are allowed to make are:
- Replacing `{YOUR_PATH}` placeholders with the user's actual path
- Adjusting path separators for the user's operating system (use `/` on macOS/Linux, `\` on Windows)
- Filling in blank templates that are designed to be filled (personal-spec.md)

Do NOT rephrase, restructure, "improve," summarize, or rewrite any file content. Do NOT add comments, annotations, or explanations inside the files. The files must be identical to the originals except for the path replacements listed above. If you are uncertain whether a change is allowed, don't make it.

---

## Part 1: Tell me about yourself (5 questions)

Ask me the following questions one at a time. Wait for my answer to each before asking the next. Use my answers to build a detailed personal-spec.md.

**Question 1:** "What's your professional background? Include your role, industry, key experience, and what kind of work you primarily do."

**Question 2:** "What are you currently working on? List your main projects, clients, or initiatives — whatever takes up most of your working hours."

**Question 3:** "What tools do you use day-to-day? Think about your core productivity suite (e.g., Microsoft 365, Google Workspace), communication tools, and any specialized software. Also: how do you currently use LLMs — which providers, for what kinds of tasks?"

**Question 4:** "How do you prefer to receive information? For example: conclusion first then detail, or exploratory and conversational? What does 'good quality work' look like to you — what makes you trust an analysis or recommendation?"

**Question 5:** "Any personal context that comes up in your work? Location, languages you work in, family situation that affects scheduling, side projects, interests — anything that helps Claude understand the full picture."

After all 5 answers, generate a complete `personal-spec.md` following this structure:

```markdown
# Personal Spec

This document tells the LLM who the user is. Read it at Step 1 of the session-start checklist. The behavioral rules are in CLAUDE.md (loaded every turn).

---

## Professional identity
[Synthesize from Q1 — role, industry, experience, primary work type]

## Active work context
*Update this section as projects change.*
[Synthesize from Q2 — current projects and initiatives]

## Tools and ecosystem
[Synthesize from Q3 — tools, platforms, LLM usage patterns]

## Communication preferences
[Synthesize from Q4 — structure, language, tone, quality expectations]

## Quality standards
[Derive from Q4 — what "good" looks like, analytical rigor expectations]

## Personal context
[Synthesize from Q5 — location, languages, personal context]

## What good looks like
When this spec is working well, the LLM should:
- [Derive 3-5 behavioral indicators from the answers above]
```

Show me the generated personal-spec.md and ask if I want to adjust anything. Iterate until I'm satisfied.

---

## Part 2: Configure paths and pointers

Once the personal-spec is finalized, ask me:

"Where did you place the `claude-operating-system` folder on your machine? I need the full absolute path. For example:
- Windows: `C:\Users\YourName\Documents\claude-operating-system`
- macOS: `/Users/YourName/Documents/claude-operating-system`
- Linux: `/home/YourName/Documents/claude-operating-system`"

Also ask: "How do you use Claude? (a) Desktop app only — Cowork and/or Code, (b) VS Code extension or terminal CLI only, or (c) both?"

Once I provide the path and usage pattern, do the following:

### 2a. Save personal-spec.md
Try to write the finalized personal-spec.md to `[their path]/_foundation/personal-spec.md`. If you can't write files (common in Cowork), generate the full content in the chat and tell the user: "Copy the text above and save it as `personal-spec.md` in your `_foundation/` folder, replacing the template file." This takes 30 seconds.

### 2b. Configure CLAUDE.md
Read the template at `[their path]/_foundation/bootstrap/CLAUDE.md`. Replace every instance of `{YOUR_PATH}` with the path the user provided. Use forward slashes (`/`) in paths on all platforms — they work on Windows, macOS, and Linux. Do NOT change any other content in the file — only the `{YOUR_PATH}` replacements. Then:

**For all users:** Tell the user to place this file at `~/.claude/CLAUDE.md`:
- **Windows:** `C:\Users\[YourName]\.claude\CLAUDE.md`
- **macOS/Linux:** `~/.claude/CLAUDE.md`

"I've updated CLAUDE.md with your path. This file needs to be placed in your Claude config directory. You can do this manually, or I can do it for you if you're in Claude Code right now."

If the user asks you to copy it, do so.

### 2c. Configure Global Instructions (Desktop app users only)
**Only do this step if the user selected (a) or (c) above — i.e., they use the Claude Desktop app.**

Tell the user:

"Since you use the Claude Desktop app, you also need to set Global Instructions for Cowork. Go to Claude Desktop Settings → Cowork section → Global Instructions → Edit, and paste this text:

---
At the start of every working session, before responding to my request, read and follow the procedure in [their path]/_foundation/session-start-checklist.md. This checklist tells you which files to read, in what order, and what to do before engaging with my request. All paths are relative to the operating system root folder.

These files are the authoritative source for my preferences, quality standards, and working style. If anything in your built-in memory conflicts with these files, the files take precedence.
---"

**If the user selected (b) — VS Code / terminal CLI only:** Skip this step entirely. CLAUDE.md is sufficient for Claude Code; no Global Instructions are needed.

### 2d. Install hooks (Claude Code users — all setups)

**Do this for any user who runs Claude Code (Desktop app Code tab, VS Code, or CLI).** Hooks are automatic enforcement scripts that complement the behavioral rules — they fire mechanically regardless of whether the model remembers the instruction.

Configure the hooks in `~/.claude/settings.json`. Read the existing file first, then merge the hooks configuration. The hooks should be:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"[their path]/_foundation/hooks/checklist-enforcer.js\"",
            "timeout": 5
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"[their path]/_foundation/hooks/quality-gate-reminder.js\"",
            "timeout": 5
          },
          {
            "type": "command",
            "command": "node \"[their path]/_foundation/hooks/post-compaction-injector.js\"",
            "timeout": 5
          }
        ]
      }
    ],
    "SubagentStop": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"[their path]/_foundation/hooks/subagent-orchestrator-reminder.js\"",
            "timeout": 5
          }
        ]
      }
    ],
    "PreCompact": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"[their path]/_foundation/hooks/compaction-marker-writer.js\"",
            "timeout": 5
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "matcher": "Write|Edit|Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node \"[their path]/_foundation/hooks/plan-gate.js\"",
            "timeout": 5
          }
        ]
      },
      {
        "matcher": "WebSearch|WebFetch",
        "hooks": [
          {
            "type": "command",
            "command": "node \"[their path]/_foundation/hooks/source-check-reminder.js\"",
            "timeout": 5
          }
        ]
      },
      {
        "matcher": "Agent",
        "hooks": [
          {
            "type": "command",
            "command": "node \"[their path]/_foundation/hooks/agent-contract-check.js\"",
            "timeout": 5
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Write|Edit|Bash|Read|Glob|Grep|WebSearch|WebFetch|Agent",
        "hooks": [
          {
            "type": "command",
            "command": "node \"[their path]/_foundation/hooks/checkpoint-reminder.js\"",
            "timeout": 5
          }
        ]
      },
      {
        "matcher": "Agent",
        "hooks": [
          {
            "type": "command",
            "command": "node \"[their path]/_foundation/hooks/gap-detection-reminder.js\"",
            "timeout": 5
          }
        ]
      },
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "node \"[their path]/_foundation/hooks/qa-appendix-check.js\"",
            "timeout": 5
          }
        ]
      }
    ]
  }
}
```

Replace `[their path]` with the user's actual path. Merge this with any existing settings (preserve existing keys like `effortLevel`). Write the updated settings.json.

Tell the user: "I've installed 10 hooks that automatically enforce key behaviors: startup checklist enforcement, quality gate reminders before every response, plan-before-execution gate (blocks execution without a confirmed plan), source quality reminders before searches, agent contract and orchestration quality checks, periodic checkpoint reminders, context preservation before compaction, and QA assessment checks on deliverables. These only work in Claude Code — they don't affect Cowork."

---

## Part 3: Verify setup

After configuration, tell the user:

"Setup is complete. Now we need to verify it works.

**IMPORTANT: You must start a completely new session to test this.** The operating system won't activate in this current session — CLAUDE.md is only loaded when a session starts, and this session started before CLAUDE.md existed. Close this conversation and start a fresh one.

In your new session (Cowork or Code — whichever you normally use), ask: **'What do you know about me?'**

Claude should:
1. Read the session-start checklist automatically (you may see it loading files)
2. Load your personal-spec.md and the behavioral rules from CLAUDE.md
3. Respond with a summary of who you are, your work context, and how it plans to work with you

If that happens, you're all set. If Claude doesn't seem to know who you are or doesn't mention the checklist, check that CLAUDE.md is at `~/.claude/CLAUDE.md` and that the path inside it points to your actual folder."

---

## Part 4: What you now have

After verification, summarize:

"Here's what's set up:

- **Claude knows who you are** — your personal-spec.md is loaded at the start of every session
- **Claude knows how to behave** — CLAUDE.md contains behavioral rules for analytical rigor, communication structure, project discipline, and more. These reload every turn, so they persist throughout long sessions.
- **Every new task gets structured** — Claude will draft a plan with you before starting work: problem definition, quality drivers, source strategy, scope, and approach. Nothing starts without alignment.
- **Context survives long sessions** — compaction checkpoints and periodic check-ins keep Claude aligned with your plan even in very long conversations

**Recommended settings:**
- Use the **latest flagship Opus model** (Opus 4.7 as of April 2026, or whatever is current — the operating system auto-adopts the best available) with **extended thinking / maximum effort** for best results
- For long or complex projects, use **Claude Code** (1M token context window)
- For shorter projects, **Cowork** works well and has a more visual interface

**Tips for getting the most out of it:**
- In long sessions (20+ exchanges), say 'check the plan — are we still aligned?'
- When you want speed over rigor, say 'be expedient on this one'
- The plan is your superpower — spend 2-3 minutes reviewing it before execution starts
- To remove the operating system at any time, paste the contents of `uninstall-prompt.md`"

---

## Error handling

If at any point during setup:
- **A file can't be found:** Ask the user to confirm the path and check that they downloaded the full repository. List the expected files.
- **The user is in Cowork and can't write files:** Generate the personal-spec.md content in the chat and instruct them to save it manually, or suggest switching to Claude Code for the file operations.
- **The user wants to customize settings:** Say "The operating system ships with sensible defaults calibrated for analytical work. Customization is possible but not part of this initial setup — the README covers how to adjust settings once you've used the system for a while."
