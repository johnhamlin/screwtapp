import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Sound } from 'expo-av/build/Audio';

export interface PlayerState {
  isPlayerReady: boolean;
  currentTrack: string;
  sound: Sound | null;
  isPlaying: boolean;
  queue: MixtapeTrack[] | null;
  queueIndex: number | null;
  isFooterPlayerVisible: boolean;
}

const initialState = {
  isPlayerReady: false,
  currentTrack: '',
  // sound: null,
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
    // setCurrentTrack: (state, action: PayloadAction<string>) => {
    //   state.currentTrack = action.payload;
    // },
    // setIsPlaying: (state, action: PayloadAction<boolean>) => {
    //   state.isPlaying = action.payload;
    // },
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
  // setCurrentTrack,
  // setIsPlaying,
  setQueue,
  setQueueIndex,
  setFooterPlayerVisible,
} = playerSlice.actions;

export default playerSlice.reducer;
