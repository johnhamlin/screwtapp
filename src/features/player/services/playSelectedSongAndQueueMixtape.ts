import { fastQueueWithIndex } from './fastQueueWithIndex';
import {
  setFooterPlayerVisible,
  setQueue,
  setQueueIndex,
} from '../slice/playerSlice';

import { reduxStore } from '@/reduxStore';

export const playSelectedSongAndQueueMixtape = async (
  queue: MixtapeTrack[],
  indexOfSelectedTrack: number,
) => {
  const store = reduxStore;

  await fastQueueWithIndex({
    queue,
    index: indexOfSelectedTrack,
    shouldPlay: true,
  });

  // Save the queue and index to Redux to persist between sessions
  store.dispatch(setQueue(queue));
  store.dispatch(setQueueIndex(indexOfSelectedTrack));

  // The first time you play a track, show the footer player
  store.dispatch(setFooterPlayerVisible(true));
};
