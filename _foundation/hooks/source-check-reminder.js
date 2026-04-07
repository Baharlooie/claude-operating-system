// PreToolUse hook on WebSearch/WebFetch: catch-net for source quality assessment.
// Only fires if the model hasn't already addressed source quality in context.
let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const transcript = JSON.stringify(data.transcript || '').toLowerCase();
    // Skip if source assessment already visible in recent context
    const hasSourceAssessment = /authoritative|source strategy|source quality|primary source|verified source/.test(transcript);
    if (!hasSourceAssessment) {
      const output = {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          additionalContext: "Catch-net (skip if already done): Have you identified what authoritative sources look like for this topic? If not, consider whether this search should identify leading experts/institutions first, not answer the question directly."
        }
      };
      process.stdout.write(JSON.stringify(output));
    }
    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
