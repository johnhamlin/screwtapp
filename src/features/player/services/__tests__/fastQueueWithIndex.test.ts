import TrackPlayer from 'react-native-track-player';

import { fastQueueWithIndex } from '../fastQueueWithIndex';

const mockQueue = [
  { url: 'track0.mp3', title: 'Track 0' },
  { url: 'track1.mp3', title: 'Track 1' },
  { url: 'track2.mp3', title: 'Track 2' },
  { url: 'track3.mp3', title: 'Track 3' },
] as Parameters<typeof fastQueueWithIndex>[0]['queue'];

beforeEach(() => {
  jest.clearAllMocks();
});

describe('fastQueueWithIndex', () => {
  test('sets queue from selected index onward', async () => {
    await fastQueueWithIndex({ queue: mockQueue, index: 2 });

    expect(TrackPlayer.setQueue).toHaveBeenCalledWith(mockQueue.slice(2));
  });

  test('prepends earlier tracks at position 0', async () => {
    await fastQueueWithIndex({ queue: mockQueue, index: 2 });

    expect(TrackPlayer.add).toHaveBeenCalledWith(mockQueue.slice(0, 2), 0);
  });

  test('plays when shouldPlay is true', async () => {
    await fastQueueWithIndex({ queue: mockQueue, index: 1, shouldPlay: true });

    expect(TrackPlayer.play).toHaveBeenCalled();
  });

  test('does not play when shouldPlay is false', async () => {
    await fastQueueWithIndex({ queue: mockQueue, index: 1, shouldPlay: false });

    expect(TrackPlayer.play).not.toHaveBeenCalled();
  });

  test('does not play when shouldPlay is omitted', async () => {
    await fastQueueWithIndex({ queue: mockQueue, index: 1 });

    expect(TrackPlayer.play).not.toHaveBeenCalled();
  });

  test('index 0: nothing to prepend', async () => {
    await fastQueueWithIndex({ queue: mockQueue, index: 0 });

    expect(TrackPlayer.setQueue).toHaveBeenCalledWith(mockQueue);
    expect(TrackPlayer.add).toHaveBeenCalledWith([], 0);
  });

  test('last index: entire queue prepended except last track', async () => {
    await fastQueueWithIndex({ queue: mockQueue, index: 3 });

    expect(TrackPlayer.setQueue).toHaveBeenCalledWith([mockQueue[3]]);
    expect(TrackPlayer.add).toHaveBeenCalledWith(mockQueue.slice(0, 3), 0);
  });

  test('call order: setQueue before play before add', async () => {
    const callOrder: string[] = [];
    (TrackPlayer.setQueue as jest.Mock).mockImplementation(async () => {
      callOrder.push('setQueue');
    });
    (TrackPlayer.play as jest.Mock).mockImplementation(async () => {
      callOrder.push('play');
    });
    (TrackPlayer.add as jest.Mock).mockImplementation(async () => {
      callOrder.push('add');
    });

    await fastQueueWithIndex({ queue: mockQueue, index: 1, shouldPlay: true });

    expect(callOrder).toEqual(['setQueue', 'play', 'add']);
  });
});
