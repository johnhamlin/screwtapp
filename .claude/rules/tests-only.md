# AI Scope Boundary — Constitution P1

AI agents (Claude Code) operating in this repository may **only** create or modify files in the following categories:

## Allowed File Patterns

- **Test files**: `**/__tests__/**`, `**/*.test.*`, `**/*.spec.*`
- **Test configuration**: `jest.config.*`, `jest.setup.*`, `stryker.config.*`
- **Mock files**: `src/mocks/**`
- **Test utilities**: `src/test/**`
- **Maestro E2E flows**: `.maestro/**`
- **Spec/design documents**: `specs/**`, `.specify/**`

## Prohibited

- Production source code under `src/` (except `src/test/**`, `src/mocks/**`, and `**/__tests__/**`)
- Build configuration, CI pipelines, or deployment manifests
- Any file not matching an allowed pattern above

## When Production Changes Are Needed

If a production file needs modification to improve testability, the AI must **not** edit it directly. Instead, emit a "Fix Note" describing the required change so a human developer can apply it.

This rule is enforced by `.claude/settings.json` permissions, the PreToolUse hook, and path-scoped rules.
