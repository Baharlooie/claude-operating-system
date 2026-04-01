// PreToolUse hook: block execution tools if no plan confirmed
// Allows: creating marker files, operations on _foundation/ files, Read/Glob/Grep
const fs = require('fs');
const path = require('path');
let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const cwd = data.cwd || process.cwd();
    const filePath = data.tool_input && (data.tool_input.file_path || '');
    const command = data.tool_input && (data.tool_input.command || '');
    const basename = path.basename(filePath);

    // Allow creating marker files and plan.md itself
    if (basename === '.plan-confirmed' || basename === '.plan-skipped' || basename === 'plan.md') {
      process.exit(0);
    }
    if (command.includes('.plan-confirmed') || command.includes('.plan-skipped')) {
      process.exit(0);
    }

    // Allow creating project folders (mkdir)
    if (command.includes('mkdir')) {
      process.exit(0);
    }

    // Allow updating active-projects.md
    if (basename === 'active-projects.md') {
      process.exit(0);
    }

    // Allow operations on _foundation/ (system maintenance)
    if (filePath.includes('_foundation') || command.includes('_foundation')) {
      process.exit(0);
    }

    // Allow operations on .claude/ (settings, agents)
    if (filePath.includes('.claude') || command.includes('.claude')) {
      process.exit(0);
    }

    // Allow operations on _context/ (active-projects, suggestions)
    if (filePath.includes('_context') || command.includes('_context')) {
      process.exit(0);
    }

    // Check for markers
    const confirmed = path.join(cwd, '.plan-confirmed');
    const skipped = path.join(cwd, '.plan-skipped');
    if (!fs.existsSync(confirmed) && !fs.existsSync(skipped)) {
      const output = {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: "PLAN GATE: No .plan-confirmed or .plan-skipped marker in " + cwd + ". Complete Step 3 before executing. Create the marker in the working directory."
        }
      };
      process.stdout.write(JSON.stringify(output));
      process.exit(0);
    }

    // Marker exists — but validate plan.md has the required structure
    // Search for the most recent plan.md in project subfolders
    const glob = require('path');
    let planWarning = '';
    try {
      // Find plan.md files modified in the last hour
      const findPlan = (dir, depth) => {
        if (depth <= 0) return null;
        try {
          const entries = fs.readdirSync(dir, { withFileTypes: true });
          for (const e of entries) {
            if (e.name === 'plan.md' && e.isFile()) return path.join(dir, e.name);
            if (e.isDirectory() && !e.name.startsWith('.') && !e.name.startsWith('_') && e.name !== 'node_modules') {
              const found = findPlan(path.join(dir, e.name), depth - 1);
              if (found) return found;
            }
          }
        } catch (err) {}
        return null;
      };
      const planPath = findPlan(path.join(cwd, 'projects'), 4);
      if (planPath) {
        const planContent = fs.readFileSync(planPath, 'utf8');
        const requiredSections = ['Quality drivers', 'Success criteria', 'Scope', 'Sources', 'Approach'];
        const missing = requiredSections.filter(s => !planContent.includes(s));
        if (missing.length > 0) {
          planWarning = 'PLAN STRUCTURE WARNING: plan.md at ' + planPath + ' is missing sections: ' + missing.join(', ') + '. The plan should follow the 11-section structure from the session-start checklist.';
        }
      }
    } catch (e) {}

    if (planWarning) {
      const output = {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          additionalContext: planWarning
        }
      };
      process.stdout.write(JSON.stringify(output));
    }
    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
