import TrackPlayer from 'react-native-track-player';

import { reduxStore } from '@/reduxStore';
import type { RootState } from '@/reduxStore';

export const queuePersistedTracksService = async (): Promise<void> => {
  const state: RootState = reduxStore.getState();
  const { queue } = state.player;
  if (queue) {
    console.log('loading queue from redux store');

    await TrackPlayer.setQueue(queue);
  }
};
