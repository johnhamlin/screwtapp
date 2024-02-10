import { useEffect } from 'react';

import { setIsPlayerReady } from '../slice/playerSlice';

import {
  queuePersistedTracksService,
  setupService,
} from '@/features/player/services';
import { reduxStore } from '@/reduxStore';

export function useSetupPlayer() {
  reduxStore.dispatch(setIsPlayerReady(false));
  useEffect(() => {
    // Only run this once
    let hasBeenCalled = false;
    (async () => {
      if (hasBeenCalled) return;
      await setupService();
      // I need to know if this is the initial setup in playbackService to avoid overwriting the queue index when the app is opened
      // Can't use RTK hooks here because it's called in the RootLayout component outside of the Redux Provider
      await queuePersistedTracksService();
      reduxStore.dispatch(setIsPlayerReady(true));
    })();
    return () => {
      hasBeenCalled = true;
    };
  }, []);
}
