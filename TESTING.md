# Testing

## Quick Reference

```bash
npm test                  # Run all tests (58 passing, ~2.5s)
npm run test:watch        # Watch mode — reruns on file changes
npm run test:coverage     # Coverage report (text + HTML in coverage/)
npm run test:mutate       # Mutation testing pilot (Stryker, ~40s)
npm run test:related      # Run only tests related to uncommitted changes
npm run test:unit         # Unit tests only (slices, selectors, utils)
npm run test:screens      # Screen integration tests only
```

## Stack

| Tool | Version | Purpose |
|------|---------|---------|
| Jest | 29 | Test runner |
| jest-expo | ~54.0 | React Native preset (Babel transforms, RN globals) |
| @testing-library/react-native | 13.3 | Component rendering and user-centric queries |
| MSW | 2.x | HTTP request interception (Archive.org API mocking) |
| Stryker | 9.x | Mutation testing for test quality validation |
| Maestro | — | E2E smoke tests on device/simulator |

## Project Layout

```
jest.config.ts                           # Jest configuration
jest.setup.ts                            # Global mocks (10+ native modules) + MSW lifecycle
stryker.config.mjs                       # Mutation testing config (pilot: 2 source files)

src/test/
  renderWithProviders.tsx                # Test harness: Redux + Paper + SafeArea
  __mocks__/
    expo-vector-icons.js                 # Shared mock for @expo/vector-icons

src/mocks/
  server.ts                              # MSW server instance
  handlers.ts                            # Default success handlers for Archive.org API
  fixtures/
    mixtapeList.ts                        # 3 sample mixtapes (scrape endpoint)
    mixtapeMetadata.ts                    # 3 tracks + cover art (metadata endpoint)
  __tests__/
    msw-integration.test.ts              # Verifies MSW wiring works

src/app/__tests__/
  smoke.test.ts                          # Sanity: Jest runs, path alias works
  index.test.tsx                         # Home screen (success/loading/error/empty)
  player.test.tsx                        # Player screen (track info, controls, no-track)

src/app/mixtape/__tests__/
  [id].test.tsx                          # Mixtape detail (tracks, loading, error, interaction)

src/features/mixtapeList/__tests__/
  transforms.test.ts                     # RTK Query transformResponse (16 tests)

src/features/player/__tests__/
  playerSlice.test.ts                    # Redux reducer transitions (11 tests)
  playerSelectors.test.ts                # Selector logic (7 tests)

src/styles/utils/__tests__/
  rgbStringToRgbaString.test.ts          # Pure utility (7 tests)

.maestro/
  smoke-browse-mixtapes.yaml             # Browse: launch -> list loads -> scroll
  smoke-view-tracks.yaml                 # View: tap mixtape -> track list -> back
  smoke-play-audio.yaml                  # Play: tap track -> footer player visible
```

## Writing Tests

### Screen / Component Tests

Use `renderWithProviders` which wraps your component with Redux, PaperProvider, and SafeAreaProvider:

```tsx
import { renderWithProviders } from '@/test/renderWithProviders';
import MyScreen from '../MyScreen';

// Mock expo-router (required for any screen using Stack, Link, or useRouter)
jest.mock('expo-router', () => {
  const { View, Text } = require('react-native');
  const React = require('react');
  return {
    Stack: {
      Screen: ({ options }: { options: { title?: string } }) =>
        React.createElement(Text, {}, options?.title ?? ''),
    },
    Link: ({ children }: { children: React.ReactNode }) =>
      React.createElement(View, {}, children),
    useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
    useLocalSearchParams: () => ({ id: 'some-id' }),
  };
});

test('renders content from API', async () => {
  const { findByText } = renderWithProviders(<MyScreen />);
  // findBy* waits for async data (MSW intercepts the fetch)
  expect(await findByText('Expected Text')).toBeTruthy();
});
```

### Pre-loading Redux State

```tsx
const { getByText } = renderWithProviders(<Player />, {
  preloadedState: {
    player: {
      isPlayerReady: true,
      currentTrack: '',
      isPlaying: false,
      queue: [mockTrack],
      queueIndex: 0,
      isFooterPlayerVisible: true,
    },
  },
});
```

### Testing Error States (MSW Override)

```tsx
import { http, HttpResponse } from 'msw';
import { server } from '@/mocks/server';

test('shows error on server failure', async () => {
  server.use(
    http.get('https://archive.org/metadata/:identifier', () => {
      return HttpResponse.json(null, { status: 500 });
    }),
  );

  const { findByText } = renderWithProviders(<MyScreen />);
  expect(await findByText(/error/i)).toBeTruthy();
});
```

### Testing Empty States

```tsx
server.use(
  http.get('https://archive.org/services/search/v1/scrape', () => {
    return HttpResponse.json({ items: [], count: 0, total: 0 });
  }),
);
```

### Unit Tests (Redux Slices)

```tsx
import playerReducer, { setQueue } from '../slice/playerSlice';

test('sets the queue', () => {
  const state = playerReducer(initialState, setQueue([mockTrack]));
  expect(state.queue).toHaveLength(1);
});
```

### Unit Tests (RTK Query Transforms)

Dispatch the query against MSW and assert on the transformed result:

```tsx
import { mixtapeListApi } from '../slices/mixtapeListApi';

const store = configureStore({
  reducer: { [mixtapeListApi.reducerPath]: mixtapeListApi.reducer },
  middleware: gDM => gDM().concat(mixtapeListApi.middleware),
});

const promise = store.dispatch(mixtapeListApi.endpoints.getMixtapeList.initiate(''));
const result = await promise.unwrap();
promise.unsubscribe(); // prevent RTK Query timer leaks

expect(result[0].title).toBe('Chapter 001: Tha Originator');
```

## Query Priority

Follow this order when selecting RNTL queries (per [testing-library guidelines](https://callstack.github.io/react-native-testing-library/docs/how-should-i-query)):

1. `getByRole` / `findByRole` with `name` — preferred for buttons, headings, etc.
2. `getByLabelText` / `getByPlaceholderText` — for form inputs
3. `getByText` / `findByText` — for visible text content
4. `getByTestId` — last resort (requires `testID` prop in production code)

Use `findBy*` for anything async (data fetching, animations). Use `queryBy*` only to assert something is NOT present.

## MSW (Network Mocking)

All HTTP requests are intercepted by MSW. Unhandled requests **fail the test** (`onUnhandledRequest: 'error'`).

**Default handlers** (`src/mocks/handlers.ts`):
- `GET https://archive.org/services/search/v1/scrape` — returns 3 mixtapes
- `GET https://archive.org/metadata/:identifier` — returns 3 tracks + cover art

**Per-test overrides** use `server.use()` and are automatically reset after each test via `afterEach(() => server.resetHandlers())` in `jest.setup.ts`.

## Native Module Mocks

All native modules are mocked in `jest.setup.ts`. Key behaviors:

| Module | Mock Behavior |
|--------|--------------|
| react-native-track-player | All methods return resolved promises. Hooks (`useActiveTrack`, `useIsPlaying`, etc.) return defaults. Override with `(useActiveTrack as jest.Mock).mockReturnValue(...)` |
| react-native-mmkv | In-memory `Map`-backed store. Persists within a single test only. |
| react-native-reanimated | Animations are synchronous pass-throughs. `withTiming(val)` returns `val` immediately. |
| @shopify/flash-list | Delegates to React Native `FlatList` |
| @expo/vector-icons | Renders icon `name` as `<Text>`. Configured via `moduleNameMapper` (not `jest.mock`). |
| expo-image | Renders as `<View testID="expo-image">` |
| @sentry/react-native | All functions are no-ops |

## Mutation Testing

Stryker validates test effectiveness by introducing small code changes (mutants) and checking that tests catch them.

**Pilot scope** (2 files):
- `src/styles/utils/rgbStringToRgbaString.ts` — 100% mutation kill rate
- `src/features/mixtapeList/slices/mixtapeListApi.ts` — 69% (surviving mutants are mostly RTK Query cache tag config)

```bash
npm run test:mutate          # Run Stryker (~40s)
open reports/mutation/index.html  # View HTML report
```

Results are documented in `specs/1-testing-foundation/mutation-report.md`.

## E2E Smoke Tests (Maestro)

Three YAML flows in `.maestro/` covering the critical path: browse mixtapes, view tracks, play audio.

**Prerequisites**: Built app binary + [Maestro CLI](https://maestro.mobile.dev/getting-started/installing-maestro) installed.

```bash
maestro test .maestro/                # Run all flows
maestro test .maestro/smoke-browse-mixtapes.yaml  # Run one flow
```

**Production code needed** (see `specs/1-testing-foundation/fix-notes-maestro.md`):
- `testID="footer-player"` on FooterPlayer root container
- `testID` on PlayerControls buttons
- `accessibilityLabel` on PlayPauseButton

## Coverage Baseline

As of initial setup (informational, no enforced thresholds):

| Metric | Coverage |
|--------|----------|
| Statements | 86% |
| Branches | 66% |
| Functions | 79% |
| Lines | 88% |

100% coverage on: `mixtapeListApi.ts`, `playerSlice.ts`, `playerSelectors.ts`, `rgbStringToRgbaString.ts`, MSW fixtures/handlers, test utilities.

## Known Issues

1. **RTK Query timer warnings**: Tests log `ReferenceError: Jest environment torn down` after completion. This is harmless — RTK Query's `keepUnusedDataFor` timers fire after Jest tears down. Suppressed by `forceExit: true` in jest.config.ts.

2. **`act(...)` console warnings**: React Redux subscription updates trigger act warnings in screen tests. These are cosmetic — the tests use `findBy*` which properly waits for updates.

3. **Mixtape detail empty state (production bug)**: `trackList[0].album` crashes when trackList is empty. Test is `test.skip`'d with Fix Notes. Guard needed at `src/app/mixtape/[id]/index.tsx:47`:
   ```tsx
   title: trackList?.length ? trackList[0].album : ''
   ```

## AI Scope Boundary

AI (Claude Code) may only create or modify:
- Test files (`__tests__/**`, `*.test.*`, `*.spec.*`)
- Test infrastructure (`jest.config.*`, `jest.setup.*`, `stryker.config.*`)
- Mocks and fixtures (`src/mocks/**`, `src/test/**`)
- Maestro flows (`.maestro/**`)

Production code under `src/**` is protected. When a production change is needed for testability, AI emits a **Fix Note** documenting the change for a human to apply.

Enforcement via:
- `.claude/rules/` — declarative policy
- `.claude/settings.json` — permission deny/allow rules
- `.claude/hooks/pre-tool-use.sh` — blocks Edit/Write to production paths
- `.claude/hooks/post-tool-use.sh` — auto-runs related tests after test file edits
