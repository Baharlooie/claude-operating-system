// SubagentStop hook: remind orchestrator of full responsibilities when an agent completes
// Only fires when formal orchestration is happening (contracts exist)
const fs = require('fs');
const path = require('path');
let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const cwd = data.cwd || process.cwd();

    // Check if formal orchestration is happening (contracts exist anywhere in project tree)
    const findContracts = (dir, depth) => {
      if (depth <= 0) return false;
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const e of entries) {
          if (e.isDirectory()) {
            if (e.name === 'contracts') {
              const parentName = path.basename(dir);
              if (parentName === 'orchestration') {
                try {
                  const files = fs.readdirSync(path.join(dir, e.name)).filter(f => f.endsWith('.md'));
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

    if (hasContracts) {
      const context = `AGENT COMPLETED — orchestrator responsibilities before proceeding:
1. READ the agent's output in full against its contract — did it deliver what was specified?
2. ASSESS quality — are sources authoritative, is reasoning sound, are there gaps or contradictions?
3. RUN gap detection — systematic check, not "looks about right"
4. SYNTHESIZE — what does this output mean for the project? What's the so-what for the user?
5. PROPOSE next steps — what follows from this output in light of the project plan?
Do not simply pass agent output to the user. Your role is quality control, synthesis, and judgment.`;

      const output = {
        hookSpecificOutput: {
          hookEventName: 'SubagentStop',
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
