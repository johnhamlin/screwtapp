---
globs: src/**
---

# Production Code Protection

**Production code under `src/` is protected.** AI agents must not edit production source files.

## Exceptions

The following paths under `src/` are allowed:

- `src/test/**` — Shared test utilities (renderWithProviders, createTestStore, etc.)
- `src/mocks/**` — MSW handlers, fixtures, and mock modules
- `**/__tests__/**` — Colocated test directories within any feature

## Fix Notes

When a production file needs changes to improve testability (e.g., exporting an internal function, adding a dependency injection seam), the AI must **not** edit the file directly. Instead, append a Fix Note entry to `TO-FIX.md` at the project root, following the numbered-list format established in that file:

> **N.** **`<description>`** (`path/to/file.ts:lines`):
> - What is wrong and why it matters
> - Suggested fix with code snippet

A human developer will review and apply the change.
