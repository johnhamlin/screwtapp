#!/usr/bin/env bash
# PostToolUse hook: Runs jest on edited test files.
# Always exits 0 (post-hooks should not block).

set -uo pipefail

# Read JSON from stdin
INPUT=$(cat)

# Extract tool name
TOOL_NAME=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_name',''))" 2>/dev/null || echo "")

# Only check Edit and Write tools
if [[ "$TOOL_NAME" != "Edit" && "$TOOL_NAME" != "Write" ]]; then
  exit 0
fi

# Extract file_path from tool_input
FILE_PATH=$(echo "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null || echo "")

if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

# Check if the file is a test file
IS_TEST=false
if [[ "$FILE_PATH" == */__tests__/* || "$FILE_PATH" == *__tests__/* ]]; then
  IS_TEST=true
fi
if [[ "$FILE_PATH" == *.test.* || "$FILE_PATH" == *.spec.* ]]; then
  IS_TEST=true
fi

if [[ "$IS_TEST" != "true" ]]; then
  exit 0
fi

# Run jest on the edited test file
echo "Running tests for: $FILE_PATH"

# Change to repo root
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo "")
if [[ -n "$REPO_ROOT" ]]; then
  cd "$REPO_ROOT"
fi

npx jest --findRelatedTests "$FILE_PATH" --passWithNoTests --no-coverage 2>&1 || {
  echo "Test run completed with failures for: $FILE_PATH"
}

# Post-hooks always exit 0
exit 0
