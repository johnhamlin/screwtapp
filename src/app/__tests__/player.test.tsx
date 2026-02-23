import React from 'react';
import { useActiveTrack } from 'react-native-track-player';
import { renderWithProviders } from '@/test/renderWithProviders';

// Mock expo-router
jest.mock('expo-router', () => {
  const { View, Text, Pressable } = require('react-native');
  const React = require('react');
  return {
    Stack: {
      Screen: ({ options }: { options: { title?: string } }) =>
        React.createElement(Text, {}, options?.title ?? ''),
    },
    Link: ({ children }: { children: React.ReactNode }) =>
      React.createElement(View, {}, children),
    router: {
      back: jest.fn(),
      navigate: jest.fn(),
    },
    useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  };
});

import Player from '../player';

const mockTrack = {
  sha1: 'sha1track1',
  url: 'https://archive.org/download/test/track.mp3',
  duration: 245.5,
  title: 'Intro',
  artist: 'DJ Screw',
  album: 'Chapter 001: Tha Originator',
  genre: 'Hip Hop',
  artwork: 'https://archive.org/download/test/Front.jpg',
  pitchAlgorithm: 1,
  isLiveStream: false,
  directoryOnArchiveDotOrg: '/test',
  fileName: 'track.mp3',
  mixtapeId: 'dj-screw-chapter-001',
};

describe('Player screen', () => {
  test('active track displayed: shows track info', () => {
    (useActiveTrack as jest.Mock).mockReturnValue(mockTrack);

    const { getByText } = renderWithProviders(<Player />, {
      preloadedState: {
        player: {
          isPlayerReady: true,
          currentTrack: '',
          isPlaying: false,
          queue: [mockTrack as MixtapeTrack],
          queueIndex: 0,
          isFooterPlayerVisible: true,
        },
      },
    });

    expect(getByText('Intro')).toBeTruthy();
    expect(getByText('DJ Screw')).toBeTruthy();
  });

  test('controls visible: play/pause and skip buttons present', () => {
    (useActiveTrack as jest.Mock).mockReturnValue(mockTrack);

    const { getByText } = renderWithProviders(<Player />);

    // FontAwesome6 renders the icon name as text in our mock
    expect(getByText('play')).toBeTruthy();
    expect(getByText('backward')).toBeTruthy();
    expect(getByText('forward')).toBeTruthy();
  });

  test('no active track: renders without track info', () => {
    (useActiveTrack as jest.Mock).mockReturnValue(undefined);

    const { queryByText } = renderWithProviders(<Player />);

    expect(queryByText('Intro')).toBeNull();
    expect(queryByText('DJ Screw')).toBeNull();
  });
});
