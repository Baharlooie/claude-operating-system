// PreCompact hook: inject critical context that must survive compaction
// Fires before context compaction occurs
const fs = require('fs');
const path = require('path');
let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const cwd = data.cwd || process.cwd();

    let planInfo = '';

    // Check for .plan-confirmed marker to find active project
    const markerPath = path.join(cwd, '.plan-confirmed');
    if (fs.existsSync(markerPath)) {
      try {
        const markerContent = fs.readFileSync(markerPath, 'utf8').trim();
        planInfo = 'Active project marker: ' + markerContent;
      } catch (e) {}
    }

    // Search for the most recently modified plan.md in project folders
    const findRecentPlan = (dir, depth) => {
      if (depth <= 0) return null;
      let best = null;
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const e of entries) {
          if (e.name === 'plan.md' && e.isFile()) {
            const fullPath = path.join(dir, e.name);
            try {
              const stat = fs.statSync(fullPath);
              if (!best || stat.mtimeMs > best.mtime) {
                best = { path: fullPath, mtime: stat.mtimeMs };
              }
            } catch (err) {}
          }
          if (e.isDirectory() && !e.name.startsWith('.') && !e.name.startsWith('_') && e.name !== 'node_modules') {
            const found = findRecentPlan(path.join(dir, e.name), depth - 1);
            if (found && (!best || found.mtime > best.mtime)) {
              best = found;
            }
          }
        }
      } catch (err) {}
      return best;
    };

    const recentPlan = findRecentPlan(path.join(cwd, 'projects'), 5);
    if (recentPlan) {
      planInfo += (planInfo ? ' | ' : '') + 'Most recent plan.md: ' + recentPlan.path;
    }

    const context = `COMPACTION IMMINENT — critical context to preserve:
${planInfo ? planInfo : 'No active plan marker or recent plan.md found.'}
After compaction: (1) Re-read plan.md immediately. (2) Run the 5-item compaction checkpoint from CLAUDE.md. (3) Do not rely on the compaction summary for procedural details — re-read the actual files. (4) Do not resume work without verifying what was in progress.`;

    const output = {
      hookSpecificOutput: {
        hookEventName: 'PreCompact',
        additionalContext: context
      }
    };
    process.stdout.write(JSON.stringify(output));
    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
