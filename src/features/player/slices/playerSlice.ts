import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Sound } from 'expo-av/build/Audio';
import type { Track as rntpTrack } from 'react-native-track-player';
export interface PlayerState {
  isPlayerReady: boolean;
  currentTrack: string;
  sound: Sound | null;
  isPlaying: boolean;
  queue: rntpTrack[] | null;
  queueIndex: number | null;
}

const initialState = {
  isPlayerReady: false,
  currentTrack: '',
  // sound: null,
  isPlaying: false,
  queue: null,
  queueIndex: null,
} as PlayerState;

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setIsPlayerReady: (state, action: PayloadAction<boolean>) => {
      state.isPlayerReady = action.payload;
    },
    setCurrentTrack: (state, action: PayloadAction<string>) => {
      state.currentTrack = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setQueue: (state, action: PayloadAction<rntpTrack[]>) => {
      state.queue = action.payload;
    },
    setQueueIndex: (state, action: PayloadAction<number>) => {
      state.queueIndex = action.payload;
    },
  },
});

export const {
  setIsPlayerReady,
  setCurrentTrack,
  setIsPlaying,
  setQueue,
  setQueueIndex,
} = playerSlice.actions;

export default playerSlice.reducer;
