import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Stack, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Divider, List, Text } from 'react-native-paper';
import TrackPlayer, { Track as rntpTrack } from 'react-native-track-player';

import { useGetMixtapeQuery } from '@/features/mixtapeList/slices/mixtapeListApi';

dayjs.extend(utc);

type MixtapeListProps = {
  item: archiveApiTrack;
  index: number;
};

export default function Mixtape() {
  const { identifier } = useLocalSearchParams();
  const {
    data: trackList,
    error,
    isLoading,
  } = useGetMixtapeQuery(identifier as string);

  // TODO: This is an impure function… do I care to change that?
  const setTrackPlaying = async ({
    // dir,
    // name: file,
    index,
  }: Pick<archiveApiTrack, 'dir' | 'name' | 'title' | 'artist' | 'length'> & {
    index: number;
  }) => {
    // trackList should be defined or else user couldn't have tapped on a track to play it
    if (!trackList) return;
    // Transform Archive.org API formatted track list into RNTP format
    const queue: rntpTrack[] = trackList.map(current => {
      return {
        url:
          'https://archive.org' +
          current.dir +
          '/' +
          encodeURIComponent(current.name),
        title: current.title,
        artist: current.artist,
        album: current.album,
        duration: current.length,
        // TODO: This may be a lie… RTK Query may return an object
        artwork: 'https://archive.org/services/img/' + identifier,
      };
    });

    // Set the queue, starting with the track the user selected and begin playing
    await TrackPlayer.setQueue(queue.slice(index));
    await TrackPlayer.play();

    // Add tracks before the one the user selected to the queue asynchronously, so the user can use PlaybackButtons to skip backward in the queue
    TrackPlayer.add(queue.slice(0, index));
  };

  return (
    <View
      // Use stylesheet because nativewinds beta has a bug
      style={styles.container}
      className="items-center content-center flex-1"
    >
      <Stack.Screen
        options={{
          title: trackList ? trackList[0].album : '',
          headerBackTitleVisible: false,
        }}
      />
      {error ? (
        <Text>Oh no! Error</Text>
      ) : isLoading ? (
        <ActivityIndicator size="large" />
      ) : trackList ? (
        <FlatList
          className="w-full pl-5"
          data={trackList}
          renderItem={({ item: mixtape, index }: MixtapeListProps) => (
            <Pressable
              onPress={() =>
                setTrackPlaying({
                  dir: mixtape.dir,
                  name: mixtape.name,
                  title: mixtape.title,
                  artist: mixtape.artist,
                  length: mixtape.length,
                  index,
                })
              }
            >
              <List.Item
                title={mixtape.title}
                description={mixtape.artist}
                left={() => <Text>{index + 1}</Text>}
                right={() => (
                  <Text>{dayjs.utc(mixtape.length * 1000).format('m:ss')}</Text>
                )}
              />
              <Divider />
            </Pressable>
          )}
          keyExtractor={(item: archiveApiTrack) => item.md5}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
