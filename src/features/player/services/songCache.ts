import TrackPlayer from 'react-native-track-player';
import type { Track as rntpTrack } from 'react-native-track-player';

import type { RootState } from '@/reduxStore';
import { reduxStore } from '@/reduxStore';

export async function cacheNextSong() {
  const nextSongUrl = nextSong.url;
  if (nextSongUrl) {
    const nextSongCache = await cacheManager.get(nextSongUrl);
    if (!nextSongCache) {
      await cacheManager.add(nextSongUrl);
    }
  }
}
