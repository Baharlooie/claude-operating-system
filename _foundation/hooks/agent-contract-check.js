const fs = require('fs');
const path = require('path');
let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const cwd = data.cwd || process.cwd();

    // Search for orchestration/contracts/ folders with .md files
    // Check both cwd-relative and recursively under projects/
    const findContracts = (dir, depth) => {
      if (depth <= 0) return false;
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const e of entries) {
          if (e.isDirectory()) {
            if (e.name === 'contracts') {
              // Check if parent is 'orchestration'
              const parentName = path.basename(dir);
              if (parentName === 'orchestration') {
                const contractPath = path.join(dir, e.name);
                try {
                  const files = fs.readdirSync(contractPath).filter(f => f.endsWith('.md'));
                  if (files.length > 0) return true;
                } catch (err) {}
              }
            }
            if (!e.name.startsWith('.') && !e.name.startsWith('_') && e.name !== 'node_modules') {
              if (findContracts(path.join(dir, e.name), depth - 1)) return true;
            }
          }
        }
      } catch (err) {}
      return false;
    };

    const hasContracts = findContracts(cwd, 6);

    if (!hasContracts) {
      const output = {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          additionalContext: "AGENT DISPATCH WARNING: No contract files found in any orchestration/contracts/ folder. If you are dispatching agents, you are orchestrating — write contracts to files before dispatching. Each contract must include: assignment, quality drivers for THIS task, source strategy, output format and location. Tell the agent not to run the startup checklist."
        }
      };
      process.stdout.write(JSON.stringify(output));
    }
    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
