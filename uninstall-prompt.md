# Uninstall the Claude Operating System

Paste this into any Claude Code session to remove the operating system cleanly.

---

I want to remove the Claude Operating System from my system. Please do the following:

1. **Clear CLAUDE.md.** Read my `~/.claude/CLAUDE.md` file. If it contains behavioral rules and a session-start checklist pointer from the operating system, replace the entire file contents with an empty file (or delete it).

2. **Remove rules files.** Delete the directory `~/.claude/rules/` and all files inside it (these contain communication quality and tool behavior rules from the operating system).

3. **Remove skills.** Delete these directories and their contents from `~/.claude/skills/`:
   - `dev/` (development workflow skill)
   - `orchestrate/` (multi-agent orchestration skill)
   - `tts-convert/` (text-to-speech conversion)
   - `tts-play/` (text-to-speech playback)
   - `tts-save/` (text-to-speech MP3 export)
   
   Leave any other skills that aren't from the operating system.

4. **Remove hooks from settings.json.** Read `~/.claude/settings.json`. Remove all hook entries under `"hooks"` that reference files in the operating system's `_foundation/hooks/` directory. These include hooks for: plan-gate, source-check-reminder, agent-contract-check, checkpoint-reminder, gap-detection-reminder, qa-appendix-check, checklist-enforcer, quality-gate-reminder, subagent-orchestrator-reminder, and pre-compaction-saver. Preserve any other settings (permissions, effortLevel, etc.) and any hooks that aren't from the operating system.

5. **Clear Global Instructions (if applicable).** If I'm using Claude Desktop with Cowork, remind me to go to Settings → Cowork → Global Instructions → Edit and clear the text that points to the session-start checklist.

6. **Confirm.** List everything you removed and confirm the operating system is no longer active. My next session will start as Claude out of the box.

Note: This does NOT delete the operating system files themselves — just the configuration that tells Claude to read them. The files in the `claude-operating-system/` folder remain untouched. You can delete that folder manually if you want, or keep it in case you want to re-enable later (just re-run `setup-prompt.md`).
