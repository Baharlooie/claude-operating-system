// UserPromptSubmit hook: inject post-compaction recovery reminder
// Reads the marker file written by compaction-marker-writer.js (PreCompact).
// If marker exists, injects a strong reminder to re-read plan.md + run the
// compaction checkpoint. Then deletes the marker (one-shot).
const fs = require('fs');
const path = require('path');
const os = require('os');

let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  try {
    const markerPath = path.join(os.homedir(), '.claude', 'state', 'post-compaction-marker.json');
    if (!fs.existsSync(markerPath)) {
      process.exit(0);
    }

    let marker;
    try {
      marker = JSON.parse(fs.readFileSync(markerPath, 'utf8'));
    } catch (e) {
      // Corrupt marker — delete and exit silently
      try { fs.unlinkSync(markerPath); } catch (err) {}
      process.exit(0);
    }

    let context = 'POST-COMPACTION RECOVERY: Claude-style context compaction just occurred (marker timestamp: ' + marker.timestamp + '). Before responding to the user, you MUST:\n\n';
    context += '(1) Re-read plan.md — this is the durable state record that survives compaction. ';
    if (marker.suggestedPlanPath) {
      context += 'Most likely relevant plan: ' + marker.suggestedPlanPath + '. If a different plan.md is relevant to this conversation, read that one instead.\n';
    } else {
      context += 'Identify the relevant plan.md from conversation context or user references.\n';
    }
    context += '(2) Run the 5-item compaction checkpoint from CLAUDE.md: re-read plan.md, check working procedures, review todos, state success criteria, verify behavioral rules are loaded.\n';
    context += '(3) Do NOT rely on the compaction summary for procedural details — it captures "what was decided" but loses "how things are done." Re-read the actual files.\n';
    context += '(4) Do NOT resume work without verifying what was in progress.';

    const output = {
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: context
      }
    };
    process.stdout.write(JSON.stringify(output));

    // Delete marker (one-shot) — reminder fires exactly once post-compaction
    try { fs.unlinkSync(markerPath); } catch (e) {}

    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
