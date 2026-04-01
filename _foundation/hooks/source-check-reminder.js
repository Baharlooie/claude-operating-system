const output = {
  hookSpecificOutput: {
    hookEventName: "PreToolUse",
    additionalContext: "SOURCE CHECK: Before using these search results, have you identified what authoritative sources look like for this topic? If not, this search should identify the leading experts/institutions first, not answer the question directly."
  }
};
process.stdout.write(JSON.stringify(output));
process.exit(0);
