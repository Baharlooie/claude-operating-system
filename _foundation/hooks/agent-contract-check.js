const fs = require('fs');
const path = require('path');
let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const cwd = data.cwd || process.cwd();
    const contractDir = path.join(cwd, 'orchestration', 'contracts');
    let hasContracts = false;
    try {
      const files = fs.readdirSync(contractDir).filter(f => f.endsWith('.md'));
      hasContracts = files.length > 0;
    } catch (e) {}
    if (!hasContracts) {
      const output = {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          additionalContext: "AGENT DISPATCH WARNING: No contract files in orchestration/contracts/. For Phase 2b, write contracts to files before dispatching. For informal agents, include in the prompt: assignment, quality drivers, source strategy, output location. Tell the agent not to run the startup checklist."
        }
      };
      process.stdout.write(JSON.stringify(output));
    }
    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
