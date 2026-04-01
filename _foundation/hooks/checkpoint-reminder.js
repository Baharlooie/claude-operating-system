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
      additionalContext: "CHECKPOINT (" + count + " tool calls): Is plan.md current? Are you still aligned with the objective? Consider compacting at this logical boundary."
    }
  };
  process.stdout.write(JSON.stringify(output));
}
process.exit(0);
