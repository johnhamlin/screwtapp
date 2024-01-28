import { Sound } from 'expo-av/build/Audio';

import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
export interface PlayerState {
  isPlayerReady: boolean;
  currentTrack: string;
  sound: Sound | null;
  isPlaying: boolean;
  playerProps: PlayerProps;
  // currentTrackIndex: number;
  // currentTrackTime: number;
  // currentTrackDuration: number;
  // currentTrackVolume: number;
  // currentTrackMuted: boolean;
  // currentTrackPaused: boolean;
  // currentTrackEnded: boolean;
  // currentTrackLoop: boolean;
  // currentTrackShuffle: boolean;
  // currentTrackMetadata: any;
}

const initialState = {
  isPlayerReady: false,
  currentTrack: '',
  // sound: null,
  isPlaying: false,
  playerProps: {
    dir: null,
    file: null,
  },
  // currentTrackIndex: -1,
  // currentTrackTime: 0,
  // currentTrackDuration: 0,
  // currentTrackVolume: 1,
  // currentTrackMuted: false,
  // currentTrackPaused: false,
  // currentTrackEnded: false,
  // currentTrackLoop: false,
  // currentTrackShuffle: false,
  // currentTrackMetadata: null,
} as PlayerState;

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayerReady: (state, action: PayloadAction<boolean>) => {
      state.isPlayerReady = action.payload;
    },
    setCurrentTrack: (state, action: PayloadAction<string>) => {
      state.currentTrack = action.payload;
    },
    // setSound: (state, action: PayloadAction<Sound>) => {
    //   state.sound = action.payload;
    // },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setPlayerProps: (state, action: PayloadAction<PlayerProps>) => {
      state.playerProps = action.payload;
    },
    // setCurrentTrackIndex: (state, action: PayloadAction<number>) => {
    //   state.currentTrackIndex = action.payload;
    // },
    // setCurrentTrackTime: (state, action: PayloadAction<number>) => {
    //   state.currentTrackTime = action.payload;
    // },
    // setCurrentTrackDuration: (state, action: PayloadAction<number>) => {
    //   state.currentTrackDuration = action.payload;
    // },
    // setCurrentTrackVolume: (state, action: PayloadAction<number>) => {
    //   state.currentTrackVolume = action.payload;
    // },
    // setCurrentTrackMuted: (state, action: PayloadAction<boolean>) => {
    //   state.currentTrackMuted = action.payload;
    // },
    // setCurrentTrackPaused: (state, action: PayloadAction<boolean>) => {
    //   state.currentTrackPaused = action.payload;
    // },
    // setCurrentTrackEnded: (state, action: PayloadAction<boolean>) => {
    //   state.currentTrackEnded = action.payload;
    // },
    // setCurrentTrackLoop: (state, action: PayloadAction<boolean>) => {
    //   state.currentTrackLoop = action.payload;
    // },
    // setCurrentTrackShuffle: (state, action: PayloadAction<boolean>) => {
    //   state.currentTrackShuffle = action.payload;
    // },
    // setCurrentTrackMetadata: (state, action: PayloadAction<any>) => {
    //   state.currentTrackMetadata = action.payload;
    // },
  },
});

export const { setPlayerReady, setCurrentTrack, setIsPlaying, setPlayerProps } =
  playerSlice.actions;

export default playerSlice.reducer;
