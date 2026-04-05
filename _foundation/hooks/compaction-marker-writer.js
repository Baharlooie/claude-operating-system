// PreCompact hook: write a marker file before Claude-style compaction occurs
// PreCompact cannot inject context into Claude's conversation (docs confirm),
// so this hook only does a side effect: writes a marker that the
// post-compaction-injector.js hook reads on the next user prompt.
//
// The marker records: timestamp, cwd, best-guess plan.md path.
const fs = require('fs');
const path = require('path');
const os = require('os');

let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const cwd = data.cwd || process.cwd();

    // Find the most recently modified plan.md in cwd/projects (best-guess heuristic)
    let recentPlan = null;
    const findRecentPlan = (dir, depth, best) => {
      if (depth <= 0) return best;
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
            best = findRecentPlan(path.join(dir, e.name), depth - 1, best);
          }
        }
      } catch (err) {}
      return best;
    };
    recentPlan = findRecentPlan(path.join(cwd, 'projects'), 5, null);

    // Write marker file to ~/.claude/state/post-compaction-marker.json
    const markerDir = path.join(os.homedir(), '.claude', 'state');
    try { fs.mkdirSync(markerDir, { recursive: true }); } catch (e) {}
    const marker = {
      timestamp: new Date().toISOString(),
      cwd: cwd,
      suggestedPlanPath: recentPlan ? recentPlan.path : null
    };
    const markerPath = path.join(markerDir, 'post-compaction-marker.json');
    fs.writeFileSync(markerPath, JSON.stringify(marker, null, 2));

    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
