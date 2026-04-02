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
1. READ the full output end-to-end against its contract. Not a sample. Not just the opening and verify criteria. The full document.
2. VERIFY the 2-3 most important factual claims independently — does the cited source exist and say what the worker claims?
3. ACTIVELY LOOK FOR PROBLEMS — assume they exist. If you find zero issues, you are confirming, not reviewing.
4. RUN gap detection per the protocol — all 6 levels (existence, substance, coverage, cross-reference, quality judgment, process transparency).
5. SYNTHESIZE — what does this output mean for the project? What is the so-what for the user in light of the project objective?
6. CROSS-CUTTING VIEW — what are the implications across tracks, streams, and topics? Individual workers see only their scope. You see connections, contradictions, and compounding insights across all outputs. This holistic view is a key part of orchestration that no worker can provide.
7. PROPOSE next steps — what follows from this, what should come next, what decisions does the user need to make?
Sampling is not QA. Structural compliance checking is not gap detection. Your role is quality control, synthesis, cross-cutting judgment, and next-step recommendation — not pass-through.`;

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
