// PreToolUse hook on Agent: enforce contracts and plan for substantial dispatches
//
// Decision logic:
// - Quick lookups (<200 chars): pass through with a note
// - Substantial dispatches must have EITHER a valid contract file reference in
//   the prompt, OR minimum template elements embedded (quality drivers + output
//   format). Missing both → HARD BLOCK.
// - Research-type dispatches (synthesize/research/investigate/etc.) without
//   source strategy language → WARN.
// - Warn if no plan marker exists (may be new work requiring Step 3).
//
// Scoping note: does NOT do a tree-wide search for contract folders. Checks
// whether THIS dispatch references a contract file that actually exists. A
// contract file existing somewhere else in the tree is not relevant.
const fs = require('fs');
const path = require('path');
let input = '';
process.stdin.on('data', d => input += d);
process.stdin.on('end', () => {
  try {
    const data = JSON.parse(input);
    const cwd = data.cwd || process.cwd();
    const agentPrompt = (data.tool_input && data.tool_input.prompt) || '';

    const isSubstantial = agentPrompt.length > 200;

    // Check for plan marker
    const hasplan = fs.existsSync(path.join(cwd, '.plan-confirmed')) ||
                    fs.existsSync(path.join(cwd, '.plan-skipped'));

    // Detect contract file reference in prompt
    // Paths with spaces are common (e.g., "AI assisted", "children friendly").
    // Strategy: collect ALL candidate paths from the prompt, then check each.
    // If ANY resolves to an existing file, the check passes.
    let contractFileValid = false;
    let contractFileReferenced = null;
    const candidates = [];
    // 1. Quoted paths: backtick, double-quote, single-quote wrapping a contracts path
    //    Quotes delimit the match so spaces inside work correctly.
    const backtickMatches = [...agentPrompt.matchAll(/`([^`]*contracts?[\/\\][^`]+\.md)`/gi)];
    const dblQuoteMatches = [...agentPrompt.matchAll(/"([^"]*contracts?[\/\\][^"]+\.md)"/gi)];
    const sglQuoteMatches = [...agentPrompt.matchAll(/'([^']*contracts?[\/\\][^']+\.md)'/gi)];
    backtickMatches.forEach(m => candidates.push(m[1]));
    dblQuoteMatches.forEach(m => candidates.push(m[1]));
    sglQuoteMatches.forEach(m => candidates.push(m[1]));
    // 2. Anchor-based extraction: find every "contracts[/\]X.md" occurrence in the prompt,
    //    then walk backwards to the rightmost absolute-path anchor (Windows drive letter,
    //    Git-Bash /x/, or home ~/) so we capture the full path even when it contains spaces.
    //    Fallback: last whitespace boundary (preserves original behavior for simple relative
    //    paths like "orchestration/contracts/foo.md" without spaces).
    //
    //    This replaces two earlier buggy strategies:
    //    - "labeled" regex used [^:]* which consumed through the drive letter colon and
    //      caused "C:\..." paths to lose their drive letter prefix
    //    - "unquoted" regex used \S* which treated spaces as terminators and captured only
    //      the trailing fragment after the last space before "contracts\" (e.g. "AI assisted"
    //      and "children friendly" would break the match)
    //    Fixed 2026-04-13 after a real failure in a dispatch with spaces in the path.
    const contractMdRegex = /contracts?[\/\\][^\s`"'\n]+?\.md\b/gi;
    let mdMatch;
    while ((mdMatch = contractMdRegex.exec(agentPrompt)) !== null) {
      const mdStart = mdMatch.index;
      const mdEnd = mdMatch.index + mdMatch[0].length;
      const beforeMd = agentPrompt.substring(0, mdStart);

      // Find rightmost absolute-path anchor before this match
      const anchorRegex = /(?:[A-Za-z]:[\\\/]|\/[a-z]\/|~[\\\/])/g;
      let lastAnchorPos = -1;
      let anchorMatch;
      while ((anchorMatch = anchorRegex.exec(beforeMd)) !== null) {
        lastAnchorPos = anchorMatch.index;
      }

      let startPos;
      if (lastAnchorPos !== -1) {
        startPos = lastAnchorPos;
      } else {
        // No absolute anchor — fall back to last whitespace boundary
        const wsMatch = beforeMd.match(/(\S*)$/);
        startPos = wsMatch ? wsMatch.index : mdStart;
      }
      candidates.push(agentPrompt.substring(startPos, mdEnd));
    }
    // Try each candidate — if ANY resolves to an existing file, pass
    for (const ref of candidates) {
      const absPath = path.isAbsolute(ref)
        ? path.resolve(ref)
        : path.resolve(path.join(cwd, ref));
      if (fs.existsSync(absPath)) {
        contractFileValid = true;
        contractFileReferenced = ref;
        break;
      }
      // Track first reference for error messages even if it doesn't resolve
      if (!contractFileReferenced) contractFileReferenced = ref;
    }
    // rawRef is the first candidate found (for error messages), or null if none found
    const rawRef = contractFileReferenced;

    // Detect minimum template elements in the embedded prompt content
    const hasQualityDrivers = /quality driver|quality bar|what good looks like|quality criteria|method guidance|what drives.*quality|quality.*:/i.test(agentPrompt);
    const hasOutputFormat = /output format|write to:|output path|deliverable:|required structure|output.*:|format:/i.test(agentPrompt);
    const hasMinimumTemplate = hasQualityDrivers && hasOutputFormat;

    // Detect research-type dispatches
    const isResearch = /\b(synthesize|research|investigate|review the|review these|analyze|find all|survey|examine)\b/i.test(agentPrompt);
    const hasSourceStrategy = /authoritative|primary source|verify source|verified source|sources? to use|source strategy|source.*:/i.test(agentPrompt);

    // --- Decisions ---

    // Case A: Substantial dispatch with invalid contract file reference
    if (isSubstantial && contractFileReferenced && !contractFileValid) {
      const output = {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: "AGENT DISPATCH BLOCKED: Contract file referenced at '" + contractFileReferenced + "' but file does not exist at that path (resolved relative to cwd: " + cwd + "). Write the contract file before dispatching, or correct the path reference."
        }
      };
      process.stdout.write(JSON.stringify(output));
      process.exit(0);
    }

    // Case B: Substantial dispatch with no file reference AND missing template elements
    if (isSubstantial && !contractFileValid && !hasMinimumTemplate) {
      const missing = [];
      if (!hasQualityDrivers) missing.push("quality drivers (what 'good' looks like for this task)");
      if (!hasOutputFormat) missing.push("output format/path (where to write results, what structure)");
      const output = {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          permissionDecision: "deny",
          permissionDecisionReason: "AGENT DISPATCH BLOCKED: Substantial dispatch (" + agentPrompt.length + " chars) with no contract file reference AND embedded contract is missing: " + missing.join("; ") + ". Either: (1) write a proper contract file at [project]/orchestration/contracts/[name].md following worker-contract-template.md and reference it in the prompt, OR (2) include the missing template elements inline. Per CLAUDE.md: 'Write contracts as files... Contracts embedded only in prompts are not auditable.'"
        }
      };
      process.stdout.write(JSON.stringify(output));
      process.exit(0);
    }

    // Case C: Substantial dispatch with embedded contract but no file — WARN
    if (isSubstantial && !contractFileValid && hasMinimumTemplate) {
      let warning = "AGENT DISPATCH WARNING: Contract is embedded inline rather than written to a file. Per CLAUDE.md, contracts should live at [project]/orchestration/contracts/*.md for auditability and reuse. Template elements found in prompt — consider extracting to file for next dispatch.";
      // Also check research-specific source strategy
      if (isResearch && !hasSourceStrategy) {
        warning += " ALSO: research-type dispatch detected without source strategy. Per CLAUDE.md, verify authoritative sources BEFORE dispatching.";
      }
      const output = {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          additionalContext: warning
        }
      };
      process.stdout.write(JSON.stringify(output));
      process.exit(0);
    }

    // Case D: Valid contract file reference, but research with no source strategy
    if (isSubstantial && contractFileValid && isResearch && !hasSourceStrategy) {
      const output = {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          additionalContext: "AGENT DISPATCH WARNING: Research-type dispatch with no source strategy language detected in prompt. If the contract file includes source strategy, this may be a false positive. Otherwise, per CLAUDE.md: verify authoritative sources BEFORE dispatching agents for research."
        }
      };
      process.stdout.write(JSON.stringify(output));
      process.exit(0);
    }

    // Case E: No plan marker — warn (may be new work needing Step 3)
    if (!hasplan) {
      const output = {
        hookSpecificOutput: {
          hookEventName: "PreToolUse",
          additionalContext: "AGENT DISPATCH WARNING: No .plan-confirmed or .plan-skipped marker found. Are you dispatching an agent for a new task that needs its own plan? Switching to a new task within the same session is new work — the test is: does the current plan describe THIS task? If not, update the plan or create a sub-plan before dispatching."
        }
      };
      process.stdout.write(JSON.stringify(output));
      process.exit(0);
    }

    // Case F: Quick lookup — pass through silently
    process.exit(0);
  } catch (e) {
    process.exit(0);
  }
});
