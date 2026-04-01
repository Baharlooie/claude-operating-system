# Uninstall the Claude Operating System

Paste this into any Claude Code session to remove the operating system cleanly.

---

I want to remove the Claude Operating System from my system. Please do the following:

1. **Clear CLAUDE.md.** Read my `~/.claude/CLAUDE.md` file. If it contains behavioral rules and a session-start checklist pointer from the operating system, replace the entire file contents with an empty file (or delete it).

2. **Clear Global Instructions (if applicable).** If I'm using Claude Desktop with Cowork, remind me to go to Settings → Cowork → Global Instructions → Edit and clear the text that points to the session-start checklist.

3. **Confirm.** Tell me what you did and confirm the operating system is no longer active. My next session will start as Claude out of the box.

Note: This does NOT delete the operating system files themselves — just the pointers that tell Claude to read them. The files in the `claude-operating-system/` folder remain untouched. You can delete that folder manually if you want, or keep it in case you want to re-enable later (just re-run `setup-prompt.md`).
