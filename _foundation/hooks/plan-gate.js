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
    // Scope: only validate the plan.md for the CURRENT project (walk up from file_path)
    // Never do a tree-wide search — that produces false-positive warnings about unrelated projects
    let planWarning = '';
    try {
      // Find plan.md by walking up from the file being edited
      const findRelevantPlan = (filePath, cwd) => {
        if (!filePath) return null; // No file_path (e.g. Bash) → skip validation
        // Normalize both paths to native format (handles forward/backslash mixing on Windows)
        const absPath = path.resolve(path.isAbsolute(filePath) ? filePath : path.join(cwd, filePath));
        const cwdNormalized = path.resolve(cwd);
        let currentDir = path.dirname(absPath);
        // Walk up at most 10 levels, stop at cwd or filesystem root
        for (let i = 0; i < 10; i++) {
          const candidatePath = path.join(currentDir, 'plan.md');
          if (fs.existsSync(candidatePath)) return candidatePath;
          const parentDir = path.dirname(currentDir);
          if (parentDir === currentDir) break; // filesystem root
          if (!parentDir.startsWith(cwdNormalized) && parentDir !== cwdNormalized) break; // went above cwd
          currentDir = parentDir;
        }
        return null;
      };
      const planPath = findRelevantPlan(filePath, cwd);
      if (planPath) {
        const planContent = fs.readFileSync(planPath, 'utf8');
        const requiredSections = ['Quality drivers', 'Success criteria', 'Scope', 'Sources', 'Approach'];
        const missing = requiredSections.filter(s => !planContent.includes(s));
        if (missing.length > 0) {
          planWarning = 'PLAN STRUCTURE WARNING: plan.md at ' + planPath + ' is missing sections: ' + missing.join(', ') + '. The plan should follow the 11-section structure from the session-start checklist.';
        } else {
          // Expansion check: the Approach section must list 3+ distinct alternatives
          // Extract the Approach section (from "Approach" heading to next heading or end of file)
          const approachMatch = planContent.match(/(^|\n)#{1,4}\s*[^\n]*Approach[^\n]*\n([\s\S]*?)(?=\n#{1,4}\s|$)/i);
          if (approachMatch) {
            const approachSection = approachMatch[2];
            // Count alternative markers: "Option 1/2/3", "Approach A/B/C", "Alternative 1/2/3"
            // Case-insensitive, allows optional colon/period after the label
            const optionMatches = approachSection.match(/(?:^|\n)\s*[-*]?\s*\*{0,2}(?:Option|Alternative)\s+[1-9A-Za-z]\b/gi) || [];
            const approachLetterMatches = approachSection.match(/(?:^|\n)\s*[-*]?\s*\*{0,2}Approach\s+[A-Z1-9]\b/gi) || [];
            // Also count numbered list items within the section (1., 2., 3.)
            const numberedListMatches = approachSection.match(/(?:^|\n)\s*[1-9]\.\s+\S/g) || [];
            const totalAlternatives = Math.max(
              optionMatches.length + approachLetterMatches.length,
              numberedListMatches.length
            );
            if (totalAlternatives < 3) {
              planWarning = 'EXPANSION WARNING: plan.md at ' + planPath + ' Approach section has only ' + totalAlternatives + ' distinct alternatives listed. The plan template (section 3.6) requires 3-5 distinct approaches (including 1-3 unconventional ones) before selecting the recommended one. Consider: "Option 1/2/3", "Approach A/B/C", or a numbered list. This surfaces the option space so the chosen approach is a genuine selection.';
            }
          }
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
