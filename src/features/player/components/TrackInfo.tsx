import { Link, router } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useActiveTrack } from 'react-native-track-player';

export function TrackInfo() {
  const track = useActiveTrack();
  // Take the string after the last slash in the URL
  const identifier = track?.artwork?.split('/').pop();
  return (
    <View style={styles.container}>
      <View style={{ backgroundColor: 'red' }}>
        {/* <Link
          asChild
          href={{
            pathname: 'mixtape/[identifier]',
            params: { identifier },
          }}
        >
          <>
            {console.log('TrackInfo.tsx identifier:', identifier)}
            <Text>Go to Mixtape</Text>
          </> */}
        {/* </Link> */}
      </View>
      {track?.artwork && (
        <Pressable
          onPress={() => {
            console.log('TrackInfo.tsx identifier:', identifier);

            router.navigate('../');
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
