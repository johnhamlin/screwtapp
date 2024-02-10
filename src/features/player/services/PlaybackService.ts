import TrackPlayer, { Event } from 'react-native-track-player';

// import { cacheNextSong } from './songCache';
import { setQueueIndex } from '../slice/playerSlice';

import type { RootState } from '@/reduxStore';
import { reduxStore } from '@/reduxStore';

export async function playbackService() {
  TrackPlayer.addEventListener(
    Event.PlaybackActiveTrackChanged,
    ({ index }) => {
      if (index === undefined) return;

      const state: RootState = reduxStore.getState();
      // Don't run on initial load
      if (state.player.isPlayerReady) {
        reduxStore.dispatch(setQueueIndex(index));
      }
    },
  );

  // TrackPlayer.addEventListener(Event.PlaybackState, async event => {
  //   if (event.state === 'playing') {
  // uncachePreviousSong;
  //     await cacheNextSong();
  //   }
  // });

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    console.log('Event.RemotePause');
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    console.log('Event.RemotePlay');
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    console.log('Event.RemoteNext');
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    console.log('Event.RemotePrevious');
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteJumpForward, async event => {
    console.log('Event.RemoteJumpForward', event);
    TrackPlayer.seekBy(event.interval);
  });

  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async event => {
    console.log('Event.RemoteJumpBackward', event);
    TrackPlayer.seekBy(-event.interval);
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, event => {
    console.log('Event.RemoteSeek', event);
    TrackPlayer.seekTo(event.position);
  });

  TrackPlayer.addEventListener(Event.RemoteDuck, async event => {
    console.log('Event.RemoteDuck', event);
  });

  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, event => {
    console.log('Event.PlaybackQueueEnded', event);
  });

  TrackPlayer.addEventListener(Event.PlaybackActiveTrackChanged, event => {
    console.log('Event.PlaybackActiveTrackChanged', event);
  });

  TrackPlayer.addEventListener(Event.PlaybackPlayWhenReadyChanged, event => {
    console.log('Event.PlaybackPlayWhenReadyChanged', event);
  });

  TrackPlayer.addEventListener(Event.PlaybackState, event => {
    console.log('Event.PlaybackState', event);
  });

  TrackPlayer.addEventListener(Event.PlaybackMetadataReceived, event => {
    console.log('[Deprecated] Event.PlaybackMetadataReceived', event);
  });

  TrackPlayer.addEventListener(Event.MetadataChapterReceived, event => {
    console.log('Event.MetadataChapterReceived', event);
  });

  TrackPlayer.addEventListener(Event.MetadataTimedReceived, event => {
    console.log('Event.MetadataTimedReceived', event);
  });

  TrackPlayer.addEventListener(Event.MetadataCommonReceived, event => {
    console.log('Event.MetadataCommonReceived', event);
  });

  // TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, event => {
  //   // console.log('Event.PlaybackProgressUpdated', event);
  //   // When the track is 30 seconds from ending, download and cache the next track
  //   // TODO When the tracks change, delete the old track from the cache
  //   const timeRemaining = Math.floor(event.duration - event.position);
  //   console.log('timeRemaining', timeRemaining);

  //   if (event.duration - event.position === 30) {
  //     //
  //   }
  // });

  TrackPlayer.addEventListener(
    Event.PlaybackMetadataReceived,
    // This came from the example app
    async ({ title, artist }) => {
      const activeTrack = await TrackPlayer.getActiveTrack();
      TrackPlayer.updateNowPlayingMetadata({
        artist: [title, artist].filter(Boolean).join(' - '),
        title: activeTrack?.title,
        artwork: activeTrack?.artwork,
      });
    },
  );
}
