import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Stack, useLocalSearchParams } from 'expo-router';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { ActivityIndicator, Divider, List, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { useGetMixtapeQuery } from '@/features/mixtapeList/slices/mixtapeListApi';
import { setPlayerProps } from '@/features/player/slices/playerSlice';

dayjs.extend(utc);

type MixtapeListProps = {
  item: Track;
  index: number;
};

export default function Mixtape() {
  const { identifier } = useLocalSearchParams();
  const { data, error, isLoading } = useGetMixtapeQuery(identifier as string);

  const dispatch = useDispatch();

  const setTrackPlaying = ({ dir, file }: PlayerProps) => {
    dispatch(setPlayerProps({ dir, file }));
  };

  return (
    <View
      // Use stylesheet because nativewinds beta has a bug
      style={styles.container}
      className="items-center content-center flex-1"
    >
      <Stack.Screen
        options={{
          title: data ? data[0].album : '',
          headerBackTitleVisible: false,
        }}
      />
      {error ? (
        <Text>Oh no! Error</Text>
      ) : isLoading ? (
        <ActivityIndicator size="large" />
      ) : data ? (
        <FlatList
          className="w-full pl-5"
          data={data}
          renderItem={({ item: mixtape, index }: MixtapeListProps) => (
            // TODO: Wrap this in a link
            <Pressable
              onPress={() =>
                setTrackPlaying({ dir: mixtape.dir, file: mixtape.name })
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
          keyExtractor={(item: Track) => item.md5}
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
