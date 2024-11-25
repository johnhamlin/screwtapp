import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/reduxStore';

// export const makeSelectQueue = () =>
//   createSelector(
//     (state: RootState) => state.player.queue,
//     queue => queue,
//   );

// export const makeSelectQueueIndex = () =>
//   createSelector(
//     (state: RootState) => state.player.queueIndex,
//     queueIndex => queueIndex,
//   );

// export const makeSelectActiveTrack = () =>
//   createSelector(
//     makeSelectQueue(),
//     makeSelectQueueIndex(),
//     (queue, queueIndex) => {
//       if (queue && queueIndex !== null) {
//         return queue[queueIndex];
//       }
//       return null;
//     },
//   );

// export const makeSelectActiveTrackId = () =>
//   createSelector(makeSelectActiveTrack(), track => track?.id as string);

// export const makeIsFooterPlayerVisible = () =>
//   createSelector(
//     (state: RootState) => state.player.isFooterPlayerVisible,
//     isFooterPlayerVisible => isFooterPlayerVisible,
//   );

export const selectIsFooterPlayerVisible = (state: RootState) =>
  state.player.isFooterPlayerVisible;

export const selectActiveTrackId = (state: RootState) => {
  if (state.player.queue !== null && state.player.queueIndex !== null) {
    return state.player.queue[state.player.queueIndex].mixtapeId;
  }
  return null;
};
