import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Pressable, View } from 'react-native';
import { ActivityIndicator, Divider, List, Text } from 'react-native-paper';

import { useGetMixtapeQuery } from '@/features/mixtapeList/slices/mixtapeListApi';
import { playSelectedSongAndQueueMixtape } from '@/features/player/services';
import { listStyles } from '@/styles';

dayjs.extend(utc);

type MixtapeListProps = {
  item: MixtapeTrack;
  index: number;
};

export default function Mixtape() {
  const { id } = useLocalSearchParams();
  const {
    data: trackList,
    error,
    isLoading,
  } = useGetMixtapeQuery(id as string);

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
          renderItem={({ item: track, index }: MixtapeListProps) => (
            <Pressable
              onPress={() => playSelectedSongAndQueueMixtape(trackList, index)}
            >
              <List.Item
                style={listStyles.item}
                title={track.title}
                titleStyle={listStyles.title}
                description={track.artist}
                left={() => <Text>{index + 1}</Text>}
                right={() => (
                  <Text>{dayjs.utc(track.duration * 1000).format('m:ss')}</Text>
                )}
              />
              <Divider />
            </Pressable>
          )}
          keyExtractor={(track: MixtapeTrack) => track.sha1}
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
