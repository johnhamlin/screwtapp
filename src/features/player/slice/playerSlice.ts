import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface PlayerState {
  isPlayerReady: boolean;
  currentTrack: string;
  isPlaying: boolean;
  queue: MixtapeTrack[] | null;
  queueIndex: number | null;
  isFooterPlayerVisible: boolean;
}

const initialState = {
  isPlayerReady: false,
  currentTrack: '',
  isPlaying: false,
  queue: null,
  queueIndex: null,
  isFooterPlayerVisible: false,
} as PlayerState;

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setIsPlayerReady: (state, action: PayloadAction<boolean>) => {
      state.isPlayerReady = action.payload;
    },
    setQueue: (state, action: PayloadAction<MixtapeTrack[]>) => {
      state.queue = action.payload;
    },
    setQueueIndex: (state, action: PayloadAction<number>) => {
      state.queueIndex = action.payload;
    },
    setFooterPlayerVisible: (state, action: PayloadAction<boolean>) => {
      state.isFooterPlayerVisible = action.payload;
    },
  },
});

export const {
  setIsPlayerReady,
  setQueue,
  setQueueIndex,
  setFooterPlayerVisible,
} = playerSlice.actions;

export default playerSlice.reducer;
