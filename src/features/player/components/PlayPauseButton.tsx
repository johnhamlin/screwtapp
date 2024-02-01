import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import TrackPlayer, { useIsPlaying } from 'react-native-track-player';

type PlayPauseButtonProps = {
  mode: 'footer' | 'modal';
};

export const PlayPauseButton = ({ mode }: PlayPauseButtonProps) => {
  const { playing, bufferingDuringPlay } = useIsPlaying();

  return (
    <View style={styles.container}>
      {bufferingDuringPlay ? (
        <ActivityIndicator />
      ) : (
        <TouchableWithoutFeedback
          onPress={playing ? TrackPlayer.pause : TrackPlayer.play}
        >
          <FontAwesome6
            name={playing ? 'pause' : 'play'}
            size={mode === 'modal' ? 48 : 36}
            color="white"
          />
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
