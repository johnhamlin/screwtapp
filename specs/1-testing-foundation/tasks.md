# Tasks: Testing & Coverage Foundation

**Feature ID**: 1-testing-foundation
**Branch**: `1-testing-foundation`
**Generated**: 2026-02-23
**Source**: [plan.md](./plan.md), [spec.md](./spec.md)

---

## User Story Map

| Story | Priority | Description | Success Criterion |
|-------|----------|-------------|-------------------|
| US1 | P1 | Fast Local Test Loop | SC-001 (partial): `npm test` passes deterministically |
| US2 | P1 | Behavior-Driven Screen/Component Tests | SC-001: Home screen tests cover success/error/loading |
| US3 | P1 | AI Tests-Only Enforcement | SC-002: Production edits blocked, test edits allowed |
| US4 | P2 | Minimal E2E Smoke Suite | SC-003: 3 Maestro flows cover critical path |
| US5 | P3 | Mutation Testing Pilot | SC-004: Stryker report with mutation scores |

---

## Phase 1: Setup

**Goal**: Install all test dependencies and create foundational configuration files.

- [x] T001 Install Jest and RNTL test dependencies via `npx expo install jest-expo@~54.0.17` and `npm install --save-dev @testing-library/react-native@^13.3.3 @testing-library/jest-native@^5.4.3 msw@^2` in `package.json`
- [x] T002 Add test scripts to `package.json`: `"test": "jest"`, `"test:watch": "jest --watch"`, `"test:coverage": "jest --coverage"`
- [x] T003 Create Jest configuration in `jest.config.ts` with `preset: 'jest-expo'`, `testEnvironment: 'node'`, `moduleNameMapper` for `@/*` path alias, and `transformIgnorePatterns` excluding all RN ecosystem packages per plan.md A2
- [x] T004 Create native module mocks in `jest.setup.ts` per contracts/native-mocks.md: mock react-native-track-player (all exports + hooks), react-native-nitro-modules, react-native-mmkv (in-memory Map), @sentry/react-native, react-native-reanimated, @shopify/flash-list (FlatList passthrough), @react-native-community/slider, expo-router/build/testing-library/expect (bug workaround), @pchmn/expo-material3-theme. Also configure `jest.useFakeTimers({ doNotFake: ['setTimeout'] })` if any component under test uses timers (prevents MSW/undici conflicts)
- [x] T005 Create smoke test in `src/app/__tests__/smoke.test.ts` and verify `npm test` passes with 1 green test

---

## Phase 2: Foundational — MSW Infrastructure

**Goal**: Set up MSW server, handlers, and fixtures that block all network-dependent tests.
**Depends on**: Phase 1

- [x] T006 [P] Create MSW fixture data in `src/mocks/fixtures/mixtapeList.ts` with realistic `MixtapeListResponse` (3 mixtapes) per data-model.md API response shapes
- [x] T007 [P] Create MSW fixture data in `src/mocks/fixtures/mixtapeMetadata.ts` with realistic `MixtapeMetadataRawResponse` (3 tracks + non-track files including Front.jpg) per data-model.md
- [x] T008 Create MSW request handlers in `src/mocks/handlers.ts` with default success handlers for `GET https://archive.org/services/search/v1/scrape` and `GET https://archive.org/metadata/:identifier` using fixtures from T006-T007
- [x] T009 Create MSW server instance in `src/mocks/server.ts` exporting `setupServer(...handlers)`
- [x] T010 Wire MSW server lifecycle into `jest.setup.ts`: `beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))`, `afterEach(() => server.resetHandlers())`, `afterAll(() => server.close())`
- [x] T011 Create MSW integration test in `src/mocks/__tests__/msw-integration.test.ts` verifying: default handler returns fixture data, per-test override works with `server.use()`, unhandled request throws error

---

## Phase 3: User Story 1 — Fast Local Test Loop (P1)

**Goal**: Unit tests for all pure logic (transforms, utilities, Redux) pass deterministically via `npm test`.
**Independent Test**: Run `npm test` and get clear pass/fail. Unmocked network requests fail with "unhandled request" error.
**Depends on**: Phase 1, Phase 2

- [x] T012 [P] [US1] Create data transform unit tests in `src/features/mixtapeList/__tests__/transforms.test.ts`. Import the `mixtapeListApi` object and call the transform functions via `mixtapeListApi.endpoints.getMixtapeList.initiate()` with MSW providing fixture data, OR extract the inline transform lambdas into standalone exported functions (emit Fix Notes if extraction needed). Test `getMixtapeList.transformResponse`: strips "DJ Screw - " prefix, strips " (YYYY)" suffix, generates thumbnail URL, maps `identifier` to `id`, handles empty items array
- [x] T013 [US1] Add `getMixtape.transformResponse` tests to `src/features/mixtapeList/__tests__/transforms.test.ts` (same testing approach as T012). Test: filters files to tracks (has `length`), maps track fields correctly (duration parsed as number), resolves artwork (Front.jpg present vs fallback), encodes file names in URLs
- [x] T014 [P] [US1] Create color utility unit tests in `src/styles/utils/__tests__/rgbStringToRgbaString.test.ts`: valid rgb input, various alpha values (0, 0.5, 1), throws on invalid input, handles extra whitespace
- [x] T015 [P] [US1] Create player slice tests in `src/features/player/__tests__/playerSlice.test.ts`: verify each reducer state transition (`setIsPlayerReady`, `setQueue`, `setQueueIndex`, `setFooterPlayerVisible`), verify initial state shape
- [x] T016 [P] [US1] Create player selector tests in `src/features/player/__tests__/playerSelectors.test.ts`: `selectIsFooterPlayerVisible` true/false, `selectActiveTrackId` with queue present returns mixtapeId, queue null returns null, queueIndex null returns null

---

## Phase 4: User Story 2 — Behavior-Driven Screen/Component Tests (P1)

**Goal**: At least one representative screen has RNTL tests covering success/error/loading states using user-centric queries.
**Independent Test**: Run Home screen RNTL tests; confirm they break when user-visible behavior breaks.
**Depends on**: Phase 1, Phase 2

- [x] T017 [US2] Create `renderWithProviders` utility in `src/test/renderWithProviders.tsx` per contracts/test-harness.md: fresh Redux store per call (with `mixtapeListApi.middleware`), accepts `preloadedState` option, wraps with `ReduxProvider` + `PaperProvider` + `SafeAreaProvider`, returns RNTL render result + `store` reference
- [x] T018 [US2] Create `createTestStore` helper in `src/test/renderWithProviders.tsx`: export for cases needing store without render, add `afterEach` hook dispatching `mixtapeListApi.util.resetApiState()` for RTK Query cache isolation
- [x] T019 [US2] Create Home screen tests in `src/app/__tests__/index.test.tsx` covering: success state (verify mixtape items rendered via `findByText`), loading state (verify ActivityIndicator visible), error state (MSW 500 override → verify error message visible; if no explicit retry button exists, emit Fix Notes per Constitution P1 recommending the human add a retry affordance), empty state (MSW empty items → verify empty state). Use ByRole/ByText queries per Constitution P3
- [x] T020 [US2] Create Mixtape detail screen tests in `src/app/mixtape/__tests__/[id].test.tsx` covering: success state (mock `useLocalSearchParams` → verify track list), loading state, error state (MSW 500 override), empty state (MSW returns metadata with zero tracks → verify empty state UI), track interaction (`userEvent.press` on track)
- [x] T021 [US2] Create Player screen tests in `src/app/__tests__/player.test.tsx` covering: active track displayed (preload state + mock `useActiveTrack`), controls visible (verify play/pause, skip buttons via `ByRole('button')`), no active track state
- [x] T022 [US2] Create `/test-screen` skill in `.claude/commands/test-screen.md`: reads component source, generates RNTL test covering success/error/loading states, uses `renderWithProviders`, follows Constitution P3, emits Fix Notes for missing testID/accessibilityLabel
- [x] T023 [P] [US2] Create `/test-hook` skill in `.claude/commands/test-hook.md`: reads hook source, generates unit test with `renderHook` from RNTL, tests input/output for all code paths, mocks dependencies
- [x] T024 [P] [US2] Create `/test-bugfix` skill in `.claude/commands/test-bugfix.md`: takes bug description, identifies affected component/function, generates failing regression test first, emits run instructions

---

## Phase 5: User Story 3 — AI Tests-Only Enforcement (P1)

**Goal**: AI tool calls targeting production `src/**` are blocked; test file edits proceed.
**Independent Test**: Attempt AI edit to production source → blocked; attempt edit to `__tests__/` → allowed.
**Depends on**: None (can run in parallel with Phases 1-4)

- [x] T025 [P] [US3] Create `.claude/rules/tests-only.md` declaring AI may only create/modify test files, test config, mocks, and test utilities — reference Constitution P1
- [x] T026 [P] [US3] Create `.claude/rules/src-protected.md` (path-scoped to `src/`): deny production code edits, allow `src/test/**` and `src/mocks/**`, instruct to emit Fix Notes for production changes
- [x] T027 [US3] Update `.claude/settings.json` with `deny` rules for Edit/Write to `src/**` and `allow` rules for `src/test/**`, `src/mocks/**`, `**/__tests__/**`, `**/*.test.*`, `**/*.spec.*`, `jest.config.*`, `jest.setup.*`, `stryker.config.*`, `.maestro/**`
- [x] T028 [US3] Create PreToolUse hook script at `.claude/hooks/pre-tool-use.sh`: intercept Edit/Write tool calls, check target path against allowed patterns, block with clear message if targeting production code, log violation attempts
- [x] T029 [US3] Create PostToolUse hook script at `.claude/hooks/post-tool-use.sh`: after AI edits a test file, run `npx jest --findRelatedTests <edited-file>`, report pass/fail back to agent
- [x] T030 [US3] Wire hooks into `.claude/settings.json` by adding PreToolUse and PostToolUse hook entries pointing to the shell scripts from T028-T029
- [x] T031 [US3] Update `CLAUDE.md` with test infrastructure section: available test commands (`npm test`, `npm run test:watch`, `npm run test:coverage`), test file conventions (`__tests__/` colocated), AI scope boundary reminder, link to constitution

---

## Phase 6: User Story 4 — Minimal E2E Smoke Suite (P2)

**Goal**: 3 Maestro YAML flows covering browse → view → play critical path.
**Independent Test**: Run Maestro flows on simulator and confirm they fail on major regressions.
**Depends on**: Pre-built app binary (human responsibility)

- [x] T032 [P] [US4] Create Maestro flow `.maestro/smoke-browse-mixtapes.yaml`: launch app, wait for mixtape list to load via `extendedWaitUntil`, verify at least one mixtape title visible, scroll list, assert no crash
- [x] T033 [P] [US4] Create Maestro flow `.maestro/smoke-view-tracks.yaml`: launch app, tap first mixtape, wait for track list to load, verify at least one track title visible, navigate back to list
- [x] T034 [P] [US4] Create Maestro flow `.maestro/smoke-play-audio.yaml`: launch app, tap mixtape, tap track, verify player screen opens, verify track info displayed, verify play/pause button exists, navigate back
- [x] T035 [US4] Emit Fix Notes for Maestro testability: `testID="footer-player"` on FooterPlayer (`src/features/player/components/FooterPlayer.tsx`), `testID` on PlayerControls buttons (`src/features/player/components/PlayerControls.tsx`), `accessibilityLabel` on PlayPauseButton (`src/features/player/components/PlayPauseButton.tsx`), `testID` on FlashList items if needed

---

## Phase 7: User Story 5 — Mutation Testing Pilot (P3)

**Goal**: Stryker produces a mutation score report for data transform pure functions.
**Independent Test**: Run `npm run test:mutate` and view HTML report with surviving mutants.
**Depends on**: Phase 1, Phase 3 (needs passing unit tests for transforms)

- [x] T036 [US5] Install Stryker dependencies: `npm install --save-dev @stryker-mutator/core @stryker-mutator/jest-runner @stryker-mutator/typescript-checker` in `package.json`
- [x] T037 [US5] Create Stryker configuration in `stryker.config.mjs`: `testRunner: 'jest'`, `checkers: ['typescript']`, `coverageAnalysis: 'perTest'`, `incremental: true`, `mutate` targeting `src/styles/utils/rgbStringToRgbaString.ts` and `src/features/mixtapeList/slices/mixtapeListApi.ts`, reporters `['html', 'clear-text', 'progress']`
- [x] T038 [US5] Add npm script `"test:mutate": "npx stryker run"` to `package.json` and add `.stryker-tmp/` and `reports/` to `.gitignore`
- [x] T039 [US5] Run Stryker pilot and document results: total mutants, mutation score, surviving mutants, recommendations — output to `specs/1-testing-foundation/mutation-report.md`

---

## Phase 8: Polish & Cross-Cutting

**Goal**: Final validation, cleanup, and documentation.

- [x] T040 Verify all tests pass via `npm test` (full suite) — confirm deterministic, no flaky tests
- [x] T041 Run `npm run test:coverage` and review coverage report — document baseline numbers (no thresholds required, informational only)

---

## Dependencies

```
Phase 1 (Setup)
  ↓
Phase 2 (MSW Foundational)
  ↓
Phase 3 (US1: Unit Tests) ──────→ Phase 7 (US5: Mutation Testing)
  ↓
Phase 4 (US2: Screen Tests + Skills)

Phase 5 (US3: Enforcement) ← runs in parallel with Phases 1-4
Phase 6 (US4: Maestro E2E) ← runs in parallel, needs app binary

Phase 8 (Polish) ← after all other phases
```

### Story Completion Order

1. **US3** (Enforcement) — can start immediately, no dependencies
2. **US1** (Fast Test Loop) — after Phase 1 + 2
3. **US2** (Screen Tests) — after US1 infrastructure
4. **US4** (E2E Smoke) — parallel, when app binary available
5. **US5** (Mutation Pilot) — after US1 unit tests exist

---

## Parallel Execution Opportunities

### Within Phase 1 (Setup)
- T001 + T002 must be sequential (deps install before scripts)
- T003 + T004 can run in parallel after T001-T002

### Within Phase 2 (MSW)
- T006 + T007 are parallel (independent fixture files)
- T008 depends on T006 + T007
- T009 depends on T008

### Within Phase 3 (US1)
- **All 5 tasks (T012-T016) are fully parallel** — they test different modules with no shared state

### Within Phase 4 (US2)
- T017-T018 must be sequential (harness before helper)
- T019-T021 are parallel after T017-T018 (different screens)
- T022-T024 are parallel (independent skill files)

### Within Phase 5 (US3)
- T025 + T026 are parallel (independent rule files)
- T027-T030 are sequential (settings → hooks → wiring)
- T031 can run in parallel with T027-T030

### Within Phase 6 (US4)
- **T032-T034 are fully parallel** (independent YAML flows)
- T035 depends on reviewing T032-T034

### Cross-Phase Parallelism
- **Phase 5 (US3) runs entirely in parallel with Phases 1-4**
- **Phase 6 (US4) runs entirely in parallel with all other phases**

---

## Implementation Strategy

### MVP (Minimum Viable)
**Phases 1-3**: Jest setup + MSW + unit tests = working `npm test` with deterministic results.
This delivers US1 and unblocks all downstream work.

### Increment 2
**Phase 4**: Screen RNTL tests + skills = US2 complete (SC-001 verified).

### Increment 3
**Phase 5**: Enforcement rules + hooks = US3 complete (SC-002 verified).

### Increment 4
**Phase 6**: Maestro flows = US4 complete (SC-003 verified).

### Increment 5
**Phase 7**: Stryker pilot = US5 complete (SC-004 verified).

---

## Fix Notes (Human Action Required)

These production code changes are needed for testability. AI cannot make them per Constitution P1.

1. **FooterPlayer** (`src/features/player/components/FooterPlayer.tsx`): Add `testID="footer-player"` to root container
2. **PlayerControls** (`src/features/player/components/PlayerControls.tsx`): Add `testID` to each control button
3. **PlayPauseButton** (`src/features/player/components/PlayPauseButton.tsx`): Add `accessibilityLabel="Play"` / `"Pause"` based on state
4. **FlashList items** (Home screen, Mixtape detail): Consider adding `testID` to list item wrapper for Maestro `scrollUntilVisible`
