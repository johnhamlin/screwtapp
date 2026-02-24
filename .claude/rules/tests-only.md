# AI Scope Boundary — Constitution P1

AI agents (Claude Code) operating in this repository may **only** create or modify files in the following categories:

## Allowed File Patterns

- **Test files**: `**/__tests__/**`, `**/*.test.*`, `**/*.spec.*`
- **Test configuration**: `jest.config.*`, `jest.setup.*`, `stryker.config.*`
- **Mock files**: `src/mocks/**`
- **Test utilities**: `src/test/**`
- **Maestro E2E flows**: `.maestro/**`
- **Spec/design documents**: `specs/**`, `.specify/**`
- **Fix notes**: `TO-FIX.md`

## Prohibited

- Production source code under `src/` (except `src/test/**`, `src/mocks/**`, and `**/__tests__/**`)
- Build configuration, CI pipelines, or deployment manifests
- Any file not matching an allowed pattern above

## When Production Changes Are Needed

If a production file needs modification to improve testability, the AI must **not** edit it directly. Instead, append a Fix Note entry to `TO-FIX.md` at the project root, following the numbered-list format established in that file.

This rule is enforced by `.claude/settings.json` permissions, the PreToolUse hook, and path-scoped rules.
