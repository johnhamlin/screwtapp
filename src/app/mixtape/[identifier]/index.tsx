import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Stack, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Divider, List, Text } from 'react-native-paper';
import type { Track as rntpTrack } from 'react-native-track-player';
import { useDispatch } from 'react-redux';

import { useGetMixtapeQuery } from '@/features/mixtapeList/slices/mixtapeListApi';
import { fastQueueWithIndex } from '@/features/player/services/';
import { setQueue, setQueueIndex } from '@/features/player/slices/playerSlice';
import { listStyles } from '@/styles';

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
  const dispatch = useDispatch();

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

    await fastQueueWithIndex({ queue, index, shouldPlay: true });

    // Save the queue and index to Redux to persist between sessions
    dispatch(setQueue(queue));
    dispatch(setQueueIndex(index));
  };

  return (
    <View style={listStyles.container}>
      <Stack.Screen
        options={{
          title: trackList ? trackList[0].album : '',
          headerBackTitleVisible: false,
        }}
      />
      {error ? (
        <>
          <View style={listStyles.errorContainer}>
            <Text>
              There was an issue loading the mixtapes. Please close the app and
              try again.
            </Text>
          </View>
          {console.error(error)}
        </>
      ) : isLoading ? (
        <View style={listStyles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : trackList ? (
        <FlashList
          estimatedItemSize={64}
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
                style={listStyles.item}
                title={mixtape.title}
                titleStyle={listStyles.title}
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   trackList: {
//     width: '100%',
//     paddingLeft: 20,
//   },
// });
