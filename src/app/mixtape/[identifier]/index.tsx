import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Stack, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Divider, List, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import {
  useGetMixtapeQuery,
  useGetThumbnailQuery,
} from '@/features/mixtapeList/slices/mixtapeListApi';

import TrackPlayer, { Track as rntpTrack } from 'react-native-track-player';

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
  const artwork = useGetThumbnailQuery(identifier as string);

  const dispatch = useDispatch();

  // TODO: This works, but needs to be refactored because it doesn't work the way I intended it to. It's an impure function, pulling from the larger state
  const setTrackPlaying = async ({
    dir,
    name: file,
    index,
  }: Pick<archiveApiTrack, 'dir' | 'name' | 'title' | 'artist' | 'length'> & {
    index: number;
  }) => {
    // Old Redux logic. Will likely refactor once I finish switch to RNTP
    // dispatch(setPlayerProps({ dir, file }));

    // trackList should be defined or else user couldn't have tapped on a track to play it

    if (!trackList) return;
    const queue: rntpTrack[] = trackList.slice(index).map(current => {
      console.log(current.title);

      return {
        url:
          'https://archive.org' +
          current.dir +
          '/' +
          encodeURIComponent(current.name),
        title: current.title,
        artist: current.artist,
        duration: current.length,
        // TODO: This may be a lie… RTK Query may return an object
        artwork: 'https://archive.org/services/img/' + identifier,
      };
    });

    console.log(queue);

    await TrackPlayer.setQueue(queue);
    TrackPlayer.play();
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
