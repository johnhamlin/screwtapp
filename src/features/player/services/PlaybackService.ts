import TrackPlayer, { Event } from 'react-native-track-player';

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

  TrackPlayer.addEventListener(Event.RemotePause, () => {
    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteJumpForward, async event => {
    TrackPlayer.seekBy(event.interval);
  });

  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async event => {
    TrackPlayer.seekBy(-event.interval);
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, event => {
    TrackPlayer.seekTo(event.position);
  });

  TrackPlayer.addEventListener(
    Event.MetadataCommonReceived,
    async ({ metadata }) => {
      console.log('Event.MetadataCommonReceived', metadata);
      const activeTrack = await TrackPlayer.getActiveTrack();
      const title = metadata?.title;
      const artist = metadata?.artist;
      if (title || artist) {
        TrackPlayer.updateNowPlayingMetadata({
          artist: [title, artist].filter(Boolean).join(' - '),
          title: activeTrack?.title,
          artwork: activeTrack?.artwork,
        });
      }
    },
  );
}
