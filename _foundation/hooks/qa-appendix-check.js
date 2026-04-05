const fs = require('fs');
const path = require('path');
let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const filePath = data.tool_input && data.tool_input.file_path;
    if (filePath && filePath.endsWith('.md')) {
      const basename = path.basename(filePath).toLowerCase();
      // Skip exact filenames for structural/meta files
      const skipExact = ['plan.md', 'active-projects.md', 'todo.md', 'readme.md', 'changelog.md', 'suggestions-for-further-improvement.md', 'handoff-note.md', 'scratch.md'];
      // Skip pattern-based: tracking logs, working notes, drafts, WIP
      const skipPatterns = [
        /-log\.md$/,         // assumptions-log, decisions-log, activity-log
        /notes?\.md$/,       // notes, working-notes, meeting-notes
        /draft/,             // draft-*, *-draft
        /\bwip\b/,           // wip-*, *-wip (word-boundary to avoid matching "swipe" etc)
        /scratch/,           // scratch-*
        /tracking/,          // tracking-*
        /-tmp\.md$/,         // *-tmp
        /-temp\.md$/         // *-temp
      ];
      const shouldSkip = skipExact.some(f => basename === f)
        || skipPatterns.some(p => p.test(basename));
      if (!shouldSkip) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          // Content-based opt-out: user can mark file with <!-- qa-skip --> in first 10 lines
          const firstLines = content.split('\n').slice(0, 10).join('\n');
          const hasOptOut = /<!--\s*qa-skip\s*-->/i.test(firstLines);
          if (!hasOptOut && content.length > 500 && !content.includes('## QA Assessment') && !content.includes('## QA assessment')) {
            const output = {
              hookSpecificOutput: {
                hookEventName: "PostToolUse",
                additionalContext: "QA CHECK: " + basename + " has no QA Assessment appendix. Add one using _foundation/qa-checklist.md before presenting to the user. If this file is a tracking log, draft, or working notes, add '<!-- qa-skip -->' near the top to opt out."
              }
            };
            process.stdout.write(JSON.stringify(output));
          }
        } catch (e) {}
      }
    }
    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
