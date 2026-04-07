const fs = require('fs');
const os = require('os');
const path = require('path');
const counterFile = path.join(os.tmpdir(), 'claude-checkpoint-' + (process.ppid || 'default'));
let count = 0;
try { count = parseInt(fs.readFileSync(counterFile, 'utf8')); } catch {}
count++;
fs.writeFileSync(counterFile, String(count));
if (count > 0 && count % 25 === 0) {
  const output = {
    hookSpecificOutput: {
      hookEventName: "PostToolUse",
      additionalContext: "Catch-net checkpoint (" + count + " tool calls — skip items already done): (1) What are you optimizing for? (2) Aligned with plan.md? (3) Is plan.md current? (4) Recent outputs well-supported? (5) Consider compacting if context is large."
    }
  };
  process.stdout.write(JSON.stringify(output));
}
process.exit(0);
