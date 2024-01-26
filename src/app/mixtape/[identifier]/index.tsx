import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { FlatList, Pressable, View } from 'react-native';
import { Divider, List, Text } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { useGetMixtapeQuery } from '@/features/mixtapeList/mixtapeListSlice';
import { playerProps } from '@/features/player/playerSlice';

dayjs.extend(utc);

type MixtapeListProps = {
  item: Track;
  index: number;
};

export default function Mixtape() {
  const router = useRouter();
  const { identifier } = useLocalSearchParams();
  const { data, error, isLoading } = useGetMixtapeQuery(identifier as string);

  const dispatch = useDispatch();

  const setTrackPlaying = ({ dir, file }: PlayerProps) => {
    dispatch(playerProps({ dir, file }));
  };

  return (
    <View className="items-center content-center flex-1">
      <Stack.Screen
        options={{
          title: data ? data[0].album : '',
          headerBackTitleVisible: false,
        }}
      />

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
            ></List.Item>
            <Divider />
          </Pressable>
        )}
        keyExtractor={(item: Track) => item.md5}
      />
    </View>
  );
}
