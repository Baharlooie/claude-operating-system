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
      const skip = ['plan.md', 'active-projects.md', 'todo.md', 'readme.md', 'changelog.md', 'suggestions-for-further-improvement.md'];
      if (!skip.some(f => basename.includes(f))) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          if (content.length > 500 && !content.includes('## QA Assessment') && !content.includes('## QA assessment')) {
            const output = {
              hookSpecificOutput: {
                hookEventName: "PostToolUse",
                additionalContext: "QA CHECK: " + basename + " has no QA Assessment appendix. Add one using _foundation/qa-checklist.md before presenting to the user."
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
