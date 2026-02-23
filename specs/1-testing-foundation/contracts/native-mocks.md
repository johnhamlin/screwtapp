# Contract: Native Module Mocks

## Purpose

Jest manual mocks for native modules that cannot load in the
Node.js test environment.

## Required Mocks

### react-native-track-player

**Mock shape**: All exported functions as `jest.fn()`, hooks
return sensible defaults.

| Export | Mock Behavior |
|--------|--------------|
| `default` (TrackPlayer) | Object with all methods as `jest.fn()` returning resolved promises |
| `useActiveTrack` | Returns `undefined` (no active track) |
| `useIsPlaying` | Returns `{ playing: false, bufferingDuringPlay: false }` |
| `useProgress` | Returns `{ position: 0, duration: 0, buffered: 0 }` |
| `usePlaybackState` | Returns `{ state: State.None }` |
| `State`, `Event`, `Capability`, `RepeatMode`, `PitchAlgorithm` | Real enum values (importable constants) |

### react-native-nitro-modules

**Why**: react-native-mmkv v4 imports NitroModules which has
native bindings. Mock prevents crash.

**Mock shape**: `{ NitroModules: { createHybridObject: jest.fn() } }`

### react-native-mmkv

**Mock shape**: `MMKV` class with in-memory Map storage.

| Method | Behavior |
|--------|----------|
| `getString` / `set` / `delete` | In-memory Map operations |
| `contains` | Map.has() |
| `clearAll` | Map.clear() |

### @sentry/react-native

**Mock shape**: All exports as `jest.fn()`. `wrap` returns
the component unchanged.

### react-native-reanimated

**Mock shape**: Use `react-native-reanimated/mock` (official).

### @shopify/flash-list

**Mock shape**: `FlashList` renders as `FlatList` equivalent.

### @react-native-community/slider

**Mock shape**: Renders a View with testID.

### expo-router

**Mock shape** (per-test, not global):

| Export | Mock Behavior |
|--------|--------------|
| `useLocalSearchParams` | Returns test-specific params |
| `useRouter` | Returns `{ push: jest.fn(), back: jest.fn() }` |
| `Link` | Renders children in a Pressable |

## Location

- Global mocks: `jest.setup.ts` (via `setupFilesAfterEnv`)
- Module mocks: `__mocks__/` directory at project root for
  auto-resolved mocks (e.g., `__mocks__/react-native-track-player.ts`)
