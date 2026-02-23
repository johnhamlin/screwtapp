# Research: Testing & Coverage Foundation

## R1: Jest + Expo 54 Setup

**Decision**: Use `jest-expo@~54.0.17` preset with Jest 29.x
**Rationale**: Official Expo preset, auto-configures transforms
and asset handling. Jest 29 is the version bundled with
jest-expo 54. Install via `npx expo install` for compatibility.
**Alternatives**: Raw `react-native` preset (more config), Jest
30 (incompatible with jest-expo 54 and expo-router testing-lib).

**Key details**:
- `@testing-library/react-native@^13.3.3` for React 19 + RN 0.81
  (APIs are async: render, fireEvent, act return Promises)
- `transformIgnorePatterns` must exclude all RN ecosystem packages
- `moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' }` for path alias
- `setupFilesAfterEnv` for native module mocks

**Known issues**:
- expo-router/testing-library `expect/build/matchers` bug
  (expo/expo#40184) — workaround: mock the module
- react-native-mmkv v4 Nitro Modules crash in Jest — mock
  `react-native-nitro-modules`
- expo-file-system mock outdated in jest-expo 54 (expo#39922)

## R2: MSW for React Native Tests

**Decision**: Use MSW v2.x with `msw/node` (not `msw/native`)
**Rationale**: `msw/node` uses Node.js HTTP interceptors, works
with Jest's Node environment. RTK Query `fetchBaseQuery` uses
`globalThis.fetch` which is intercepted directly.
**Alternatives**: Manual fetch mocks (less maintainable),
nock (doesn't intercept `globalThis.fetch` in Node 18+).

**Key details**:
- `testEnvironment: 'node'` required (not jsdom)
- RNTL does NOT require jsdom — works with node environment
- `onUnhandledRequest: 'error'` in `server.listen()`
- Centralize handlers in `src/mocks/handlers.ts`
- Per-test overrides via `server.use()`, reset in `afterEach`
- No polyfills needed for `msw/node` (unlike `msw/native`)
- Fake timers can conflict with undici — use
  `doNotFake: ['setTimeout']` if needed

## R3: RNTL + Expo Router Testing

**Decision**: Two testing approaches depending on need:
1. Screen isolation: mock expo-router hooks, use custom
   `renderWithProviders` wrapping Redux + Paper + SafeArea
2. Navigation integration: use `renderRouter` from
   `expo-router/testing-library` (with workaround for bug)

**Rationale**: Most screen tests don't need real routing;
mocking `useLocalSearchParams` is simpler and faster.
Integration tests that verify navigation use `renderRouter`.

**Key details**:
- `renderRouter` accepts RNTL render options + `initialUrl`
- It imports `./expect` which crashes on Jest 29 — mock it
- `renderWithProviders` pattern from Redux docs:
  creates fresh store per test, wraps with Provider
- Must mock: RNTP hooks, MMKV, Sentry, react-native-reanimated
- RTK Query tests: use MSW, not mock store. Never mock
  useSelector/useDispatch.
- `api.util.resetApiState()` in afterEach for cache isolation

## R4: Maestro E2E

**Decision**: Maestro CLI for E2E smoke tests
**Rationale**: Works with Expo dev builds, uses accessibility
layer, YAML-driven flows, no test runtime in app bundle.
**Alternatives**: Detox (heavy setup, doesn't play well with
Expo), Appium (slow, complex).

**Key details**:
- Install: `curl -fsSL "https://get.maestro.mobile.dev" | bash`
- Requires pre-built binary (eas build or expo prebuild)
- Flows in `.maestro/` directory
- Selectors: `testID` (→ `id:`) preferred, `accessibilityLabel`
  for icon buttons, text for stable strings
- `extendedWaitUntil` for network-dependent content
- FlashList virtualizes off-screen items — use `scrollUntilVisible`
- Must add `testID`/`accessibilityLabel` to player controls
  (Fix Notes for human)

## R5: Mutation Testing

**Decision**: Stryker Mutator (only viable JS/TS tool)
**Rationale**: Active maintenance, Jest integration, TS checker,
per-test coverage analysis, incremental mode.
**Alternatives**: None viable in JS/TS ecosystem.

**Key details**:
- Packages: `@stryker-mutator/core`, `jest-runner`,
  `typescript-checker`
- Pilot scope: `rgbStringToRgbaString.ts` + data transforms
  from `mixtapeListApi.ts` (pure functions, no native imports)
- `coverageAnalysis: 'perTest'` for speed
- `incremental: true` for iterative sessions
- Expected runtime: <1 minute for pilot scope (~20-50 mutants)
- HTML report shows survived mutants inline with source

## R6: Codebase Structure (Test Targets)

**Screens**:
- Home (`src/app/index.tsx`): RTK Query `useGetMixtapeListQuery`,
  loading/error/data states, pull-to-refresh, FlashList
- Mixtape Detail (`src/app/mixtape/[id]/index.tsx`): RTK Query
  `useGetMixtapeQuery`, loading/error/data, track tap to play
- Player (`src/app/player.tsx`): RNTP `useActiveTrack`, child
  components (TrackInfo, Progress, PlayerControls)

**Data Transforms** (mutation testing targets):
- `getMixtapeList.transformResponse`: strips prefix, generates
  thumbnail URL, extracts fields
- `getMixtape.transformResponse`: filters files to tracks,
  maps to RNTP Track format, resolves artwork
- `rgbStringToRgbaString`: pure color utility

**Player Redux**:
- Slice: `setQueue`, `setQueueIndex`, `setFooterPlayerVisible`
- Selectors: `selectIsFooterPlayerVisible`, `selectActiveTrackId`

**Native modules requiring mocks**:
- react-native-track-player (12 files, hooks + static methods)
- react-native-mmkv (Nitro Modules)
- @sentry/react-native
- react-native-reanimated
- @shopify/flash-list
- @react-native-community/slider
