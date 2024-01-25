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
  const { data } = useGetMixtapeQuery(identifier as string);
  // const [playerProps, setPlayerProps] = useState<PlayerProps>({
  //   dir: null,
  //   file: null,
  // });
  const dispatch = useDispatch();

  const setTrackPlaying = ({ dir, file }: PlayerProps) => {
    dispatch(playerProps({ dir, file }));
  };

  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Stack.Screen
          options={{
            title: data ? data[0].album : '',
            headerBackTitleVisible: false,
          }}
        />

        <FlatList
          style={{ width: '100%', paddingHorizontal: 16 }}
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
    </>
  );
}
