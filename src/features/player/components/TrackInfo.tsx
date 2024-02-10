import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Easing } from 'react-native-reanimated';
import TextTicker from 'react-native-text-ticker';
import { useActiveTrack } from 'react-native-track-player';

import LinkToActiveAlbum from '../containers/LinkToActiveAlbum';

export function TrackInfo() {
  const track = useActiveTrack();
  const theme = useTheme();

  // const selectActiveTrackId = useMemo(makeSelectActiveTrackId, []);

  return (
    <View style={styles.container}>
      {track?.artwork && (
        <LinkToActiveAlbum isInModal>
          <Image style={styles.artwork} source={{ uri: track?.artwork }} />
        </LinkToActiveAlbum>
      )}
      {track?.title && (
        <TextTicker
          style={{ ...styles.titleText, color: theme.colors.onSurface }}
          animationType="bounce"
          marqueeDelay={750}
          scrollSpeed={70}
          easing={Easing.sin}
          bounceDelay={1000}
          bouncePadding={{ left: 0, right: 10 }}
        >
          {track?.title}
        </TextTicker>
      )}
      {track?.artist && <Text style={styles.artistText}>{track?.artist}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '90%',
  },
  artwork: {
    width: '100%',
    aspectRatio: 1,
    marginTop: '2%',
    backgroundColor: 'grey',
    borderRadius: 10,
  },
  titleText: {
    fontSize: 30,
    fontWeight: '600',
    color: 'white',
    marginTop: 30,
  },
  artistText: {
    fontSize: 24,
    fontWeight: '200',
    color: 'white',
  },
});
