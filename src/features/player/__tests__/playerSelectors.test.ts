import type { PlayerState } from '../slice/playerSlice';
import {
  selectIsFooterPlayerVisible,
  selectActiveTrackId,
} from '../slice/playerSelectors';

// Build a mock RootState with the minimum shape needed by selectors.
// RootState has `player` and `mixtapeListApi` keys.

const mockTrack: MixtapeTrack = {
  sha1: 'sha1abc',
  url: 'https://archive.org/download/test/track.mp3',
  duration: 300,
  title: 'Test Track',
  artist: 'DJ Screw',
  album: 'Test Album',
  genre: 'Hip Hop',
  artwork: 'https://archive.org/services/img/test',
  isLiveStream: false,
  directoryOnArchiveDotOrg: '/27/items/test',
  fileName: 'track.mp3',
  mixtapeId: 'test-mixtape-001',
};

const secondTrack: MixtapeTrack = {
  ...mockTrack,
  sha1: 'sha1def',
  title: 'Second Track',
  mixtapeId: 'test-mixtape-002',
};

function buildMockState(playerOverrides: Partial<PlayerState> = {}) {
  const playerState: PlayerState = {
    isPlayerReady: false,
    currentTrack: '',
    isPlaying: false,
    queue: null,
    queueIndex: null,
    isFooterPlayerVisible: false,
    ...playerOverrides,
  };

  // The selectors only access state.player, so we use a minimal mock for the
  // rest of RootState. Casting is safe because the selectors under test never
  // touch mixtapeListApi.
  return { player: playerState } as {
    player: PlayerState;
    mixtapeListApi: unknown;
  };
}

describe('selectIsFooterPlayerVisible', () => {
  it('returns true when footer player is visible', () => {
    const state = buildMockState({ isFooterPlayerVisible: true });
    expect(selectIsFooterPlayerVisible(state as never)).toBe(true);
  });

  it('returns false when footer player is not visible', () => {
    const state = buildMockState({ isFooterPlayerVisible: false });
    expect(selectIsFooterPlayerVisible(state as never)).toBe(false);
  });
});

describe('selectActiveTrackId', () => {
  it('returns the mixtapeId when queue and queueIndex are present', () => {
    const state = buildMockState({
      queue: [mockTrack, secondTrack],
      queueIndex: 0,
    });
    expect(selectActiveTrackId(state as never)).toBe('test-mixtape-001');
  });

  it('returns the correct mixtapeId for a different queueIndex', () => {
    const state = buildMockState({
      queue: [mockTrack, secondTrack],
      queueIndex: 1,
    });
    expect(selectActiveTrackId(state as never)).toBe('test-mixtape-002');
  });

  it('returns null when queue is null', () => {
    const state = buildMockState({ queue: null, queueIndex: 0 });
    expect(selectActiveTrackId(state as never)).toBeNull();
  });

  it('returns null when queueIndex is null', () => {
    const state = buildMockState({
      queue: [mockTrack],
      queueIndex: null,
    });
    expect(selectActiveTrackId(state as never)).toBeNull();
  });

  it('returns null when both queue and queueIndex are null', () => {
    const state = buildMockState({ queue: null, queueIndex: null });
    expect(selectActiveTrackId(state as never)).toBeNull();
  });
});
