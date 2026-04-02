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

    const context = 'Before responding: (1) Step-zero check — is this a qualitatively different sub-problem from the current task? If yes, reassess quality drivers before proceeding. (2) Quality gate — am I answering the right problem, is it well-supported, and is it complete?';

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
