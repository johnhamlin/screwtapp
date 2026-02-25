import playerReducer, {
  setIsPlayerReady,
  setQueue,
  setQueueIndex,
  setFooterPlayerVisible,
  type PlayerState,
} from '../slice/playerSlice';

const initialState: PlayerState = {
  isPlayerReady: false,
  currentTrack: '',
  isPlaying: false,
  queue: null,
  queueIndex: null,
  isFooterPlayerVisible: false,
};

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
  mixtapeId: 'test-mixtape',
};

describe('playerSlice', () => {
  it('has the correct initial state', () => {
    const state = playerReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  describe('setIsPlayerReady', () => {
    it('sets isPlayerReady to true', () => {
      const state = playerReducer(initialState, setIsPlayerReady(true));
      expect(state.isPlayerReady).toBe(true);
    });

    it('sets isPlayerReady to false', () => {
      const readyState = { ...initialState, isPlayerReady: true };
      const state = playerReducer(readyState, setIsPlayerReady(false));
      expect(state.isPlayerReady).toBe(false);
    });
  });

  describe('setQueue', () => {
    it('sets the queue to an array of tracks', () => {
      const tracks: MixtapeTrack[] = [
        mockTrack,
        { ...mockTrack, sha1: 'sha1def', title: 'Second Track' },
      ];
      const state = playerReducer(initialState, setQueue(tracks));

      expect(state.queue).toHaveLength(2);
      expect(state.queue![0].title).toBe('Test Track');
      expect(state.queue![1].title).toBe('Second Track');
    });

    it('replaces existing queue', () => {
      const stateWithQueue = {
        ...initialState,
        queue: [mockTrack],
      };
      const newTracks: MixtapeTrack[] = [
        { ...mockTrack, sha1: 'new', title: 'New Track' },
      ];
      const state = playerReducer(stateWithQueue, setQueue(newTracks));

      expect(state.queue).toHaveLength(1);
      expect(state.queue![0].title).toBe('New Track');
    });
  });

  describe('setQueueIndex', () => {
    it('sets the queue index', () => {
      const state = playerReducer(initialState, setQueueIndex(2));
      expect(state.queueIndex).toBe(2);
    });

    it('updates the queue index', () => {
      const stateWithIndex = { ...initialState, queueIndex: 0 };
      const state = playerReducer(stateWithIndex, setQueueIndex(5));
      expect(state.queueIndex).toBe(5);
    });

    it('can set queue index to 0', () => {
      const stateWithIndex = { ...initialState, queueIndex: 3 };
      const state = playerReducer(stateWithIndex, setQueueIndex(0));
      expect(state.queueIndex).toBe(0);
    });
  });

  describe('setFooterPlayerVisible', () => {
    it('sets footer player visible to true', () => {
      const state = playerReducer(initialState, setFooterPlayerVisible(true));
      expect(state.isFooterPlayerVisible).toBe(true);
    });

    it('sets footer player visible to false', () => {
      const visibleState = { ...initialState, isFooterPlayerVisible: true };
      const state = playerReducer(visibleState, setFooterPlayerVisible(false));
      expect(state.isFooterPlayerVisible).toBe(false);
    });
  });

  it('does not mutate state for unrelated actions', () => {
    const state = playerReducer(initialState, { type: 'unrelated/action' });
    expect(state).toEqual(initialState);
  });
});
