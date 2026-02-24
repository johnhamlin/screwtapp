<!--
Sync Impact Report
===================
Version change: 1.0.0 → 1.1.0
Modified principles:
  - Principle 1: AI Scope Boundary — Fix Notes now append to TO-FIX.md
Added sections: N/A
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md — N/A (not yet created)
  - .specify/templates/spec-template.md — N/A (not yet created)
  - .specify/templates/tasks-template.md — N/A (not yet created)
Propagated to:
  - CLAUDE.md — AI Scope Boundary section
  - .claude/rules/tests-only.md — Allowed File Patterns + procedure
  - .claude/rules/src-protected.md — Fix Notes section
  - .claude/settings.json — Edit/Write permissions for TO-FIX.md
Follow-up TODOs: None
-->

# ScrewTapp Project Constitution

**Version:** 1.1.0
**Ratified:** 2026-02-23
**Last Amended:** 2026-02-24

---

## Mission

Build long-lived, behavior-driven tests that survive refactors
and validate real functionality. Humans write 100% of production
code; AI writes ONLY tests and test infrastructure.

---

## Principle 1: AI Scope Boundary (Tests-Only)

AI agents (Claude Code, CI bots) may create or modify ONLY:

- `tests/**`
- `**/__tests__/**`
- `src/test/**`
- Files matching `**/*.{test,spec}.{ts,tsx,js,jsx}`
- Test infrastructure: Jest config/setup, MSW mocks
  (`src/mocks/**`), test utilities

AI MUST NOT modify production source under `src/**` except
`src/test/**` and `src/mocks/**`.

When a production change is needed to make code testable, AI
MUST append a **Fix Note** entry to `TO-FIX.md` (project root).
Each entry follows the numbered-list format already established
in that file:

```
N. **`<description>`** (`<path/to/file.ts:lines>`):
   - <What is wrong and why it matters>
   - Suggested fix:
     ```ts
     <code snippet>
     ```
```

**Rationale:** Preserves human ownership of production code
while allowing AI to build comprehensive test coverage safely.

---

## Principle 2: Test Pyramid Targets

| Layer | Coverage Target | Scope |
|-------|----------------|-------|
| Unit / functional core | 55–70% | Pure logic, reducers, selectors, transforms |
| RNTL component / integration | 25–40% | Screens, connected components, user flows |
| E2E smoke | 5–10% | 3–6 critical flows max |

All percentages refer to share of total test effort, not code
coverage metrics. New test files MUST map to one of these layers.

**Rationale:** Keeps the suite fast, maintainable, and focused
on the highest-value assertions at each level.

---

## Principle 3: RNTL Query & Interaction Doctrine

Query priority (strictest first):

1. `ByRole` + accessible name
2. `ByLabelText` / `ByPlaceholderText` / `ByText`
3. `ByTestId` — last resort only

Interaction rules:

- MUST prefer `userEvent` over `fireEvent`.
- MUST use `findBy*` for async appearance.
- MUST use `queryBy*` only to assert non-existence.
- MUST NOT assert internal state, props, or hook return values.
- MUST NOT mock component internals (children, render props).

**Rationale:** Tests that query like a user survive refactors.
Internal-state assertions create brittle coupling to
implementation details.

---

## Principle 4: Network Mocking Doctrine

- MUST use MSW (Mock Service Worker) for all networked behavior
  in unit and integration tests.
- MSW server MUST be configured with
  `onUnhandledRequest: 'error'` — no silent passthrough.
- Centralize default handlers in `src/mocks/handlers.ts`.
- Per-test overrides MUST use `server.use()` and reset
  automatically via `afterEach`.

**Rationale:** Centralized handlers prevent duplicated mock
logic. Failing on unhandled requests catches unintended network
calls immediately.

---

## Principle 5: Snapshot Policy

- MUST NOT snapshot whole screens or complex/nested UI trees.
- Snapshots are allowed ONLY for small, stable leaf components
  (e.g., a themed icon, a badge) with an explicit inline
  comment stating the rationale.
- Every snapshot MUST include a `// Snapshot rationale:` comment
  in the test file.

**Rationale:** Large snapshots break on trivial style changes,
generate noise in diffs, and provide no behavioral confidence.

---

## Principle 6: E2E Doctrine (Maestro)

- MUST prefer Maestro for E2E due to Expo/EAS compatibility and
  accessibility-layer automation.
- E2E smoke suite MUST remain minimal and stable: 3–6 flows.
- `testID` props are acceptable in E2E when visible text is
  localized or brittle.
- E2E flows live in `.maestro/` at the repo root.

**Rationale:** Maestro's YAML-driven flows and native
accessibility queries integrate cleanly with Expo builds and
require no test runtime inside the app bundle.

---

## Principle 7: Mutation Testing Pilot

- Scope: core domain logic only (reducers, selectors, data
  transforms). NOT UI components.
- Execution: manual, on-demand. NOT required on every commit.
- Findings MUST be tracked and used to improve test assertions.
- Tool choice deferred until test infrastructure is established.

**Rationale:** Mutation testing reveals weak assertions but is
expensive. Limiting scope keeps the cost/benefit ratio
favorable.

---

## Principle 8: Claude Code Enforcement (Local)

### CLAUDE.md + Rules

- Tests-only scope rules MUST be documented in `CLAUDE.md` and
  reinforced via `.claude/rules/` with path-scoped rule files.

### Permissions

- `.claude/settings.json` MUST deny Edit/Write to production
  `src/**` paths (excluding `src/test/**` and `src/mocks/**`).

### Hooks

- **PreToolUse hook:** Best-effort block of Edit/Write calls
  targeting production paths. Log violations.
- **PostToolUse hook:** After AI edits any test file, run the
  targeted test command (e.g., `npx jest --findRelatedTests`)
  to provide immediate feedback.

**Rationale:** Defense-in-depth — rules document intent,
permissions enforce boundaries, hooks provide runtime guardrails
and instant validation.

---

## Governance & Amendments

### Amendment Procedure

1. Propose the change with rationale in a PR or conversation.
2. Classify the version bump:
   - **MAJOR:** Principle removal or incompatible redefinition.
   - **MINOR:** New principle, new section, or material
     expansion of existing guidance.
   - **PATCH:** Wording clarification, typo fix, non-semantic
     refinement.
3. Update `Version`, `Last Amended`, and the Sync Impact Report.
4. Propagate changes to dependent templates and enforcement
   files (CLAUDE.md, .claude/rules/, hooks).

### Compliance Review

At the start of each new feature specification, verify that the
spec and task plan reference applicable constitution principles.
AI agents MUST cite the relevant principle number when a test
decision is governed by this constitution.

### Drift Prevention

Any change to this constitution MUST be intentional and
documented. Undocumented deviations discovered in practice MUST
be resolved by either amending the constitution or correcting
the practice — never by silent acceptance.
