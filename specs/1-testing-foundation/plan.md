# Implementation Plan: Testing & Coverage Foundation

**Feature ID**: 1-testing-foundation
**Branch**: `1-testing-foundation`
**Status**: Planning Complete
**Created**: 2026-02-23

---

## Technical Context

### Stack

- **Runtime**: Expo 54, React Native 0.81, React 19.1, New Architecture
- **State**: Redux Toolkit + RTK Query, persisted via MMKV v4
- **Audio**: react-native-track-player v5 (alpha, Fabric)
- **UI**: react-native-paper (MD3), @shopify/flash-list
- **Routing**: Expo Router (file-based, `src/app/`)
- **Node**: 22.22.0 (Volta), npm with `legacy-peer-deps=true`

### Key Constraints

- `jest-expo@~54.0.17` bundles Jest 29.x — must not use Jest 30
- `@testing-library/react-native@^13.3.3` — async APIs (render, fireEvent, act return Promises)
- `testEnvironment: 'node'` — required for MSW `msw/node`; RNTL does not require jsdom
- expo-router/testing-library has `expect/build/matchers` bug (expo/expo#40184) — mock workaround
- react-native-mmkv v4 Nitro Modules crash in Jest — must mock `react-native-nitro-modules`
- Path alias `@/*` → `src/*` needs `moduleNameMapper` in Jest config

---

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| P1: AI Scope Boundary | PASS | All deliverables are test files, test config, mocks, or enforcement rules. No production code modified. |
| P2: Test Pyramid Targets | PASS | Plan includes unit tests (transforms, selectors), RNTL integration (screens), E2E smoke (3-6 Maestro flows). |
| P3: RNTL Query Doctrine | PASS | Contracts specify ByRole/ByText priority, userEvent preference, no internal state assertions. |
| P4: Network Mocking Doctrine | PASS | MSW with `onUnhandledRequest: 'error'`, centralized handlers, per-test override pattern. |
| P5: Snapshot Policy | PASS | No screen-level snapshots planned. |
| P6: E2E Doctrine | PASS | Maestro flows in `.maestro/`, 3-6 flows max, testID for localized/brittle text. |
| P7: Mutation Testing Pilot | PASS | Scoped to data transforms only (pure functions). Manual execution. |
| P8: Claude Code Enforcement | PASS | Plan includes CLAUDE.md rules, .claude/settings.json permissions, PreToolUse/PostToolUse hooks. |

**Gate evaluation**: All principles satisfied. No violations.

---

## Phase 0: Research (Complete)

See [research.md](./research.md) for full findings.

**Summary of decisions**:
- Jest via `jest-expo@~54.0.17` with `testEnvironment: 'node'`
- RNTL v13.3.3 (async APIs for React 19)
- MSW v2.x with `msw/node` (no polyfills needed)
- Two RNTL approaches: `renderWithProviders` (most tests) + `renderRouter` (navigation integration)
- Maestro CLI for E2E smoke
- Stryker Mutator for mutation testing pilot
- 6 native modules require mocks

---

## Phase 1: Design (Complete)

See:
- [data-model.md](./data-model.md) — entities, transforms, mock data shapes
- [contracts/test-harness.md](./contracts/test-harness.md) — `renderWithProviders` interface
- [contracts/msw-handlers.md](./contracts/msw-handlers.md) — MSW handler structure
- [contracts/native-mocks.md](./contracts/native-mocks.md) — native module mock shapes
- [quickstart.md](./quickstart.md) — setup commands and verification

---

## Phase 2: Implementation Tasks

### Task Group A: Jest + Test Runner Setup (P1, Foundation)

**Blocks**: All other task groups

#### A1: Install test dependencies

Install via `npx expo install` and `npm install --save-dev`:
- `jest-expo@~54.0.17`
- `@testing-library/react-native@^13.3.3`
- `@testing-library/jest-native@^5.4.3`
- `msw@^2`

Update `package.json` scripts:
- `"test": "jest"`
- `"test:watch": "jest --watch"`
- `"test:coverage": "jest --coverage"`

#### A2: Create Jest configuration

Create `jest.config.ts`:
- `preset: 'jest-expo'`
- `testEnvironment: 'node'`
- `setupFilesAfterEnv: ['./jest.setup.ts']`
- `moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' }`
- `transformIgnorePatterns`: exclude all RN ecosystem packages
  (`react-native`, `@react-native`, `expo-*`, `@expo`, `@shopify`,
  `react-native-paper`, `react-native-track-player`,
  `react-native-reanimated`, `react-native-gesture-handler`,
  `react-native-svg`, `react-native-safe-area-context`,
  `react-native-screens`, `react-native-mmkv`,
  `react-native-nitro-modules`, `@sentry`, `@pchmn`,
  `@johnhamlin/redux-persist`, `@reduxjs`)

#### A3: Create jest.setup.ts with native module mocks

Per [contracts/native-mocks.md](./contracts/native-mocks.md):
- Mock `react-native-track-player` (all exports + hooks)
- Mock `react-native-nitro-modules` (prevents MMKV crash)
- Mock `react-native-mmkv` (in-memory Map implementation)
- Mock `@sentry/react-native` (all exports as jest.fn)
- Mock `react-native-reanimated` (official mock)
- Mock `@shopify/flash-list` (FlatList passthrough)
- Mock `@react-native-community/slider` (View passthrough)
- Mock `expo-router/build/testing-library/expect` (bug workaround)
- Mock `@pchmn/expo-material3-theme` (return default theme)

#### A4: Smoke test — verify Jest runs

Create `src/app/__tests__/smoke.test.ts`:
```typescript
test('jest is configured correctly', () => {
  expect(1 + 1).toBe(2);
});
```

Run `npm test` to verify the entire pipeline works.

**Deliverable**: `npm test` passes with 1 green test.

---

### Task Group B: MSW + Test Fixtures (P1)

**Blocks**: C (screen tests)
**Depends on**: A

#### B1: Create MSW server and handlers

Per [contracts/msw-handlers.md](./contracts/msw-handlers.md):

- `src/mocks/server.ts` — `setupServer(...handlers)` export
- `src/mocks/handlers.ts` — default handlers:
  - `GET https://archive.org/services/search/v1/scrape` → fixture list
  - `GET https://archive.org/metadata/:identifier` → fixture metadata
- `src/mocks/fixtures/mixtapeList.ts` — `MixtapeListResponse` fixture
- `src/mocks/fixtures/mixtapeMetadata.ts` — `MixtapeMetadataRawResponse` fixture

#### B2: Wire MSW into jest.setup.ts

Add to `jest.setup.ts`:
```typescript
import { server } from '@/mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

#### B3: Test MSW integration

Create `src/mocks/__tests__/msw-integration.test.ts`:
- Verify default handler returns fixture data
- Verify per-test override works with `server.use()`
- Verify unhandled request throws error

**Deliverable**: MSW intercepts RTK Query fetch calls in tests.

---

### Task Group C: renderWithProviders + Screen Tests (P1)

**Depends on**: A, B

#### C1: Create renderWithProviders utility

Per [contracts/test-harness.md](./contracts/test-harness.md):

`src/test/renderWithProviders.tsx`:
- Creates fresh Redux store per call (with RTK Query middleware)
- Accepts `preloadedState` option for pre-seeded state
- Wraps with `ReduxProvider`, `PaperProvider`, `SafeAreaProvider`
- Returns RNTL render result + `store` reference

#### C2: Create RTK Query test helper

In `src/test/renderWithProviders.tsx` or separate util:
- Export `createTestStore(preloadedState?)` for cases
  needing store without render
- Include `mixtapeListApi.middleware` in test store
- Helper to `store.dispatch(mixtapeListApi.util.resetApiState())`
  — call in global `afterEach` or per-test

#### C3: Home screen tests (SC-001 representative screen)

`src/app/__tests__/index.test.tsx`:

1. **Success state**: render Home → `findByRole('list')` or
   `findByText` for mixtape titles from fixture data → verify
   mixtape items rendered
2. **Loading state**: render Home → immediately `queryByRole`
   for loading indicator (ActivityIndicator) → verify visible
3. **Error state**: `server.use()` to return 500 →
   render Home → `findByText` for error message → verify
   retry affordance exists
4. **Empty state**: `server.use()` to return empty items →
   render Home → verify empty state message

Constitution P3: Use `ByRole`/`ByText` queries, `userEvent`
for interactions, `findBy*` for async. No internal state
assertions.

#### C4: Mixtape detail screen tests

`src/app/mixtape/__tests__/[id].test.tsx`:

1. **Success state**: mock `useLocalSearchParams` → render →
   verify track list items appear from fixture
2. **Loading state**: verify loading indicator while fetching
3. **Error state**: MSW 500 override → verify error UI
4. **Track interaction**: `userEvent.press` on track →
   verify navigation or player dispatch

#### C5: Player screen tests

`src/app/__tests__/player.test.tsx`:

1. **Active track displayed**: preload state with queue +
   mock `useActiveTrack` → verify track info visible
2. **Controls visible**: verify play/pause, skip buttons
   via `ByRole('button')`
3. **No active track**: verify appropriate empty/default state

---

### Task Group D: Unit Tests — Transforms + Redux (P1)

**Depends on**: A

#### D1: Data transform unit tests

`src/features/mixtapeList/__tests__/transforms.test.ts`:

Test `getMixtapeList.transformResponse`:
- Strips "DJ Screw - " prefix
- Strips " (YYYY)" suffix
- Generates correct thumbnail URL
- Maps `identifier` → `id`
- Handles empty items array

Test `getMixtape.transformResponse`:
- Filters files to only tracks (has `length` property)
- Maps track fields correctly (duration parsed as number)
- Resolves artwork (Front.jpg present vs. fallback)
- Encodes file names in URLs

#### D2: Color utility unit tests

`src/styles/utils/__tests__/rgbStringToRgbaString.test.ts`:

- Valid `rgb(255, 0, 128)` → `rgba(255, 0, 128, 0.5)`
- Handles various alpha values (0, 0.5, 1)
- Throws on invalid input (no numbers, empty string)
- Handles extra whitespace in input

#### D3: Player Redux tests

`src/features/player/__tests__/playerSlice.test.ts`:
- Each reducer: verify state transition
- Initial state shape

`src/features/player/__tests__/playerSelectors.test.ts`:
- `selectIsFooterPlayerVisible`: true/false states
- `selectActiveTrackId`: queue present → returns mixtapeId;
  queue null → returns null; queueIndex null → returns null

---

### Task Group E: Claude Code Enforcement (P1)

**Depends on**: None (parallel with A-D)

#### E1: Create .claude/rules/ for test-only scope

`.claude/rules/tests-only.md`:
- Declare that AI may only create/modify test files,
  test config, mocks, and test utilities
- Reference Constitution P1

`.claude/rules/src-protected.md` (path-scoped to `src/`):
- Explicitly deny production code edits
- Allow `src/test/**` and `src/mocks/**`
- Instruct to emit Fix Notes for production changes

#### E2: Update .claude/settings.json permissions

Add `deny` rules for Edit/Write targeting:
- `src/**` (production code)

Add `allow` rules for:
- `src/test/**`
- `src/mocks/**`
- `**/__tests__/**`
- `**/*.test.*`
- `**/*.spec.*`
- `jest.config.*`
- `jest.setup.*`
- `stryker.config.*`
- `.maestro/**`

#### E3: Create PreToolUse hook

`.claude/hooks/pre-tool-use.sh`:
- Intercept Edit/Write tool calls
- Check target path against allowed patterns
- Block with clear message if targeting production code
- Log violation attempts

#### E4: Create PostToolUse hook

`.claude/hooks/post-tool-use.sh`:
- After AI edits a test file, run:
  `npx jest --findRelatedTests <edited-file>`
- Report pass/fail back to the agent

#### E5: Update CLAUDE.md

Add test infrastructure section:
- Available test commands
- Test file conventions (`__tests__/` colocated)
- AI scope boundary reminder
- Link to constitution

---

### Task Group F: Claude Code Skills (P1)

**Depends on**: A, B, C (needs working test infrastructure)

#### F1: `/test-screen` skill

`.claude/commands/test-screen.md`:
- Input: screen/component file path
- Reads the component source
- Generates RNTL test file covering:
  - Success state (data loaded)
  - Error state (MSW error override)
  - Loading state (initial render)
- Uses `renderWithProviders`
- Follows Constitution P3 (ByRole/ByText, userEvent, findBy*)
- Outputs Fix Notes if production code needs `testID` or
  `accessibilityLabel`

#### F2: `/test-hook` skill

`.claude/commands/test-hook.md`:
- Input: custom hook file path
- Reads the hook source
- Generates unit test with `renderHook` from RNTL
- Tests input → output for all code paths
- Mocks dependencies (not hook internals)

#### F3: `/test-bugfix` skill

`.claude/commands/test-bugfix.md`:
- Input: bug description (natural language)
- Identifies affected component/function
- Generates a **failing** regression test first
- Test should fail on current code (proving the bug exists)
- Emits instructions: "Run this test — it should FAIL.
  Fix the production code, then the test should PASS."

---

### Task Group G: Maestro E2E Smoke Suite (P2)

**Depends on**: None (parallel, requires built app binary)

#### G1: Maestro flow — Browse mixtapes

`.maestro/smoke-browse-mixtapes.yaml`:
- Launch app
- Wait for mixtape list to load
- Verify at least one mixtape title visible
- Scroll list
- Assert no crash

#### G2: Maestro flow — View tracks

`.maestro/smoke-view-tracks.yaml`:
- Launch app → tap first mixtape
- Wait for track list to load
- Verify at least one track title visible
- Navigate back to list

#### G3: Maestro flow — Play audio

`.maestro/smoke-play-audio.yaml`:
- Launch app → tap mixtape → tap track
- Verify player screen opens
- Verify track info displayed
- Verify play/pause button exists
- Navigate back

#### G4: Fix Notes for Maestro testability

Emit Fix Notes for human:
- Add `testID` to FooterPlayer component
- Add `testID` to PlayerControls buttons
- Add `accessibilityLabel` to PlayPauseButton
- Add `testID` to FlashList items if needed for `scrollUntilVisible`

---

### Task Group H: Mutation Testing Pilot (P3)

**Depends on**: A, D (needs passing unit tests)

#### H1: Install Stryker dependencies

```bash
npm install --save-dev @stryker-mutator/core \
  @stryker-mutator/jest-runner \
  @stryker-mutator/typescript-checker
```

#### H2: Create Stryker configuration

`stryker.config.mjs`:
- `testRunner: 'jest'`
- `jest.configFile: 'jest.config.ts'`
- `checkers: ['typescript']`
- `coverageAnalysis: 'perTest'`
- `incremental: true`
- `mutate`:
  - `src/styles/utils/rgbStringToRgbaString.ts`
  - `src/features/mixtapeList/slices/mixtapeListApi.ts`
    (scoped to `transformResponse` functions)
- `reporters: ['html', 'clear-text', 'progress']`

#### H3: Run pilot and document results

Add npm script: `"test:mutate": "npx stryker run"`

Run pilot, document:
- Total mutants generated
- Mutation score
- Surviving mutants (what assertions are missing)
- Recommendations for test improvements

---

## Dependency Graph

```
A (Jest setup)
├── B (MSW) ──→ C (Screen tests)
├── D (Unit tests) ──→ H (Mutation testing)
├── F (Skills) [after C]
E (Enforcement) [parallel]
G (Maestro) [parallel, needs app binary]
```

## Implementation Order

1. **A1-A4**: Jest + test runner (foundation for everything)
2. **E1-E5**: Claude Code enforcement (parallel with #1)
3. **B1-B3**: MSW setup + fixtures
4. **D1-D3**: Unit tests for transforms, utils, Redux
5. **C1-C5**: renderWithProviders + screen RNTL tests
6. **F1-F3**: Claude Code skills
7. **G1-G4**: Maestro E2E flows (when app binary available)
8. **H1-H3**: Stryker mutation testing pilot

## Fix Notes (for Human)

These production code changes are needed for testability.
AI cannot make them per Constitution P1.

1. **FooterPlayer** (`src/features/player/components/FooterPlayer.tsx`):
   Add `testID="footer-player"` to root container.

2. **PlayerControls** (`src/features/player/components/PlayerControls.tsx`):
   Add `testID` to each control button (play, pause, skip-forward, skip-back).

3. **PlayPauseButton** (`src/features/player/components/PlayPauseButton.tsx`):
   Add `accessibilityLabel="Play"` / `"Pause"` based on state.

4. **FlashList items** (Home screen, Mixtape detail):
   Consider adding `testID` to list item wrapper for Maestro `scrollUntilVisible`.

---

## Success Verification

| Criterion | Verification |
|-----------|-------------|
| SC-001 | Home screen tests cover success/error/loading with ByRole/ByText queries |
| SC-002 | PreToolUse hook blocks Edit/Write to production `src/**`; allows test files |
| SC-003 | 3 Maestro flows exist in `.maestro/` covering browse → view → play |
| SC-004 | `npm run test:mutate` produces HTML report with mutation scores for transforms |
