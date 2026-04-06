// UserPromptSubmit hook: nudge quality gate and step-zero trigger
// Fires before Claude processes each user prompt
// Skips very short prompts (confirmations like "yes", "go ahead")
let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const prompt = (data.prompt || '').trim();

    // Skip short confirmations — these don't need quality gate reminders
    if (prompt.length < 30) {
      process.exit(0);
    }

    const context = 'Catch-net (skip if already done in your thinking): (1) Did you run the step-zero check — is this a qualitatively different sub-problem? If you already assessed this, do not repeat it. (2) Quality gate — right problem, well-supported, complete? If already checked, proceed.';

    const output = {
      hookSpecificOutput: {
        hookEventName: 'UserPromptSubmit',
        additionalContext: context
      }
    };
    process.stdout.write(JSON.stringify(output));
    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
