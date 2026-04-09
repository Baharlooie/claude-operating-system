<!-- qa-skip -->
# Tools and Skills Reference

Available tools and skills across the operating system. Claude should be aware of these and suggest them when relevant.

---

## Skills (invoke with /name in Claude Code)

### Workflow skills
| Skill | Command | When to use |
|---|---|---|
| **Development workflow** | `/dev` | When work produces code — scripts, tools, apps. Full lifecycle: discovery → design → build → test → deploy → maintain. |
| **Orchestration** | `/orchestrate` | When dispatching multiple agents for parallel work. Loads full orchestration protocol into context. |

### TTS skills (text-to-speech)
| Skill | Command | What it does |
|---|---|---|
| **TTS Convert** | `/tts-convert` | Converts MD → TTS-friendly MD. Replaces tables with prose, bullets with sentences, spells out abbreviations, adds spoken transitions. |
| **TTS Play** | `/tts-play` | Streams MD as audio on desktop via edge-tts + mpv. Starts playing within seconds. |
| **TTS Save** | `/tts-save` | Converts MD → MP3 file. Saves next to source file by default. |

**TTS chaining:**
- Quick desktop listen: `/tts-play` on any MD file
- Polished listen: `/tts-convert` → `/tts-play` on the converted file
- Mobile listening: `/tts-save` (saves MP3 → sync to mobile)
- Mobile + polished: `/tts-convert` → `/tts-save`

### Utility skills
| Skill | Command | What it does |
|---|---|---|
| **Browser Automation** | `/browser-automation` | Playwright playbook for authenticated web content, form filling, multi-page extraction, visual QA screenshots. Uses Chrome profile copy pattern. |
| **Image Utilities** | `/image-utils` | Download, resize, convert, optimize images. Pillow patterns, curl downloads, base64 encoding for HTML. |
| **Agent Reach** | `/agent-reach` | Web platform access — 14+ channels via CLI tools. Twitter, Reddit, YouTube, GitHub, LinkedIn, RSS, Exa search. |

### Design skills (impeccable.style — 21 skills)
| Skill | Command | What it does |
|---|---|---|
| **Polish** | `/polish` | Improve overall design quality of a component or page |
| **Audit** | `/audit` | Design audit — identify issues and propose fixes |
| **Typeset** | `/typeset` | Typography improvements |
| **Overdrive** | `/overdrive` | Push design to maximum visual impact |
| + 17 more | Various | Full design vocabulary for frontend work |

Installed via `npx skills add pbakaus/impeccable`. All 21 skills auto-detected by Claude Code.

### Session memory skills (learning loop)
| Skill | Command | What it does |
|---|---|---|
| **Session Reflect** | `/session-reflect` | Extract structured learnings from a completed session using 6-category framework (OS rules, skill gaps, tool gaps, process failures, user preferences, cross-project insights). Writes to `knowledge-base/staging/session-learnings/`. |
| **Session Patterns** | `/session-patterns` | Find system/behavior patterns across sessions. Two modes: Variation A (Guided Bootstrap — user-directed search across raw 434-session corpus) and Variation B (Codification Digest — from accumulated reflections, needs 10+). |
| **Content Patterns** | `/content-patterns` | Find topic/substance patterns across sessions. Synthesis memos on what we're learning about subject matter itself (parenting, career, etc.), not how we work. |

**The three skills form a pipeline:**
- `/session-reflect` → one session → "What did we learn?"
- `/session-patterns` → system/behavior → "What should change in how we work?"
- `/content-patterns` → topic/substance → "What are we learning about the subject itself?"

### Personal skills (not distributed)
| Skill | Command | What it does |
|---|---|---|
| **Child Artifact Builder** | `/artifact` | Interactive HTML learning artifacts for children. Project-specific. |
| **Daily Triage** | Scheduled task | Combines inbox sort + email scan for tasks + calendar scan. Runs at 10am daily or on demand. Located at `~/.claude/scheduled-tasks/daily-triage/`. |

---

## Plugins (Claude Code ecosystem)

| Plugin | Source | What it does |
|---|---|---|
| **Codex (OpenAI)** | `openai-codex` | Second opinion, parallel execution, code review, rescue delegation. Works for ANY task, not just code. |
| **Document Skills** | `anthropic-agent-skills` | Official Anthropic skills for creating PDF, DOCX, XLSX, PPTX documents. |
| **Example Skills** | `anthropic-agent-skills` | Official Anthropic skills: web-artifacts-builder, frontend-design, mcp-builder, webapp-testing, skill-creator, algorithmic-art, and more. |
| **Ralph Wiggum** | `claude-code-plugins` | Autonomous iteration loop. Claude works → Stop hook intercepts → re-feeds prompt → Claude improves. Repeats until completion criteria met. Use `--max-iterations` as safety cap. |
| **last30days** | `last30days-skill` | Multi-platform research agent. Searches Reddit, X, YouTube, TikTok, HN, Polymarket, GitHub, Bluesky simultaneously. Ranks by real engagement. Use `/last30days` for topic research. |

**Codex commands:**
- `/codex:review` — code review
- `/codex:adversarial-review` — challenges implementation decisions
- `/codex:rescue` — delegates ANY task to Codex as background subagent
- `/codex:status` / `/codex:result` / `/codex:cancel` — manage background tasks

**Ralph Wiggum usage:**
```
/ralph-loop "Build X. Requirements: Y. Output <promise>COMPLETE</promise> when done." --completion-promise "COMPLETE" --max-iterations 20
```

---

## MCP Servers

| Server | What it does | Scope |
|---|---|---|
| **qmd** | Session memory search — 434 indexed session transcripts. Search past reasoning, decisions, context. Use via Bash fallback: `qmd search "query"`. MCP registered but tools don't load in VS Code (known issue). | User (all projects) |
| **Context7** | Current, version-specific library/framework docs. Use before building against any API or library. 150M+ pre-indexed docs. | User (all projects) |
| **Exa** (via mcporter) | Semantic web search across the full internet. Free, no API key. | Project |
| **Todoist** | Task management — create/read/update/complete tasks, projects, sections, labels. | Project |
| **Gmail** | Read email, search messages, create drafts. | Available (needs auth) |
| **Google Calendar** | Calendar access. | Available (needs auth) |
| **Microsoft 365** | Outlook, OneDrive, SharePoint access. | Available (needs auth) |
| **Gamma** | AI presentation generation. | Available |
| **Learning Commons** | Knowledge graph access. | Available |
| **Microsoft Learn** | MS docs search + fetch. | Available |

---

## CLI Tools

| Tool | Install | What it does |
|---|---|---|
| **twitter-cli** | pipx (installed) | Twitter/X access — fetch tweets, threads, user profiles, search. Auth via env vars. |
| **rdt-cli** | pipx (installed) | Reddit content access — posts, comments, subreddits. |
| **yt-dlp** | Configured via Agent Reach | YouTube video/subtitle extraction. |
| **mcporter** | npm global (installed) | MCP server management CLI. |
| **edge-tts** | pip (installed) | Microsoft free neural TTS — Danish/English voices. |
| **gh CLI** | System (installed) | GitHub operations — repos, PRs, issues, actions. |
| **Playwright** | pip (installed) | Headless browser automation — screenshots, navigation, form filling, testing. |
| **opendataloader-pdf** | pip (installed) | #1 benchmarked PDF parser. Extracts structured markdown/JSON/HTML from PDFs. Tables, OCR (80+ languages), formulas, charts. |

---

## Python Packages (AI/tool relevant)

| Package | What it does |
|---|---|
| `anthropic` | Anthropic API client |
| `playwright` | Browser automation |
| `pillow` | Image processing (resize, convert, optimize) |
| `edge-tts` | Text-to-speech |
| `beautifulsoup4` | HTML/XML parsing |
| `httpx` | HTTP client |
| `opendataloader-pdf` | PDF parsing |

---

## Standalone tools (run outside Claude Code)

### Watchdog — auto-resume after rate limits
**What:** Python script that automatically resumes Claude Code CLI sessions after rate limit stalls. Works overnight with screen locked.

**Location:** `projects/personal/ai-tools-personal/claude-code-auto-resume-watchdog/watchdog.py`

**When to suggest:** When the user mentions leaving the computer during a long task, going to sleep, or hitting rate limits.

### Auto-capture — session transcript indexing
**What:** Python script that converts new JSONL session transcripts to searchable markdown and indexes them in qmd. Scans `~/.claude/projects/` for new/idle sessions, converts via proven parser, runs `qmd update`.

**Location:** `{KNOWLEDGE_BASE}\auto-capture.py`

**Manual run:** `python "{KNOWLEDGE_BASE}/auto-capture.py"`

**Scheduled:** 4x/day via Windows Task Scheduler (being set up). User can also run manually between scheduled runs to push recent sessions.

**When to suggest:** After the user mentions completing a session they want searchable, or before using `/session-reflect` on a recent session.

### Read Aloud script
**What:** Converts Markdown to speech using Microsoft's free neural voices. Cross-platform.

**Location:** `projects/personal/ai-tools-personal/tts-for-project-outputs/read-aloud.py` (also at `tools/read-aloud/` in the distribution repo).

---

## Connectors (Claude platform)

### Microsoft 365 — Outlook, OneDrive, SharePoint
Built-in — no MCP setup required. Available on all Claude plans.
- **Outlook:** Read email, search, draft responses
- **OneDrive:** Access documents and files
- **SharePoint:** Enterprise content

**Privacy note:** Some organizations disable these. Check settings for client-sensitive content.

**Email security invariant:** No send/reply/delete capability regardless of integration method.

---

## Diagnostic tools

| Tool | How to run | What it does |
|---|---|---|
| **CC Hubber** | `npx cchubber` | Token usage analysis — cost breakdown, cache health, model routing, recommendations. HTML report. |

---

## Backlog (evaluated, not yet installed)

| Tool | What it does | Why backlogged |
|---|---|---|
| **Nia / AgentSearch** | MCP server indexing repos, docs, PDFs, Notion, Drive, Slack, X. Semantic search across all sources. | Hosted service (account + API key). Evaluate for knowledge graph project. Handover note at `projects/personal/task-management-system/handover-knowledge-graph-tools.md`. |
| **ai-website-cloner** | Reverse-engineers websites into Next.js codebases. | No recurring need identified yet. Requires Node.js 24+. |
| **Clicky** | AI screen companion — sees screen, talks via voice, explains what's happening. | macOS only (v1). Monitor for Windows release. |
| **Compound Engineering** | 5-agent pipeline per task (brainstorm→plan→execute→review→cross-check). | Similar to our orchestration. Evaluate for complementarity. |
| **shanraisshan/claude-code-best-practice** | 32.7K-star best practices catalogue. | Cross-reference session — compare patterns against our OS. |
| **Claude Managed Agents** | Cloud-hosted agent infrastructure — persistent sessions, multi-agent coordination, self-evaluation loops, checkpointing. | Multi-agent coordination in research preview. Evaluate when GA — potential target for daily triage automation and heavy orchestration that should survive disconnections. [Blog post](https://claude.com/blog/claude-managed-agents). |
| **Open-Higgsfield-AI** | Free AI studio for image/video generation via cloud APIs (200+ models). Text-to-image, image-to-video, lip sync. | Relevant for wife's business project (SoMe marketing, product photography). Not OS-related. [GitHub](https://github.com/Anil-matcha/Open-Higgsfield-AI). |
| **VibeVoice (Microsoft)** | Open-source voice AI — 60-min transcription with speaker ID, 90-min multi-speaker TTS, real-time streaming TTS. 37.6K stars. | TTS upgrade path when edge-tts becomes a bottleneck. Meeting transcription for knowledge graph. [GitHub](https://github.com/microsoft/VibeVoice). |
| **Feynman** | CLI research agent — deep research, literature review, paper audit, experiment replication, simulated peer review. 3.1K stars. | Specialized academic research. Evaluate for research-heavy projects. [GitHub](https://github.com/getcompanion-ai/feynman). |
| **Clicky** | AI screen companion — sees screen, talks via voice, explains what's happening in real-time. | macOS only (v1). Monitor for Windows release. Learning companion for unfamiliar technical territory. [GitHub](https://github.com/farzaa/clicky). |
| **Modes of reasoning pattern** | 80 reasoning modes across 12 categories. Dispatch agents with assigned reasoning perspectives for multi-viewpoint analysis. | Implement as orchestration pattern — contracts specify reasoning mode (dialectical, theory-of-mind, adversarial, etc.). [Reference](https://github.com/Dicklesworthstone/ntm/blob/main/modes_of_reasoning.md). |
| **Mem0 / Letta** | Dedicated AI memory layers — auto-extract facts/reasoning from sessions, persist across context windows. | Evaluate for knowledge graph project — addresses reasoning persistence gap. [Mem0 paper](https://arxiv.org/pdf/2504.19413). |
| **Rowboat** | Local-first AI coworker — builds Obsidian-compatible knowledge graph from email + meetings. MCP-compatible. 10.1K stars. | Evaluate for knowledge graph project. Handover note written. [GitHub](https://github.com/rowboatlabs/rowboat). |
