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
      additionalContext: "CHECKPOINT (" + count + " tool calls): (1) What are you optimizing for? State it. (2) Is what you're doing aligned with plan.md? (3) Is plan.md current — update it if significant progress since last update. (4) Quality gate: are your recent outputs well-supported and complete? (5) Consider compacting at this logical boundary if context is getting large."
    }
  };
  process.stdout.write(JSON.stringify(output));
}
process.exit(0);
