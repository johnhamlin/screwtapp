# Feature Specification: Testing & Coverage Foundation

**Feature ID**: 1-testing-foundation
**Status**: Draft
**Created**: 2026-02-23
**Last Updated**: 2026-02-23
**Author**: Human + AI (spec only)

---

## Overview

Establish a comprehensive, scalable test infrastructure for a
React Native (Expo) app where humans write 100% of production
code and AI writes only tests and test tooling. The foundation
covers unit tests, component/screen integration tests via RNTL,
E2E smoke tests via Maestro, mutation testing for core logic,
and Claude Code enforcement guardrails ensuring the AI
tests-only boundary is reliable.

## Clarifications

### Session 2026-02-23

- Q: Canonical test directory convention? → A: Colocated `__tests__/` dirs next to production code (e.g., `src/features/player/__tests__/`)
- Q: Which modules constitute "core logic" for mutation testing? → A: Data transforms only (API response transforms, queue logic) — pure functions with clear inputs/outputs
- Q: What distinguishes the three Claude Code skills? → A: Distinct workflows — `/test-screen` generates RNTL multi-state tests (success/error/loading); `/test-hook` generates unit input/output tests for custom hooks; `/test-bugfix` generates a failing-first regression test from a bug description

## Problem Statement

The app currently has no test runner, no test infrastructure,
and no guardrails preventing AI from modifying production code.
Without tests, refactoring is risky, regressions go undetected,
and there is no automated confidence that the app works as
intended. Without enforcement, the "AI writes tests only"
boundary is aspirational rather than real.

## Target Users

- **Solo developer** — the human owner who writes all production
  code, runs tests locally, and relies on AI to build and
  maintain the test suite.

## User Scenarios & Testing

### User Story 1 — Fast Local Test Loop

**Priority**: P1
**As a** solo dev, **I can** run unit and RNTL integration tests
locally with deterministic results **so that** I can refactor
safely.

**Why this priority**: Unlocks regression protection immediately
for all future changes.

**Independent Test**: Run a single command locally and get clear
pass/fail for unit + integration tests.

**Acceptance Scenarios**:

1. **Given** a clean checkout, **When** the developer runs the
   test command, **Then** unit and integration tests run
   deterministically and finish successfully.
2. **Given** a test triggers an unmocked network request,
   **When** tests run, **Then** the test fails with a clear
   "unhandled request" error (not a silent pass or hang).

---

### User Story 2 — Behavior-Driven Screen/Component Tests

**Priority**: P1
**As a** solo dev, **I can** have AI generate RNTL tests for
screens and components that assert user-visible behavior **so
that** tests survive refactors and catch real regressions.

**Why this priority**: Provides protection for the UI flows
most likely to break.

**Independent Test**: Pick a screen, run its RNTL tests, and
confirm they break when user-visible behavior breaks (not when
internal implementation changes).

**Acceptance Scenarios**:

1. **Given** a screen with a primary action, **When** the user
   performs the action, **Then** the expected UI outcome is
   visible (success state).
2. **Given** a network failure, **When** the screen loads,
   **Then** an error state is visible and a retry affordance
   exists.
3. **Given** data is loading, **When** the screen renders,
   **Then** a loading indicator is visible.

---

### User Story 3 — AI Tests-Only Enforcement

**Priority**: P1
**As a** solo dev, **I need** the tooling to prevent AI from
editing production code **so that** the "tests-only AI"
boundary is reliable, not just aspirational.

**Why this priority**: Prevents accidental production changes
and keeps code ownership human.

**Independent Test**: Attempt an AI edit to production source
and verify it is blocked; verify test file edits are allowed.

**Acceptance Scenarios**:

1. **Given** an AI agent attempts to Edit/Write a file under
   `src/**` (excluding `**/__tests__/**` and `src/mocks/**`),
   **When** the tool call is invoked, **Then** the attempt is
   blocked or denied with a clear reason message.
2. **Given** an AI agent attempts to edit a file under
   `**/__tests__/**` or `src/mocks/**`, **When** the tool call
   is invoked, **Then** it proceeds normally.
3. **Given** AI determines a production change is needed for
   testability, **When** it encounters this situation, **Then**
   it emits Fix Notes instead of making the change.

---

### User Story 4 — Minimal E2E Smoke Suite

**Priority**: P2
**As a** solo dev, **I have** a small Maestro smoke suite that
validates the critical path on device/simulator **so that** I
catch "it works on device" issues without maintaining a slow,
brittle E2E suite.

**Why this priority**: Catches real integration issues that
unit/RNTL tests cannot, while staying small enough to be
maintainable.

**Independent Test**: Run 3–6 Maestro flows and confirm they
fail on major regressions.

**Acceptance Scenarios**:

1. **Given** a built app, **When** E2E smoke tests run,
   **Then** the app launches and completes core smoke flows
   reliably.
2. **Given** a broken navigation regression, **When** E2E runs,
   **Then** it fails deterministically with clear output
   identifying the failure point.

---

### User Story 5 — Mutation Testing Pilot

**Priority**: P3
**As a** solo dev, **I can** run mutation testing for core
logic modules **so that** I validate test effectiveness beyond
code coverage and catch "green tests that assert nothing."

**Why this priority**: Provides a higher bar for test quality,
but only needed after baseline coverage exists.

**Independent Test**: Run mutation testing on core logic and
view a mutation score report.

**Acceptance Scenarios**:

1. **Given** mutation testing is configured for data transforms
   (API response transforms, player queue logic), **When** the
   developer runs the mutation test command, **Then** it
   produces a report listing surviving mutants and a mutation
   score.

---

## Edge Cases

- **Loading / slow network states**: Tests MUST handle async UI
  deterministically using `findBy*` queries; no reliance on
  real network timing.
- **Offline / server failures**: MSW handlers MUST simulate
  error responses; tests MUST verify error UI is displayed.
- **Empty states**: Tests MUST cover screens with zero data
  (empty mixtape list, mixtape with no tracks).
- **Time-dependent UI**: Tests MUST NOT depend on real time;
  use fake timers or deterministic values where time affects UI.
- **Localization / brittle text**: Test strategy MUST remain
  stable if UI text changes; prefer accessible role queries
  over exact text matching where feasible. E2E tests may use
  `testID` when text is brittle.

---

## Functional Requirements

- **FR-001**: The system MUST provide a shared
  `renderWithProviders` test harness that wraps components with
  all necessary providers (Redux store, theme, navigation) for
  screen and component tests.
- **FR-002**: Tests MUST use user-centric RNTL queries: assert
  on visible text and accessibility roles. Tests MUST NOT assert
  on internal state, props, or hook return values.
- **FR-003**: The system MUST use MSW (Mock Service Worker) for
  all networked behavior in unit and integration tests, with
  `onUnhandledRequest: 'error'` configured globally.
- **FR-004**: The system MUST provide three Claude Code skills,
  each manual-invocation only and following the constitution's
  testing doctrines:
  - `/test-screen` — generates RNTL tests covering success,
    error, and loading states for a given screen/component.
  - `/test-hook` — generates unit tests for custom hooks with
    input/output assertions.
  - `/test-bugfix` — takes a bug description and generates a
    failing-first regression test before any fix is applied.
- **FR-005**: The system MUST implement best-effort enforcement
  preventing AI edits to `src/**` production code (excluding
  `**/__tests__/**` and `src/mocks/**`), using a combination
  of Claude Code rules, permissions, and hooks.

---

## Success Criteria

- **SC-001**: For at least one representative screen, tests
  cover success, error, and loading states using user-centric
  queries (ByRole/ByText, not ByTestId or internal state).
- **SC-002**: AI tool calls that attempt to modify production
  source under `src/**` (excluding `**/__tests__/**` and
  `src/mocks/**`) are blocked; only test file changes proceed.
- **SC-003**: A minimal Maestro smoke suite of 3–6 flows exists,
  covering the critical user path (browse mixtapes, view tracks,
  play audio).
- **SC-004**: Mutation testing can be run for data transform
  modules (API response transforms, player queue logic) and
  produces a readable report with mutation scores and surviving
  mutant details.

---

## Scope

### In Scope

- Jest configuration and setup for Expo/React Native
- RNTL test utilities (`renderWithProviders`, custom queries)
- MSW server setup with centralized handlers and per-test
  override pattern
- Unit tests for reducers, selectors, and data transforms
- RNTL integration tests for at least one screen (all states)
- Claude Code enforcement: `.claude/rules/`, settings
  permissions, PreToolUse/PostToolUse hooks
- Three Claude Code skills for test generation
- Maestro E2E smoke suite (3–6 flows)
- Mutation testing pilot configuration for data transforms
  (API response transforms, player queue logic)
- **Convention**: Test files live in colocated `__tests__/`
  directories adjacent to the code they test (e.g.,
  `src/features/player/__tests__/`). `src/mocks/` holds MSW
  handlers and shared test fixtures.

### Out of Scope

- Modifying any production source code (human responsibility)
- CI/CD pipeline integration (future work)
- Visual regression testing
- Performance/load testing
- Code coverage thresholds or coverage gating
- Test generation for every screen/component (foundation only)

---

## Dependencies

- **Existing production code**: Tests wrap existing screens,
  reducers, and API layers; production code is not modified.
- **Archive.org API**: MSW mocks simulate Archive.org responses;
  no live API calls in tests.
- **react-native-track-player**: Audio player must be mocked
  in test environment (native module).
- **react-native-mmkv**: Storage must be mocked or stubbed for
  test isolation.
- **Expo Router**: Navigation must be wrappable in test harness.

---

## Assumptions

- The developer will install test dependencies (Jest, RNTL,
  MSW, Maestro) as part of the implementation; AI provides
  configuration but not `npm install` commands in production
  `package.json` (test deps are dev dependencies and acceptable
  for AI to specify).
- Native modules (RNTP, MMKV) will require manual mocks in
  `__mocks__/` or `jest.setup.ts`; the specific mock shapes
  may need human adjustment if APIs change.
- Maestro flows assume a pre-built app binary is available;
  building the app is outside the AI's scope.
- The mutation testing tool selection is deferred; the pilot
  will evaluate options compatible with the Jest + RN stack.
- Claude Code hooks run locally only; there is no server-side
  enforcement mechanism.

---

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Native module mocks diverge from real APIs | Medium | High | Pin mock shapes to documented APIs; human reviews mocks when upgrading deps |
| MSW setup complexity with React Native bundler | Medium | Medium | Follow established RN + MSW patterns; fall back to manual fetch mocks if MSW integration proves unreliable |
| Claude Code hooks are best-effort, not airtight | High | Low | Layer defenses (rules + permissions + hooks); accept that determined bypass is possible but unlikely in normal use |
| Maestro flow stability across Expo SDK upgrades | Medium | Medium | Keep E2E suite minimal (3–6 flows); prefer accessibility-based selectors over fragile coordinates |

---

## Constitution References

This feature is governed by the following constitution principles:

- **Principle 1**: AI Scope Boundary (tests-only)
- **Principle 2**: Test Pyramid Targets
- **Principle 3**: RNTL Query & Interaction Doctrine
- **Principle 4**: Network Mocking Doctrine
- **Principle 5**: Snapshot Policy
- **Principle 6**: E2E Doctrine (Maestro)
- **Principle 7**: Mutation Testing Pilot
- **Principle 8**: Claude Code Enforcement (Local)
