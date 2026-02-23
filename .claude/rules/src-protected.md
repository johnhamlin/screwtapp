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

When a production file needs changes to improve testability (e.g., exporting an internal function, adding a dependency injection seam), the AI must **not** edit the file directly. Instead, emit a **Fix Note** in the following format:

> **Fix Note** (`path/to/production/file.ts`):
> Description of the required change and why it improves testability.
> Suggested diff or code snippet.

A human developer will review and apply the change.
