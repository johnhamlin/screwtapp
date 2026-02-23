/* eslint-disable @typescript-eslint/no-require-imports */
import { server } from '@/mocks/server';

// ─── MSW server lifecycle ───────────────────────────────────────────────────
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ─── react-native-track-player ──────────────────────────────────────────────
jest.mock('react-native-track-player', () => {
  const State = {
    None: 'none',
    Ready: 'ready',
    Playing: 'playing',
    Paused: 'paused',
    Stopped: 'stopped',
    Loading: 'loading',
    Buffering: 'buffering',
    Error: 'error',
    Ended: 'ended',
  };

  const Event = {
    PlaybackState: 'playback-state',
    PlaybackError: 'playback-error',
    PlaybackActiveTrackChanged: 'playback-active-track-changed',
    PlaybackQueueEnded: 'playback-queue-ended',
    PlaybackProgressUpdated: 'playback-progress-updated',
    PlaybackPlayWhenReadyChanged: 'playback-play-when-ready-changed',
    RemotePlay: 'remote-play',
    RemotePause: 'remote-pause',
    RemoteStop: 'remote-stop',
    RemoteSkip: 'remote-skip',
    RemoteNext: 'remote-next',
    RemotePrevious: 'remote-previous',
    RemoteSeek: 'remote-seek',
    RemoteDuck: 'remote-duck',
    RemoteJumpForward: 'remote-jump-forward',
    RemoteJumpBackward: 'remote-jump-backward',
  };

  const Capability = {
    Play: 0,
    Pause: 1,
    Stop: 2,
    SeekTo: 3,
    Skip: 4,
    SkipToNext: 5,
    SkipToPrevious: 6,
    JumpForward: 7,
    JumpBackward: 8,
  };

  const RepeatMode = {
    Off: 0,
    Track: 1,
    Queue: 2,
  };

  const PitchAlgorithm = {
    Linear: 0,
    Music: 1,
    Voice: 2,
  };

  return {
    __esModule: true,
    default: {
      setupPlayer: jest.fn().mockResolvedValue(undefined),
      registerPlaybackService: jest.fn(),
      add: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
      skip: jest.fn().mockResolvedValue(undefined),
      skipToNext: jest.fn().mockResolvedValue(undefined),
      skipToPrevious: jest.fn().mockResolvedValue(undefined),
      reset: jest.fn().mockResolvedValue(undefined),
      play: jest.fn().mockResolvedValue(undefined),
      pause: jest.fn().mockResolvedValue(undefined),
      stop: jest.fn().mockResolvedValue(undefined),
      seekTo: jest.fn().mockResolvedValue(undefined),
      setVolume: jest.fn().mockResolvedValue(undefined),
      setRate: jest.fn().mockResolvedValue(undefined),
      setRepeatMode: jest.fn().mockResolvedValue(undefined),
      getQueue: jest.fn().mockResolvedValue([]),
      getActiveTrack: jest.fn().mockResolvedValue(null),
      getActiveTrackIndex: jest.fn().mockResolvedValue(null),
      getPlaybackState: jest.fn().mockResolvedValue({ state: State.None }),
      getProgress: jest.fn().mockResolvedValue({
        position: 0,
        duration: 0,
        buffered: 0,
      }),
      updateOptions: jest.fn().mockResolvedValue(undefined),
      updateNowPlayingMetadata: jest.fn().mockResolvedValue(undefined),
      clearNowPlayingMetadata: jest.fn().mockResolvedValue(undefined),
      retry: jest.fn().mockResolvedValue(undefined),
      move: jest.fn().mockResolvedValue(undefined),
      load: jest.fn().mockResolvedValue(undefined),
      setQueue: jest.fn().mockResolvedValue(undefined),
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    },
    useActiveTrack: jest.fn().mockReturnValue(undefined),
    useIsPlaying: jest
      .fn()
      .mockReturnValue({ playing: false, bufferingDuringPlay: false }),
    useProgress: jest
      .fn()
      .mockReturnValue({ position: 0, duration: 0, buffered: 0 }),
    usePlaybackState: jest.fn().mockReturnValue({ state: State.None }),
    usePlayWhenReady: jest.fn().mockReturnValue(false),
    useTrackPlayerEvents: jest.fn(),
    State,
    Event,
    Capability,
    RepeatMode,
    PitchAlgorithm,
  };
});

// ─── react-native-nitro-modules (prevents MMKV v4 crash) ───────────────────
jest.mock('react-native-nitro-modules', () => ({
  NitroModules: {
    createHybridObject: jest.fn(),
  },
}));

// ─── react-native-mmkv (in-memory Map) ─────────────────────────────────────
jest.mock('react-native-mmkv', () => {
  class MockMMKV {
    private store = new Map<string, string>();

    getString(key: string) {
      return this.store.get(key);
    }

    set(key: string, value: string | number | boolean) {
      this.store.set(key, String(value));
    }

    getNumber(key: string) {
      const val = this.store.get(key);
      return val !== undefined ? Number(val) : undefined;
    }

    getBoolean(key: string) {
      const val = this.store.get(key);
      return val !== undefined ? val === 'true' : undefined;
    }

    contains(key: string) {
      return this.store.has(key);
    }

    delete(key: string) {
      this.store.delete(key);
    }

    getAllKeys() {
      return Array.from(this.store.keys());
    }

    clearAll() {
      this.store.clear();
    }
  }

  return {
    MMKV: MockMMKV,
    createMMKV: jest.fn(() => new MockMMKV()),
  };
});

// ─── @sentry/react-native ───────────────────────────────────────────────────
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  wrap: jest.fn((component: unknown) => component),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
  setExtra: jest.fn(),
  addBreadcrumb: jest.fn(),
  withScope: jest.fn(),
  reactNavigationIntegration: jest.fn(() => ({
    registerNavigationContainer: jest.fn(),
  })),
  ReactNavigationInstrumentation: jest.fn(),
  ReactNativeTracing: jest.fn(),
}));

// ─── react-native-worklets (prevents native init crash) ────────────────────
jest.mock('react-native-worklets', () => ({
  Worklets: {
    defaultContext: {
      createRunAsync: jest.fn(),
      createRunOnJS: jest.fn(),
    },
    createContext: jest.fn(),
    createSharedValue: jest.fn(),
    createRunInContextFn: jest.fn(),
    createRunInJsFn: jest.fn(),
  },
}));

// ─── react-native-reanimated ────────────────────────────────────────────────
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: {
      call: jest.fn(),
      createAnimatedComponent: (component: unknown) => component,
      addWhitelistedUIProps: jest.fn(),
      addWhitelistedNativeProps: jest.fn(),
    },
    useAnimatedStyle: jest.fn(() => ({})),
    useSharedValue: jest.fn((init: unknown) => ({ value: init })),
    useAnimatedScrollHandler: jest.fn(() => jest.fn()),
    useDerivedValue: jest.fn((fn: () => unknown) => ({ value: fn() })),
    useAnimatedRef: jest.fn(() => ({ current: null })),
    withTiming: jest.fn((val: unknown) => val),
    withSpring: jest.fn((val: unknown) => val),
    withDelay: jest.fn((_delay: number, val: unknown) => val),
    withSequence: jest.fn((...vals: unknown[]) => vals[vals.length - 1]),
    withRepeat: jest.fn((val: unknown) => val),
    Easing: {
      linear: jest.fn(),
      ease: jest.fn(),
      sin: jest.fn(),
      in: jest.fn(),
      out: jest.fn(),
      inOut: jest.fn(),
    },
    FadeIn: { duration: jest.fn().mockReturnThis() },
    FadeOut: { duration: jest.fn().mockReturnThis() },
    Layout: {},
    SlideInRight: {},
    SlideOutLeft: {},
    createAnimatedComponent: (component: unknown) => component || View,
    interpolate: jest.fn(),
    Extrapolate: { CLAMP: 'clamp' },
    runOnJS: jest.fn((fn: Function) => fn),
    runOnUI: jest.fn((fn: Function) => fn),
  };
});

// ─── @shopify/flash-list (FlatList passthrough) ─────────────────────────────
jest.mock('@shopify/flash-list', () => {
  const { FlatList } = require('react-native');
  return {
    FlashList: FlatList,
    MasonryFlashList: FlatList,
  };
});

// ─── @react-native-community/slider (View passthrough) ─────────────────────
jest.mock('@react-native-community/slider', () => {
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) =>
      require('react').createElement(View, { testID: 'slider', ...props }),
  };
});

// ─── expo-router testing-library expect bug workaround (expo/expo#40184) ────
jest.mock('expo-router/build/testing-library/expect', () => ({}));

// ─── @pchmn/expo-material3-theme ───────────────────────────────────────────
jest.mock('@pchmn/expo-material3-theme', () => ({
  useMaterial3Theme: jest.fn(() => ({
    theme: {
      light: {},
      dark: {},
    },
  })),
}));

// ─── expo-image (View passthrough) ──────────────────────────────────────────
jest.mock('expo-image', () => {
  const { View } = require('react-native');
  return {
    Image: (props: Record<string, unknown>) =>
      require('react').createElement(View, {
        testID: 'expo-image',
        ...props,
      }),
  };
});

// ─── react-native-text-ticker ───────────────────────────────────────────────
jest.mock('react-native-text-ticker', () => {
  const { Text } = require('react-native');
  return {
    __esModule: true,
    default: (props: Record<string, unknown>) =>
      require('react').createElement(Text, props, props.children as string),
  };
});
