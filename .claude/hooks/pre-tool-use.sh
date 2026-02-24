#!/usr/bin/env bash
# PreToolUse hook: Blocks Edit/Write to production code.
# Exits 0 to allow, exits 2 to block.

set -uo pipefail

# Read JSON from stdin
INPUT=$(cat)

# Extract tool name
TOOL_NAME=$(printf '%s' "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_name',''))" 2>/dev/null || echo "")
if [[ -z "$TOOL_NAME" ]]; then
  echo "BLOCKED: Failed to parse tool_name from hook input."
  exit 2
fi

# Only check Edit and Write tools
if [[ "$TOOL_NAME" != "Edit" && "$TOOL_NAME" != "Write" ]]; then
  exit 0
fi

# Extract file_path from tool_input
FILE_PATH=$(printf '%s' "$INPUT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null || echo "")
if [[ -z "$FILE_PATH" ]]; then
  echo "BLOCKED: Edit/Write tool call has no file_path."
  exit 2
fi

# Normalize: strip repo root, then resolve ../ segments
REL_PATH="$FILE_PATH"
REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null || echo "")
if [[ -n "$REPO_ROOT" && "$REL_PATH" == "$REPO_ROOT"* ]]; then
  REL_PATH="${REL_PATH#$REPO_ROOT/}"
fi

# Collapse ../ segments to prevent path traversal bypass
REL_PATH=$(printf '%s' "$REL_PATH" | python3 -c "import sys,os; print(os.path.normpath(sys.stdin.read().strip()))" 2>/dev/null || echo "$REL_PATH")

# --- Allowed patterns ---

# .claude/ config files (always allowed)
if [[ "$REL_PATH" == .claude/* ]]; then
  exit 0
fi

# Test files: __tests__ directories, .test.*, .spec.*
if [[ "$REL_PATH" == */__tests__/* || "$REL_PATH" == *__tests__/* ]]; then
  exit 0
fi
if [[ "$REL_PATH" == *.test.* || "$REL_PATH" == *.spec.* ]]; then
  exit 0
fi

# Test utilities and mocks
if [[ "$REL_PATH" == src/test/* || "$REL_PATH" == src/mocks/* ]]; then
  exit 0
fi

# Test config files
if [[ "$REL_PATH" == jest.config.* || "$REL_PATH" == jest.setup.* || "$REL_PATH" == stryker.config.* ]]; then
  exit 0
fi

# Maestro E2E flows
if [[ "$REL_PATH" == .maestro/* ]]; then
  exit 0
fi

# Spec/design documents
if [[ "$REL_PATH" == specs/* || "$REL_PATH" == .specify/* ]]; then
  exit 0
fi

# CLAUDE.md at repo root
if [[ "$REL_PATH" == "CLAUDE.md" ]]; then
  exit 0
fi

# Fix notes (production change requests)
if [[ "$REL_PATH" == "TO-FIX.md" ]]; then
  exit 0
fi

# Testing documentation
if [[ "$REL_PATH" == "TESTING.md" ]]; then
  exit 0
fi

# --- Blocked: everything else under src/ or any other production file ---
if [[ "$REL_PATH" == src/* ]]; then
  echo "BLOCKED: AI may not edit production code at '$REL_PATH'."
  echo "This file is under src/ and does not match any allowed test pattern."
  echo "If this file needs changes for testability, emit a Fix Note instead."
  exit 2
fi

# --- Blocked: production config files ---
case "$REL_PATH" in
  package.json|tsconfig.json|app.json|eas.json)
    echo "BLOCKED: AI may not edit production config file '$REL_PATH'."
    exit 2 ;;
  app.config.*|babel.config.*|metro.config.*)
    echo "BLOCKED: AI may not edit production config file '$REL_PATH'."
    exit 2 ;;
  .env*)
    echo "BLOCKED: AI may not edit environment file '$REL_PATH'."
    exit 2 ;;
esac

# --- Default: BLOCK everything else ---
echo "BLOCKED: File '$REL_PATH' does not match any allowed pattern."
exit 2
