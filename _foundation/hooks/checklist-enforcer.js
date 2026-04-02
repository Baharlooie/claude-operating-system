// SessionStart hook: remind to read the session-start checklist
// Fires on session start, resume, clear, and compact
const fs = require('fs');
let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const source = data.source || 'startup';

    let context = '';
    if (source === 'startup' || source === 'clear') {
      context = 'MANDATORY SESSION START: Read and complete the session-start checklist before responding to the user. No exceptions. Read the checklist file now — do not skip it because the request seems simple or urgent.';
    } else if (source === 'compact') {
      context = 'POST-COMPACTION: Run the mandatory 5-item compaction checkpoint from CLAUDE.md. Re-read plan.md. Do not rely on the compaction summary for procedural details.';
    } else if (source === 'resume') {
      context = 'SESSION RESUMED: The checklist was run at session start. Re-read plan.md to restore context.';
    }

    if (context) {
      const output = {
        hookSpecificOutput: {
          hookEventName: 'SessionStart',
          additionalContext: context
        }
      };
      process.stdout.write(JSON.stringify(output));
    }
    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
