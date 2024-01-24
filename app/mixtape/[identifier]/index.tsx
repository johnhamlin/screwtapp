import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { View, Button, FlatList, Pressable, Text } from 'react-native';

import { useGetMixtapeQuery } from '../../../model/redux/services/mixtapeList';
import Player from '../../components/audio/Player';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Divider, List } from 'react-native-paper';

type MixtapeListProps = {
  item: Track;
  index: number;
};

export default function MixtapeDetails() {
  const router = useRouter();
  const { identifier } = useLocalSearchParams();
  const { data } = useGetMixtapeQuery(identifier as string);
  const [playerProps, setPlayerProps] = useState<PlayerProps>({
    dir: null,
    file: null,
  });

  const setTrackPlaying = ({ dir, file }: PlayerProps) => {
    setPlayerProps({ dir, file });
  };

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <Button title="Home" onPress={() => router.push('/')} />

      <Player {...playerProps}></Player>

      <FlatList
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
    </SafeAreaView>
  );
}
dayjs;
