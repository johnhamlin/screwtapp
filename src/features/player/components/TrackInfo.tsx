import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';

export function TrackInfo() {
  const track = useActiveTrack();
  // Take the string after the last slash in the URL
  const identifier = track?.artwork?.split('/').pop();
  return (
    <View style={styles.container}>
      {track?.artwork && (
        // Tap on the artwork to navigate to the mixtape
        <Pressable
          onPress={() => {
            // close the modal with back
            router.back();
            // navigate to the mixtape
            router.navigate({
              pathname: 'mixtape/[identifier]',
              params: { identifier },
            });
          }}
        >
          <Image style={styles.artwork} source={{ uri: track?.artwork }} />
        </Pressable>
      )}
      {track?.title && <Text style={styles.titleText}>{track?.title}</Text>}
      {track?.artist && <Text style={styles.artistText}>{track?.artist}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  artwork: {
    width: '60%',
    aspectRatio: 1,
    marginTop: '2%',
    backgroundColor: 'grey',
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginTop: 30,
  },
  artistText: {
    fontSize: 16,
    fontWeight: '200',
    color: 'white',
  },
});
