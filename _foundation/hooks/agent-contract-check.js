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
    // Strategy: try quoted paths first, then labeled ("Contract file: ..."),
    // then unquoted (simple no-space paths).
    let contractFileValid = false;
    let contractFileReferenced = null;
    // 1. Quoted paths: backtick, double-quote, single-quote wrapping a contracts path
    const backtickMatch = agentPrompt.match(/`([^`]*contracts?[\/\\][^`]+\.md)`/i);
    const dblQuoteMatch = agentPrompt.match(/"([^"]*contracts?[\/\\][^"]+\.md)"/i);
    const sglQuoteMatch = agentPrompt.match(/'([^']*contracts?[\/\\][^']+\.md)'/i);
    const quotedRef = backtickMatch ? backtickMatch[1]
      : dblQuoteMatch ? dblQuoteMatch[1]
      : sglQuoteMatch ? sglQuoteMatch[1]
      : null;
    // 2. Labeled: "Contract file:", "Contract at:", "contract:" followed by path ending .md
    const labeledMatch = agentPrompt.match(/[Cc]ontract\s*(?:file|at)?[:\s]+([A-Za-z.~\/\\][^\n]*?\.md)\b/i);
    const labeledRef = labeledMatch && /contracts?[\/\\]/i.test(labeledMatch[1])
      ? labeledMatch[1].trim() : null;
    // 3. Unquoted: no-space path (works for simple paths like orchestration/contracts/x.md)
    const unquotedMatch = agentPrompt.match(/\S*contracts?[\/\\]\S+\.md/i);
    const unquotedRef = unquotedMatch ? unquotedMatch[0] : null;
    // Priority: quoted > labeled (handles spaces) > unquoted (simple paths)
    const rawRef = quotedRef || labeledRef || unquotedRef || null;
    if (rawRef) {
      contractFileReferenced = rawRef;
      // Verify the file exists (absolute path or relative to cwd)
      const absPath = path.isAbsolute(contractFileReferenced)
        ? path.resolve(contractFileReferenced)
        : path.resolve(path.join(cwd, contractFileReferenced));
      if (fs.existsSync(absPath)) {
        contractFileValid = true;
      }
    }

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
