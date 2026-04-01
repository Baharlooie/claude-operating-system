// PostToolUse hook: remind orchestrator to run gap detection after agent
// Only fires when orchestration/contracts/ exists (formal Phase 2b)
// Skips for informal research agents where gap detection isn't appropriate
const fs = require('fs');
const path = require('path');
let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const cwd = data.cwd || process.cwd();
    const contractDir = path.join(cwd, 'orchestration', 'contracts');
    // Only fire if this is a formal orchestration (contracts folder exists)
    try {
      const files = fs.readdirSync(contractDir);
      if (files.length > 0) {
        const output = {
          hookSpecificOutput: {
            hookEventName: "PostToolUse",
            additionalContext: "AGENT COMPLETED (formal orchestration detected). Before presenting results: (1) Run gap detection on all outputs for this wave. (2) Do substantive QA yourself. (3) Synthesize by theme, not by worker. (4) Did the worker follow the contract and use authoritative sources?"
          }
        };
        process.stdout.write(JSON.stringify(output));
      }
    } catch (e) {
      // No contracts folder — informal agent, skip silently
    }
  } catch (e) {}
  process.exit(0);
});
