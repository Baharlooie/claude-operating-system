// PreToolUse hook on Agent: enforce contracts and plan for substantial dispatches
// - Hard BLOCKS dispatch if no contracts exist AND prompt is substantial (>200 chars)
// - Warns if no plan marker exists (may be new work requiring Step 3)
// - Quick lookups (short prompts) pass through with a reminder only
const fs = require('fs');
const path = require('path');
let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const cwd = data.cwd || process.cwd();
    const agentPrompt = (data.tool_input && data.tool_input.prompt) || '';

    // Determine if this is a substantial dispatch (research, analysis, multi-step work)
    // vs. a quick lookup (file search, simple question)
    const isSubstantial = agentPrompt.length > 200;

    // Check for plan marker
    const hasplan = fs.existsSync(path.join(cwd, '.plan-confirmed')) ||
                    fs.existsSync(path.join(cwd, '.plan-skipped'));

    // Search for orchestration/contracts/ folders with .md files
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

    // Case 1: Substantial dispatch with no contracts — HARD BLOCK
    if (isSubstantial && !hasContracts) {
      const output = {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: "AGENT DISPATCH BLOCKED: This is a substantial agent dispatch but no contract files exist in any orchestration/contracts/ folder. If you are dispatching agents, you are orchestrating — write contracts to files BEFORE dispatching. Each contract must include: assignment, quality drivers for THIS task, source strategy grounded in verified sources, output format and location. Also: have you verified authoritative sources BEFORE this dispatch? Source verification must happen first, not in parallel."
        }
      };
      process.stdout.write(JSON.stringify(output));
      process.exit(0);
    }

    // Case 2: No plan marker — warn (may be new work needing Step 3)
    if (!hasplan) {
      const output = {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          additionalContext: "AGENT DISPATCH WARNING: No .plan-confirmed or .plan-skipped marker found. Are you dispatching an agent for a new task that needs its own plan? Switching to a new task within the same session is new work — the test is: does the current plan describe THIS task? If not, update the plan or create a sub-plan before dispatching."
        }
      };
      process.stdout.write(JSON.stringify(output));
      process.exit(0);
    }

    // Case 3: Quick lookup without contracts — remind but allow
    if (!isSubstantial && !hasContracts) {
      const output = {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          additionalContext: "Agent dispatch note: no formal contracts found. If this is a quick lookup, proceed. If this is research or substantial work, write contracts first."
        }
      };
      process.stdout.write(JSON.stringify(output));
    }

    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
