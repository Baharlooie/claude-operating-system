#!/bin/bash
# Sync a file from the live operating system to the distribution, applying
# path-pattern substitutions so hardcoded user paths become {YOUR_PATH}.
#
# Usage: ./sync-from-live.sh <source-absolute-path> <target-relative-to-repo-root>
#
# Example:
#   ./sync-from-live.sh \
#     "/c/Users/fresh/OneDrive/Dokumenter/AI assisted/LLM operating system/_foundation/hooks/plan-gate.js" \
#     "_foundation/hooks/plan-gate.js"
#
# The script performs a sanitizing copy: user path patterns in the source
# are replaced with {YOUR_PATH} in the target. This does NOT strip name
# patterns (client names, family names, etc.) — those are caught by the
# pre-commit hook, not silently removed.

set -e

SRC="$1"
TGT="$2"

if [ -z "$SRC" ] || [ -z "$TGT" ]; then
  echo "Usage: $0 <source-absolute-path> <target-relative-to-repo-root>"
  exit 1
fi

if [ ! -f "$SRC" ]; then
  echo "ERROR: source file not found: $SRC"
  exit 1
fi

# Ensure target directory exists
TGT_DIR=$(dirname "$TGT")
mkdir -p "$TGT_DIR"

# Copy source to target, applying path substitutions
# Handles both forward-slash and backslash path variants
sed -e 's|C:/Users/fresh/OneDrive/Dokumenter/AI assisted|{YOUR_PATH}|g' \
    -e 's|C:\\Users\\fresh\\OneDrive\\Dokumenter\\AI assisted|{YOUR_PATH}|g' \
    -e 's|/c/Users/fresh/OneDrive/Dokumenter/AI assisted|{YOUR_PATH}|g' \
    "$SRC" > "$TGT"

echo "Synced: $SRC"
echo "    -> $TGT"
echo "(Path patterns substituted. Review target before committing.)"
