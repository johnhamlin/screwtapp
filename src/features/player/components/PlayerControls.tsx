import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import TrackPlayer, { usePlaybackState } from 'react-native-track-player';

import { PlayPauseButton } from './PlayPauseButton';
import { PlaybackError } from './PlaybackError';

const performSkipToNext = () => TrackPlayer.skipToNext();
const performSkipToPrevious = () => TrackPlayer.skipToPrevious();

export const PlayerControls: React.FC = () => {
  const playback = usePlaybackState();
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TouchableWithoutFeedback onPress={performSkipToPrevious}>
          <FontAwesome6 name="backward" size={30} color="white" />
        </TouchableWithoutFeedback>
        <PlayPauseButton mode="modal" />
        <TouchableWithoutFeedback onPress={performSkipToNext}>
          <FontAwesome6 name="forward" size={30} color="white" />
        </TouchableWithoutFeedback>
      </View>
      <PlaybackError
        error={'error' in playback ? playback.error.message : undefined}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});
