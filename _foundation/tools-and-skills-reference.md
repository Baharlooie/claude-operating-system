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

### Project-specific skills (not distributed)
| Skill | Command | What it does |
|---|---|---|
| **Child Artifact Builder** | `/artifact` | Interactive HTML learning artifacts for children. Project-specific — not in distribution. |

---

## Plugins (Claude Code ecosystem)

| Plugin | Source | What it does |
|---|---|---|
| **Codex (OpenAI)** | `openai-codex` | Second opinion, parallel execution, code review, rescue delegation. Works for ANY task, not just code. |
| **Document Skills** | `anthropic-agent-skills` | Official Anthropic skills for creating PDF, DOCX, XLSX, PPTX documents. |
| **Example Skills** | `anthropic-agent-skills` | Official Anthropic skills: web-artifacts-builder, frontend-design, mcp-builder, webapp-testing, skill-creator, algorithmic-art, and more. |
| **Ralph Wiggum** | `claude-code-plugins` | Autonomous iteration loop. Claude works → Stop hook intercepts → re-feeds prompt → Claude improves. Repeats until completion criteria met. Use `--max-iterations` as safety cap. |

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
